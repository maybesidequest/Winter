import { describe, expect, it } from "bun:test";
import { action } from "~/routes/auth/logout";

describe("logout CSRF boundary", () => {
  it("only accepts POST", async () => {
    const response = await action({ request: new Request("https://winter.test/auth/logout") } as never);
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("rejects a cross-origin POST", async () => {
    const response = await action({
      request: new Request("https://winter.test/auth/logout", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
      }),
    } as never);
    expect(response.status).toBe(403);
  });
});
