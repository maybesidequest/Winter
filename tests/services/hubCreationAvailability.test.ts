import { describe, expect, it } from "bun:test";
import {
  HUB_CREATION_UNAVAILABLE_MESSAGE,
  canCreateHub,
} from "~/services/hubCreationAvailability";

describe("Hub creation availability", () => {
  it("does not expose Hub creation merely because Hub listing is enabled", () => {
    expect(canCreateHub({ HUB_LIST: true, HUB_LIFECYCLE: false })).toBe(false);
  });

  it("allows the action only after the lifecycle capability is enabled", () => {
    expect(canCreateHub({ HUB_LIST: true, HUB_LIFECYCLE: true })).toBe(true);
  });

  it("explains the unavailable state without promising a failed submission", () => {
    expect(HUB_CREATION_UNAVAILABLE_MESSAGE).toContain("not enabled");
  });
});
