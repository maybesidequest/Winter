import {
  CloudServerOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  MessageOutlined,
  PhoneOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import type { ServerResource } from "~/resources/server";

interface ServerOverviewCardProps {
  server: ServerResource;
  botClientId?: string;
}

export function ServerOverviewCard({ server, botClientId = "904791550993072230" }: ServerOverviewCardProps) {
  const isInstalled = server.status.botInstalled;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=534723950656&scope=bot%20applications.commands&guild_id=${server.metadata.id}&disable_guild_select=true`;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Bot Status Banner */}
      {!isInstalled ? (
        <div
          className="relative overflow-hidden p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(91, 76, 203, 0.25) 0%, rgba(20, 20, 30, 0.6) 100%)",
            borderColor: "rgba(129, 117, 238, 0.35)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 4px 20px 0 rgba(91, 76, 203, 0.2)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 text-2xl flex-shrink-0">
              <ExclamationCircleOutlined />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-white font-['Sora']">
                InterChat is not in this server yet
              </h3>
              <p className="text-sm text-white/70 max-w-xl">
                Add the bot to <span className="font-semibold text-white">{server.metadata.name}</span> to enable cross-server Hub bridges, Userphone calls, and automod protection.
              </p>
            </div>
          </div>

          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="dashboard-btn-primary px-5 py-3 text-sm flex-shrink-0"
          >
            <PlusOutlined />
            <span>Add to Discord</span>
          </a>
        </div>
      ) : (
        <div
          className="p-5 rounded-2xl border flex items-center justify-between gap-4"
          style={{
            ...dashboardGlassCardStyle,
            borderColor: "rgba(52, 211, 153, 0.25)",
            background: "rgba(16, 185, 129, 0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
              <CheckCircleOutlined />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>InterChat is active in this server</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <span className="text-xs text-white/60">
                Server ID: <code className="text-white/80 font-mono">{server.metadata.id}</code>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Messages */}
        <div
          className="p-5 rounded-2xl border flex flex-col gap-2"
          style={{ ...dashboardGlassCardStyle, padding: 20 }}
        >
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Messages Relayed</span>
            <MessageOutlined className="text-base text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white font-['Sora']">
            {server.status.messageCount.toLocaleString()}
          </div>
          <span className="text-xs text-white/50">Total cross-server broadcast messages</span>
        </div>

        {/* Calls */}
        <div
          className="p-5 rounded-2xl border flex flex-col gap-2"
          style={{ ...dashboardGlassCardStyle, padding: 20 }}
        >
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Userphone Calls</span>
            <PhoneOutlined className="text-base text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-['Sora']">
            {server.status.callCount.toLocaleString()}
          </div>
          <span className="text-xs text-white/50">Matched 1:1 and group text calls</span>
        </div>

        {/* Quick Links */}
        <div
          className="p-5 rounded-2xl border flex flex-col justify-between gap-3 sm:col-span-2 lg:col-span-1"
          style={{ ...dashboardGlassCardStyle, padding: 20 }}
        >
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortcuts</span>
            <ApartmentOutlined className="text-base text-amber-400" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/dashboard/servers/${server.metadata.id}/calls`}
              className="dashboard-btn-secondary flex-1 py-2 px-3 text-xs font-semibold text-center"
            >
              Call Settings
            </Link>
            <Link
              to={`/dashboard/servers/${server.metadata.id}/bridges`}
              className="dashboard-btn-secondary flex-1 py-2 px-3 text-xs font-semibold text-center"
            >
              Hub Bridges
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
