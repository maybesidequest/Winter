import { Drawer } from "antd";
import {
  SafetyCertificateFilled,
  CrownFilled,
  StarFilled,
  LinkOutlined,
  CommentOutlined,
  ClusterOutlined,
  FileTextOutlined,
  GlobalOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { HubPublicResource } from "~/resources/hubDiscovery";
import { HubVoteButton } from "./HubVoteButton";

interface HubDetailsDrawerProps {
  hub: HubPublicResource | null;
  open: boolean;
  onClose: () => void;
  onConnect: (hub: HubPublicResource) => void;
}

export function HubDetailsDrawer({
  hub,
  open,
  onClose,
  onConnect,
}: HubDetailsDrawerProps) {
  if (!hub) return null;
  const { metadata, spec, status, tags } = hub;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={null}
      closable={false}
      styles={{
        content: {
          background: "rgba(18, 16, 26, 0.98)",
          backdropFilter: "blur(30px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          color: "white",
          padding: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Banner */}
        <div className="relative h-36 w-full bg-violet-950/60 overflow-hidden flex-shrink-0">
          {spec.bannerUrl ? (
            <img src={spec.bannerUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-violet-900/40 via-purple-900/20 to-black/60" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all shadow-[0_1.5px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_2.5px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_0.5px_0_0_rgba(255,255,255,0.12)] cursor-pointer"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-1 gap-6 -mt-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#161424] border-2 border-white/15 flex items-center justify-center text-lg font-bold text-violet-300 flex-shrink-0 font-['Sora'] shadow-2xl">
              {spec.iconUrl ? (
                <img src={spec.iconUrl} alt={metadata.name} className="w-full h-full object-cover" />
              ) : (
                <span>{metadata.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-6">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold text-white font-['Sora'] truncate">
                  {metadata.name}
                </h2>
                {status.verified && <SafetyCertificateFilled className="text-sky-400 text-sm" />}
                {status.partnered && <CrownFilled className="text-amber-400 text-sm" />}
                {status.featured && <StarFilled className="text-violet-400 text-sm" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                <span>{status.connectionCount} routes</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">★ {status.averageRating ? status.averageRating.toFixed(1) : "New"}</span>
                <span>({status.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Weekly Msgs</span>
              <span className="text-sm font-bold text-white font-['Sora'] mt-0.5">{status.weeklyMessageCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">24h Chatters</span>
              <span className="text-sm font-bold text-emerald-400 font-['Sora'] mt-0.5">{status.activeUsersLast24h || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Activity</span>
              <span className="text-sm font-bold text-violet-300 font-['Sora'] mt-0.5">{status.activityLevel}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t.id || t.name}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-white/70 border border-white/[0.06]"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/50">About this Hub</h4>
            <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
              {spec.description || spec.shortDescription || "No detailed description provided."}
            </p>
          </div>

          {/* Rules */}
          {spec.rules && spec.rules.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/50 flex items-center gap-1.5">
                <FileTextOutlined /> Hub Rules & Guidelines
              </h4>
              <div className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] text-xs text-white/75">
                {spec.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-violet-400 font-bold">{idx + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Actions Footer */}
          <div className="mt-auto pt-6 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <HubVoteButton
              hubId={metadata.id}
              initialVoteCount={status.upvoteCount}
              hasVoted={status.hasVotedToday}
            />

            <button
              type="button"
              onClick={() => {
                onClose();
                onConnect(hub);
              }}
              className="dashboard-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 flex-1 justify-center"
            >
              <LinkOutlined />
              <span>Bridge My Server</span>
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

