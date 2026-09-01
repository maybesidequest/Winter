/**
 * Actor-derivation and actor-binding sweep — Phase 3 Workstream C.
 *
 * "Every request derives the actor from a verified Discord interaction or
 * server-side OAuth session; the browser cannot choose the actor."
 *
 * Layer trace: ./authzHarness.ts. These tests drive the real ORPC procedures
 * through `protectedBase` and assert that:
 *   1. an unauthenticated request is rejected before any handler runs;
 *   2. a mutating request without the signed-session CSRF token is rejected;
 *   3. for every route-level identifier (hub, server, connection, channel,
 *      rule, invite, announcement, staff assignment, role, infraction, appeal,
 *      inbox item, audit page, profile, activity, leaderboard, feedback,
 *      operation, review item), any browser-supplied actor identity is ignored
 *      and the control-plane call carries the session actor — even when the
 *      raw input is poisoned with `actorId` fields.
 */

import { describe, expect, it, beforeEach } from "bun:test";
import { call } from "@orpc/server";
import "./authzHarness";
import {
  ANNOUNCEMENT_ID,
  APPEAL_ID,
  CHANNEL_ID,
  CONNECTION_ID,
  HUB_ID,
  INFRACTION_ID,
  INBOX_ITEM_ID,
  INVITE_CODE,
  OPERATION_ID,
  ROLE_ID,
  RULE_ID,
  SERVER_ID,
  STAFF,
  UNRELATED,
  authenticatedRequest,
  boundaryCalls,
  resetBoundary,
  unauthenticatedRequest,
} from "./authzHarness";

const MUTATION = "POST" as const;
const IDEM = "idem-key-fixed-for-sweep";

const { hubRouter } = await import("~/rpc/routers/hub");
const { serverRouter } = await import("~/rpc/routers/server");
const { moderationRouter } = await import("~/rpc/routers/moderation");
const { userRouter } = await import("~/rpc/routers/user");
const { operationsRouter } = await import("~/rpc/routers/operations");
const { safetyRouter } = await import("~/rpc/routers/safety");

async function invoke(proc: unknown, input: unknown, ctx: { request: Request }) {
  return call(proc as never, input as never, { context: ctx });
}

interface SweepEntry {
  route: string;
  proc: unknown;
  input?: unknown;
  method?: "GET" | "POST";
  /** Server routes require a Discord-manageable guild before the control-plane boundary. */
  actor?: string;
}

