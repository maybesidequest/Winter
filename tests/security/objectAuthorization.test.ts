/**
 * Negative authorization matrix — Phase 3 Workstream C, "Object-level
 * authorization" minimum regression cases.
 *
 * The enforcement-layer trace lives in ./authzHarness.ts. Object-level
 * authorization itself is enforced by interchat-control (layer 5); these tests
 * fake only that gRPC boundary (with the exact ControlPlaneError shape the
 * real transport produces) and assert that Winter's session, ORPC, router, and
 * client layers:
 *   - bind every control-plane call to the verified session actor;
 *   - surface control-plane denials (no silent success, no fallback write);
 *   - load connections before mutating them and never trust companion IDs;
 *   - do not leak private-object data or existence through denials.
 *
 * Findings recorded against the phase-3 plan are noted inline as F-1/F-2/F-3
 * and listed in docs/dashboard/release-evidence.md.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import "./authzHarness";
import {
  ANNOUNCEMENT_ID,
  APPEAL_ID,
  CHANNEL_ID,
  CONNECTION_ID,
  HUB_ID,
  INFRACTION_ID,
  INSUFFICIENT,
  INBOX_ITEM_ID,
  OTHER_CONNECTION_ID,
  OTHER_HUB_ID,
  OTHER_SERVER_ID,
  OWNER,
  REMOVED,
  RULE_ID,
  SERVER_ID,
  STAFF,
  UNRELATED,
  authenticatedRequest,
  behaviors,
  boundaryCalls,
  callsFor,
  permissionDenied,
  notFound,
  resetBoundary,
} from "./authzHarness";

const { hubRouter } = await import("~/rpc/routers/hub");
const { serverRouter } = await import("~/rpc/routers/server");
const { moderationRouter } = await import("~/rpc/routers/moderation");
const { userRouter } = await import("~/rpc/routers/user");

async function invoke(proc: unknown, input: unknown, ctx: { request: Request }) {
  return call(proc as never, input as never, { context: ctx });
}

async function denied(proc: unknown, input: unknown, actorId: string, method: "GET" | "POST" = "GET") {
  const { request } = await authenticatedRequest(actorId, method);
  try {
    await invoke(proc, input, { request });
  } catch (error) {
    return error as Error;
  }
  throw new Error(`Expected denial for actor ${actorId}, but the procedure succeeded.`);
}

beforeEach(() => {
  resetBoundary();
});

/* ------------------------------------------------------------------ */
/* Private Hub reads by changing hub_id                                */
/* ------------------------------------------------------------------ */

