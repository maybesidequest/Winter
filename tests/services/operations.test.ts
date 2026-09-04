import { describe, expect, it } from "bun:test";
import { ORPCError } from "@orpc/server";
import { OperationState } from "~/generated/control/v1/static";
import { mapOperationError } from "~/rpc/routers/operations";

/** A minimal gRPC-shaped failure; grpcCodeOf reads the numeric `code`. */
function grpcError(code: number): unknown {
  return Object.assign(new Error("rpc failure"), { code });
}

function catchError(fn: () => unknown): ORPCError<any, any> {
  try {
    fn();
    throw new Error("expected function to throw an ORPCError");
  } catch (error) {
    expect(error).toBeInstanceOf(ORPCError);
    return error as ORPCError<any, any>;
  }
}

describe("mapOperationError", () => {
  it("maps invalid-argument to BAD_REQUEST", () => {
    expect(catchError(() => mapOperationError(grpcError(3))).code).toBe("BAD_REQUEST");
  });

  it("maps abort, already-exists, and failed-precondition to CONFLICT", () => {
    for (const code of [6, 9, 10]) {
      const error = catchError(() => mapOperationError(grpcError(code)));
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toBe("The operation changed. Refresh and try again.");
    }
  });

  it("maps unimplemented to BAD_REQUEST", () => {
    expect(catchError(() => mapOperationError(grpcError(12))).code).toBe("BAD_REQUEST");
  });

  it("collapses not-found, permission-denied, and unauthenticated into NOT_FOUND", () => {
    for (const code of [5, 7, 16]) {
      expect(catchError(() => mapOperationError(grpcError(code))).code).toBe("NOT_FOUND");
    }
  });

  it("treats every other failure as SERVICE_UNAVAILABLE", () => {
    for (const code of [4, 14, 8, 13, 2]) {
      expect(catchError(() => mapOperationError(grpcError(code))).code).toBe("SERVICE_UNAVAILABLE");
    }
  });
});

describe("operations list state mapping", () => {
  it("maps every client-facing state name onto the proto enum", () => {
    const names = [
      "OPERATION_STATE_PENDING",
      "OPERATION_STATE_RUNNING",
      "OPERATION_STATE_SUCCEEDED",
      "OPERATION_STATE_FAILED",
      "OPERATION_STATE_CANCELED",
      "OPERATION_STATE_CANCELLED",
      "OPERATION_STATE_NEEDS_ATTENTION",
      "OPERATION_STATE_PARTIAL",
    ] as const;
    for (const name of names) {
      expect(OperationState[name]).toBeDefined();
      expect(OperationState[name]).not.toBe(OperationState.OPERATION_STATE_UNSPECIFIED);
    }
  });
});
