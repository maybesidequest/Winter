import {
  FireOutlined,
  MessageOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface ActivityMetricsGridProps {
  messages: number;
  messageRank: number;
  currentStreak: number;
  longestStreak: number;
}

export function ActivityMetricsGrid({
  messages,
  messageRank,
  currentStreak,
  longestStreak,
}: ActivityMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Messages */}
      <div
        className="rounded-2xl p-5 border flex flex-col justify-between"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            Messages Relayed
          </span>
          <MessageOutlined className="text-violet-300 text-base" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-extrabold text-white font-['Sora'] m-0">
            {messages.toLocaleString()}
          </p>
          <p className="text-xs text-white/65 mt-1 m-0">
            {messageRank > 0
              ? `Ranked #${messageRank} across InterChat`
              : "No rank available for this period"}
          </p>
        </div>
      </div>

      {/* Current Streak */}
      <div
        className="rounded-2xl p-5 border flex flex-col justify-between"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            Current Streak
          </span>
          <FireOutlined className="text-amber-400 text-base" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-['Sora']">
              {currentStreak}
            </span>
            <span className="text-xs font-semibold text-white/60">days active</span>
          </div>
          <p className="text-xs text-white/65 mt-1 m-0">Consecutive days chatting</p>
        </div>
      </div>

      {/* Best Streak */}
      <div
        className="rounded-2xl p-5 border flex flex-col justify-between"
        style={dashboardGlassCardStyle}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            Best Streak
          </span>
          <TrophyOutlined className="text-sky-300 text-base" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-['Sora']">
              {longestStreak}
            </span>
            <span className="text-xs font-semibold text-white/60">days</span>
          </div>
          <p className="text-xs text-white/65 mt-1 m-0">Longest streak recorded</p>
        </div>
      </div>
    </div>
  );
}

