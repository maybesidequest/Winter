import { NavLink } from "react-router";
import { mockHubs, mockServers } from "~/data/dashboard-mock";

export type SidebarContext =
  | { type: "dashboard" }
  | { type: "hub"; id: string }
  | { type: "server"; id: string }
  | { type: "calls" }
  | { type: "browse" };

interface SidebarTabsProps {
  context: SidebarContext;
  onNavigate?: () => void;
}

export function SidebarTabs({ context, onNavigate }: SidebarTabsProps) {
  if (context.type === "dashboard") {
    return (
      <div className="flex flex-col gap-4 py-2">
        <div className="px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400/90">
            Workspace
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Dashboard</h2>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Dashboard navigation">
          <NavLink
            to="/dashboard"
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="text-sm">📊</span>
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/dashboard/browse"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="text-sm">🌐</span>
            <span>Browse Hubs</span>
          </NavLink>

          <NavLink
            to="/dashboard/calls"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="text-sm">⚡</span>
            <span>Global Calls</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  if (context.type === "calls") {
    return (
      <div className="flex flex-col gap-4 py-2">
        <div className="px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
            Realtime Text
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Global Calls</h2>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Calls navigation">
          <NavLink
            to="/dashboard/calls"
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="text-sm">⚡</span>
            <span>Active Lobbies</span>
          </NavLink>

          <NavLink
            to="/dashboard/calls/history"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="text-sm">📜</span>
            <span>Call History</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  if (context.type === "browse") {
    return (
      <div className="flex flex-col gap-4 py-2">
        <div className="px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400/90">
            Discovery
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Browse Hubs</h2>
        </div>

        <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed">
          Explore public InterChat communities and connect your server to shared hubs worldwide.
        </div>
      </div>
    );
  }

  if (context.type === "hub") {
    const hub = mockHubs.find((h) => h.id === context.id) || mockHubs[0];
    const hubTabs = [
      { path: "overview", label: "Overview", icon: "📊" },
      { path: "analytics", label: "Analytics", icon: "📈" },
      { path: "members", label: "Members", icon: "👥" },
      { path: "rules", label: "Rules", icon: "📜" },
      { path: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
      <div className="flex flex-col gap-4 py-2">
        {/* Hub Header */}
        <div className="px-2 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
            style={{ backgroundColor: hub.color }}
          >
            {hub.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate">{hub.name}</h2>
            <p className="text-[11px] text-white/50 truncate">
              {hub.serverCount} servers · {hub.memberCount.toLocaleString()} members
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Hub navigation">
          {hubTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/dashboard/hubs/${hub.id}/${tab.path}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                  ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  if (context.type === "server") {
    const server = mockServers.find((s) => s.id === context.id) || mockServers[0];
    const serverTabs = [
      { path: "overview", label: "Overview", icon: "📊" },
      { path: "bot-config", label: "Bot Config", icon: "🤖" },
      { path: "channels", label: "Channels", icon: "#" },
      { path: "logs", label: "Logs", icon: "📝" },
      { path: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
      <div className="flex flex-col gap-4 py-2">
        {/* Server Header */}
        <div className="px-2 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
            style={{ backgroundColor: server.color }}
          >
            {server.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate">{server.name}</h2>
            <p className="text-[11px] text-white/50 truncate">
              {server.channels} channels · {server.memberCount.toLocaleString()} members
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Server navigation">
          {serverTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/dashboard/servers/${server.id}/${tab.path}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                  ? "bg-[#5b4ccb] text-white shadow-md shadow-[#5b4ccb]/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  return null;
}
