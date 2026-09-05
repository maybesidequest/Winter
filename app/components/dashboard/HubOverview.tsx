import {
  ApiOutlined,
  BookOutlined,
  CheckCircleFilled,
  ClusterOutlined,
  ExclamationCircleFilled,
  GlobalOutlined,
  LinkOutlined,
  MessageOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { HubConnectionResource } from "~/resources/connection";
import type { HubResource } from "~/resources/hub";
import { MetricCard } from "./MetricCard";

interface HubOverviewProps {
  hub: HubResource;
  connections?: HubConnectionResource[];
  canEdit?: boolean;
}

export function HubOverview({ hub, connections = [], canEdit = false }: HubOverviewProps) {
  const activeCount = useMemo(() => connections.filter((c) => c.spec.connected).length, [connections]);
  const totalConnections = hub.status.connectionCount ?? connections.length;
  const recentConnections = useMemo(() => connections.slice(0, 4), [connections]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full">
      {/* Top Operational Metrics with Standard Drop Shadow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Bridges"
          value={`${activeCount} / ${totalConnections}`}
          icon={<ClusterOutlined className="text-violet-300 text-lg" />}
          iconBg="rgba(129, 117, 238, 0.18)"
        />
        <MetricCard
          title="Weekly Messages"
          value={hub.status.weeklyMessageCount.toLocaleString()}
          icon={<MessageOutlined className="text-sky-300 text-lg" />}
          iconBg="rgba(143, 211, 255, 0.18)"
          contourClass="dashboard-card-contours--sky"
        />
        <MetricCard
          title="Network Posture"
          value={hub.spec.visibility.charAt(0) + hub.spec.visibility.slice(1).toLowerCase()}
          icon={<GlobalOutlined className="text-emerald-300 text-lg" />}
          iconBg="rgba(126, 212, 147, 0.18)"
          contourClass="dashboard-card-contours--sage"
        />
      </div>

      {/* Hub Hero Summary Card */}
      <div className="rounded-2xl border overflow-hidden relative flex flex-col justify-end" style={dashboardGlassCardStyle}>
        <div
          className="w-full h-32 relative overflow-hidden bg-violet-950/40"
          style={{
            backgroundImage: hub.spec.bannerUrl ? `url(${hub.spec.bannerUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!hub.spec.bannerUrl && <div className="dashboard-card-contours pointer-events-none opacity-20" aria-hidden="true" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#13141f] via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 relative flex flex-wrap items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4 min-w-0">
            <div className="w-20 h-20 rounded-2xl bg-violet-950/90 border-2 border-white/20 overflow-hidden flex items-center justify-center text-xl font-bold text-violet-200 shadow-xl flex-shrink-0">
              {hub.spec.iconUrl ? (
                <img src={hub.spec.iconUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col gap-1 pb-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white font-['Sora'] m-0 truncate">{hub.metadata.name}</h2>
                {hub.status.partnered && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">Partner</span>}
                {hub.status.verified && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Verified</span>}
                {hub.spec.nsfw && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">18+</span>}
              </div>
              <span className="text-xs text-white/60 truncate">{hub.spec.shortDescription || "No tagline configured."}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pb-1">
            <Link to={`/dashboard/hubs/${hub.metadata.id}/invites`} className="dashboard-btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5">
              <LinkOutlined />
              <span>Invites</span>
            </Link>
            {canEdit && (
              <Link to={`/dashboard/hubs/${hub.metadata.id}/branding`} className="dashboard-btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5">
                <PictureOutlined />
                <span>Edit Branding</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Connected Bridge Nodes & Routing Health */}
      <div className="rounded-2xl p-6 border flex flex-col gap-4" style={dashboardGlassCardStyle}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <ApiOutlined className="text-sky-400 text-base" />
            <h3 className="text-base font-bold text-white font-['Sora'] m-0">Connected Bridge Nodes</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 font-semibold">{connections.length} total</span>
          </div>
          <Link to={`/dashboard/hubs/${hub.metadata.id}/connections`} className="text-xs font-bold text-sky-300 hover:text-sky-200 transition-colors">
            Manage All Bridges &rarr;
          </Link>
        </div>

        {recentConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentConnections.map((conn) => {
              const isHealthy = conn.status.healthy;
              return (
                <div key={conn.metadata.id} className="p-4 rounded-xl border border-white/[0.08] bg-[#181726] shadow-[0_2px_0_0_rgba(10,8,23,0.3)] transition-all hover:border-violet-500/30 hover:bg-[#1d1b2e] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${conn.spec.connected ? "bg-sky-500/15 text-sky-300 border border-sky-500/30" : "bg-white/[0.06] text-white/40 border border-white/[0.08]"}`}>
                      <ClusterOutlined />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">{conn.status.serverName || "Discord Server"}</span>
                      <span className="text-xs text-white/50 truncate">#{conn.status.channelName || conn.spec.channelId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {conn.spec.connected ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircleFilled className="text-xs drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                        <span className="w-2 h-2 rounded-full bg-white/30" />
                        <span>Paused</span>
                      </span>
                    )}
                    {!isHealthy && conn.spec.connected && (
                      <span title={conn.status.statusMessage || "Route Degraded"} className="text-amber-400 text-xs">
                        <ExclamationCircleFilled />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 px-4 text-center flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/[0.08] bg-[#181726]">
            <ApiOutlined className="text-2xl text-white/30" />
            <div className="flex flex-col gap-1 max-w-sm">
              <span className="text-sm font-bold text-white">No server bridges connected</span>
              <span className="text-xs text-white/60">Connect your Discord server channels to activate cross-server chat relays.</span>
            </div>
            <Link to={`/dashboard/hubs/${hub.metadata.id}/connections`} className="dashboard-btn-primary px-4 py-2 text-xs font-bold mt-1">
              Connect First Server
            </Link>
          </div>
        )}
      </div>

      {/* Operations Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to={`/dashboard/hubs/${hub.metadata.id}/connections`} className="p-5 rounded-xl border border-white/[0.08] bg-[#181726] shadow-[0_2px_0_0_rgba(10,8,23,0.3)] hover:border-sky-500/40 hover:bg-[#1d1b2e] transition-all flex flex-col gap-3 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 text-base">
              <ApiOutlined />
            </div>
            <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-white">Bridges & Routes</span>
            <span className="text-xs text-white/60">Manage connected channels and live relay routing.</span>
          </div>
        </Link>
        <Link to={`/dashboard/hubs/${hub.metadata.id}/rules`} className="p-5 rounded-xl border border-white/[0.08] bg-[#181726] shadow-[0_2px_0_0_rgba(10,8,23,0.3)] hover:border-emerald-500/40 hover:bg-[#1d1b2e] transition-all flex flex-col gap-3 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-base">
              <BookOutlined />
            </div>
            <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-white">Rules & Guidelines</span>
            <span className="text-xs text-white/60">Configure community rules shown to member participants.</span>
          </div>
        </Link>
        <Link to={`/dashboard/hubs/${hub.metadata.id}/moderation`} className="p-5 rounded-xl border border-white/[0.08] bg-[#181726] shadow-[0_2px_0_0_rgba(10,8,23,0.3)] hover:border-purple-500/40 hover:bg-[#1d1b2e] transition-all flex flex-col gap-3 group">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 text-base">
              <SafetyCertificateOutlined />
            </div>
            <span className="text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-white">Safety & Moderation</span>
            <span className="text-xs text-white/60">Review automated policies, active desk, and sanctions.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
