import { describe, expect, it } from "bun:test";
import { rateLimitPolicyForPath } from "~/services/rateLimitPolicy";

describe("Winter rate-limit policy", () => {
  it("keeps the sign-in, search, read, mutation, and export budgets explicit", () => {
    expect(rateLimitPolicyForPath(["auth", "discord"])).toEqual({
      name: "reads",
      limit: 120,
      windowSeconds: 60,
    });
    expect(rateLimitPolicyForPath(["hubDiscovery", "search"])).toEqual({
      name: "search",
      limit: 30,
      windowSeconds: 60,
    });
    expect(rateLimitPolicyForPath(["hubFeatures", "createRule"])).toEqual({
      name: "mutations",
      limit: 30,
      windowSeconds: 60,
    });
    expect(rateLimitPolicyForPath(["audit", "export"])).toEqual({
      name: "exports",
      limit: 2,
      windowSeconds: 60,
    });
  });
});
