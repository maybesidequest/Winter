import { useState } from "react";
import { NavLink } from "react-router";
import {
  DownOutlined,
  UpOutlined,
  CloudServerOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";

interface ServerSidebarTabsProps {
  serverId: string;
  server?: ServerResource;
  onNavigate?: () => void;
}

export function ServerSidebarTabs({ serverId, server, onNavigate }: ServerSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const serverItems = [
    {
      path: "overview",
      label: "Overview",
      icon: <CloudServerOutlined />,
    },
    {
      path: "bridges",
      label: "Hub Bridges",
      icon: <ApartmentOutlined />,
    },
    {
      path: "calls",
      label: "Calls & Userphone",
      icon: <ThunderboltOutlined />,
    },
    {
      path: "safety",
      label: "Safety & Blocklist",
      icon: <SafetyCertificateOutlined />,
    },
    {
      path: "settings",
      label: "Server Settings",
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer"
        >
          <span>Server Controls</span>
          <span className="text-[10px] opacity-70">{collapsed ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed && (
          <nav className="flex flex-col gap-1 mt-0.5">
            {serverItems.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/servers/${serverId}/${item.path}`}
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
