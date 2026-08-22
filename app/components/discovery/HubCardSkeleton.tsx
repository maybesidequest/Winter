import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export function HubCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border overflow-hidden flex flex-col p-5 animate-pulse"
          style={dashboardGlassCardStyle}
        >
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.08]" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-32 h-4 rounded bg-white/[0.08]" />
              <div className="w-20 h-3 rounded bg-white/[0.04]" />
            </div>
          </div>
          <div className="w-full h-10 rounded bg-white/[0.04] mb-4" />
          <div className="flex items-center gap-2 mb-4">
            <div className="w-14 h-5 rounded-full bg-white/[0.06]" />
            <div className="w-16 h-5 rounded-full bg-white/[0.06]" />
          </div>
          <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="w-16 h-4 rounded bg-white/[0.06]" />
            <div className="w-20 h-7 rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

