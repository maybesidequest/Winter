import { describe, expect, it } from "bun:test";
import { applySecurityHeaders } from "~/services/securityHeaders.server";

describe("Winter HTTP security headers", () => {
  it("sets restrictive browser policies and a unique CSP nonce", async () => {
    const first = applySecurityHeaders(new Response("ok"), "production");
    const second = applySecurityHeaders(new Response("ok"), "production");

    expect(first.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(first.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(first.headers.get("Permissions-Policy")).toContain("camera=()");
    expect(first.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
    expect(first.headers.get("Content-Security-Policy")).not.toBe(second.headers.get("Content-Security-Policy"));
    expect(first.headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
  });

  it("does not advertise HSTS outside production", () => {
    expect(applySecurityHeaders(new Response("ok"), "test").headers.has("Strict-Transport-Security")).toBe(false);
  });
});
