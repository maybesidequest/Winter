import { describe, expect, test } from "bun:test";
import { OperationState, type Operation } from "~/generated/control/v1/static";
import { presentConnectionOperation } from "./operationPresentation";

function operation(state: OperationState, statusMessage = "Webhook provisioning") : Operation {
  return { status: { state, statusMessage, failureMessage: "", progressPercent: 0, failureCode: "", attemptCount: 0, recoveryAction: "", observedResourceVersion: 0, requiresAttention: false }, version: 1 };
}

describe("presentConnectionOperation", () => {
  test("keeps polling while canonical work is pending", () => {
    expect(presentConnectionOperation(operation(OperationState.OPERATION_STATE_PENDING))).toEqual({ tone: "info", title: "Bridge change queued", detail: "Webhook provisioning", live: true });
  });

  test("reports a partial operation without treating it as success", () => {
    expect(presentConnectionOperation(operation(OperationState.OPERATION_STATE_PARTIAL))).toEqual({ tone: "warning", title: "Bridge change needs attention", detail: "Webhook provisioning", live: false });
  });

  test("reports terminal failures truthfully", () => {
    expect(presentConnectionOperation(operation(OperationState.OPERATION_STATE_FAILED, "Discord permissions changed"))).toEqual({ tone: "danger", title: "Bridge change failed", detail: "Discord permissions changed", live: false });
  });
});
