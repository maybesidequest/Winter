import { describe, expect, it } from "bun:test";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { shouldRevalidateServerWorkspace } from "~/services/serverWorkspaceNavigation";

type RevalidationArgs = Pick<
  ShouldRevalidateFunctionArgs,
  "currentParams" | "nextParams" | "formMethod" | "defaultShouldRevalidate"
>;

const args = (overrides: Partial<RevalidationArgs> = {}): RevalidationArgs => ({
  currentParams: { serverId: "server-1", view: "overview" },
  nextParams: { serverId: "server-1", view: "calls" },
  formMethod: undefined,
  defaultShouldRevalidate: true,
  ...overrides,
});

describe("server workspace navigation", () => {
  it("does not reload the route when switching tabs on one server", () => {
    expect(shouldRevalidateServerWorkspace(args())).toBe(false);
  });

  it("reloads when changing servers", () => {
    expect(
      shouldRevalidateServerWorkspace(args({
        nextParams: { serverId: "server-2", view: "overview" },
        defaultShouldRevalidate: false,
      })),
    ).toBe(true);
  });

  it("reloads after a mutation or explicit revalidation", () => {
    expect(shouldRevalidateServerWorkspace(args({ formMethod: "POST" }))).toBe(true);
    expect(
      shouldRevalidateServerWorkspace(args({
        defaultShouldRevalidate: true,
        nextParams: { serverId: "server-1", view: "calls" },
      })),
    ).toBe(false);
    expect(
      shouldRevalidateServerWorkspace(args({
        currentParams: { serverId: "server-1", view: "calls" },
        nextParams: { serverId: "server-1", view: "calls" },
        defaultShouldRevalidate: true,
      })),
    ).toBe(true);
  });
});
