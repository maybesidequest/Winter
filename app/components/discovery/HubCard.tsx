import {
  SafetyCertificateFilled,
  StarFilled,
  CrownFilled,
  LinkOutlined,
  CommentOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import type { HubPublicResource } from "~/resources/hubDiscovery";
import { HubVoteButton } from "./HubVoteButton";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface HubCardProps {
  hub: HubPublicResource;
  onConnect: (hub: HubPublicResource) => void;
  onInspect: (hub: HubPublicResource) => void;
}

export function HubCard({ hub, onConnect, onInspect }: HubCardProps) {
  const { metadata, spec, status, tags } = hub;

  return (
    <div
      onClick={() => onInspect(hub)}
      className="group relative rounded-2xl border overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      style={dashboardGlassCardStyle}
    >
      {/* Banner Background */}
      {spec.bannerUrl ? (
        <div className="relative h-20 w-full overflow-hidden flex-shrink-0 bg-violet-950/40">
          <img
            src={spec.bannerUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100e19] via-[#100e19]/60 to-transparent" />
        </div>
      ) : (
        <div className="h-10 w-full bg-gradient-to-r from-violet-900/20 via-purple-900/10 to-transparent flex-shrink-0" />
      )}

      <div className="p-5 flex flex-col flex-1 gap-3.5">
        {/* Header: Icon + Name + Badges */}
        <div className="flex items-start gap-3.5 -mt-6">
          {/* Avatar Icon */}
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#161424] border-2 border-white/10 flex items-center justify-center text-sm font-bold text-violet-300 flex-shrink-0 font-['Sora'] shadow-lg group-hover:border-violet-500/40 transition-colors">
            {spec.iconUrl ? (
              <img
                src={spec.iconUrl}
                alt={metadata.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{metadata.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* Title & Badges */}
          <div className="flex-1 min-w-0 pt-5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white truncate font-['Sora'] group-hover:text-violet-300 transition-colors">
                {metadata.name}
              </h3>
              {status.verified && (
                <SafetyCertificateFilled className="text-sky-400 text-xs flex-shrink-0" title="Verified Hub" />
              )}
              {status.partnered && (
                <CrownFilled className="text-amber-400 text-xs flex-shrink-0" title="Partnered Hub" />
              )}
              {status.featured && (
                <StarFilled className="text-violet-400 text-xs flex-shrink-0" title="Featured Hub" />
              )}
              {spec.nsfw && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-500/20 border border-red-500/30 text-red-300 rounded">
                  18+
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 mt-0.5">
              <div className="flex items-center text-amber-400">
                <StarFilled className="text-[10px]" />
                <span className="ml-1 font-semibold text-white/90">
                  {status.averageRating ? status.averageRating.toFixed(1) : "New"}
                </span>
              </div>
              <span>·</span>
              <span>{status.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed flex-1">
          {spec.shortDescription || spec.description || "No description provided."}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t.id || t.name}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-white/60 border border-white/[0.04]"
              >
                #{t.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] text-white/40 bg-white/[0.02]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Statistics Bar */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ClusterOutlined className="text-violet-400 text-xs" />
              <strong className="text-white/90 font-medium">{status.connectionCount}</strong>
              <span className="text-[10px] text-white/40">routes</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CommentOutlined className="text-emerald-400 text-xs" />
              <strong className="text-white/90 font-medium">{status.weeklyMessageCount}</strong>
              <span className="text-[10px] text-white/40">/wk</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <HubVoteButton
              hubId={metadata.id}
              initialVoteCount={status.upvoteCount}
              hasVoted={status.hasVotedToday}
            />

            <button
              type="button"
              onClick={() => onConnect(hub)}
              className="dashboard-btn-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <LinkOutlined className="text-[11px]" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

