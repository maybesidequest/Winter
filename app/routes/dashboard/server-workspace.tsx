import type { ReactNode } from "react";
import { useParams, Link } from "react-router";
import {
  CloudServerOutlined,
  RobotOutlined,
  NumberOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { mockServers } from "~/data/dashboard-mock";
import { PageHeader } from "~/components/dashboard/PageHeader";

export default function ServerWorkspace() {
  const params = useParams();
  const serverId = params.serverId;
  const view = params.view || params.tab || "overview";

  const server = mockServers.find((s) => s.id === serverId) || {
    id: serverId || "srv-1",
    name: "Discord Server",
    initials: "DS",
    iconType: "guild" as const,
    color: "#2a7198",
    memberCount: 1200,
    health: "healthy" as const,
    latency: "22ms",
    channels: 4,
    botInstalled: true,
    callCount: 25,
    region: "US-East",
    uptime: "99.9%",
  };

  const viewTitles: Record<string, { title: string; desc: string; icon: ReactNode }> = {
    overview: {
      title: "Server Overview",
      desc: "Connected channels, bot connection status, and call usage statistics.",
      icon: <CloudServerOutlined />,
    },
    "bot-config": {
      title: "Bot Configuration",
      desc: "Command prefixes, automated webhook dispatch, and channel routing policies.",
      icon: <RobotOutlined />,
    },
    channels: {
      title: "Channel Management",
      desc: "Assign specific Discord text channels to Hub bridges and Call lobbies.",
      icon: <NumberOutlined />,
    },
    logs: {
      title: "Server Audit Logs",
      desc: "Recent message relays, call invitations, and moderation action logs.",
      icon: <FileTextOutlined />,
    },
    settings: {
      title: "Server Settings",
      desc: "NSFW filter toggles, match pings, server visibility, and bot permissions.",
      icon: <SettingOutlined />,
    },
  };

  const currentView = viewTitles[view] || {
    title: `${view[0].toUpperCase()}${view.slice(1)}`,
    desc: `Manage ${view} for ${server.name}.`,
    icon: <CloudServerOutlined />,
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Server Controls"
        title={`${server.name} · ${currentView.title}`}
        description={`Manage InterChat bridge settings and text call routes for ${server.name}.`}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Dashboard
            </Link>
          </div>
        }
      />

      <div
        className="relative overflow-hidden p-8 md:p-12 rounded-3xl border flex flex-col items-center justify-center text-center gap-4"
        style={{
          background: "rgba(21, 20, 36, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.09)",
          boxShadow: "0 4px 0 0 rgba(0, 0, 0, 0.45)",
        }}
      >
        <div className="dashboard-card-contours--sky pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1 border border-white/10 text-white"
            style={{ backgroundColor: server.color }}
          >
            {currentView.icon}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2a7198]/20 text-sky-300 border border-[#2a7198]/40">
              {server.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/60">
              {server.channels} Active Channels · {server.latency} Latency
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-['Sora']">{currentView.title}</h3>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            {currentView.desc}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
            Tab view configured according to Discord <code className="text-sky-400">/server manage</code> specifications.
          </div>
        </div>
      </div>
    </div>
  );
}
