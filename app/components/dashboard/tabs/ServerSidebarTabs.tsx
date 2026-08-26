import {
  ApartmentOutlined,
  CloudServerOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router";
import type { ServerResource } from "~/resources/server";

interface ServerSidebarTabsProps {
  serverId: string;
  server?: ServerResource;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

export function ServerSidebarTabs({ serverId, server, onNavigate, capabilities }: ServerSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  const serverItems = [
    {
      path: "overview",
      label: "Overview",
      icon: <CloudServerOutlined />,
    },
    {
      path: "bridges",
      label: "Hubs",
      icon: <ApartmentOutlined />,
      visible: enabled("CONNECTIONS"),
    },
    {
      path: "calls",
      label: "Calls",
      icon: <ThunderboltOutlined />,
      visible: false,
    },
    {
      path: "safety",
      label: "Blocklist",
      icon: <SafetyCertificateOutlined />,
      visible: enabled("SERVER_CONFIG"),
    },
    {
      path: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      visible: enabled("SERVER_CONFIG"),
    },
  ].filter((item) => item.visible !== false);

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-purple-300/40 hover:text-purple-300/70 transition-colors cursor-pointer"
        >
          <span>Server Controls</span>
          <span className="text-[10px]">{collapsed ? <DownOutlined /> : <UpOutlined />}</span>
        </button>

        {!collapsed && (
          <nav className="flex flex-col gap-1 mt-0.5">
            {serverItems.map((item) => (
              <NavLink
                key={item.path}
                to={`/dashboard/servers/${serverId}/${item.path}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150 ${isActive
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
