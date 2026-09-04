import { DownOutlined, ExclamationCircleOutlined, InboxOutlined, ReloadOutlined, StopOutlined, UpOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Popconfirm } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ListOperationsResponse, Operation } from "~/generated/control/v1/static";
import { orpc } from "~/lib/orpc";
import { idempotencyAttemptFor, type IdempotencyAttempt } from "~/services/lifecycleIntent";
import { operationFilterStates, presentOperation, type OperationFilterKey, type OperationPresentation } from "./operationPresentation";

const POLL_INTERVAL_MS = 2_000;
const MAX_CONSECUTIVE_ERRORS = 5;
const PAGE_LIMIT = 50;

const FILTER_PILLS: Array<{ key: OperationFilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "inProgress", label: "In progress" },
  { key: "needsAttention", label: "Needs attention" },
  { key: "failed", label: "Failed" },
  { key: "completed", label: "Completed" },
];

const TONE_BADGE_CLASSES = {
  info: "bg-sky-500/15 text-sky-300 border-sky-500/30 [&_.op-dot]:bg-sky-400",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 [&_.op-dot]:bg-emerald-400",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30 [&_.op-dot]:bg-amber-400",
  danger: "bg-red-500/15 text-red-300 border-red-500/30 [&_.op-dot]:bg-red-400",
} as const;

