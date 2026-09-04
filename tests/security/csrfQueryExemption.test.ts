import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import "./authzHarness";
import {
  STAFF,
  SERVER_ID,
  HUB_ID,
  behaviors,
  resetBoundary,
} from "./authzHarness";
import { sessionStorage } from "~/services/session.server";
import { ensureCsrfSession } from "~/services/csrf.server";

const { serverRouter } = await import("~/rpc/routers/server");
const { hubRouter } = await import("~/rpc/routers/hub");

async function createAuthenticatedPostRequest(actorId: string, options?: { omitCsrfHeader?: boolean; invalidCsrfHeader?: boolean }): Promise<Request> {
  const csrfToken = crypto.randomUUID();
  const session = await sessionStorage.getSession();
  session.set("user", { id: actorId, username: "fixture", avatarUrl: "" });
  session.set("csrfToken", csrfToken);
  const cookie = await sessionStorage.commitSession(session);

  const headers: Record<string, string> = {
    cookie,
    origin: "https://winter.test",
    "content-type": "application/json",
  };

  if (!options?.omitCsrfHeader) {
    headers["x-csrf-token"] = options?.invalidCsrfHeader ? "invalid-token" : csrfToken;
  }

  return new Request("https://winter.test/rpc", {
    method: "POST",
    headers,
  });
}

describe("CSRF query exemption & auto-healing", () => {
  it("allows read queries like server.list over POST even without X-CSRF-Token header", async () => {
    resetBoundary();
    behaviors["server.batchGetServers"] = (() => Promise.resolve({ servers: [] })) as never;
    const request = await createAuthenticatedPostRequest(STAFF, { omitCsrfHeader: true });

    // server.list is a read query. Over POST, it must succeed even when X-CSRF-Token is omitted.
    const result = await call(serverRouter.list as never, {} as never, { context: { request } });
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows read queries like hub.getUserHubs over POST even without X-CSRF-Token header", async () => {
    resetBoundary();
    behaviors["hub.listMyHubs"] = (() => Promise.resolve({ hubs: [] })) as never;
    const request = await createAuthenticatedPostRequest(STAFF, { omitCsrfHeader: true });

    const result = await call(hubRouter.getUserHubs as never, {} as never, { context: { request } });
    expect(Array.isArray(result)).toBe(true);
  });

  it("enforces CSRF for mutations over POST when X-CSRF-Token is omitted", async () => {
    resetBoundary();
    const request = await createAuthenticatedPostRequest(STAFF, { omitCsrfHeader: true });

    // server.patchCallConfig is a mutation. Over POST without CSRF header, it must be rejected with 403 / CSRF error.
    await expect(
      call(
        serverRouter.patchCallConfig as never,
        {
          serverId: SERVER_ID,
          pingOnMatch: false,
          autoRequeueOnSkip: false,
          filterNsfw: true,
          lobbyChannelIds: [],
          expectedVersion: 1,
          idempotencyKey: crypto.randomUUID(),
        } as never,
        { context: { request } },
      ),
    ).rejects.toThrow(/CSRF validation failed/);
  });

  it("ensureCsrfSession heals missing session csrfToken and missing cookie", async () => {
    // 1. Session without csrfToken
    const session = await sessionStorage.getSession();
    session.set("user", { id: STAFF, username: "fixture", avatarUrl: "" });
    const cookie = await sessionStorage.commitSession(session);

    const requestWithoutCsrf = new Request("https://winter.test/dashboard", {
      headers: { cookie },
    });

    const result = await ensureCsrfSession(requestWithoutCsrf);
    expect(typeof result.csrfToken).toBe("string");
    expect(result.csrfToken.length).toBeGreaterThan(0);

    const setCookies = result.headers.getSetCookie();
    expect(setCookies.some((c) => c.includes("interchat_csrf="))).toBe(true);
    expect(setCookies.some((c) => c.includes("interchat_session="))).toBe(true);
  });
});
