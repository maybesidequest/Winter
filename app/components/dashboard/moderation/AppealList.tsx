import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { Appeal } from "~/services/control/moderation.shared";

function formatStatus(status: string) {
  return status.replace(/^APPEAL_STATUS_/, "").replaceAll("_", " ").toLowerCase();
}

function formatDate(timestamp: string | null) {
  if (!timestamp) return "Not reviewed";
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

interface AppealListProps {
  appeals: Appeal[];
  onOpenDecision?: (appeal: Appeal, kind: "approve" | "reject") => void;
}

export function AppealList({ appeals, onOpenDecision }: AppealListProps) {
  if (appeals.length === 0) {
    return (
      <div className="py-8 text-center rounded-xl bg-[#181726] border border-white/[0.06] flex flex-col items-center gap-2">
        <InboxOutlined className="text-2xl text-white/30" />
        <p className="m-0 text-xs text-white/50">No pending appeals awaiting review for this Hub.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {appeals.map((appeal) => {
        const isPending = appeal.appealStatus === "APPEAL_STATUS_PENDING";
        const sanctionType = appeal.infraction?.type?.replace("SANCTION_TYPE_", "") || "SANCTION";

        return (
          <article
            key={appeal.id}
            className="flex flex-col gap-3 p-4 rounded-xl bg-[#181726] border border-white/[0.08] text-xs shadow-[0_2px_0_0_rgba(10,8,23,0.3)] transition-all hover:border-white/15"
          >
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${
                    isPending
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : appeal.appealStatus === "APPEAL_STATUS_APPROVED"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-red-500/15 text-red-300 border-red-500/30"
                  }`}
                >
                  {formatStatus(appeal.appealStatus)}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/5 text-white/70 border border-white/10">
                  {sanctionType}
                </span>
                <span className="text-white/60 font-mono text-xs">
                  User: {appeal.userId}
                </span>
              </div>

              <span className="text-white/40 text-xs">
                {appeal.createdAt ? formatDate(appeal.createdAt) : null}
              </span>
            </div>

            {/* Appeal Reason Statement */}
            <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06]">
              <p className="m-0 text-white/90 leading-relaxed whitespace-pre-wrap font-sans">
                "{appeal.reason}"
              </p>
            </div>

            {/* Metadata Footer & Review Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.04]">
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/40 text-xs">
                {appeal.reviewedAt && (
                  <span>Reviewed: {formatDate(appeal.reviewedAt)}</span>
                )}
                {appeal.infraction && (
                  <span>
                    State:{" "}
                    {appeal.infraction.lifecycleState
                      .replace("INFRACTION_LIFECYCLE_STATE_", "")
                      .toLowerCase()}
                  </span>
                )}
                {appeal.resolutionReason && (
                  <span className="text-white/60 italic" title={appeal.resolutionReason}>
                    Resolution: "{appeal.resolutionReason}"
                  </span>
                )}
              </div>

              {isPending && onOpenDecision && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDecision(appeal, "approve")}
                    className="dashboard-btn-primary !min-h-[30px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircleOutlined className="text-xs" />
                    <span>Approve…</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDecision(appeal, "reject")}
                    className="dashboard-btn-secondary !min-h-[30px] !px-3 !py-1 !text-xs !font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CloseCircleOutlined className="text-xs" />
                    <span>Reject…</span>
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
