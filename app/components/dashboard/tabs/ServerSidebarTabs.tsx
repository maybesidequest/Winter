import {
  ApartmentOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";
import { SidebarNavGroup, type SidebarItemDef } from "./SidebarNavGroup";

interface ServerSidebarTabsProps {
  serverId: string;
  server?: ServerResource;
  onNavigate?: () => void;
  capabilities?: Record<string, boolean>;
}

interface NavGroup {
  id: string;
  title: string;
  colorClass: string;
  items: SidebarItemDef[];
}

export function ServerSidebarTabs({ serverId, server, onNavigate, capabilities }: ServerSidebarTabsProps) {
  const enabled = (capability: string) => capabilities?.[capability] ?? import.meta.env.DEV;

  const groups: NavGroup[] = [
    {
      id: "routing",
      title: "Routing & Bridges",
      colorClass: "text-sky-300/70",
      items: [
        {
          path: "overview",
          label: "Overview",
          icon: <CloudServerOutlined />,
        },
        {
          path: "bridges",
          label: "Hub Bridges",
          icon: <ApartmentOutlined />,
          visible: enabled("CONNECTIONS"),
          badge: server?.status?.connectionCount !== undefined ? server.status.connectionCount : undefined,
        },
      ],
    },
    {
      id: "communications",
      title: "Calls & Safety",
      colorClass: "text-emerald-300/70",
      items: [
        {
          path: "calls",
          label: "Userphone Calls",
          icon: <ThunderboltOutlined />,
          visible: enabled("SERVER_CONFIG"),
          badge: server?.status?.activeCall ? "LIVE" : undefined,
        },
        {
          path: "safety",
          label: "Blocklist",
          icon: <SafetyCertificateOutlined />,
          visible: enabled("SERVER_BLOCKLIST"),
        },
      ],
    },
    {
      id: "admin",
      title: "Administration",
      colorClass: "text-amber-300/65",
      items: [
        {
          path: "settings",
          label: "Settings",
          icon: <SettingOutlined />,
          visible: enabled("SERVER_CONFIG"),
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
          basePath={`/dashboard/servers/${serverId}`}
          items={group.items}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
