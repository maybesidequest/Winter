import { FireOutlined, SafetyCertificateOutlined, TrophyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { getBadgeInfo } from "~/resources/badge";
import type { UserResource } from "~/resources/user";

interface AccountSectionProps {
  userResource?: UserResource;
  isLoading?: boolean;
}

export function AccountSection({ userResource, isLoading }: AccountSectionProps) {
  if (isLoading || !userResource) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-24 rounded-2xl bg-white/5 border border-white/10" />
        <div className="h-16 rounded-2xl bg-white/5 border border-white/10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const { metadata, status } = userResource;
  const joinedDate = new Date(metadata.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const userBadges = (status.badges || [])
    .map((b) => getBadgeInfo(b))
    .filter((b): b is NonNullable<typeof b> => b !== null);

  return (
    <div className="relative z-10 flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] tracking-tight">
          My Account
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-0.5">
          Manage your personal account profile, badges, and activity record.
        </p>
      </div>

      {/* User Identity Card */}
      <div
        className="relative overflow-hidden p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border"
        style={{
          background: "#13141f",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 3px 0 0 rgba(10, 8, 23, 0.75)",
        }}
      >
        <div className="dashboard-card-contours pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#5b4ccb] border-2 border-white/20 flex-shrink-0 flex items-center justify-center text-xl font-bold text-white font-['Sora']">
            {metadata.image ? (
              <img src={metadata.image} alt={metadata.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <span>{(metadata.name || "U").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-white font-['Sora'] truncate">
                {metadata.name || "InterChat User"}
              </span>
              {userBadges.map((badge) => (
                <Tooltip
                  key={badge.id}
                  title={
                    <div className="text-center py-0.5">
                      <div className="font-bold text-xs">{badge.name}</div>
                      <div className="text-[11px] text-white/75">{badge.description}</div>
                    </div>
                  }
                >
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 hover:border-violet-400/40 hover:bg-white/[0.12] transition-all cursor-pointer p-0.5 shadow-sm">
                    <img
                      src={badge.icon}
                      alt={badge.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
            {metadata.email && <span className="text-xs text-white/60 truncate">{metadata.email}</span>}
            <span className="text-[11px] text-white/40">Member since {joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Connected Discord ID */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between gap-3"
        style={{
          background: "rgba(11, 12, 20, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.6)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-sm font-bold text-[#8175ee] flex-shrink-0">
            <SafetyCertificateOutlined className="text-base" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white">Discord Identity</h4>
            <p className="text-[11px] text-white/50 truncate font-mono">ID: {metadata.id}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#7ed493]/15 text-[#7ed493] border border-[#7ed493]/30 flex-shrink-0">
          Connected
        </span>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Reputation", value: status.reputation, icon: <TrophyOutlined className="text-amber-400" /> },
          { label: "Hubs Owned", value: status.hubsCount, icon: "🏠" },
          { label: "Calls Completed", value: status.callCount, icon: "📞" },
          { label: "Messages Sent", value: status.messageCount, icon: "💬" },
          { label: "Active Streak", value: `${status.currentStreak}d`, icon: <FireOutlined className="text-orange-400" /> },
          { label: "Streak Freezes", value: `${status.streakFreezes}/2`, icon: "❄️" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden p-3 sm:p-3.5 rounded-2xl border flex flex-col justify-between"
            style={{
              background: "#13141f",
              borderColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.5)",
            }}
          >
            <div className="flex items-center justify-between text-xs text-white/50 font-medium">
              <span>{stat.label}</span>
              <span className="text-sm">{stat.icon}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white mt-1 font-['Sora']">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
