import {
  ApartmentOutlined,
  ApiOutlined,
  AppstoreOutlined,
  BellOutlined,
  ClusterOutlined,
  DownOutlined,
  FileTextOutlined,
  HistoryOutlined,
  IdcardOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UpOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router";
import type { HubResource } from "~/resources/hub";

interface HubSidebarTabsProps {
  hubId: string;
  hub?: HubResource;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

export function HubSidebarTabs({ hubId, hub, onNavigate, capabilities }: HubSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const permissions = hub?.metadata.permissions;
  const can = (...actions: string[]) => {
    if (!permissions) return true;
    if (Array.isArray(permissions)) {
      const permMap = Object.fromEntries(
        (permissions as any[])
          .filter((p) => p && typeof p === "object" && "key" in p)
          .map((p) => [p.key, Boolean(p.value)])
      );
      return actions.some((action) => permMap[action]);
    }
    return actions.some((action) => (permissions as any)[action]);
  };
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  const hubItems = [
    { path: "overview", label: "Overview", icon: <ClusterOutlined /> },
    { path: "connections", label: "Connections", icon: <ApiOutlined />, visible: false },
    {
      path: "moderation",
      label: "Moderation",
      icon: <SafetyCertificateOutlined />,
      visible: false,
    },
    { path: "rules", label: "Rules", icon: <FileTextOutlined />, visible: enabled("HUB_RULES") && (hub?.metadata.effectiveRole === "OWNER" || can("MANAGE_RULES")) },
    {
      path: "modules",
      label: "Modules",
      icon: <AppstoreOutlined />,
      visible: enabled("HUB_CONFIG") && can("MANAGE_HUB_SETTINGS"),
    },
    {
      path: "logging",
      label: "Logging",
      icon: <FileTextOutlined />,
      visible: enabled("HUB_LOGGING") && can("MANAGE_LOGS", "MANAGE_HUB_SETTINGS"),
    },
    {
      path: "badges",
      label: "Badges",
      icon: <IdcardOutlined />,
      visible: enabled("HUB_BADGES") && can("MANAGE_HUB_SETTINGS"),
    },
    {
      path: "invites",
      label: "Invites",
      icon: <LinkOutlined />,
      visible: enabled("HUB_INVITES") && can("MANAGE_INVITES"),
    },
    {
      path: "team",
      label: "Team",
      icon: <ApartmentOutlined />,
      visible: enabled("HUB_TEAM") && can("MANAGE_MODERATORS"),
    },
    {
      path: "announcements",
      label: "Announcements",
      icon: <BellOutlined />,
      visible: enabled("HUB_ANNOUNCEMENTS") && can("ANNOUNCE"),
    },
    { path: "audit", label: "Audit history", icon: <HistoryOutlined />, visible: enabled("HUB_AUDIT") && can("VIEW_LOGS") },
    {
      path: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      visible: can("MANAGE_HUB_SETTINGS") || hub?.metadata.effectiveRole === "OWNER",
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
