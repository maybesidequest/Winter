import {
  ApartmentOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import type { ServerResource } from "~/resources/server";

export interface ServerMobileTabsProps {
  server: ServerResource;
  currentView: string;
  capabilities: Record<string, boolean>;
  blocksCount?: number;
}

export function ServerMobileTabs({
  server,
  currentView,
  capabilities,
  blocksCount,
}: ServerMobileTabsProps) {
  const tabs = [
    { key: "overview", label: "Overview", icon: <CloudServerOutlined /> },
    {
      key: "bridges",
      label: "Hubs",
      icon: <ApartmentOutlined />,
      count: server.status.connectionCount,
      capabilities: ["CONNECTIONS"],
    },
    {
      key: "calls",
      label: "Calls",
      icon: <ThunderboltOutlined />,
      count: server.spec.lobbyChannelIds.length > 0 ? server.spec.lobbyChannelIds.length : undefined,
      capabilities: ["SERVER_CONFIG", "CONNECTIONS"],
    },
    {
      key: "safety",
      label: "Blocklist",
      icon: <SafetyCertificateOutlined />,
      count: currentView === "safety" ? blocksCount : undefined,
      capabilities: ["SERVER_BLOCKLIST"],
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      capabilities: ["SERVER_CONFIG"],
    },
  ];

  const visibleTabs = tabs.filter(
    (tab) => !tab.capabilities || tab.capabilities.every((capability) => capabilities[capability] === true),
  );

  return (
    <nav
      aria-label="Server Workspace Views"
      className="flex items-center gap-2 p-2 rounded-2xl border border-white/[0.08] bg-[#13141f] shadow-[0_2px_0_0_rgba(10,8,23,0.75)] overflow-x-auto md:hidden scrollbar-none"
    >
      {visibleTabs.map((tab) => {
        const isActive = currentView === tab.key;
        return (
          <Link
            key={tab.key}
            to={`/dashboard/servers/${server.metadata.id}/${tab.key === "overview" ? "" : tab.key}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
              ? "bg-violet-600/25 text-violet-200 border border-violet-500/40 shadow-[0_1.5px_0_0_#5b4ccb] font-bold"
              : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] shadow-[0_1.5px_0_0_rgba(255,255,255,0.06)]"
              }`}
          >
            <span className={isActive ? "text-violet-300" : "text-white/60"}>{tab.icon}</span>
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-full ${isActive
                  ? "bg-violet-500/30 text-violet-200 border border-violet-400/30"
                  : "bg-white/10 text-white/70"
                  }`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

