import { AlertOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { SafetyAssessment } from "~/services/control/moderation.shared";

export type SafetyAssessmentState = "idle" | "loading" | "ready" | "error";

const STATE_COPY: Record<Exclude<SafetyAssessmentState, "ready">, string> = {
  idle: "Select a Discord member from the search bar above to request an automated safety profile.",
  loading: "Querying Control Plane safety telemetry and risk assessment…",
  error: "Safety assessment is currently unavailable. No automated risk score could be retrieved.",
};

function getRiskBandBadge(riskBand: string) {
  const normalized = riskBand.replace("SAFETY_RISK_BAND_", "").toLowerCase();
  switch (normalized) {
    case "low":
      return { label: "Low Risk", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    case "medium":
      return { label: "Medium Risk", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    case "high":
      return { label: "High Risk", color: "bg-coral-500/15 text-coral-300 border-coral-500/30" };
    case "critical":
      return { label: "Critical Risk", color: "bg-red-500/15 text-red-300 border-red-500/30" };
    default:
      return { label: normalized, color: "bg-white/10 text-white/70 border-white/20" };
  }
}

export function SafetyAssessmentCard({ assessment, state = "ready" }: { assessment: SafetyAssessment | null; state?: SafetyAssessmentState }) {
  if (state !== "ready" || !assessment) {
    const copy = state === "ready" ? STATE_COPY.error : STATE_COPY[state];
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#181726] p-4 text-xs text-white/60 flex items-center gap-2.5">
        <InfoCircleOutlined className="text-sm text-violet-400" />
        <span>{copy}</span>
      </div>
    );
  }

  const badge = getRiskBandBadge(assessment.riskBand);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#181726] p-4 text-xs flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <strong className="text-white text-sm">Control Plane Assessment</strong>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <span className="text-white/50 text-xs">
          Observed: {assessment.observedAt ? new Date(assessment.observedAt).toLocaleString() : "Not observed"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-white/70">
        <div>
          <span className="text-white/40">Risk Score:</span>{" "}
          <span className="font-bold text-white font-mono text-sm">{assessment.score}</span>
          <span className="text-white/40 text-xs"> / 100</span>
        </div>
      </div>

      {assessment.approvedSignalSummaries.length > 0 ? (
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">Observed Signals:</span>
          <ul className="m-0 list-none space-y-1.5 p-0">
            {assessment.approvedSignalSummaries.map((signal) => (
              <li key={signal.code} className="flex items-start gap-2 text-white/70">
                <CheckCircleOutlined className="text-violet-400 text-xs mt-0.5 flex-shrink-0" />
                <span className="flex-1">
                  {signal.summary}{" "}
                  <span className="text-white/40 text-[12px]">
                    ({signal.observedAt ? new Date(signal.observedAt).toLocaleDateString() : "unobserved"})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/50 pt-1">
          <AlertOutlined className="text-xs" />
          <span>No historical risk flags observed for this user.</span>
        </div>
      )}
    </div>
  );
}
