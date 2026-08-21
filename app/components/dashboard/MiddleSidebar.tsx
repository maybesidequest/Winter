import { useLocation, useParams, useNavigate } from "react-router";
import {
  DownOutlined,
  ClusterOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { mockHubs, mockServers } from "~/data/dashboard-mock";
import { SidebarToggle } from "./SidebarToggle";
import { SidebarTabs, type SidebarContext } from "./SidebarTabs";
import { UserBar } from "./UserBar";

interface MiddleSidebarProps {
  instanceType: "servers" | "hubs";
  onToggleInstanceType: (type: "servers" | "hubs") => void;
  onOpenSettings: () => void;
  onNavigate?: () => void;
}

export function MiddleSidebar({
  instanceType,
  onToggleInstanceType,
  onOpenSettings,
  onNavigate,
}: MiddleSidebarProps) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  let context: SidebarContext = { type: "dashboard" };
  let currentTitle = "InterChat Workspace";
  let currentIcon = <AppstoreOutlined className="text-sm text-violet-400" />;

  if (location.pathname.startsWith("/dashboard/hubs") && params.hubId) {
    context = { type: "hub", id: params.hubId };
    const hub = mockHubs.find((h) => h.id === params.hubId);
    if (hub) {
      currentTitle = hub.name;
      currentIcon = <ClusterOutlined className="text-sm text-violet-400" />;
    }
  } else if (location.pathname.startsWith("/dashboard/servers") && params.serverId) {
    context = { type: "server", id: params.serverId };
    const server = mockServers.find((s) => s.id === params.serverId);
    if (server) {
      currentTitle = server.name;
      currentIcon = <CloudServerOutlined className="text-sm text-sky-400" />;
    }
  } else if (location.pathname.startsWith("/dashboard/calls")) {
    context = { type: "calls" };
    currentTitle = "Global Calls";
  } else if (location.pathname.startsWith("/dashboard/browse")) {
    context = { type: "browse" };
    currentTitle = "Hub Directory";
  }

  return (
    <aside
      className="w-[272px] h-screen fixed top-0 left-[72px] z-30 flex flex-col justify-between p-3.5 select-none"
      style={{
        background: "#151424",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      aria-label="Middle Navigation Sidebar"
    >
      {/* Top Section */}
      <div className="flex flex-col gap-3.5 overflow-y-auto dark-scrollbar flex-1 pr-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1 pb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="font-['Sora'] font-extrabold text-sm tracking-wider text-white">
              INTERCHAT
            </span>
          </div>
        </div>

        {/* Workspace Selector Dropdown Pill (Creem style) */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-between p-2.5 px-3 rounded-xl border transition-colors duration-150 text-left bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 2px 0 0 rgba(10, 8, 23, 0.6)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {currentIcon}
            </div>
            <span className="text-[13px] font-bold text-white truncate font-['Sora']">
              {currentTitle}
            </span>
          </div>
          <DownOutlined className="text-[10px] text-white/40 flex-shrink-0 ml-1.5" />
        </button>

        {/* Servers vs Hubs Toggle */}
        <SidebarToggle value={instanceType} onChange={onToggleInstanceType} />

        {/* Collapsible Tabs */}
        <SidebarTabs context={context} onNavigate={onNavigate} />
      </div>

      {/* Bottom User Bar */}
      <div className="pt-2.5 mt-auto border-t border-white/[0.08] flex-shrink-0">
        <UserBar onOpenSettings={onOpenSettings} />
      </div>
    </aside>
  );
}
