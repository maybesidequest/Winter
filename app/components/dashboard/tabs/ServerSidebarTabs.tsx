import { useState } from "react";
import { NavLink } from "react-router";
import {
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";

interface ServerSidebarTabsProps {
  serverId: string;
  server?: ServerResource;
  onNavigate?: () => void;
}

export function ServerSidebarTabs({ serverId, onNavigate }: ServerSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const serverItems = [
    { path: "overview", label: "Overview", icon: <CloudServerOutlined /> },
    { path: "calls", label: "Calls & Userphone", icon: <ThunderboltOutlined /> },
    { path: "bridges", label: "Hub Bridges", icon: <ApartmentOutlined /> },
    { path: "blocklist", label: "Blocklist", icon: <SafetyCertificateOutlined /> },
  ];

  return (
    <div className="flex flex-col gap-4 py-1">
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

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase text-[#93c5fd] hover:text-[#bfdbfe] transition-colors cursor-pointer"
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

