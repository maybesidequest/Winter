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
          `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
            isActive
              ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
              : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
          }`
        }
      >
        <HomeOutlined className="text-[17px] text-white/90" />
        <span>Home</span>
      </NavLink>

      {/* Community & Hubs */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("community")}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase text-[#9f95f4] hover:text-[#b8b0f8] transition-colors cursor-pointer"
        >
          <span>Community & Hubs</span>
          <span className="text-[10px]">{collapsed.community ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.community && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/browse"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                    : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-white/90 flex items-center justify-center w-5">
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
                    `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                        : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                    }`
                  }
                >
                  <span className="text-[17px] text-white/90 flex items-center justify-center w-5">
                    <ClusterOutlined />
                  </span>
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
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase text-[#93c5fd] hover:text-[#bfdbfe] transition-colors cursor-pointer"
        >
          <span>Discord Servers</span>
          <span className="text-[10px]">{collapsed.servers ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.servers && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/servers"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                    : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-white/90 flex items-center justify-center w-5">
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
                    `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                        : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                    }`
                  }
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
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
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase text-[#fdba74] hover:text-[#fed7aa] transition-colors cursor-pointer"
        >
          <span>Realtime Calls</span>
          <span className="text-[10px]">{collapsed.calls ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.calls && (
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/calls"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                    : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-white/90 flex items-center justify-center w-5">
                <ThunderboltOutlined />
              </span>
              <span>Active Lobbies</span>
            </NavLink>

            <NavLink
              to="/dashboard/calls/history"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 min-h-[40px] rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white font-bold border border-white/[0.08]"
                    : "text-white/85 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-white/90 flex items-center justify-center w-5">
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

