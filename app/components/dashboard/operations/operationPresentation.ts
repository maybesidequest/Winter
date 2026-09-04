import { OperationState, OperationType, type Operation } from "~/generated/control/v1/static";

export type OperationTone = "info" | "success" | "warning" | "danger";

export interface OperationPresentation {
  tone: OperationTone;
  /** Short state label for the badge (12px Inter Label style). */
  stateLabel: string;
  /** Humanized action title, e.g. "Connect channel". */
  actionLabel: string;
  /** Server status message, or undefined so the row can fall back. */
  message: string | undefined;
  /** True while the operation may still change (PENDING/RUNNING). */
  live: boolean;
  /** True once the operation has reached a final state. */
  terminal: boolean;
  /** Live operation older than the 5-minute stuck SLO. */
  stuck: boolean;
}

const STUCK_AFTER_MS = 5 * 60_000;

const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  [OperationType.OPERATION_TYPE_UNSPECIFIED]: "Operation",
  [OperationType.OPERATION_TYPE_CONNECT_CHANNEL]: "Connect channel",
  [OperationType.OPERATION_TYPE_DISCONNECT_CHANNEL]: "Disconnect channel",
  [OperationType.OPERATION_TYPE_REPAIR_CONNECTION]: "Repair connection",
  [OperationType.OPERATION_TYPE_RESTORE_AUDIT]: "Restore configuration",
  [OperationType.OPERATION_TYPE_BULK_UPDATE]: "Bulk update",
  [OperationType.UNRECOGNIZED]: "Operation",
};

function actionLabel(operation: Operation): string {
  const type = operation.metadata?.operationType;
  if (type && type !== OperationType.OPERATION_TYPE_UNSPECIFIED && type !== OperationType.UNRECOGNIZED) {
    return OPERATION_TYPE_LABELS[type];
  }
  return operation.spec?.requestedAction || "Operation";
}

function startedAtMs(operation: Operation): number | undefined {
  const createdAt = operation.metadata?.createdAt;
  if (!createdAt?.seconds) return undefined;
  return createdAt.seconds * 1000 + Math.round((createdAt.nanos ?? 0) / 1_000_000);
}

export function presentOperation(operation: Operation, nowMs: number = Date.now()): OperationPresentation {
  const state = operation.status?.state;
  const message = operation.status?.statusMessage || operation.status?.failureMessage || undefined;
  const live = state === OperationState.OPERATION_STATE_PENDING || state === OperationState.OPERATION_STATE_RUNNING;
  const started = startedAtMs(operation);
  const stuck = live && started !== undefined && nowMs - started > STUCK_AFTER_MS;

  switch (state) {
    case OperationState.OPERATION_STATE_PENDING:
      return { tone: "info", stateLabel: "Queued", actionLabel: actionLabel(operation), message, live: true, terminal: false, stuck };
    case OperationState.OPERATION_STATE_RUNNING:
      return { tone: "info", stateLabel: "In progress", actionLabel: actionLabel(operation), message, live: true, terminal: false, stuck };
    case OperationState.OPERATION_STATE_SUCCEEDED:
      return { tone: "success", stateLabel: "Completed", actionLabel: actionLabel(operation), message, live: false, terminal: true, stuck: false };
    case OperationState.OPERATION_STATE_PARTIAL:
      return { tone: "warning", stateLabel: "Partially applied", actionLabel: actionLabel(operation), message, live: false, terminal: true, stuck: false };
    case OperationState.OPERATION_STATE_NEEDS_ATTENTION:
      return { tone: "warning", stateLabel: "Needs attention", actionLabel: actionLabel(operation), message, live: false, terminal: true, stuck: false };
    case OperationState.OPERATION_STATE_FAILED:
      return { tone: "danger", stateLabel: "Failed", actionLabel: actionLabel(operation), message, live: false, terminal: true, stuck: false };
    case OperationState.OPERATION_STATE_CANCELED:
    case OperationState.OPERATION_STATE_CANCELLED:
      return { tone: "warning", stateLabel: "Cancelled", actionLabel: actionLabel(operation), message, live: false, terminal: true, stuck: false };
    default:
      return { tone: "warning", stateLabel: "Unknown", actionLabel: actionLabel(operation), message, live: false, terminal: false, stuck: false };
  }
}

/** Server-friendly filter groups for the panel's pill controls. */
export type OperationFilterKey = "all" | "inProgress" | "needsAttention" | "failed" | "completed";

const OPERATION_FILTER_STATES: Record<Exclude<OperationFilterKey, "all">, readonly OperationState[]> = {
  inProgress: [OperationState.OPERATION_STATE_PENDING, OperationState.OPERATION_STATE_RUNNING],
  needsAttention: [OperationState.OPERATION_STATE_NEEDS_ATTENTION, OperationState.OPERATION_STATE_PARTIAL],
  failed: [OperationState.OPERATION_STATE_FAILED],
  completed: [OperationState.OPERATION_STATE_SUCCEEDED],
};

export function operationFilterStates(filter: OperationFilterKey): readonly OperationState[] {
  if (filter === "all") return [];
  return OPERATION_FILTER_STATES[filter];
}
