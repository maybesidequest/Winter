import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import type { HubResource } from "~/resources/hub";

interface HubListItemProps {
  hub: HubResource;
}

export function HubListItem({ hub }: HubListItemProps) {
  const isLocked = Boolean(hub.spec.locked);
  const initials = hub.metadata.name.slice(0, 2).toUpperCase();

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 hover:bg-[#181726]/60 group">
      {/* Identity */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0 font-['Sora'] shadow-sm">
          {hub.spec.iconUrl ? (
            <img
              src={hub.spec.iconUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white truncate font-['Sora'] flex items-center gap-2">
            <span>{hub.metadata.name}</span>
            {hub.status.verified && (
              <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Verified
              </span>
            )}
            {hub.status.partnered && (
              <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Partner
              </span>
            )}
          </div>
          <div className="text-xs text-white/50 truncate max-w-md mt-0.5">
            {hub.spec.shortDescription || hub.spec.description || "No description provided."}
          </div>
        </div>
      </div>

      {/* Meta Details */}
      <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs">
        <div className="text-white/60 hidden md:block">
          <span className="font-semibold text-white/90">{hub.status.connectionCount}</span> routes
          <span className="mx-1.5 text-white/20">·</span>
          <span className="font-semibold text-white/90">
            {hub.status.weeklyMessageCount.toLocaleString()}
          </span> messages this week
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isLocked
                ? "bg-red-500/15 text-red-300 border-red-500/30"
                : "bg-violet-500/15 text-violet-300 border-violet-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLocked ? "bg-red-400" : "bg-violet-400"
              }`}
            />
            {isLocked ? "Locked" : hub.spec.visibility}
          </span>
        </div>

        {/* Action Button */}
        <Link
          to={`/dashboard/hubs/${hub.metadata.id}/overview`}
          className="dashboard-btn-secondary px-4 py-1.5 text-xs font-bold"
        >
          <span>Manage</span>
          <ArrowRightOutlined className="text-xs" />
        </Link>
      </div>
    </div>
  );
}

