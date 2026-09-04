import { describe, expect, it } from "bun:test";
import { OperationState, OperationType, type Operation } from "~/generated/control/v1/static";
import { presentOperation } from "./operationPresentation";

function operation(state: OperationState, overrides: Partial<Operation> = {}): Operation {
  return {
    metadata: {
      id: "op-1",
      operationType: OperationType.OPERATION_TYPE_CONNECT_CHANNEL,
      resourceType: "connection",
      resourceId: "conn-1",
      createdAt: { seconds: 1_000, nanos: 0 },
    },
    spec: { ownerId: "u1", requestedAction: "", maxAttempts: 3, retryable: true, cancellable: true },
    status: { state, progressPercent: 0, statusMessage: "", failureCode: "", failureMessage: "", attemptCount: 1, recoveryAction: "", observedResourceVersion: 1, requiresAttention: false },
    version: 1,
    ...overrides,
  };
}

describe("presentOperation", () => {
  it("treats pending and running as live and pollable", () => {
    for (const state of [OperationState.OPERATION_STATE_PENDING, OperationState.OPERATION_STATE_RUNNING]) {
      const result = presentOperation(operation(state));
      expect(result.live).toBe(true);
      expect(result.terminal).toBe(false);
      expect(result.tone).toBe("info");
    }
  });

  it("maps terminal states to truthful tones", () => {
    expect(presentOperation(operation(OperationState.OPERATION_STATE_SUCCEEDED)).tone).toBe("success");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_FAILED)).tone).toBe("danger");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_PARTIAL)).tone).toBe("warning");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_NEEDS_ATTENTION)).tone).toBe("warning");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_CANCELED)).tone).toBe("warning");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_CANCELLED)).tone).toBe("warning");
    expect(presentOperation(operation(OperationState.OPERATION_STATE_FAILED)).terminal).toBe(true);
  });

  it("humanizes the operation type", () => {
    expect(presentOperation(operation(OperationState.OPERATION_STATE_RUNNING)).actionLabel).toBe("Connect channel");
    const restore = operation(OperationState.OPERATION_STATE_RUNNING, {
      metadata: { id: "op-2", operationType: OperationType.OPERATION_TYPE_RESTORE_AUDIT, resourceType: "hub", resourceId: "h1" },
    });
    expect(presentOperation(restore).actionLabel).toBe("Restore configuration");
  });

  it("falls back to the requested action when the type is unknown", () => {
    const custom = operation(OperationState.OPERATION_STATE_RUNNING, {
      metadata: { id: "op-3", operationType: OperationType.OPERATION_TYPE_UNSPECIFIED, resourceType: "", resourceId: "" },
      spec: { ownerId: "u1", requestedAction: "Reindex rules", maxAttempts: 3, retryable: true, cancellable: true },
    });
    expect(presentOperation(custom).actionLabel).toBe("Reindex rules");
  });

  it("prefers the server status message over the failure message", () => {
    const withMessages = operation(OperationState.OPERATION_STATE_FAILED, {
      status: { state: OperationState.OPERATION_STATE_FAILED, progressPercent: 0, statusMessage: "Webhook missing", failureCode: "DISCORD_FORBIDDEN", failureMessage: "403", attemptCount: 2, recoveryAction: "", observedResourceVersion: 1, requiresAttention: false },
    });
    expect(presentOperation(withMessages).message).toBe("Webhook missing");
  });

  it("flags live operations older than five minutes as stuck", () => {
    const started = 1_000_000;
    const justStarted = operation(OperationState.OPERATION_STATE_RUNNING, {
      metadata: { id: "op-4", operationType: OperationType.OPERATION_TYPE_CONNECT_CHANNEL, resourceType: "c", resourceId: "r", createdAt: { seconds: started / 1000, nanos: 0 } },
    });
    expect(presentOperation(justStarted, started + 60_000).stuck).toBe(false);
    expect(presentOperation(justStarted, started + 6 * 60_000).stuck).toBe(true);
    // Terminal states are never stuck, however old they are.
    expect(presentOperation(operation(OperationState.OPERATION_STATE_FAILED), started + 60 * 60_000).stuck).toBe(false);
  });
});