function relativeTime(iso: string | undefined, nowMs: number): string | undefined {
  if (!iso) return undefined;
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return undefined;
  const diff = Math.max(0, nowMs - then);
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function timestampToIso(timestamp: { seconds?: number; nanos?: number } | undefined): string | undefined {
  if (!timestamp?.seconds) return undefined;
  return new Date(timestamp.seconds * 1000 + Math.round((timestamp.nanos ?? 0) / 1_000_000)).toISOString();
}

function isUnavailableError(error: unknown): boolean {
  return error instanceof Error && /unavailable|temporarily/i.test(error.message);
}

function OperationRow({
  operation,
  nowMs,
}: {
  operation: Operation;
  nowMs: number;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [conflict, setConflict] = useState(false);
  const presentation: OperationPresentation = presentOperation(operation, nowMs);
  const operationId = operation.metadata?.id ?? "";
  const hasFailureDetail = Boolean(operation.status?.failureCode || operation.status?.failureMessage || operation.spec?.requestedAction || operation.metadata?.provenance?.source);
  // One stable key per intent (operation + version + action): retrying the
  // same intent after an UNAVAILABLE must reuse the key, never mint a new one.
  const attemptsRef = useRef<Record<string, IdempotencyAttempt>>({});
  const attemptFor = (action: "retry" | "cancel") => {
    const fingerprint = `${action}:${operationId}:${operation.version}:${presentation.terminal ? "t" : "l"}`;
    const attempt = idempotencyAttemptFor(attemptsRef.current[fingerprint] ?? null, fingerprint);
    attemptsRef.current[fingerprint] = attempt;
    return attempt.key;
  };

  const listKey = orpc.operations.list.queryOptions({ input: { limit: PAGE_LIMIT } }).queryKey;

  const cancelMutation = useMutation(
    orpc.operations.cancel.mutationOptions({
      onSuccess: async () => {
        message.success("Cancellation requested.");
        await queryClient.invalidateQueries({ queryKey: listKey });
      },
      onError: (error) => {
        if (/changed/i.test(error.message)) {
          setConflict(true);
        } else {
          message.error(error.message || "The cancellation could not be requested.");
        }
      },
    }),
  );

  const retryMutation = useMutation(
    orpc.operations.retry.mutationOptions({
      onSuccess: async () => {
        message.success("Retry queued.");
        await queryClient.invalidateQueries({ queryKey: listKey });
      },
      onError: (error) => {
        if (/changed/i.test(error.message)) {
          setConflict(true);
        } else {
          message.error(error.message || "The retry could not be queued.");
        }
      },
    }),
  );

  const actionPending = cancelMutation.isPending || retryMutation.isPending;
  const canRetry = Boolean(operation.spec?.retryable) && presentation.terminal
    && (presentation.tone === "danger" || presentation.tone === "warning");
  const canCancel = Boolean(operation.spec?.cancellable) && presentation.live;

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${TONE_BADGE_CLASSES[presentation.tone]}`}>
                <span className="op-dot w-1.5 h-1.5 rounded-full" />
                {presentation.stateLabel}
              </span>
              {presentation.stuck && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border bg-amber-500/15 text-amber-300 border-amber-500/30">
                  <ExclamationCircleOutlined className="text-[10px]" />
                  Stuck — no progress for over 5 minutes
                </span>
              )}
              <span className="text-sm font-bold text-white font-['Sora'] truncate">{presentation.actionLabel}</span>
            </div>
            {presentation.message && (
              <p className="text-sm text-white/70 m-0 truncate">{presentation.message}</p>
            )}
            <p className="text-xs text-white/45 m-0">
              <span title={timestampToIso(operation.metadata?.createdAt)}>
                {relativeTime(timestampToIso(operation.metadata?.createdAt), nowMs) || "Time unavailable"}
              </span>
              {operation.spec?.maxAttempts ? ` · Attempt ${operation.status?.attemptCount ?? 0} of ${operation.spec.maxAttempts}` : ""}
              {operationId ? ` · ${operationId.slice(0, 8)}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {canRetry && (
            <button
              type="button"
              disabled={actionPending}
              onClick={() => retryMutation.mutate({ operationId, expectedVersion: operation.version, idempotencyKey: attemptFor("retry") })}
              className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold"
              title="Queue this operation again with the same intent"
              aria-disabled={actionPending}
            >
              <ReloadOutlined />
              <span>Retry</span>
            </button>
          )}
          {canCancel && (
            <Popconfirm
              title="Cancel this operation?"
              description="The Control Plane will stop the operation at the next safe point."
              okText="Cancel operation"
              cancelText="Keep running"
              okButtonProps={{ danger: true }}
              onConfirm={() => cancelMutation.mutate({ operationId, expectedVersion: operation.version, idempotencyKey: attemptFor("cancel") })}
            >
              <button
                type="button"
                disabled={actionPending}
                className="dashboard-btn-danger px-3.5 py-1.5 text-xs font-bold"
                title="Stop this operation before it completes"
                aria-disabled={actionPending}
              >
                <StopOutlined />
                <span>Cancel</span>
              </button>
            </Popconfirm>
          )}
          {hasFailureDetail && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="dashboard-btn-secondary !px-2.5 py-1.5 text-xs font-bold"
              aria-expanded={expanded}
              title={expanded ? "Hide details" : "Show failure details"}
            >
              {expanded ? <UpOutlined /> : <DownOutlined />}
            </button>
          )}
        </div>
      </div>

      {presentation.live && !presentation.stuck && (operation.status?.progressPercent ?? 0) > 0 && (
        <div
          className="h-1 rounded-full overflow-hidden bg-white/[0.06]"
          role="progressbar"
          aria-valuenow={operation.status?.progressPercent ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${presentation.actionLabel} progress`}
        >
          <div
            className="h-full rounded-full bg-sky-400/70 motion-reduce:transition-none transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(2, operation.status?.progressPercent ?? 0))}%` }}
          />
        </div>
      )}

      {conflict && (
        <div role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-50 flex items-center justify-between gap-3 flex-wrap">
          <span>This operation changed since you viewed it. Refresh to review its current state before retrying.</span>
          <button
            type="button"
            onClick={async () => {
              setConflict(false);
              await queryClient.invalidateQueries({ queryKey: listKey });
            }}
            className="dashboard-btn-secondary !min-h-[28px] !px-3 !py-1 !text-xs !font-bold"
          >
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
        </div>
      )}

      {expanded && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 m-0 text-xs">
          {operation.status?.failureCode && (
            <div className="flex gap-2">
              <dt className="text-white/45">Failure code</dt>
              <dd className="text-white/80 m-0 truncate">{operation.status.failureCode}</dd>
            </div>
          )}
          {operation.status?.failureMessage && (
            <div className="flex gap-2">
              <dt className="text-white/45">Failure reason</dt>
              <dd className="text-white/80 m-0 truncate">{operation.status.failureMessage}</dd>
            </div>
          )}
          {operation.spec?.requestedAction && (
            <div className="flex gap-2">
              <dt className="text-white/45">Requested action</dt>
              <dd className="text-white/80 m-0 truncate">{operation.spec.requestedAction}</dd>
            </div>
          )}
          {operation.status?.recoveryAction && (
            <div className="flex gap-2">
              <dt className="text-white/45">Recovery</dt>
              <dd className="text-white/80 m-0 truncate">{operation.status.recoveryAction}</dd>
            </div>
          )}
          {operation.status?.nextRetryAt?.seconds ? (
            <div className="flex gap-2">
              <dt className="text-white/45">Next retry</dt>
              <dd className="text-white/80 m-0">{timestampToIso(operation.status.nextRetryAt)}</dd>
            </div>
          ) : null}
          {operation.metadata?.provenance && (
            <div className="flex gap-2">
              <dt className="text-white/45">Source</dt>
              <dd className="text-white/80 m-0 truncate">{operation.metadata.provenance.source}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-white/45">Completed</dt>
            <dd className="text-white/80 m-0">{timestampToIso(operation.status?.completedAt) || "Not completed"}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

export function OperationsPanel() {
  const [filter, setFilter] = useState<OperationFilterKey>("all");
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [pages, setPages] = useState<Array<{ operations: Operation[]; nextCursor: string }>>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const firstPage = useQuery({
    ...orpc.operations.list.queryOptions({ input: { limit: PAGE_LIMIT } }),
    // Poll only while at least one loaded operation may still change; a
    // terminal history must not keep the network busy.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return POLL_INTERVAL_MS;
      return data.operations.some((operation) => presentOperation(operation, Date.now()).live) ? POLL_INTERVAL_MS : false;
    },
    retry: false,
  });

  useEffect(() => {
    if (firstPage.isError) {
      setConsecutiveErrors((count) => count + 1);
    } else if (firstPage.isSuccess) {
      setConsecutiveErrors(0);
    }
  }, [firstPage.isError, firstPage.isSuccess]);

  // Keep relative timestamps and the stuck-operation flag honest even when
  // nothing is polling (all work settled).
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const queryClient = useQueryClient();
  const listKey = orpc.operations.list.queryOptions({ input: { limit: PAGE_LIMIT } }).queryKey;

  const accumulated = useMemo<{ operations: Operation[]; nextCursor: string | undefined; hasMore: boolean }>(() => {
    if (!firstPage.data) return { operations: [], nextCursor: undefined, hasMore: false };
    const merged = [firstPage.data, ...pages];
    const seen = new Set<string>();
    const operations: Operation[] = [];
    for (const page of merged) {
      for (const operation of page.operations) {
        const id = operation.metadata?.id ?? JSON.stringify(operation.metadata);
        if (!seen.has(id)) {
          seen.add(id);
          operations.push(operation);
        }
      }
    }
    const lastPage = merged[merged.length - 1];
    return { operations, nextCursor: lastPage.nextCursor || undefined, hasMore: lastPage.hasMore };
  }, [firstPage.data, pages]);

  const filtered = useMemo(() => {
    if (filter === "all") return accumulated.operations;
    const states = new Set<string>(operationFilterStates(filter));
    return accumulated.operations.filter((operation) => states.has(operation.status?.state ?? ""));
  }, [accumulated.operations, filter]);

  if (firstPage.isLoading) {
    return (
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#13141f", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {[1, 2, 3].map((row) => (
            <div key={row} className="p-5 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08]" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-40 h-4 rounded bg-white/[0.08]" />
                  <div className="w-56 h-3 rounded bg-white/[0.05]" />
                </div>
              </div>
              <div className="w-20 h-7 rounded-lg bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (firstPage.isError) {
    const unavailable = isUnavailableError(firstPage.error);
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS && unavailable) {
      return (
        <div role="alert" className="rounded-2xl p-6 border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-bold text-white m-0">Operations status is unavailable</h3>
            <p className="text-xs text-amber-100/80 m-0 mt-1">
              The Control Plane could not be reached repeatedly. No state has been assumed — check the operations before acting.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConsecutiveErrors(0);
              firstPage.refetch();
            }}
            className="dashboard-btn-secondary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
          >
            <ReloadOutlined className="text-xs" />
            <span>Try again</span>
          </button>
        </div>
      );
    }
    return (
      <div role="alert" className="rounded-2xl p-6 border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-white m-0">Operations could not be loaded</h3>
          <p className="text-xs text-amber-100/80 m-0 mt-1">{firstPage.error.message || "The operation list is temporarily unavailable."}</p>
        </div>
        <button
          type="button"
          onClick={() => firstPage.refetch()}
          className="dashboard-btn-secondary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
        >
          <ReloadOutlined className="text-xs" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  const liveCount = accumulated.operations.filter((operation) => presentOperation(operation, nowMs).live).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter operations by state">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.key}
              type="button"
              aria-pressed={filter === pill.key}
              onClick={() => setFilter(pill.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                filter === pill.key
                  ? "bg-violet-500 text-white border-violet-400"
                  : "bg-white/[0.04] text-white/60 border-white/[0.08] hover:bg-white/[0.08] hover:text-white/80"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/45 m-0" role="status">
          {liveCount > 0 ? `${liveCount} operation${liveCount === 1 ? "" : "s"} in flight` : "All operations settled"}
        </p>
      </div>

      <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: "#13141f", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 0 0 rgba(10,8,23,0.75)" }}>
        {filtered.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {filtered.map((operation) => (
              <OperationRow key={operation.metadata?.id ?? String(operation.metadata?.createdAt?.seconds)} operation={operation} nowMs={nowMs} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white/40">
              <InboxOutlined />
            </div>
            <h3 className="text-sm font-bold text-white font-['Sora'] m-0">
              {accumulated.operations.length > 0 ? "No operations match this filter" : "No operations yet"}
            </h3>
            <p className="text-xs text-white/50 max-w-sm m-0">
              {accumulated.operations.length > 0
                ? "Try a different state filter to see the rest of your operations."
                : "When you make changes that the Control Plane processes in the background — connecting channels, restoring configurations — they appear here with their live status."}
            </p>
          </div>
        )}
      </div>

      {accumulated.hasMore && accumulated.nextCursor && (
        <button
          type="button"
          onClick={async () => {
            const next = await queryClient.fetchQuery(
              orpc.operations.list.queryOptions({ input: { limit: PAGE_LIMIT, cursor: accumulated.nextCursor } }),
            );
            setPages((current) => [...current, next]);
          }}
          className="dashboard-btn-secondary px-4 py-2 text-xs font-bold self-center"
        >
          Load more
        </button>
      )}
    </div>
  );
}
