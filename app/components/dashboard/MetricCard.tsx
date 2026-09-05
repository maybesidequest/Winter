import type { ReactNode } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: ReactNode;
  iconBg?: string;
  contourClass?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  icon,
  iconBg = "rgba(91, 76, 203, 0.15)",
  contourClass = "dashboard-card-contours",
}: MetricCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl flex flex-col justify-between select-none transition-all hover:border-white/15 group"
      style={{
        ...dashboardGlassCardStyle,
        height: "auto",
        padding: "20px 24px",
      }}
    >
      {/* Subtle Contour Effect from Homepage (Atlas Contours) */}
      <div className={`${contourClass} pointer-events-none opacity-25 group-hover:opacity-35 transition-opacity`} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">
            {title}
          </span>
          <span className="text-3xl font-bold text-white font-['Sora'] tracking-tight mt-1">
            {value}
          </span>
        </div>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 border border-white/10 shadow-[0_1.5px_0_0_rgba(255,255,255,0.06)]"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-1.5">
          <span className="text-xs font-semibold text-violet-300">{trend}</span>
        </div>
      )}
    </div>
  );
}
