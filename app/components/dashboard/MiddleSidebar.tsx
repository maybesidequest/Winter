import { useLocation, useParams } from "react-router";
import { SidebarTabs, type SidebarContext } from "./SidebarTabs";
import { SidebarToggle } from "./SidebarToggle";
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

  let context: SidebarContext = { type: "dashboard" };

  if (location.pathname.startsWith("/dashboard/hubs") && params.hubId) {
    context = { type: "hub", id: params.hubId };
  } else if (location.pathname.startsWith("/dashboard/servers") && params.serverId) {
    context = { type: "server", id: params.serverId };
  } else if (location.pathname.startsWith("/dashboard/calls")) {
    context = { type: "calls" };
  } else if (location.pathname.startsWith("/dashboard/browse")) {
    context = { type: "browse" };
  }

  return (
    <aside
      className="w-[240px] h-screen fixed top-0 left-[72px] z-30 flex flex-col justify-between p-3 select-none"
      style={{
        background: "#151424",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
      aria-label="Middle Navigation Sidebar"
    >
      {/* Top Segmented Control & Tabs */}
      <div className="flex flex-col gap-3 overflow-y-auto dark-scrollbar flex-1 pr-0.5">
        <SidebarToggle value={instanceType} onChange={onToggleInstanceType} />
        <SidebarTabs context={context} onNavigate={onNavigate} />
      </div>

      {/* Bottom User Bar */}
      <div className="pt-2 mt-auto border-t border-white/10 flex-shrink-0">
        <UserBar onOpenSettings={onOpenSettings} />
      </div>
    </aside>
  );
}