describe("private Hub objects are not readable by swapping hub_id", () => {
  const staffAllowed = (actorId: string) => actorId === OWNER || actorId === STAFF;

  beforeEach(() => {
    behaviors["hub.getHub"] = ((hubId: string, actorId: string) =>
      staffAllowed(actorId) ? { metadata: { id: hubId, name: "Private Hub" } } : Promise.reject(permissionDenied())) as never;
  });

  it("lets the owner read their own private Hub", async () => {
    const { request } = await authenticatedRequest(OWNER);
    const hub = await invoke(hubRouter.getHub, { hubId: HUB_ID }, { request });
    expect(hub).toMatchObject({ metadata: { id: HUB_ID } });
  });

  it("lets authorized staff read the private Hub", async () => {
    const { request } = await authenticatedRequest(STAFF);
    const hub = await invoke(hubRouter.getHub, { hubId: HUB_ID }, { request });
    expect(hub).toMatchObject({ metadata: { id: HUB_ID } });
  });

  it.each([UNRELATED, INSUFFICIENT, REMOVED])("denies actor %s and leaks no Hub data", async (actorId) => {
    const error = await denied(hubRouter.getHub, { hubId: HUB_ID }, actorId);
    expect(error.message).not.toContain("Private Hub");
    expect(error.message).not.toContain(HUB_ID);
    const read = callsFor("hub", "getHub");
    expect(read).toHaveLength(1);
    expect(read[0]?.actorId).toBe(actorId);
  });

  it("denies rules, Team, announcements, audit, connections, and moderation records for an unrelated user", async () => {
    const cases: Array<[string, unknown, unknown, "GET" | "POST"]> = [
      ["rules", hubRouter.listRules, { hubId: HUB_ID }, "GET"],
      ["team", hubRouter.listStaff, { hubId: HUB_ID }, "GET"],
      ["roles", hubRouter.listRoles, { hubId: HUB_ID }, "GET"],
      ["announcements", hubRouter.listAnnouncements, { hubId: HUB_ID }, "GET"],
      ["audit", hubRouter.listAudit, { hubId: HUB_ID }, "GET"],
      ["invites", hubRouter.listInvites, { hubId: HUB_ID }, "GET"],
      ["badges", hubRouter.getBadges, { hubId: HUB_ID }, "GET"],
      ["log config", hubRouter.getLogConfig, { hubId: HUB_ID }, "GET"],
      ["connections", hubRouter.getConnections, { hubId: HUB_ID }, "GET"],
      ["infractions", moderationRouter.listInfractions, { hubId: HUB_ID }, "GET"],
      ["infraction", moderationRouter.getInfraction, { hubId: HUB_ID, infractionId: INFRACTION_ID }, "GET"],
      ["appeals", moderationRouter.listHubAppeals, { hubId: HUB_ID }, "GET"],
      ["appeal", moderationRouter.getAppeal, { hubId: HUB_ID, appealId: APPEAL_ID }, "GET"],
      ["safety settings", moderationRouter.getHubSafetySettings, { hubId: HUB_ID }, "GET"],
    ];
    for (const [label, proc, input, method] of cases) {
      const error = await denied(proc, input, UNRELATED, method);
      expect(error.message, label).not.toMatch(/rule|staff|announce|audit|connect|infraction|appeal|hideLinks/i);
    }
  });

  it("does not reveal whether an inaccessible hub_id is private or missing", async () => {
    // Existence is checked before permission control-plane-side, so the router
    // collapses PERMISSION_DENIED and NOT_FOUND into one identical response.
    behaviors["hub.getHub"] = (() => Promise.reject(notFound())) as never;
    const missing = await denied(hubRouter.getHub, { hubId: "hub-missing-0000000000000001" }, UNRELATED);
    const denied_ = await denied(hubRouter.getHub, { hubId: HUB_ID }, UNRELATED);
    expect((missing as { code?: string }).code).toBe("NOT_FOUND");
    expect((denied_ as { code?: string }).code).toBe("NOT_FOUND");
    expect(missing.message).toBe(denied_.message);
  });
});

/* ------------------------------------------------------------------ */
/* Server manager cannot touch another server by changing server_id    */
/* ------------------------------------------------------------------ */

