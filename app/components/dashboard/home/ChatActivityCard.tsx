import {
  ArrowRightOutlined,
  FireOutlined,
  MessageOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";

interface ChatActivityCardProps {
  capabilities?: Record<string, boolean>;
}

export function ChatActivityCard({ capabilities = {} }: ChatActivityCardProps) {
  const isEnabled = Boolean(capabilities.USER_ACTIVITY || import.meta.env.DEV);
  const now = new Date();

  const { data: activity, isLoading } = useQuery({
    ...orpc.user.getActivity.queryOptions({
      input: {
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1,
        limit: 3,
      },
    }),
    enabled: isEnabled,
  });

  if (!isEnabled) return null;

  return (
    <div
      className="rounded-2xl p-6 border flex flex-col gap-6"
      style={dashboardGlassCardStyle}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-lg text-violet-300">
            <MessageOutlined />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Sora'] m-0">
              Chat Activity
            </h3>
            <p className="text-xs text-white/65 m-0 mt-0.5">
              Messages and participation across your connected Discord channels.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/activity"
          className="dashboard-btn-secondary !min-h-[34px] !px-3.5 !py-1.5 !text-xs !font-bold flex items-center gap-1.5"
        >
          <span>Full activity</span>
          <ArrowRightOutlined className="text-xs" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-pulse">
          <div className="h-20 bg-white/[0.04] rounded-xl" />
          <div className="h-20 bg-white/[0.04] rounded-xl" />
          <div className="h-20 bg-white/[0.04] rounded-xl hidden sm:block" />
        </div>
      ) : activity ? (
        <div className="flex flex-col gap-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs font-semibold text-white/65 block">
                Messages Relayed
              </span>
              <span className="text-2xl font-bold text-white font-['Sora'] mt-1 block">
                {activity.lifetimeMessages.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs font-semibold text-white/65 flex items-center gap-1">
                <FireOutlined className="text-amber-400" /> Current Streak
              </span>
              <span className="text-2xl font-bold text-white font-['Sora'] mt-1 block">
                {activity.currentStreak}{" "}
                <span className="text-xs font-normal text-white/60">days</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-white/65 flex items-center gap-1">
                <TrophyOutlined className="text-violet-300" /> Rank
              </span>
              <span className="text-2xl font-bold text-white font-['Sora'] mt-1 block">
                {activity.messageRank > 0 ? `#${activity.messageRank}` : "Unranked"}
              </span>
            </div>
          </div>

          {/* Top Hubs Breakdown (if any) */}
          {activity.topHubs && activity.topHubs.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06]">
              <span className="text-xs font-bold uppercase tracking-wider text-white/65 block mb-3">
                Top Active Hubs
              </span>
              <div className="flex flex-col gap-2.5">
                {activity.topHubs.map((hub) => (
                  <div key={hub.hubId} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/80 truncate">
                        {hub.hubName || "Community Hub"}
                      </span>
                      <span className="text-white/60 font-medium">
                        {hub.messageCount.toLocaleString()} messages ({hub.sharePercent}%)
                      </span>
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
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-white/50 m-0">No chat activity recorded yet for this month.</p>
        </div>
      )}
    </div>
  );
}
