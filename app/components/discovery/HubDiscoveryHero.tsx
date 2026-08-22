import {
  FireFilled,
  SafetyCertificateFilled,
  CrownFilled,
  StarFilled,
  LinkOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { HubPublicResource } from "~/resources/hubDiscovery";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface HubDiscoveryHeroProps {
  featuredHubs: HubPublicResource[];
  onConnect: (hub: HubPublicResource) => void;
  onInspect: (hub: HubPublicResource) => void;
}

export function HubDiscoveryHero({
  featuredHubs,
  onConnect,
  onInspect,
}: HubDiscoveryHeroProps) {
  if (featuredHubs.length === 0) return null;

  const primary = featuredHubs[0];
  const { metadata, spec, status, tags } = primary;

  return (
    <div
      className="relative rounded-3xl border overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl"
      style={{
        ...dashboardGlassCardStyle,
        background: "linear-gradient(135deg, rgba(35, 20, 65, 0.45) 0%, rgba(15, 12, 28, 0.6) 100%)",
        borderColor: "rgba(139, 92, 246, 0.25)",
      }}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Left: Info */}
      <div className="flex items-start sm:items-center gap-5 z-10 flex-1 min-w-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-violet-950/80 border-2 border-violet-400/30 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 font-['Sora'] shadow-xl">
          {spec.iconUrl ? (
            <img src={spec.iconUrl} alt={metadata.name} className="w-full h-full object-cover" />
          ) : (
            <span>{metadata.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Eyebrow / Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-400/30">
              <FireFilled className="text-violet-400 text-xs" />
              <span>Featured Spotlight</span>
            </span>
            {status.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-sky-400 font-semibold">
                <SafetyCertificateFilled /> Verified
              </span>
            )}
            {status.partnered && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <CrownFilled /> Partner
              </span>
            )}
          </div>

          {/* Hub Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Sora'] truncate">
            {metadata.name}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/70 line-clamp-2 max-w-2xl leading-relaxed">
            {spec.shortDescription || spec.description || "Persistent cross-server bridge."}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              {tags.slice(0, 4).map((t) => (
                <span
                  key={t.id || t.name}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.06] text-white/70 border border-white/[0.06]"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & Stats */}
      <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 z-10 flex-shrink-0 w-full sm:w-auto">
        <div className="flex items-center gap-4 text-xs text-white/60 bg-white/[0.03] px-3.5 py-2 rounded-xl border border-white/[0.06]">
          <div>
            <strong className="text-white text-sm font-semibold">{status.connectionCount}</strong>
            <span className="ml-1 text-white/40">connected servers</span>
          </div>
          <span className="text-white/20">·</span>
          <div>
            <strong className="text-white text-sm font-semibold">{status.weeklyMessageCount}</strong>
            <span className="ml-1 text-white/40">msgs/wk</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onInspect(primary)}
            className="dashboard-btn-secondary px-4 py-2 text-xs font-bold flex-1 sm:flex-initial justify-center"
          >
            <span>Learn More</span>
          </button>
          <button
            type="button"
            onClick={() => onConnect(primary)}
            className="dashboard-btn-primary px-5 py-2 text-xs font-bold flex items-center justify-center gap-2 flex-1 sm:flex-initial"
          >
            <LinkOutlined />
            <span>Connect Server</span>
          </button>
        </div>
      </div>
    </div>
  );
}

