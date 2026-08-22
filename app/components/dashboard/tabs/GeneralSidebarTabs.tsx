import { useState } from "react";
import { NavLink } from "react-router";
import {
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  ClusterOutlined,
  CompassOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";

interface GeneralSidebarTabsProps {
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  onNavigate?: () => void;
}

export function GeneralSidebarTabs({
  servers = [],
  hubs = [],
  isLoading = false,
  onNavigate,
}: GeneralSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    community: false,
    servers: false,
    calls: false,
  });

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="flex flex-col gap-3.5 py-1">
      <NavLink
        to="/dashboard"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
            isActive
              ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
          }`
        }
      >
        <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
          <HomeOutlined />
        </span>
        <span>Home</span>
      </NavLink>

      {/* Community & Hubs */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("community")}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-[#b794f4] hover:text-[#c4b5fd] transition-colors cursor-pointer"
        >
          <span>Community & Hubs</span>
          <span className="text-[10px] opacity-70">{collapsed.community ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.community && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/browse"
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <CompassOutlined />
              </span>
              <span>Explore Directory</span>
            </NavLink>

            {isLoading ? (
              <div className="flex flex-col gap-1.5 px-3.5 py-1 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg bg-white/[0.02]">
                    <div className="w-5 h-5 rounded-md bg-white/[0.08]" />
                    <div className="h-3 rounded bg-white/[0.08] flex-1 max-w-[120px]" />
                  </div>
                ))}
              </div>
            ) : (
              hubs.slice(0, 3).map((h) => (
                <NavLink
                  key={h.metadata.id}
                  to={`/dashboard/hubs/${h.metadata.id}/overview`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                        : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-violet-950/60 border border-violet-400/20 flex items-center justify-center text-[10px] font-bold text-violet-300 group-hover:text-violet-200 group-hover:border-violet-400/40 transition-colors duration-150 flex-shrink-0">
                    {h.spec.iconUrl ? (
                      <img src={h.spec.iconUrl} alt={h.metadata.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{h.metadata.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="truncate">{h.metadata.name}</span>
                </NavLink>
              ))
            )}
          </nav>
        )}
      </div>

      {/* Discord Servers */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("servers")}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer"
        >
          <span>Discord Servers</span>
          <span className="text-[10px] opacity-70">{collapsed.servers ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.servers && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/servers"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <CloudServerOutlined />
              </span>
              <span>All Servers</span>
            </NavLink>

            {isLoading ? (
              <div className="flex flex-col gap-1.5 px-3.5 py-1 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg bg-white/[0.02]">
                    <div className="w-5 h-5 rounded-md bg-white/[0.08]" />
                    <div className="h-3 rounded bg-white/[0.08] flex-1 max-w-[120px]" />
                  </div>
                ))}
              </div>
            ) : (
              servers.slice(0, 4).map((s) => (
                <NavLink
                  key={s.metadata.id}
                  to={`/dashboard/servers/${s.metadata.id}/overview`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                        : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover:bg-white/20 transition-colors duration-150">
                    {s.metadata.iconUrl ? (
                      <img src={s.metadata.iconUrl} alt={s.metadata.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{s.metadata.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="truncate">{s.metadata.name}</span>
                </NavLink>
              ))
            )}
          </nav>
        )}
      </div>

      {/* Realtime Calls */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("calls")}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-[#fb923c] hover:text-[#fed7aa] transition-colors cursor-pointer"
        >
          <span>Realtime Calls</span>
          <span className="text-[10px] opacity-70">{collapsed.calls ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.calls && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/calls"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <ThunderboltOutlined />
              </span>
              <span>Active Lobbies</span>
            </NavLink>

            <NavLink
              to="/dashboard/calls/history"
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <HistoryOutlined />
              </span>
              <span>Call History</span>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
}

