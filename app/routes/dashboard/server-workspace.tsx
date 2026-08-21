import { useParams, Link } from "react-router";
import { mockServers } from "~/data/dashboard-mock";
import { PageHeader } from "~/components/dashboard/PageHeader";

export default function ServerWorkspace() {
  const params = useParams();
  const serverId = params.serverId;
  const view = params.view || params.tab || "overview";

  const server = mockServers.find((s) => s.id === serverId) || {
    id: serverId || "srv-1",
    name: "Discord Server",
    icon: "🛡️",
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

  const viewTitles: Record<string, { title: string; desc: string; icon: string }> = {
    overview: {
      title: "Server Overview",
      desc: "Connected channels, bot connection status, and call usage statistics.",
      icon: "📊",
    },
    "bot-config": {
      title: "Bot Configuration",
      desc: "Command prefixes, automated webhook dispatch, and channel routing policies.",
      icon: "🤖",
    },
    channels: {
      title: "Channel Management",
      desc: "Assign specific Discord text channels to Hub bridges and Call lobbies.",
      icon: "#",
    },
    logs: {
      title: "Server Audit Logs",
      desc: "Recent message relays, call invitations, and moderation action logs.",
      icon: "📝",
    },
    settings: {
      title: "Server Settings",
      desc: "NSFW filter toggles, match pings, server visibility, and bot permissions.",
      icon: "⚙️",
    },
  };

  const currentView = viewTitles[view] || {
    title: `${view[0].toUpperCase()}${view.slice(1)}`,
    desc: `Manage ${view} for ${server.name}.`,
    icon: "🛡️",
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
        className="p-8 md:p-12 rounded-3xl border flex flex-col items-center justify-center text-center gap-4"
        style={{
          background: "rgba(21, 20, 36, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.09)",
          boxShadow: "0 12px 34px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 border border-white/10 shadow-lg"
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
  );
}
