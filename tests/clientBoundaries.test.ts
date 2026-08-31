import { describe, expect, it } from "bun:test";

describe("browser client boundaries", () => {
  it("does not pull the server-only moderation transport into the hub workspace", async () => {
    const source = await Bun.file(
      new URL("../app/components/dashboard/HubModerationPanel.tsx", import.meta.url),
    ).text();

    expect(source).not.toMatch(/from ["']~\/services\/control\/moderation["']/);
  });
});
