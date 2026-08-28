import { describe, expect, test } from "bun:test";
import { stateForCollection, stateForControlError } from "./serverState";

describe("server Control Plane state mapping", () => {
  test("keeps permission failures distinct from unavailable data", () => {
    expect(stateForControlError(new Error("Actor lacks MANAGE_GUILD permission")).state).toBe("permission_denied");
    expect(stateForControlError(new Error("Control Plane is temporarily unavailable")).state).toBe("unavailable");
  });

  test("preserves permission status through wrapped gRPC errors", () => {
    expect(stateForControlError({ code: 7, message: "rpc failed" }).state).toBe("permission_denied");
    expect(stateForControlError({ message: "temporary wrapper", cause: { code: "PERMISSION_DENIED" } }).state).toBe("permission_denied");
    expect(stateForControlError({ code: 14, message: "unavailable" }).state).toBe("unavailable");
  });

  test("models not-requested, empty, and ready collection states", () => {
    expect(stateForCollection(false, 0)).toBe("not_requested");
    expect(stateForCollection(true, 0)).toBe("empty");
    expect(stateForCollection(true, 1)).toBe("ready");
  });
});
