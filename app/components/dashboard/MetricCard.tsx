import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: ReactNode;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  icon,
  iconBg = "rgba(91, 76, 203, 0.15)",
}: MetricCardProps) {
  return (
    <div
      className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:translate-y-[-2px] select-none"
      style={{
        background: "rgba(21, 20, 36, 0.85)",
        border: "2px solid rgba(255, 255, 255, 0.09)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">
            {title}
          </span>
          <span className="text-3xl font-bold text-white font-['Sora'] tracking-tight mt-1">
            {value}
          </span>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border border-white/10"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-1.5">
          <span className="text-xs font-semibold text-violet-400/90">{trend}</span>
        </div>
      )}
    </div>
  );
}
