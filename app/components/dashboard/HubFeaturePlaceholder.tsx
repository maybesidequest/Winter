import type { ReactNode } from "react";
import { dashboardGlassCardStyle } from "./shared";

interface HubFeaturePlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function HubFeaturePlaceholder({ icon, title, description }: HubFeaturePlaceholderProps) {
  return (
    <div
      className="max-w-4xl rounded-2xl border p-8 flex flex-col items-center text-center gap-3"
      style={dashboardGlassCardStyle}
    >
      <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-400/20 flex items-center justify-center text-xl text-violet-300">
        {icon}
      </div>
      <h2 className="text-base font-bold text-white font-['Sora'] m-0">{title}</h2>
      <p className="text-xs text-white/55 max-w-md m-0 leading-relaxed">{description}</p>
      <span className="dashboard-pill-btn px-3 py-1 text-[11px] font-semibold text-white/60 mt-1">
        Use /hub manage in Discord
      </span>
    </div>
  );
}
