/**
 * Shared harness for the negative-authorization test matrix
 * (docs/dashboard/phase-3-release.md, Workstream C — Object-level authorization).
 *
 * Enforcement-layer trace (verified against the code, not comments):
 *
 * 1. Winter session layer — `app/services/session.server.ts` holds the signed
 *    cookie session; `requireUser` (app/services/auth.server.ts) derives the
 *    actor exclusively from the `user` key of that server-side session. The
 *    browser can never choose the actor.
 * 2. Winter ORPC BFF — `app/rpc/context.ts` (`protectedBase`) authenticates the
 *    session, enforces CSRF on mutations, applies user and per-resource rate
 *    limits, and exposes the actor to handlers as `context.user`. Capability
 *    flags (`app/rpc/capabilityGuard.ts`) fail closed for uncutover routes.
 * 3. Winter ORPC routers — `app/rpc/routers/*` build control-plane inputs with
 *    `actorId: context.user.id`. Zod input schemas strip unknown keys, so a
 *    browser-supplied `actorId`/`userId` actor field never reaches the control
 *    plane as the actor.
 * 4. Winter control-plane clients — `app/services/control/*` wrap every RPC in
 *    a gRPC `RequestContext` (`makeRequestContext`) carrying the session actor,
 *    `servicePrincipal: "interchat-winter"`, and `source: "WINTER"`. They add
 *    no authorization of their own, hold no fallback writers, and propagate
 *    transport failures (mapped once by `controlErrorMiddleware` into
 *    `ControlPlaneError`).
 * 5. interchat-control (InterChat) — the authoritative layer. It authorizes the
 *    actor against the exact stored object (Iris owns Hub authorization),
 *    validates parent/child relationships, and answers with gRPC codes:
 *    NOT_FOUND = 5 (missing or redacted) and PERMISSION_DENIED = 7.
 *
 * These tests therefore fake only layer 5's gRPC boundary (the same
 * `ControlPlaneError` shape the real transport produces) and drive the real
 * session, ORPC, router, and client layers through `@orpc/server`'s `call`.
 */

import { mock } from "bun:test";
import { ControlPlaneError } from "~/services/control/middleware";
import { sessionStorage } from "~/services/session.server";

/* ------------------------------------------------------------------ */
/* Fixtures: owner, allowed staff, insufficient staff, unrelated, removed */
/* ------------------------------------------------------------------ */

export const OWNER = "actor-owner-000000000000001";
export const STAFF = "actor-staff-00000000000002";
export const INSUFFICIENT = "actor-insuff-0000000000003";
export const UNRELATED = "actor-unrelat-00000000000004";
export const REMOVED = "actor-removed-00000000000005";
export const ATTACKER = "actor-attacker-000000000006";

export const ACTOR_IDS = new Set([OWNER, STAFF, INSUFFICIENT, UNRELATED, REMOVED]);

export const HUB_ID = "hub-private-0000000000000001";
export const OTHER_HUB_ID = "hub-unrelat-0000000000000002";
export const RULE_ID = "rule_1";
export const ANNOUNCEMENT_ID = "ann-000000000000000000001";
export const INVITE_CODE = "invite-code-abc";
export const ROLE_ID = "role-000000000000000000001";
export const INFRACTION_ID = "infraction-00000000000000001";
export const APPEAL_ID = "appeal-000000000000000000001";
export const INBOX_ITEM_ID = "inbox-item-00000000000000001";
export const OPERATION_ID = "operation-0000000000000000001";

export const SERVER_ID = "guild-managed-000000000000001";
export const OTHER_SERVER_ID = "guild-other-000000000000002";
export const CHANNEL_ID = "channel-0000000000000000001";
export const CONNECTION_ID = "connection-00000000000000001";
export const OTHER_CONNECTION_ID = "connection-other-0000000000002";

/** Discord "Manage Server"-equivalent guilds the DiscordStrategy would return. */
export const manageableGuildsByActor: Record<string, Array<{ id: string; name: string; icon: string | null; owner: boolean; permissions: string }>> = {
  [STAFF]: [{ id: SERVER_ID, name: "Managed Server", icon: null, owner: false, permissions: "8" }],
  [UNRELATED]: [{ id: OTHER_SERVER_ID, name: "Other Server", icon: null, owner: false, permissions: "8" }],
};

/** Recorded control-plane boundary calls, for actor-binding assertions. */
export interface BoundaryCall {
  service: string;
  method: string;
  actorId: string | undefined;
  args: unknown[];
}
export const boundaryCalls: BoundaryCall[] = [];

export function callsFor(service: string, method: string): BoundaryCall[] {
  return boundaryCalls.filter((call) => call.service === service && call.method === method);
}

export function permissionDenied(): ControlPlaneError {
  return new ControlPlaneError({ code: 7, details: "You do not have permission to perform this action." });
}

export function notFound(): ControlPlaneError {
  return new ControlPlaneError({ code: 5, details: "Requested entity was not found." });
}

/**
 * Per-method override map keyed by `"service.method"`. Unset methods deny with
 * PERMISSION_DENIED (the control plane's negative answer), mirroring the
 * fail-closed control-plane policy under test.
 */
export const behaviors: Record<string, (...args: never[]) => unknown> = {};

function extractActorId(args: unknown[]): string | undefined {
  for (const arg of args) {
    if (typeof arg === "string" && ACTOR_IDS.has(arg)) return arg;
    if (arg && typeof arg === "object" && "actorId" in arg) {
      const actorId = (arg as { actorId: unknown }).actorId;
      if (typeof actorId === "string" && ACTOR_IDS.has(actorId)) return actorId;
    }
  }
  return undefined;
}

