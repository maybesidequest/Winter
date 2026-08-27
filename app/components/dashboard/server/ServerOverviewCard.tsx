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
}

export function ServerOverviewCard({ server, botClientId = "798748015435055134" }: ServerOverviewCardProps) {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&guild_id=${server.metadata.id}&disable_guild_select=true`;

  return (
    <div className="flex flex-col gap-6 w-full">
      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-2xl">
            {server.status.botInstalled ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Bot installation</h2>
            <p className="mt-1 text-sm text-white/65">
              {server.status.botInstalled
                ? "InterChat is installed in this server."
                : "InterChat needs to be installed before this server can use Hub features."}
            </p>
          </div>
          {!server.status.botInstalled && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="dashboard-btn-primary px-5 py-3 text-sm flex-shrink-0"
            >
              <PlusOutlined />
              <span>Add to Discord</span>
            </a>
          )}
        </div>
      </section>

      <section style={{ ...dashboardGlassCardStyle, padding: 24, borderRadius: 16 }}>
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Configuration Overview</h2>
            <p className="text-xs text-white/50 mt-0.5">Authoritative settings synced from Control Plane</p>
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
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="text-xs text-white/45 font-medium uppercase tracking-wider">Command Prefix</div>
            <div className="text-lg font-bold text-violet-300 mt-1 font-mono">{server.spec.prefix || "!"}</div>
            <div className="text-xs text-white/40 mt-0.5">Bot prompt prefix</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="text-xs text-white/45 font-medium uppercase tracking-wider">Match Alerts</div>
            <div className="text-lg font-bold text-white mt-1">
              {server.spec.pingOnMatch ? "Ping Enabled" : "Silent"}
            </div>
            <div className="text-xs text-white/40 mt-0.5">Calls notification mode</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="text-xs text-white/45 font-medium uppercase tracking-wider">NSFW Filter</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {server.spec.filterNsfw ? "Active" : "Disabled"}
            </div>
            <div className="text-xs text-white/40 mt-0.5">Call media protection</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="text-xs text-white/45 font-medium uppercase tracking-wider">Auto-Requeue</div>
            <div className="text-lg font-bold text-white mt-1">
              {server.spec.autoRequeueOnSkip ? "Enabled" : "Disabled"}
            </div>
            <div className="text-xs text-white/40 mt-0.5">On skip / disconnect</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <Link
            to={`/dashboard/servers/${server.metadata.id}/bridges`}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-300 text-lg group-hover:scale-105 transition-transform">
              <ApartmentOutlined />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Hub Bridges</div>
              <div className="text-xs text-white/45">Manage connected channels</div>
            </div>
          </Link>

          <Link
            to={`/dashboard/servers/${server.metadata.id}/calls`}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-300 text-lg group-hover:scale-105 transition-transform">
              <ThunderboltOutlined />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Calls & Userphone</div>
              <div className="text-xs text-white/45">Configure channels & matching</div>
            </div>
          </Link>

          <Link
            to={`/dashboard/servers/${server.metadata.id}/safety`}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 flex items-center justify-center text-rose-300 text-lg group-hover:scale-105 transition-transform">
              <SafetyCertificateOutlined />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Server Blocklist</div>
              <div className="text-xs text-white/45">Manage blocked users & servers</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
