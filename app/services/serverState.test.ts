import { describe, expect, test } from "bun:test";
import { stateForControlError } from "./serverState";

describe("server Control Plane state mapping", () => {
  test("keeps permission failures distinct from unavailable data", () => {
    expect(stateForControlError(new Error("Actor lacks MANAGE_GUILD permission")).state).toBe("permission_denied");
    expect(stateForControlError(new Error("Control Plane is temporarily unavailable")).state).toBe("unavailable");
  });
});
