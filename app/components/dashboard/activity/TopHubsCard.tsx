import { ClusterOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface TopHub {
  hubId: string;
  hubName: string | null;
  messageCount: number;
  sharePercent: number;
}

interface TopHubsCardProps {
  topHubs: TopHub[];
}

export function TopHubsCard({ topHubs }: TopHubsCardProps) {
  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-5"
      style={dashboardGlassCardStyle}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-white font-['Sora'] m-0">
            Your Top Hubs
          </h3>
          <p className="text-xs text-white/65 m-0 mt-0.5">
            Where your Discord channels were most active during this period.
          </p>
        </div>
        <span className="text-xs text-white/60 font-semibold">
          {topHubs.length} {topHubs.length === 1 ? "hub active" : "hubs active"}
        </span>
      </div>

      {topHubs.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center gap-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <ClusterOutlined className="text-2xl text-white/40" />
          <p className="text-xs text-white/65 m-0">
            No Hub activity recorded for this period.
          </p>
          <Link
            to="/dashboard/browse"
            className="dashboard-btn-secondary !min-h-[32px] !px-3 !py-1 !text-xs !font-bold mt-2"
          >
            Explore Hubs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {topHubs.map((hub) => (
            <div
              key={hub.hubId}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 font-['Sora'] flex-shrink-0">
                    {(hub.hubName || "HB").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white truncate font-['Sora']">
                    {hub.hubName || "Unnamed Hub"}
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-white">
                    {hub.messageCount.toLocaleString()}{" "}
                    <span className="font-normal text-white/60">messages</span>
                  </span>
                  <span className="text-xs text-violet-300 font-semibold block">
                    {hub.sharePercent}% of your chat
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#8175ee] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, hub.sharePercent))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