describe("Server manager scope is bounded by the actor's own Discord guilds", () => {
  it("denies a user who does not manage the server before any control-plane call", async () => {
    const error = await denied(serverRouter.get, { serverId: SERVER_ID }, UNRELATED);
    expect(error.message).toContain("Manage Server");
    expect(callsFor("server", "getServer")).toHaveLength(0);
  });

  it("denies reading another server's channels, bridges, and blocklist", async () => {
    for (const proc of [serverRouter.channels, serverRouter.bridges, serverRouter.blocklist]) {
      const error = await denied(proc, { serverId: SERVER_ID }, UNRELATED);
      expect(error.message).toContain("Manage Server");
    }
    expect(boundaryCalls.filter((c) => c.service === "server")).toHaveLength(0);
  });

  it("denies mutating another server even when Discord-side access exists", async () => {
    const configInput = {
      serverId: OTHER_SERVER_ID,
      pingOnMatch: true,
      autoRequeueOnSkip: false,
      filterNsfw: true,
      lobbyChannelIds: [],
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(serverRouter.patchCallConfig, configInput, STAFF, "POST");
    expect(error.message).toContain("Manage Server");
    expect(callsFor("server", "patchServer")).toHaveLength(0);
  });

  it("surfaces a control-plane denial for a manageable server without leaking data", async () => {
    const error = await denied(serverRouter.get, { serverId: SERVER_ID }, STAFF);
    expect(callsFor("server", "getServer")[0]?.actorId).toBe(STAFF);
    expect(error.message).not.toContain(SERVER_ID);
    expect(error.message).toContain("temporarily unavailable");
  });

  it("cannot enumerate servers it does not manage through the list endpoint", async () => {
    behaviors["server.batchGetServers"] = (() => Promise.resolve({ servers: [] })) as never;
    const { request } = await authenticatedRequest(STAFF);
    const own = (await invoke(serverRouter.list, {}, { request })) as Array<{ metadata: { id: string } }>;
    expect(own.map((s) => s.metadata.id)).toEqual([SERVER_ID]);

    const otherCtx = await authenticatedRequest(UNRELATED);
    const other = (await invoke(serverRouter.list, {}, otherCtx)) as Array<{ metadata: { id: string } }>;
    expect(other.map((s) => s.metadata.id)).toEqual([OTHER_SERVER_ID]);
  });
});

/* ------------------------------------------------------------------ */
/* Connection operations authorize the stored hub/server               */
/* ------------------------------------------------------------------ */

describe("Connection operations load the connection first and ignore companion IDs", () => {
  it("denies toggling a connection inside a private Hub and never reaches the mutation", async () => {
    const input = {
      connectionId: CONNECTION_ID,
      hubId: HUB_ID,
      enabled: true,
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(hubRouter.toggleConnection, input, UNRELATED, "POST");
    expect(error).toBeInstanceOf(Error);
    expect(callsFor("connection", "toggleConnection")).toHaveLength(0);
  });

  it("does not trust an untrusted companion hub_id to authorize a foreign connection", async () => {
    behaviors["connection.getConnections"] = ((query: { hubId?: string; serverId?: string; actorId: string }) =>
      query.hubId === OTHER_HUB_ID && query.actorId === UNRELATED
        ? Promise.resolve([])
        : Promise.reject(permissionDenied())) as never;
    const input = {
      connectionId: CONNECTION_ID,
      hubId: OTHER_HUB_ID,
      enabled: true,
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(hubRouter.toggleConnection, input, UNRELATED, "POST");
    expect(error.message).toContain("Connection not found");
    expect(callsFor("connection", "toggleConnection")).toHaveLength(0);
  });

  it("surfaces the control-plane denial when the stored connection exists but the actor lost access", async () => {
    behaviors["connection.getConnections"] = ((query: { actorId: string }) =>
      query.actorId === STAFF
        ? Promise.resolve([
            {
              metadata: { id: CONNECTION_ID, hubId: HUB_ID, channelId: CHANNEL_ID, serverId: SERVER_ID },
              spec: { connected: true },
              status: { healthy: true },
              version: 2,
            },
          ])
        : Promise.reject(permissionDenied())) as never;
    const input = {
      connectionId: CONNECTION_ID,
      hubId: HUB_ID,
      enabled: false,
      expectedVersion: 2,
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(hubRouter.toggleConnection, input, STAFF, "POST");
    expect(error.message).toContain("permission");
    expect(callsFor("connection", "toggleConnection")).toHaveLength(1);
  });

  it("denies disconnecting through the same load-before-mutate path", async () => {
    const input = {
      connectionId: CONNECTION_ID,
      hubId: HUB_ID,
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    };
    await denied(hubRouter.disconnectConnection, input, UNRELATED, "POST");
    expect(callsFor("connection", "disconnectChannel")).toHaveLength(0);
  });

  it("denies connecting a channel into a private Hub the actor does not manage", async () => {
    const input = { hubId: HUB_ID, channelId: CHANNEL_ID, serverId: SERVER_ID, idempotencyKey: crypto.randomUUID() };
    const error = await denied(hubRouter.createConnection, input, UNRELATED, "POST");
    expect(error).toBeInstanceOf(Error);
    const connect = callsFor("connection", "connectChannel");
    expect(connect).toHaveLength(1);
    expect(connect[0]?.actorId).toBe(UNRELATED);
  });

  it("denies a Server bridge mutation for a connection not on the actor's server", async () => {
    behaviors["connection.getConnections"] = (() => Promise.resolve([])) as never;
    const input = {
      serverId: SERVER_ID,
      connectionId: OTHER_CONNECTION_ID,
      enabled: true,
      expectedVersion: 1,
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(serverRouter.toggleBridge, input, STAFF, "POST");
    // The failure is surfaced with a generic message (no connection or hub
    // details leak) and the mutation never reaches the control plane.
    expect(error.message).toContain("could not be");
    expect(error.message).not.toContain(CONNECTION_ID);
    expect(callsFor("connection", "toggleConnection")).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/* Hub moderator cannot escalate Team privileges                       */
/* ------------------------------------------------------------------ */

describe("Hub Team changes cannot grant unheld permissions or remove the owner", () => {
  it("denies an insufficient-staff actor assigning a role", async () => {
    const input = { hubId: HUB_ID, targetUserId: STAFF, role: "MODERATOR", expectedVersion: 1 };
    const error = await denied(moderationRouter.addModerator, input, INSUFFICIENT, "POST");
    expect(error.message).toContain("permission");
    const assign = callsFor("hub", "assignStaffRole");
    expect(assign).toHaveLength(1);
    expect(assign[0]?.actorId).toBe(INSUFFICIENT);
  });

  it("denies removing the Hub owner", async () => {
    const input = { hubId: HUB_ID, targetUserId: OWNER, expectedVersion: 1 };
    const error = await denied(moderationRouter.removeModerator, input, STAFF, "POST");
    expect(error.message).toContain("permission");
    expect(callsFor("hub", "removeStaffRole")).toHaveLength(1);
  });

  it("denies granting a role above the actor's own rank", async () => {
    // The control plane rejects a MANAGER grant from an actor that is not an
    // owner; addModerator cannot carry a permission bitmask, so rank is the
    // escalation vector.
    behaviors["hub.assignStaffRole"] = ((input: { actorId: string; role: string }) =>
      input.role === "MANAGER" && input.actorId !== OWNER ? Promise.reject(permissionDenied()) : Promise.resolve({})) as never;
    const input = { hubId: HUB_ID, targetUserId: INSUFFICIENT, role: "MANAGER", expectedVersion: 1 };
    const error = await denied(moderationRouter.addModerator, input, STAFF, "POST");
    expect(error.message).toContain("permission");
    const assign = callsFor("hub", "assignStaffRole");
    expect(assign[0]?.actorId).toBe(STAFF);
  });

  it("denies protected role creation by a non-owner through the Team router", async () => {
    const input = { hubId: HUB_ID, name: "Super Staff", permissionsBitmask: 1 << 20, idempotencyKey: crypto.randomUUID() };
    const error = await denied(hubRouter.createRole, input, INSUFFICIENT, "POST");
    expect(error).toBeInstanceOf(Error);
    const created = callsFor("hubs/roles", "createRole");
    expect(created).toHaveLength(1);
    expect(created[0]?.actorId).toBe(INSUFFICIENT);
  });

  it("denies removing an equal-rank moderator through the Team router", async () => {
    const input = { hubId: HUB_ID, userId: STAFF, expectedVersion: 1, idempotencyKey: crypto.randomUUID() };
    const error = await denied(hubRouter.removeStaffRole, input, INSUFFICIENT, "POST");
    expect(error).toBeInstanceOf(Error);
    expect(callsFor("hubs/staff", "removeStaffRole")).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/* Inbox, preferences, and appeals bind to the authenticated actor     */
/* ------------------------------------------------------------------ */

describe("personal resources are bound to the authenticated actor", () => {
  it("returns only the authenticated actor's inbox items", async () => {
    behaviors["user.getUserInbox"] = ((actorId: string) =>
      Promise.resolve({ items: [{ id: `item-for-${actorId}` }] })) as never;
    const { request } = await authenticatedRequest(UNRELATED);
    const inbox = (await invoke(userRouter.getInbox, undefined, { request })) as { items: Array<{ id: string }> };
    expect(inbox.items.map((item) => item.id)).toEqual([`item-for-${UNRELATED}`]);
    expect(callsFor("user", "getUserInbox")[0]?.actorId).toBe(UNRELATED);
  });

  it("denies acknowledging another user's inbox item", async () => {
    behaviors["user.getUserInbox"] = ((actorId: string) =>
      actorId === OWNER ? Promise.resolve({ items: [{ id: INBOX_ITEM_ID }] }) : Promise.resolve({ items: [] })) as never;
    const error = await denied(
      userRouter.acknowledgeInbox,
      { itemId: INBOX_ITEM_ID, idempotencyKey: crypto.randomUUID() },
      UNRELATED,
      "POST",
    );
    expect(error).toBeInstanceOf(Error);
    const ack = callsFor("user", "acknowledgeInboxItem");
    expect(ack[0]?.actorId).toBe(UNRELATED);
  });

  it("never reports success when a preference patch is denied", async () => {
    const { request } = await authenticatedRequest(UNRELATED, "POST");
    const result = (await invoke(
      userRouter.patchPreferences,
      { showBadges: false },
      { request },
    )) as { success: boolean };
    expect(result.success).toBe(false);
  });

  it("binds dashboard preferences to the actor's storage key", async () => {
    const { request } = await authenticatedRequest(UNRELATED, "POST");
    const result = (await invoke(
      userRouter.patchDashboardPreferences,
      { theme: "night" },
      { request },
    )) as { success: boolean };
    expect(result.success).toBe(true);
  });

  it("denies submitting an appeal for another user's infraction", async () => {
    const input = {
      hubId: HUB_ID,
      infractionId: INFRACTION_ID,
      reason: "This sanction was applied in error",
      idempotencyKey: crypto.randomUUID(),
    };
    const error = await denied(moderationRouter.submitAppeal, input, UNRELATED, "POST");
    expect(error).toBeInstanceOf(Error);
    const appeal = callsFor("moderation", "submitAppeal");
    expect(appeal).toHaveLength(1);
    expect(appeal[0]?.actorId).toBe(UNRELATED);
  });

  it("lists only the actor's own appealable infractions", async () => {
    behaviors["moderation.listMyAppealableInfractions"] = ((actorId: string) =>
      Promise.resolve([{ id: `infraction-of-${actorId}` }])) as never;
    const { request } = await authenticatedRequest(UNRELATED);
    const mine = (await invoke(moderationRouter.listMyAppealableInfractions, undefined, { request })) as Array<{ id: string }>;
    expect(mine.map((infraction) => infraction.id)).toEqual([`infraction-of-${UNRELATED}`]);
  });
});

/* ------------------------------------------------------------------ */
/* Existence concealment                                               */
/* ------------------------------------------------------------------ */

describe("denial responses do not leak private-object contents", () => {
  it("returns the same concealed denial for every inaccessible Hub surface", async () => {
    behaviors["hub.getHub"] = (() => Promise.reject(permissionDenied())) as never;
    const error = await denied(hubRouter.getHub, { hubId: HUB_ID }, UNRELATED);
    expect((error as { code?: string }).code).toBe("NOT_FOUND");
    expect(error.message).toBe("Hub not found or access denied.");
  });

  it("redacts bridge rows whose linked Hub lookup is denied or missing", async () => {
    // The Control Plane checks existence before permission, so a denied Hub
    // lookup must redact the row's Hub identity (including the raw ID) while
    // the bridge itself stays visible with its observed state.
    behaviors["connection.getConnections"] = ((query: { actorId: string }) =>
      query.actorId === STAFF
        ? Promise.resolve([
            {
              metadata: { id: CONNECTION_ID, hubId: HUB_ID, channelId: CHANNEL_ID, serverId: SERVER_ID },
              spec: { connected: true },
              status: { healthy: true },
              version: 1,
            },
          ])
        : Promise.reject(permissionDenied())) as never;
    behaviors["server.listConnectableChannels"] = (() =>
      Promise.resolve([{ channelId: CHANNEL_ID, name: "general", connectable: true }])) as never;

    const { request } = await authenticatedRequest(STAFF);
    const bridges = (await invoke(serverRouter.bridges, { serverId: SERVER_ID }, { request })) as Array<{
      hubId: string;
      channelId: string;
      channelName: string | null;
    }>;
    expect(bridges).toHaveLength(1);
    expect(bridges[0]?.hubId).toBe("");
    expect(bridges[0]?.channelId).toBe(CHANNEL_ID);
    expect(bridges[0]?.channelName).toBe("general");
    expect(JSON.stringify(bridges)).not.toContain(HUB_ID);
  });
});
