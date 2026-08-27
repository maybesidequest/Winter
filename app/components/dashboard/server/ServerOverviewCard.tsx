import {
  ApartmentOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerResource } from "~/resources/server";

interface ServerOverviewCardProps {
  server: ServerResource;
  botClientId?: string;
  bridgesCount?: number;
  blocksCount?: number;
}

export function ServerOverviewCard({
  server,
  botClientId = "798748015435055134",
  bridgesCount,
  blocksCount,
}: ServerOverviewCardProps) {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Bot Installation Card */}
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${server.status.botInstalled
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
              }`}>
              {server.status.botInstalled ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-white">Bot Integration Status</h2>
                {server.status.botInstalled ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    Action Required
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/70">
                {server.status.botInstalled
                  ? "InterChat bot is installed and synchronized with the Control Plane."
                  : "InterChat needs to be invited to this Discord server before cross-server Hubs and Calls can function."}
              </p>
            </div>
          </div>
          {!server.status.botInstalled && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="dashboard-btn-primary px-5 py-2.5 text-xs flex-shrink-0 flex items-center gap-2 shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
            >
              <PlusOutlined />
              <span>Add Bot to Discord</span>
            </a>
          )}
        </div>
      </section>

      {/* Configuration Summary Card */}
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Configuration Overview</h2>
            <p className="text-xs text-white/60 mt-0.5">Authoritative settings synced from Control Plane</p>
          </div>
          <Link
            to={`/dashboard/servers/${server.metadata.id}/settings`}
            className="dashboard-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <SettingOutlined />
            <span>Edit Settings</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] transition-all">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">Command Prefix</div>
            <div className="text-xl font-bold text-violet-300 mt-1 font-mono">{server.spec.prefix || "!"}</div>
            <div className="text-xs text-white/50 mt-1">Bot prompt prefix in chat</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] transition-all">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">Match Alerts</div>
            <div className="text-xl font-bold text-white mt-1">
              {server.spec.pingOnMatch ? (
                <span className="text-sky-300">Ping Enabled</span>
              ) : (
                <span className="text-white/60">Silent</span>
              )}
            </div>
            <div className="text-xs text-white/50 mt-1">Calls notification mode</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] transition-all">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">NSFW Filter</div>
            <div className="text-xl font-bold mt-1">
              {server.spec.filterNsfw ? (
                <span className="text-emerald-400">Active</span>
              ) : (
                <span className="text-rose-400">Disabled</span>
              )}
            </div>
            <div className="text-xs text-white/50 mt-1">Call media protection</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] transition-all">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">Auto-Requeue</div>
            <div className="text-xl font-bold text-white mt-1">
              {server.spec.autoRequeueOnSkip ? (
                <span className="text-emerald-400">Enabled</span>
              ) : (
                <span className="text-white/60">Disabled</span>
              )}
            </div>
            <div className="text-xs text-white/50 mt-1">On skip or disconnect</div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <Link
            to={`/dashboard/servers/${server.metadata.id}/bridges`}
            className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.05] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_3px_0_0_rgba(129,117,238,0.35)] transition-all group hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(129,117,238,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-300 text-lg group-hover:scale-105 transition-transform">
                <ApartmentOutlined />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Hub Bridges</div>
                <div className="text-xs text-white/60">Connected channels</div>
              </div>
            </div>
            {typeof bridgesCount === "number" && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-200">
                {bridgesCount}
              </span>
            )}
          </Link>

          <Link
            to={`/dashboard/servers/${server.metadata.id}/calls`}
            className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] hover:border-amber-500/40 bg-white/[0.02] hover:bg-white/[0.05] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_3px_0_0_rgba(245,158,11,0.35)] transition-all group hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(245,158,11,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-300 text-lg group-hover:scale-105 transition-transform">
                <ThunderboltOutlined />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Calls & Userphone</div>
                <div className="text-xs text-white/60">Channels & matching</div>
              </div>
            </div>
            {server.spec.lobbyChannelIds.length > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200">
                {server.spec.lobbyChannelIds.length} ch
              </span>
            )}
          </Link>

          <Link
            to={`/dashboard/servers/${server.metadata.id}/safety`}
            className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] hover:border-rose-500/40 bg-white/[0.02] hover:bg-white/[0.05] shadow-[0_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_3px_0_0_rgba(244,63,94,0.35)] transition-all group hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(244,63,94,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center text-rose-300 text-lg group-hover:scale-105 transition-transform">
                <SafetyCertificateOutlined />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Server Blocklist</div>
                <div className="text-xs text-white/60">Blocked entities</div>
              </div>
            </div>
            {typeof blocksCount === "number" && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200">
                {blocksCount}
              </span>
            )}
          </Link>
        </div>
      </section>
    </div>
  );
}
