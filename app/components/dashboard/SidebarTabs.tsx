import { useState } from "react";
import { NavLink } from "react-router";
import {
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  ClusterOutlined,
  CompassOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
  CloudServerOutlined,
  RobotOutlined,
  NumberOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
  // Collapsible section state like Creem
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    community: false,
    servers: false,
    calls: false,
    insights: false,
    system: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // If a specific Hub is selected
  if (context.type === "hub") {
    const hub = mockHubs.find((h) => h.id === context.id) || mockHubs[0];
    const hubItems = [
      { path: "overview", label: "Overview", icon: <ClusterOutlined /> },
      { path: "analytics", label: "Analytics", icon: <LineChartOutlined /> },
      { path: "members", label: "Members & Staff", icon: <ApartmentOutlined /> },
      { path: "rules", label: "Rules & Policies", icon: <FileProtectOutlined /> },
      { path: "settings", label: "Hub Settings", icon: <SettingOutlined /> },
    ];

    return (
      <div className="flex flex-col gap-4 py-1">
        {/* Top Home Quick link */}
        <NavLink
          to="/dashboard"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
              isActive
                ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`
          }
        >
          <HomeOutlined className="text-base" />
          <span>Dashboard Home</span>
        </NavLink>

        {/* Hub Category */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => toggleSection("hub_controls")}
            className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8175ee] hover:text-[#9f95f4] transition-colors cursor-pointer"
          >
            <span>Hub Controls</span>
            <span className="text-[9px]">
              {collapsedSections.hub_controls ? <DownOutlined /> : <UpOutlined />}
            </span>
          </button>

          {!collapsedSections.hub_controls && (
            <nav className="flex flex-col gap-1 mt-0.5">
              {hubItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/dashboard/hubs/${hub.id}/${item.path}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <span className="text-base text-white/80 flex items-center justify-center w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    );
  }

  // If a specific Server is selected
  if (context.type === "server") {
    const server = mockServers.find((s) => s.id === context.id) || mockServers[0];
    const serverItems = [
      { path: "overview", label: "Overview", icon: <CloudServerOutlined /> },
      { path: "bot-config", label: "Bot Configuration", icon: <RobotOutlined /> },
      { path: "channels", label: "Channels", icon: <NumberOutlined /> },
      { path: "logs", label: "Audit Logs", icon: <FileTextOutlined /> },
      { path: "settings", label: "Server Settings", icon: <SettingOutlined /> },
    ];

    return (
      <div className="flex flex-col gap-4 py-1">
        <NavLink
          to="/dashboard"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
              isActive
                ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`
          }
        >
          <HomeOutlined className="text-base" />
          <span>Dashboard Home</span>
        </NavLink>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => toggleSection("server_controls")}
            className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8fd3ff] hover:text-[#bae6fd] transition-colors cursor-pointer"
          >
            <span>Server Controls</span>
            <span className="text-[9px]">
              {collapsedSections.server_controls ? <DownOutlined /> : <UpOutlined />}
            </span>
          </button>

          {!collapsedSections.server_controls && (
            <nav className="flex flex-col gap-1 mt-0.5">
              {serverItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/dashboard/servers/${server.id}/${item.path}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <span className="text-base text-white/80 flex items-center justify-center w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    );
  }

  // Global / General Dashboard view (Creem style with colorful collapsible sections)
  return (
    <div className="flex flex-col gap-3.5 py-1">
      {/* 1. Home Item */}
      <NavLink
        to="/dashboard"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
            isActive
              ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
              : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
          }`
        }
      >
        <HomeOutlined className="text-base" />
        <span>Home</span>
      </NavLink>

      {/* 2. COMMUNITY & HUBS (Purple heading) */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleSection("community")}
          className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8175ee] hover:text-[#9f95f4] transition-colors cursor-pointer"
        >
          <span>Community & Hubs</span>
          <span className="text-[9px]">
            {collapsedSections.community ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.community && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/hubs/hub-1/overview"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <ClusterOutlined />
              </span>
              <span>Hubs Overview</span>
            </NavLink>

            <NavLink
              to="/dashboard/browse"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <CompassOutlined />
              </span>
              <span>Explore Directory</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* 3. DISCORD SERVERS (Sky blue heading) */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleSection("servers")}
          className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8fd3ff] hover:text-[#bae6fd] transition-colors cursor-pointer"
        >
          <span>Discord Servers</span>
          <span className="text-[9px]">
            {collapsedSections.servers ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.servers && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/servers/srv-1/overview"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <CloudServerOutlined />
              </span>
              <span>Connected Servers</span>
            </NavLink>

            <NavLink
              to="/dashboard/servers/srv-1/bot-config"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <RobotOutlined />
              </span>
              <span>Bot Configuration</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* 4. REALTIME CALLS (Coral heading) */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleSection("calls")}
          className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#ff8c73] hover:text-[#ffb3a3] transition-colors cursor-pointer"
        >
          <span>Realtime Calls</span>
          <span className="text-[9px]">
            {collapsedSections.calls ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.calls && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/calls"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <ThunderboltOutlined />
              </span>
              <span>Active Lobbies</span>
            </NavLink>

            <NavLink
              to="/dashboard/calls/history"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <HistoryOutlined />
              </span>
              <span>Call History</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* 5. INSIGHTS & SAFETY (Green/Sage heading) */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleSection("insights")}
          className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-[#7ed493] hover:text-[#a3e8b3] transition-colors cursor-pointer"
        >
          <span>Insights & Safety</span>
          <span className="text-[9px]">
            {collapsedSections.insights ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.insights && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/hubs/hub-1/analytics"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <LineChartOutlined />
              </span>
              <span>Network Analytics</span>
            </NavLink>

            <NavLink
              to="/dashboard/hubs/hub-1/rules"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 min-h-[38px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.1] shadow-[0_2px_0_0_rgba(10,8,23,0.7)]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-base text-white/80 flex items-center justify-center w-5">
                <SafetyCertificateOutlined />
              </span>
              <span>Safety & Moderation</span>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
}
