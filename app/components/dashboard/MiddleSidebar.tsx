import { useLocation, useParams, useNavigate, Link } from "react-router";
import {
  DownOutlined,
  ClusterOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { ServerResource } from "~/resources/server";
import type { HubResource } from "~/resources/hub";
import type { User } from "~/services/auth.server";
import { SidebarToggle } from "./SidebarToggle";
import { SidebarTabs, type SidebarContext } from "./SidebarTabs";
import { UserBar } from "./UserBar";

interface MiddleSidebarProps {
  instanceType: "servers" | "hubs";
  servers?: ServerResource[];
  hubs?: HubResource[];
  isLoading?: boolean;
  user?: User;
  onToggleInstanceType: (type: "servers" | "hubs") => void;
  onOpenSettings: () => void;
  onNavigate?: () => void;
}

export function MiddleSidebar({
  instanceType,
  servers = [],
  hubs = [],
  isLoading = false,
  user,
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
    const hub = hubs.find((h) => h.metadata.id === params.hubId);
    context = { type: "hub", id: params.hubId, hub };
    if (hub) {
      currentTitle = hub.metadata.name;
      currentIcon = hub.spec.iconUrl ? (
        <img
          src={hub.spec.iconUrl}
          alt={hub.metadata.name}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span className="text-xs font-bold text-violet-400 font-['Sora']">
          {hub.metadata.name.slice(0, 2).toUpperCase()}
        </span>
      );
    } else {
      currentTitle = "Hub Workspace";
    }
  } else if (location.pathname.startsWith("/dashboard/servers") && params.serverId) {
    const server = servers.find((s) => s.metadata.id === params.serverId);
    context = { type: "server", id: params.serverId, server };
    if (server) {
      currentTitle = server.metadata.name;
      currentIcon = server.metadata.iconUrl ? (
        <img
          src={server.metadata.iconUrl}
          alt={server.metadata.name}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span className="text-xs font-bold text-sky-400 font-['Sora']">
          {server.metadata.name.slice(0, 2).toUpperCase()}
        </span>
      );
    } else {
      currentTitle = "Server Workspace";
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
      className="w-[288px] h-screen fixed top-0 left-[72px] z-30 flex flex-col justify-between p-3.5 select-none"
      style={{
        background: "#151424",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      aria-label="Middle Navigation Sidebar"
    >
      {/* Top Section */}
      <div className="flex flex-col gap-3.5 overflow-y-auto dark-scrollbar flex-1 pr-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 pt-1.5 pb-3 border-b border-white/[0.08]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img
              src="/images/interchat.png"
              alt="InterChat Logo"
              className="w-6 h-6 rounded-md object-contain"
            />
            <span className="font-['Sora'] font-extrabold text-[15.5px] tracking-wide text-white">
              InterChat
            </span>
          </Link>
        </div>

        {/* Workspace Selector Dropdown Pill (Creem style) */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-between p-2.5 px-3 min-h-[44px] rounded-xl border transition-all duration-150 text-left bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 active:translate-y-[1px] cursor-pointer"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 3px 0 0 #090814, 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {currentIcon}
            </div>
            <span className="text-[14px] font-bold text-white truncate font-['Sora']">
              {currentTitle}
            </span>
          </div>
          <DownOutlined className="text-xs text-white/40 flex-shrink-0 ml-1.5" />
        </button>

        {/* Servers vs Hubs Toggle */}
        <SidebarToggle value={instanceType} onChange={onToggleInstanceType} />

        {/* Collapsible Tabs */}
        <SidebarTabs
          context={context}
          servers={servers}
          hubs={hubs}
          isLoading={isLoading}
          onNavigate={onNavigate}
        />
      </div>



      {/* Bottom User Bar */}
      <div className="pt-2.5 mt-auto border-t border-white/[0.08] flex-shrink-0">
        <UserBar user={user} onOpenSettings={onOpenSettings} />
      </div>
    </aside>
  );
}
