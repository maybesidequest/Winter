import { useState } from "react";
import { NavLink } from "react-router";
import {
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
    <div className="flex flex-col gap-1 py-1">
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
                  `flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-white/[0.08] text-white font-bold"
                      : "text-white/85 hover:text-white hover:bg-white/[0.06]"
                  }`
                }
              >
                <span className="text-[17px] text-[#827d9c] flex items-center justify-center w-5">
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

