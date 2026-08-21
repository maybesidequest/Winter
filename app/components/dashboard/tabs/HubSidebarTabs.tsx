import { useState } from "react";
import { NavLink } from "react-router";
import {
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  ClusterOutlined,
  ApartmentOutlined,
  FileProtectOutlined,
  LineChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";

interface HubSidebarTabsProps {
  hubId: string;
  hub?: HubResource;
  onNavigate?: () => void;
}

export function HubSidebarTabs({ hubId, hub, onNavigate }: HubSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const hubItems = [
    { path: "overview", label: "Overview", icon: <ClusterOutlined /> },
    { path: "analytics", label: "Analytics", icon: <LineChartOutlined /> },
    { path: "members", label: "Members & Staff", icon: <ApartmentOutlined /> },
    { path: "rules", label: "Rules & Policies", icon: <FileProtectOutlined /> },
    { path: "settings", label: "Hub Settings", icon: <SettingOutlined /> },
  ];

  return (
    <div className="flex flex-col gap-3 py-1">
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
        <span>Dashboard Home</span>
      </NavLink>

      {/* Hub Identity Header */}
      {hub && (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-violet-900/40 border border-violet-400/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-['Sora']">
            {hub.spec.iconUrl ? (
              <img src={hub.spec.iconUrl} alt={hub.metadata.name} className="w-full h-full object-cover" />
            ) : (
              <span>{hub.metadata.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-white truncate block font-['Sora']">
              {hub.metadata.name}
            </span>
            <span className="text-[10px] text-white/50 block">
              {hub.metadata.effectiveRole || "Hub"}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase text-[#9f95f4] hover:text-[#b8b0f8] transition-colors cursor-pointer"
        >
          <span>Hub Controls</span>
          <span className="text-[10px]">{collapsed ? <DownOutlined /> : <UpOutlined />}</span>
        </button>


        {!collapsed && (
          <nav className="flex flex-col gap-1 mt-0.5">
            {hubItems.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/hubs/${hubId}/${item.path}`}
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
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

