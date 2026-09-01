import { OperationState, type Operation } from "~/generated/control/v1/static";

export type ConnectionOperationPresentation = {
  tone: "info" | "success" | "warning" | "danger";
  title: string;
  detail: string;
  live: boolean;
};

export function presentConnectionOperation(operation: Operation): ConnectionOperationPresentation {
  const status = operation.status;
  const message = status?.statusMessage || status?.failureMessage;

  switch (status?.state) {
    case OperationState.OPERATION_STATE_PENDING:
      return { tone: "info", title: "Bridge change queued", detail: message || "Waiting for the Control Plane to accept the bridge change.", live: true };
    case OperationState.OPERATION_STATE_RUNNING:
      return { tone: "info", title: "Bridge change in progress", detail: message || "Control Plane is processing the bridge change.", live: true };
    case OperationState.OPERATION_STATE_SUCCEEDED:
      return { tone: "success", title: "Bridge change completed", detail: message || "The bridge is in its requested state.", live: false };
    case OperationState.OPERATION_STATE_PARTIAL:
      return { tone: "warning", title: "Bridge change needs attention", detail: message || "Part of this change did not apply. Review the bridge before retrying.", live: false };
    case OperationState.OPERATION_STATE_NEEDS_ATTENTION:
      return { tone: "warning", title: "Bridge change needs attention", detail: message || "Review the bridge state before retrying.", live: false };
    case OperationState.OPERATION_STATE_FAILED:
      return { tone: "danger", title: "Bridge change failed", detail: message || "The bridge was not changed. Review the bridge and retry.", live: false };
    case OperationState.OPERATION_STATE_CANCELED:
    case OperationState.OPERATION_STATE_CANCELLED:
      return { tone: "warning", title: "Bridge change cancelled", detail: message || "The bridge was not changed by this operation.", live: false };
    default:
      return { tone: "warning", title: "Bridge operation state unavailable", detail: "Refresh this Hub before making another bridge change.", live: false };
  }
}
