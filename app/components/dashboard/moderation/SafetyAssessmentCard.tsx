import type { SafetyAssessment } from "~/services/control/moderation";

export type SafetyAssessmentState = "idle" | "loading" | "ready" | "error";

const STATE_COPY: Record<Exclude<SafetyAssessmentState, "ready">, string> = {
  idle: "Select a member to request their safety assessment.",
  loading: "Requesting safety assessment…",
  error: "Safety assessment is unavailable. No risk level has been inferred.",
};

export function SafetyAssessmentCard({ assessment, state = "ready" }: { assessment: SafetyAssessment | null; state?: SafetyAssessmentState }) {
  if (state !== "ready" || !assessment) {
    const copy = state === "ready" ? STATE_COPY.error : STATE_COPY[state];
    return <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/60">{copy}</div>;
  }
  return <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs"><div className="flex flex-wrap justify-between gap-2"><strong className="text-white">Control Plane safety assessment</strong><span className="text-white/60">Observed: {assessment.observedAt ? new Date(assessment.observedAt).toLocaleString() : "Not observed"}</span></div><p className="mt-3 text-white/75">Risk band: <strong>{assessment.riskBand.replace("SAFETY_RISK_BAND_", "").toLowerCase()}</strong> · Score: {assessment.score}</p><ul className="m-0 list-disc space-y-1 pl-4 text-white/60">{assessment.approvedSignalSummaries.map((signal) => <li key={signal.code}>{signal.summary} <span className="text-white/40">({signal.observedAt ? new Date(signal.observedAt).toLocaleString() : "not observed"})</span></li>)}</ul></section>;
}