function fakeService(service: string): Record<string, (...args: unknown[]) => unknown> {
  return new Proxy({}, {
    get(_target, method: string | symbol) {
      if (typeof method !== "string") return undefined;
      return (...args: unknown[]) => {
        boundaryCalls.push({ service, method, actorId: extractActorId(args), args });
        const behavior = behaviors[`${service}.${method}`] as ((...fnArgs: unknown[]) => unknown) | undefined;
        if (behavior) return behavior(...args);
        return Promise.reject(permissionDenied());
      };
    },
  });
}

/* ------------------------------------------------------------------ */
/* Module boundary fakes (only layer 5 is faked)                       */
/* ------------------------------------------------------------------ */

const hubService = fakeService("hub");
const serverService = fakeService("server");
const connectionService = fakeService("connection");
const userService = fakeService("user");
const moderationService = fakeService("moderation");
const operationService = fakeService("operation");
const selectorService = fakeService("selector");
const previewService = fakeService("preview");

const inMemoryRedis = new Map<string, string>();
const redisStub = {
  get: async (key: string) => inMemoryRedis.get(key) ?? null,
  set: async (key: string, value: string) => {
    inMemoryRedis.set(key, value);
    return "OK";
  },
  incr: async () => 1,
  expire: async () => 1,
  ping: async () => "PONG",
};

// The real moderation module also provides canonical mappers and the failure
// classifier used by the moderation router; keep those real and swap only the
// gRPC-boundary service.
import { moderationFailureFor } from "~/services/control/moderation";
import { SafetyCollectionUnavailableError } from "~/services/safety.server";

/* ------------------------------------------------------------------ */
/* Discord guild fixtures: keep the real manageable-guild loader and   */
/* stub the token + HTTP seam it sits on, so the Winter-side           */
/* coalescing/rate-limit logic stays under test and load-order is      */
/* irrelevant.                                                         */
/* ------------------------------------------------------------------ */

import * as oauthTokenReal from "~/services/oauthToken.server";

mock.module("~/services/oauthToken.server", () => ({
  ...oauthTokenReal,
  getDiscordAccessToken: async (userId: string) => `fixture-token-${userId}`,
}));

const DISCORD_GUILDS_URL = "https://discord.com/api/v10/users/@me/guilds";
const TOKEN_PREFIX = "Bearer fixture-token-";
const realFetch = globalThis.fetch.bind(globalThis);

function installFixtureFetch(): void {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url !== DISCORD_GUILDS_URL) return realFetch(input, init);
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    const authorization = headers.get("Authorization") ?? "";
    const userId = authorization.startsWith(TOKEN_PREFIX) ? authorization.slice(TOKEN_PREFIX.length) : undefined;
    const guilds = userId ? manageableGuildsByActor[userId] ?? [] : [];
    return new Response(JSON.stringify(guilds), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

installFixtureFetch();

mock.module("~/redis.server", () => ({ redis: redisStub }));
mock.module("~/services/control.server", () => ({
  hubService,
  controlHubService: hubService,
  serverService,
  controlServerService: serverService,
  connectionService,
  controlConnectionService: connectionService,
  userService,
  controlUserService: userService,
  moderationService,
  controlModerationService: moderationService,
  operationService,
  controlOperationService: operationService,
  selectorService,
  controlSelectorService: selectorService,
  previewService,
  controlPreviewService: previewService,
}));
mock.module("~/services/control/hubs/staff", () => ({ hubStaffService: fakeService("hubs/staff") }));
mock.module("~/services/control/hubs/roles", () => ({ hubRoleService: fakeService("hubs/roles") }));
mock.module("~/services/control/moderation", () => ({ moderationFailureFor, moderationService }));
mock.module("~/services/safety.server", () => ({ SafetyCollectionUnavailableError, safetyService: fakeService("safety") }));

/* Capability flags must be enabled so routes are reachable at all. */
for (const flag of [
  "HUB_LIST", "HUB_LIFECYCLE", "HUB_CONFIG", "HUB_RULES", "HUB_INVITES", "HUB_TEAM",
  "HUB_ANNOUNCEMENTS", "HUB_BADGES", "HUB_LOGGING", "HUB_AUDIT", "SERVER_CONFIG",
  "SERVER_BLOCKLIST", "CONNECTIONS", "MODERATION", "USER_PROFILE", "USER_ACTIVITY",
  "USER_PREFERENCES", "USER_INBOX", "USER_FEEDBACK",
]) {
  process.env[`CONTROL_CAP_${flag}`] = "true";
}

/* ------------------------------------------------------------------ */
/* Procedure invocation helpers                                        */
/* ------------------------------------------------------------------ */

export async function authenticatedRequest(actorId: string, method = "GET"): Promise<{ request: Request }> {
  const csrfToken = crypto.randomUUID();
  const session = await sessionStorage.getSession();
  session.set("user", { id: actorId, username: "fixture", avatarUrl: "" });
  session.set("csrfToken", csrfToken);
  const cookie = await sessionStorage.commitSession(session);
  return {
    request: new Request("https://winter.test/rpc", {
      method,
      headers: {
        cookie,
        origin: "https://winter.test",
        "x-csrf-token": csrfToken,
        "content-type": "application/json",
      },
    }),
  };
}

export function unauthenticatedRequest(): { request: Request } {
  return { request: new Request("https://winter.test/rpc") };
}

export function resetBoundary(): void {
  boundaryCalls.length = 0;
  for (const key of Object.keys(behaviors)) delete behaviors[key];
  installFixtureFetch();
}
