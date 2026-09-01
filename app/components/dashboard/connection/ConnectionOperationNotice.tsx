import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { orpc } from "~/lib/orpc";
import { presentConnectionOperation } from "./operationPresentation";

const TONE_CLASSES = {
  info: "border-sky-400/30 bg-sky-400/10 text-sky-50",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-50",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-50",
  danger: "border-red-400/30 bg-red-400/10 text-red-50",
} as const;

const POLL_INTERVAL_MS = 2_000;
const MAX_CONSECUTIVE_ERRORS = 5;
const TERMINAL_DISMISS_MS = 30_000;

export function ConnectionOperationNotice({ operationId }: { operationId: string }) {
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const operationQuery = useQuery({
    ...orpc.operations.get.queryOptions({ input: { operationId } }),
    // Stop polling once the operation reads as terminal, or after repeated
    // errors (e.g. the operation record was pruned) — an unreachable status
    // must not poll forever.
    refetchInterval: (query) => {
      const operation = query.state.data;
      if (!operation) return POLL_INTERVAL_MS;
      return presentConnectionOperation(operation).live ? POLL_INTERVAL_MS : false;
    },
    retry: false,
  });

  useEffect(() => {
    if (operationQuery.isError) {
      setConsecutiveErrors((count) => count + 1);
    } else if (operationQuery.isSuccess) {
      setConsecutiveErrors(0);
    }
  }, [operationQuery.isError, operationQuery.isSuccess]);

  const presentation = operationQuery.data ? presentConnectionOperation(operationQuery.data) : null;

  useEffect(() => {
    if (!presentation || presentation.live) return;
    const timer = setTimeout(() => setDismissed(true), TERMINAL_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [presentation]);

  if (dismissed) return null;
  if (operationQuery.isLoading) {
    return <p role="status" className="mt-1 text-xs text-sky-200/80">Checking bridge operation status…</p>;
  }

  if (operationQuery.isError) {
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      return (
        <p role="alert" className="mt-1 text-xs text-amber-200">
          Bridge operation status is unavailable. Check the bridge state on Discord before making another change.
        </p>
      );
    }
    return <p role="alert" className="mt-1 text-xs text-amber-200">Bridge operation status is temporarily unavailable. No state has been assumed.</p>;
  }

  if (!presentation) return null;
  return (
    <div role={presentation.live ? "status" : "alert"} className={`mt-2 rounded-lg border px-3 py-2 text-xs ${TONE_CLASSES[presentation.tone]}`}>
      <strong className="block text-sm">{presentation.title}</strong>
      <span className="mt-0.5 block text-white/75">{presentation.detail}</span>
    </div>
  );
}
