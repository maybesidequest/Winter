import { CheckOutlined } from "@ant-design/icons";
import { STEP_ITEMS } from "~/components/CreateHubWizard/types";

interface WizardSidebarProps {
  isFirstHub: boolean;
  currentStep: number;
}

export function WizardSidebar({ isFirstHub, currentStep }: WizardSidebarProps) {
  return (
    <div
      className="hub-wizard-sidebar relative w-80 p-8 md:p-10 flex flex-col justify-between select-none border-r border-white/[0.08] overflow-hidden flex-shrink-0"
      style={{ background: "#13141f" }}
    >
      <div className="dashboard-card-contours dashboard-card-contours--subtle" aria-hidden="true" />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Intro */}
        <div className="hub-wizard-sidebar__intro flex flex-col gap-3">
          <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30">
            {isFirstHub ? "First Hub Setup" : "New Hub"}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white font-['Sora'] tracking-tight leading-snug">
            {isFirstHub ? "Launch your first bridge." : "Open another community lane."}
          </h2>
          <p className="text-xs text-white/50 leading-relaxed">
            {isFirstHub
              ? "Define the identity, configure defaults, and drop straight into your hub control plane."
              : "Spin up an additional hub to bridge separated communities with independent policies."}
          </p>
        </div>

        {/* Steps List */}
        <div className="hub-wizard-steps flex flex-col gap-6">
          {STEP_ITEMS.map((item, index) => {
            const active = index === currentStep;
            const past = index < currentStep;

            return (
              <div
                key={item.title}
                className={`hub-wizard-step flex items-start gap-3.5 transition-all duration-200 ${
                  active ? "opacity-100" : past ? "opacity-90" : "opacity-40"
                }`}
              >
                {/* Step Number or Check Badge */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-['Sora'] flex-shrink-0 transition-all ${
                    active
                      ? "bg-[#5b4ccb] text-white border border-[#8175ee]/60 shadow-[0_0_14px_rgba(129,117,238,0.45)]"
                      : past
                      ? "bg-[#7ed493]/20 text-[#7ed493] border border-[#7ed493]/35"
                      : "bg-white/[0.04] text-white/40 border border-white/10"
                  }`}
                >
                  {past ? <CheckOutlined className="text-[11px]" /> : index + 1}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col gap-0.5 pt-0.5 min-w-0">
                  <span
                    className={`text-xs font-bold font-['Sora'] ${
                      active ? "text-white" : past ? "text-white/90" : "text-white/50"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[11px] text-white/40 leading-normal">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="relative z-10 pt-6 border-t border-white/[0.06] text-[11px] text-white/30 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
        <span>InterChat Control Plane</span>
      </div>
    </div>
  );
}
