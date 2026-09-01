import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { clearOAuthStateCookie, oauthStateCookie } from "~/services/discordStrategy.server";
import { validateProductionConfig } from "~/services/config.server";
import { newCsrfToken, requireCsrf, serializeCsrfCookie } from "~/services/csrf.server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, sessionStorage } from "~/services/session.server";

describe("Winter authentication boundaries", () => {
  it("fails closed when production credentials are missing", () => {
    expect(() => validateProductionConfig({ NODE_ENV: "production" }, "production")).toThrow(/SESSION_SECRET/);
    expect(() => validateProductionConfig({ NODE_ENV: "test" }, "test")).not.toThrow();
  });

  it("uses bounded, HttpOnly, SameSite session cookies", async () => {
    const session = await sessionStorage.getSession();
    const cookie = await sessionStorage.commitSession(session);

    expect(cookie).toContain(`Max-Age=${SESSION_MAX_AGE_SECONDS}`);
    expect(cookie).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("requires the signed-session CSRF token and constant-time header match", async () => {
    const token = newCsrfToken();
    const csrfCookie = await serializeCsrfCookie(token);
    expect(csrfCookie).toContain("interchat_csrf=");

    await expect(
      requireCsrf(
        new Request("https://winter.test/api/v1/mutation", {
          method: "POST",
          headers: { Origin: "https://winter.test", "X-CSRF-Token": token },
        }),
        token,
      ),
    ).resolves.toBeUndefined();

    await expect(
      requireCsrf(
        new Request("https://winter.test/api/v1/mutation", {
          method: "POST",
          headers: { Origin: "https://winter.test", "X-CSRF-Token": "wrong" },
        }),
        token,
      ),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("clears the OAuth state cookie after callback consumption", async () => {
    const clearCookie = await clearOAuthStateCookie();
    expect(clearCookie).toContain("Max-Age=0");
    expect(clearCookie).toContain("oauth_state=");

    const stateCookie = await oauthStateCookie.serialize("one-time-state");
    expect(stateCookie).toContain("HttpOnly");
    expect(stateCookie).toContain("SameSite=Lax");
  });

  it("does not inject a browser-controlled NODE_ENV value", async () => {
    const root = await readFile(new URL("../../app/root.tsx", import.meta.url), "utf8");
    expect(root).not.toContain("window.process");
    expect(root).not.toContain('NODE_ENV: "development"');
  });

  it("keeps provider credentials out of Winter configuration and runtime", async () => {
    const envExample = await readFile(new URL("../../.env.example", import.meta.url), "utf8");
    expect(envExample).not.toMatch(/(?:^|\n)(?:IRIS|POLARIZER)_[A-Z_]+=/);
    expect(envExample).not.toMatch(/(?:^|\n)(?:DATABASE_URL|DISCORD_TOKEN)=/);
    await expect(readFile(new URL("../../app/services/iris.server.ts", import.meta.url))).rejects.toThrow();
    await expect(readFile(new URL("../../app/services/polarizer.server.ts", import.meta.url))).rejects.toThrow();
  });
});
