import {
  ApiOutlined,
  BellOutlined,
  BookOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  HistoryOutlined,
  LinkOutlined,
  MessageOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { HubResource } from "~/resources/hub";
import type { PermissionAction } from "~/permissions/config";
import { SidebarNavGroup, type SidebarItemDef } from "./SidebarNavGroup";

interface HubSidebarTabsProps {
  hubId: string;
  hub?: HubResource;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

interface NavGroup {
  id: string;
  title: string;
  colorClass: string;
  items: SidebarItemDef[];
}

export function HubSidebarTabs({ hubId, hub, onNavigate, capabilities }: HubSidebarTabsProps) {
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
      colorClass: "text-sky-300/70",
      items: [
        { path: "overview", label: "Overview", icon: <ClusterOutlined /> },
        {
          path: "connections",
          label: "Connections",
          icon: <ApiOutlined />,
          visible: enabled("CONNECTIONS") && (hub?.metadata.effectiveRole === "OWNER" || can("MANAGE_CONNECTIONS")),
          badge: hub?.status?.connectionCount !== undefined ? hub.status.connectionCount : undefined,
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
      colorClass: "text-emerald-300/70",
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
          icon: <BookOutlined />,
          visible: enabled("HUB_RULES") && (hub?.metadata.effectiveRole === "OWNER" || can("MANAGE_RULES")),
          badge: hub?.spec?.rules?.length ? hub.spec.rules.length : undefined,
        },
      ],
    },
    {
      id: "chat",
      title: "Chat & Relay",
      colorClass: "text-purple-300/70",
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
      colorClass: "text-amber-300/65",
      items: [
        {
          path: "team",
          label: "Team",
          icon: <TeamOutlined />,
          visible: enabled("HUB_TEAM") && can("MANAGE_MODERATORS"),
        },
        {
          path: "logging",
          label: "Log Channels",
          icon: <CloudUploadOutlined />,
          visible: enabled("HUB_LOGGING") && can("MANAGE_LOGS", "MANAGE_HUB_SETTINGS"),
        },
        {
          path: "audit",
          label: "Audit Log",
          icon: <HistoryOutlined />,
          visible: enabled("HUB_AUDIT") && can("VIEW_LOGS"),
        },
        {
          path: "branding",
          label: "Branding",
          icon: <PictureOutlined />,
          visible: enabled("HUB_CONFIG") && can("MANAGE_HUB_SETTINGS"),
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
    <div className="flex flex-col gap-2 py-1">
      {groups.map((group) => (
        <SidebarNavGroup
          key={group.id}
          id={group.id}
          title={group.title}
          colorClass={group.colorClass}
          basePath={`/dashboard/hubs/${hubId}`}
          items={group.items}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
