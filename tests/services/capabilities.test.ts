import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { isCapabilityEnabled } from "~/services/capabilities.server";

describe("dashboard capability gates", () => {
  const original = process.env.CONTROL_CAP_HUB_AUDIT;

  beforeEach(() => {
    delete process.env.CONTROL_CAP_HUB_AUDIT;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.CONTROL_CAP_HUB_AUDIT;
    else process.env.CONTROL_CAP_HUB_AUDIT = original;
  });

  it("keeps audit history disabled unless explicitly enabled", () => {
    expect(isCapabilityEnabled("HUB_AUDIT")).toBe(false);
    process.env.CONTROL_CAP_HUB_AUDIT = "true";
    expect(isCapabilityEnabled("HUB_AUDIT")).toBe(true);
  });

  it("accepts the deployment's numeric enable value", () => {
    process.env.CONTROL_CAP_HUB_AUDIT = "1";
    expect(isCapabilityEnabled("HUB_AUDIT")).toBe(true);
  });
});
