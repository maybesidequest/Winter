import type { ModerationFailure } from "~/services/control/moderation.shared";

const COPY: Record<ModerationFailure["kind"], { title: string; detail: string }> = {
  STALE: { title: "Record changed", detail: "Refresh the record before submitting another decision." },
  UNAVAILABLE: { title: "Control Plane unavailable", detail: "No moderation state was assumed. Retry when service is available." },
  NOT_FOUND: { title: "Record unavailable", detail: "It may have been removed or you may no longer have access." },
};

export function ModerationOperationNotice({ failure, onRefresh, onRetry, onBack }: { failure: ModerationFailure; onRefresh?: () => void; onRetry?: () => void; onBack?: () => void }) {
  const copy = COPY[failure.kind];
  return <div role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs text-amber-50"><strong className="block text-sm">{copy.title}</strong><span className="mt-1 block text-white/70">{failure.message} {copy.detail}</span><div className="mt-3 flex flex-wrap gap-2">{failure.kind === "STALE" && onRefresh && <button type="button" className="dashboard-btn-secondary px-3 py-1 text-xs" onClick={onRefresh}>Refresh record</button>}{failure.kind === "UNAVAILABLE" && onRetry && <button type="button" className="dashboard-btn-secondary px-3 py-1 text-xs" onClick={onRetry}>Retry</button>}{failure.kind === "NOT_FOUND" && onBack && <button type="button" className="dashboard-btn-secondary px-3 py-1 text-xs" onClick={onBack}>Back to Hub</button>}</div></div>;
}
