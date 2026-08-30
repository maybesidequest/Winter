import {
  BarChartOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  CompassOutlined,
  DownOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  UpOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router";
import type { HubResource } from "~/resources/hub";
import type { ServerResource } from "~/resources/server";

interface GeneralSidebarTabsProps {
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

export function GeneralSidebarTabs({
  servers = [],
  hubs = [],
  isLoading = false,
  onNavigate,
  capabilities,
}: GeneralSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    community: false,
    servers: false,
  });

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  return (
    <div className="flex flex-col gap-3.5 py-1">
      <NavLink
        to="/dashboard"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
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

      {enabled("USER_ACTIVITY") && <NavLink
        to="/dashboard/activity"
        onClick={onNavigate}
        className={({ isActive }) => `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
          ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"}`}
      >
        <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5"><BarChartOutlined /></span>
        <span>Your activity</span>
      </NavLink>}

      {enabled("USER_HELP") && <NavLink
        to="/dashboard/help"
        onClick={onNavigate}
        className={({ isActive }) => `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
          ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"}`}
      >
        <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5"><QuestionCircleOutlined /></span>
        <span>Help & resources</span>
      </NavLink>}

      {enabled("MODERATION") && <NavLink
        to="/dashboard/appeals"
        onClick={onNavigate}
        className={({ isActive }) => `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
          ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"}`}
      >
        <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5"><SafetyCertificateOutlined /></span>
        <span>Appeals</span>
      </NavLink>}

      {/* Community & Hubs */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("community")}
          className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-purple-300/40 hover:text-purple-300/70 transition-colors cursor-pointer"
        >
          <span>Community & Hubs</span>
          <span className="text-[10px]">{collapsed.community ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed.community && (
          <nav className="flex flex-col gap-1">
            {enabled("HUB_DISCOVERY") && <NavLink
              to="/dashboard/browse"
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
                  ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <CompassOutlined />
              </span>
              <span>Explore Directory</span>
            </NavLink>}

            {enabled("HUB_LIST") && <NavLink
              to="/dashboard/hubs"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
                  ? "active bg-[#211f35] text-white font-bold border border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              <span className="text-[17px] text-[#827d9c] group-hover:text-white group-[.active]:text-white transition-colors duration-150 flex items-center justify-center w-5">
                <ClusterOutlined />
              </span>
              <span>All Hubs</span>
            </NavLink>}

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
              enabled("HUB_LIST") ? hubs.slice(0, 3).map((h) => (
                <NavLink
                  key={h.metadata.id}
                  to={`/dashboard/hubs/${h.metadata.id}/overview`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
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
              )) : null
            )}
          </nav>
        )}
      </div>

      {/* Discord Servers */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => toggle("servers")}
          className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-purple-300/40 hover:text-purple-300/70 transition-colors cursor-pointer"
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
                `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
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
                    `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
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

    </div>
  );
}
