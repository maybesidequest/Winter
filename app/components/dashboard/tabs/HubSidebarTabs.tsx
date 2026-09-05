import {
  ApartmentOutlined,
  ApiOutlined,
  BellOutlined,
  ClusterOutlined,
  DownOutlined,
  FileTextOutlined,
  HistoryOutlined,
  LinkOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router";
import type { HubResource } from "~/resources/hub";
import type { PermissionAction } from "~/permissions/config";

interface HubSidebarTabsProps {
  hubId: string;
  hub?: HubResource;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  visible?: boolean;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export function HubSidebarTabs({ hubId, hub, onNavigate, capabilities }: HubSidebarTabsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const permissions = hub?.metadata.permissions;
  const can = (...actions: PermissionAction[]) => {
    if (!permissions) return true;
    return actions.some((action) => permissions[action] === true);
  };
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  const groups: NavGroup[] = [
    {
      id: "routing",
      title: "Routing & Network",
      items: [
        { path: "overview", label: "Overview", icon: <ClusterOutlined /> },
        {
          path: "connections",
          label: "Connections",
          icon: <ApiOutlined />,
          visible: enabled("CONNECTIONS") && (hub?.metadata.effectiveRole === "OWNER" || can("MANAGE_CONNECTIONS")),
        },
        {
          path: "invites",
          label: "Invites",
          icon: <LinkOutlined />,
          visible: enabled("HUB_INVITES") && can("MANAGE_INVITES"),
        },
      ],
    },
    {
      id: "safety",
      title: "Safety & Policy",
      items: [
        {
          path: "moderation",
          label: "Moderation",
          icon: <SafetyCertificateOutlined />,
          visible: enabled("MODERATION") && (hub?.metadata.effectiveRole === "OWNER" || can("VIEW_LOGS", "MANAGE_BANS")),
        },
        {
          path: "rules",
          label: "Rules",
          icon: <FileTextOutlined />,
          visible: enabled("HUB_RULES") && (hub?.metadata.effectiveRole === "OWNER" || can("MANAGE_RULES")),
        },
      ],
    },
    {
      id: "chat",
      title: "Chat & Relay",
      items: [
        {
          path: "chat",
          label: "Chat Experience",
          icon: <MessageOutlined />,
          visible: enabled("HUB_CONFIG") && can("MANAGE_HUB_SETTINGS"),
        },
        {
          path: "announcements",
          label: "Announcements",
          icon: <BellOutlined />,
          visible: enabled("HUB_ANNOUNCEMENTS") && can("ANNOUNCE"),
        },
      ],
    },
    {
      id: "admin",
      title: "Administration",
      items: [
        {
          path: "team",
          label: "Team",
          icon: <ApartmentOutlined />,
          visible: enabled("HUB_TEAM") && can("MANAGE_MODERATORS"),
        },
        {
          path: "logging",
          label: "Logging",
          icon: <FileTextOutlined />,
          visible: enabled("HUB_LOGGING") && can("MANAGE_LOGS", "MANAGE_HUB_SETTINGS"),
        },
        {
          path: "audit",
          label: "Audit history",
          icon: <HistoryOutlined />,
          visible: enabled("HUB_AUDIT") && can("VIEW_LOGS"),
        },
        {
          path: "settings",
          label: "Settings",
          icon: <SettingOutlined />,
          visible: can("MANAGE_HUB_SETTINGS") || hub?.metadata.effectiveRole === "OWNER",
        },
      ],
    },
  ];

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
          <div className="flex flex-col gap-3 mt-0.5">
            {groups.map((group) => {
              const visibleItems = group.items.filter((item) => item.visible !== false);
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.id} className="flex flex-col gap-0.5">
                  <span className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-purple-300/40 select-none">
                    {group.title}
                  </span>
                  <nav className="flex flex-col gap-0.5">
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={`/dashboard/hubs/${hubId}/${item.path}`}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