const SWEEP: SweepEntry[] = [
  // Hub lifecycle and configuration (hub, server, channel identifiers)
  { route: "hub.getUserHubs", proc: hubRouter.getUserHubs },
  { route: "hub.getHub", proc: hubRouter.getHub, input: { hubId: HUB_ID } },
  { route: "hub.createHub", proc: hubRouter.createHub, input: { name: "Hub", shortDescription: "Desc", idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.patchConfig", proc: hubRouter.patchConfig, input: { hubId: HUB_ID, name: "Renamed Hub", version: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.getConnections", proc: hubRouter.getConnections, input: { hubId: HUB_ID } },
  { route: "hub.toggleConnection", proc: hubRouter.toggleConnection, input: { connectionId: CONNECTION_ID, hubId: HUB_ID, enabled: true, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.disconnectConnection", proc: hubRouter.disconnectConnection, input: { connectionId: CONNECTION_ID, hubId: HUB_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.createConnection", proc: hubRouter.createConnection, input: { hubId: HUB_ID, channelId: CHANNEL_ID, serverId: SERVER_ID, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.deleteHub", proc: hubRouter.deleteHub, input: { hubId: HUB_ID, confirmationName: "Hub", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.transferOwnership", proc: hubRouter.transferOwnership, input: { hubId: HUB_ID, newOwnerId: STAFF, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.lockdownHub", proc: hubRouter.lockdownHub, input: { hubId: HUB_ID, locked: true, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },

  // Hub features (rule, invite, announcement, badge, log, audit, staff, role identifiers)
  { route: "hub.listRules", proc: hubRouter.listRules, input: { hubId: HUB_ID } },
  { route: "hub.createRule", proc: hubRouter.createRule, input: { hubId: HUB_ID, title: "T", description: "D", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.updateRule", proc: hubRouter.updateRule, input: { hubId: HUB_ID, ruleId: RULE_ID, title: "T", description: "D", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.deleteRule", proc: hubRouter.deleteRule, input: { hubId: HUB_ID, ruleId: RULE_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.reorderRules", proc: hubRouter.reorderRules, input: { hubId: HUB_ID, ruleIds: [RULE_ID], expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.listInvites", proc: hubRouter.listInvites, input: { hubId: HUB_ID } },
  { route: "hub.createInvite", proc: hubRouter.createInvite, input: { hubId: HUB_ID, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.revokeInvite", proc: hubRouter.revokeInvite, input: { hubId: HUB_ID, inviteCode: INVITE_CODE, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.getBadges", proc: hubRouter.getBadges, input: { hubId: HUB_ID } },
  { route: "hub.patchBadges", proc: hubRouter.patchBadges, input: { hubId: HUB_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.getLogConfig", proc: hubRouter.getLogConfig, input: { hubId: HUB_ID } },
  { route: "hub.patchLogConfig", proc: hubRouter.patchLogConfig, input: { hubId: HUB_ID, channelId: CHANNEL_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.listAnnouncements", proc: hubRouter.listAnnouncements, input: { hubId: HUB_ID } },
  { route: "hub.createAnnouncement", proc: hubRouter.createAnnouncement, input: { hubId: HUB_ID, content: "Hello everyone", idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.updateAnnouncement", proc: hubRouter.updateAnnouncement, input: { hubId: HUB_ID, announcementId: ANNOUNCEMENT_ID, content: "Hello everyone", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.deleteAnnouncement", proc: hubRouter.deleteAnnouncement, input: { hubId: HUB_ID, announcementId: ANNOUNCEMENT_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.transitionAnnouncement", proc: hubRouter.transitionAnnouncement, input: { hubId: HUB_ID, announcementId: ANNOUNCEMENT_ID, desiredState: "PAUSED", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.listStaff", proc: hubRouter.listStaff, input: { hubId: HUB_ID } },
  { route: "hub.assignStaffRole", proc: hubRouter.assignStaffRole, input: { hubId: HUB_ID, userId: STAFF, role: "MODERATOR", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.removeStaffRole", proc: hubRouter.removeStaffRole, input: { hubId: HUB_ID, userId: STAFF, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.listRoles", proc: hubRouter.listRoles, input: { hubId: HUB_ID } },
  { route: "hub.createRole", proc: hubRouter.createRole, input: { hubId: HUB_ID, name: "Role", permissionsBitmask: 0, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.updateRole", proc: hubRouter.updateRole, input: { hubId: HUB_ID, roleId: ROLE_ID, name: "Role", permissionsBitmask: 0, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.deleteRole", proc: hubRouter.deleteRole, input: { hubId: HUB_ID, roleId: ROLE_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "hub.listAudit", proc: hubRouter.listAudit, input: { hubId: HUB_ID } },

  // Server surface (server, block, bridge identifiers) — the Discord-side
  // manageable-guild gate runs before the control-plane boundary, so these
  // assert binding through a manager actor.
  { route: "server.list", proc: serverRouter.list, input: {}, actor: STAFF },
  { route: "server.get", proc: serverRouter.get, input: { serverId: SERVER_ID }, actor: STAFF },
  { route: "server.channels", proc: serverRouter.channels, input: { serverId: SERVER_ID }, actor: STAFF },
  { route: "server.patchCallConfig", proc: serverRouter.patchCallConfig, input: { serverId: SERVER_ID, pingOnMatch: false, autoRequeueOnSkip: false, filterNsfw: true, lobbyChannelIds: [], expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.patchPrefix", proc: serverRouter.patchPrefix, input: { serverId: SERVER_ID, prefix: "!", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.bridges", proc: serverRouter.bridges, input: { serverId: SERVER_ID }, actor: STAFF },
  { route: "server.blocklist", proc: serverRouter.blocklist, input: { serverId: SERVER_ID }, actor: STAFF },
  { route: "server.addBlock", proc: serverRouter.addBlock, input: { serverId: SERVER_ID, targetType: "user", targetId: "123456789012345678", reason: "test", idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.removeBlock", proc: serverRouter.removeBlock, input: { serverId: SERVER_ID, blockId: "block-1", idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.toggleBridge", proc: serverRouter.toggleBridge, input: { serverId: SERVER_ID, connectionId: CONNECTION_ID, enabled: true, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.repairBridge", proc: serverRouter.repairBridge, input: { serverId: SERVER_ID, connectionId: CONNECTION_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },
  { route: "server.disconnectBridge", proc: serverRouter.disconnectBridge, input: { serverId: SERVER_ID, connectionId: CONNECTION_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION, actor: STAFF },

  // Moderation and appeals (infraction, appeal, subject identifiers)
  { route: "moderation.listMyAppealableInfractions", proc: moderationRouter.listMyAppealableInfractions },
  { route: "moderation.submitAppeal", proc: moderationRouter.submitAppeal, input: { hubId: HUB_ID, infractionId: INFRACTION_ID, reason: "Please review this sanction", idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.listInfractions", proc: moderationRouter.listInfractions, input: { hubId: HUB_ID } },
  { route: "moderation.getInfraction", proc: moderationRouter.getInfraction, input: { hubId: HUB_ID, infractionId: INFRACTION_ID } },
  { route: "moderation.applySanction", proc: moderationRouter.applySanction, input: { hubId: HUB_ID, subject: { userId: STAFF }, type: "SANCTION_TYPE_MUTE", reason: "test", idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.revokeSanction", proc: moderationRouter.revokeSanction, input: { hubId: HUB_ID, infractionId: INFRACTION_ID, reason: "test", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.listHubAppeals", proc: moderationRouter.listHubAppeals, input: { hubId: HUB_ID } },
  { route: "moderation.getAppeal", proc: moderationRouter.getAppeal, input: { hubId: HUB_ID, appealId: APPEAL_ID } },
  { route: "moderation.approveAppeal", proc: moderationRouter.approveAppeal, input: { hubId: HUB_ID, appealId: APPEAL_ID, resolutionReason: "ok", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.rejectAppeal", proc: moderationRouter.rejectAppeal, input: { hubId: HUB_ID, appealId: APPEAL_ID, resolutionReason: "no", expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.getHubSafetySettings", proc: moderationRouter.getHubSafetySettings, input: { hubId: HUB_ID } },
  { route: "moderation.patchHubSafetySettings", proc: moderationRouter.patchHubSafetySettings, input: { hubId: HUB_ID, settings: {}, updateMask: ["hideLinks"], expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "moderation.getSafetyAssessment", proc: moderationRouter.getSafetyAssessment, input: { hubId: HUB_ID, subject: { userId: STAFF } } },
  { route: "moderation.getStaff", proc: moderationRouter.getStaff, input: { hubId: HUB_ID } },
  { route: "moderation.addModerator", proc: moderationRouter.addModerator, input: { hubId: HUB_ID, targetUserId: STAFF, role: "MODERATOR", expectedVersion: 1 }, method: MUTATION },
  { route: "moderation.removeModerator", proc: moderationRouter.removeModerator, input: { hubId: HUB_ID, targetUserId: STAFF, expectedVersion: 1 }, method: MUTATION },

  // Personal surface (profile, activity, inbox, preferences)
  { route: "user.getProfile", proc: userRouter.getProfile },
  { route: "user.getActivity", proc: userRouter.getActivity, input: { year: 2026, month: 1 } },
  { route: "user.getLeaderboard", proc: userRouter.getLeaderboard, input: { kind: "MESSAGES" } },
  { route: "user.submitFeedback", proc: userRouter.submitFeedback, input: { category: "general", message: "Feedback message long enough", idempotencyKey: IDEM }, method: MUTATION },
  { route: "user.getInbox", proc: userRouter.getInbox },
  { route: "user.acknowledgeInbox", proc: userRouter.acknowledgeInbox, input: { itemId: INBOX_ITEM_ID, idempotencyKey: IDEM }, method: MUTATION },
  { route: "user.get", proc: userRouter.get },
  { route: "user.patchPreferences", proc: userRouter.patchPreferences, input: { showBadges: true }, method: MUTATION },

  // Durable operations (operation identifier)
  { route: "operations.get", proc: operationsRouter.get, input: { operationId: OPERATION_ID } },
  { route: "operations.list", proc: operationsRouter.list, input: {} },
  { route: "operations.cancel", proc: operationsRouter.cancel, input: { operationId: OPERATION_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },
  { route: "operations.retry", proc: operationsRouter.retry, input: { operationId: OPERATION_ID, expectedVersion: 1, idempotencyKey: IDEM }, method: MUTATION },

  // Safety review (review item identifier)
  { route: "safety.list", proc: safetyRouter.list, input: { hubId: HUB_ID, type: "review" } },
  { route: "safety.adjudicateHeld", proc: safetyRouter.adjudicateHeld, input: { hubId: HUB_ID, reviewItemId: "review-1", resolution: "APPROVE", reason: "acceptable", expectedVersion: 1 }, method: MUTATION },
];

beforeEach(() => {
  resetBoundary();
});

describe("session-derived actor identity", () => {
  it("rejects requests without a verified session before any handler runs", async () => {
    const { request } = unauthenticatedRequest();
    await expect(invoke(hubRouter.getHub, { hubId: HUB_ID }, { request })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(boundaryCalls).toHaveLength(0);
  });

  it("rejects a mutation without the signed-session CSRF token", async () => {
    const session = await sessionStorageForTest();
    const request = new Request("https://winter.test/rpc", {
      method: "POST",
      headers: { cookie: session, origin: "https://winter.test" },
    });
    await expect(
      invoke(hubRouter.createRule, { hubId: HUB_ID, title: "T", description: "D", expectedVersion: 1, idempotencyKey: IDEM }, { request }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(boundaryCalls).toHaveLength(0);
  });
});

async function sessionStorageForTest(): Promise<string> {
  const { sessionStorage } = await import("~/services/session.server");
  const session = await sessionStorage.getSession();
  session.set("user", { id: UNRELATED, username: "fixture", avatarUrl: "" });
  return sessionStorage.commitSession(session);
}

describe("actor binding across every route-level identifier", () => {
  it("binds dashboard preferences to the authenticated actor's Winter-owned storage key", async () => {
    // Dashboard preferences live in Winter-owned Redis (not the control
    // plane), so binding is asserted against the storage key instead.
    const { request } = await authenticatedRequest(UNRELATED, "POST");
    await invoke(userRouter.patchDashboardPreferences, { theme: "night" }, { request });
    const { userService } = await import("~/services/user.server");
    const own = await userService.getDashboardPreference(UNRELATED);
    const other = await userService.getDashboardPreference(STAFF);
    expect(own).toMatchObject({ theme: "night" });
    expect(other).toBeNull();
  });

  for (const entry of SWEEP) {
    it(`binds the session actor for ${entry.route}`, async () => {
      const actor = entry.actor ?? UNRELATED;
      const { request } = await authenticatedRequest(actor, entry.method ?? "GET");
      const poisoned = {
        ...(entry.input as Record<string, unknown> | undefined),
        actorId: "attacker-supplied-actor",
        discordUserId: "attacker-supplied-actor",
      };
      const before = boundaryCalls.length;
      try {
        await invoke(entry.proc, poisoned, { request });
      } catch {
        // Denials are fine here; the assertion is about who was named downstream.
      }
      const made = boundaryCalls.slice(before);
      expect(made.length, `${entry.route} should reach the control-plane boundary`).toBeGreaterThan(0);
      for (const boundaryCall of made) {
        expect(boundaryCall.actorId, `${entry.route} → ${boundaryCall.service}.${boundaryCall.method}`).toBe(actor);
      }
    });
  }
});
