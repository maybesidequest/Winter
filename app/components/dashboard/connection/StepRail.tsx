import { CheckCircleFilled } from "@ant-design/icons";

export type Step = "prerequisites" | "choose" | "review" | "done";

export const STEPS: { key: Step; label: string }[] = [
  { key: "prerequisites", label: "Check" },
  { key: "choose", label: "Connect" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

interface StepRailProps {
  current: Step;
}

export function StepRail({ current }: StepRailProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);
  return (
    <ol className="flex items-center gap-1.5 m-0 mb-5 p-0 list-none" aria-label="Connection steps">
      {STEPS.map((step, index) => {
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
        return (
          <li key={step.key} className="flex items-center gap-1.5" aria-current={state === "current" ? "step" : undefined}>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold border transition-colors ${
                state === "done"
                  ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-300"
                  : state === "current"
                    ? "bg-violet-500/20 border-violet-400/60 text-violet-200"
                    : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {state === "done" ? <CheckCircleFilled /> : index + 1}
            </span>
            <span
              className={`text-xs font-semibold tracking-wide ${
                state === "current" ? "text-white" : state === "done" ? "text-white/60" : "text-white/40"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && <span className="w-4 h-px bg-white/15 mx-1" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

