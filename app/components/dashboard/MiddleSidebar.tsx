import { useLocation, useParams, Link } from "react-router";
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

  let context: SidebarContext = { type: "dashboard" };
  let currentTitle = "InterChat Workspace";

  if (location.pathname.startsWith("/dashboard/hubs") && params.hubId) {
    const hub = hubs.find((h) => h.metadata.id === params.hubId);
    context = { type: "hub", id: params.hubId, hub };
    currentTitle = hub ? hub.metadata.name : "Hub Workspace";
  } else if (location.pathname.startsWith("/dashboard/servers") && params.serverId) {
    const server = servers.find((s) => s.metadata.id === params.serverId);
    context = { type: "server", id: params.serverId, server };
    currentTitle = server ? server.metadata.name : "Server Workspace";
  } else if (location.pathname.startsWith("/dashboard/calls")) {
    context = { type: "calls" };
    currentTitle = "Global Calls";
  } else if (location.pathname.startsWith("/dashboard/browse")) {
    context = { type: "browse" };
    currentTitle = "Hub Directory";
  }

  const isHub = context.type === "hub";
  const isServer = context.type === "server";
  const isEntityScoped = isHub || isServer;
  const bannerUrl =
    context.type === "hub"
      ? context.hub?.spec.bannerUrl
      : context.type === "server"
      ? context.server?.metadata.bannerUrl || context.server?.spec.bannerUrl
      : undefined;
  const isVerified = context.type === "hub" ? (context.hub?.status.verified ?? false) : false;
  const isPartnered = context.type === "hub" ? (context.hub?.status.partnered ?? false) : false;

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
        {/* Global Brand Header - Shown only on non-entity pages */}
        {!isEntityScoped ? (
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
        ) : (
          /* Hub / Server Hero Banner Card (Revolt / Discord style) */
          <div
            className="relative overflow-hidden rounded-xl w-full h-[92px] flex flex-col justify-end p-3 select-none flex-shrink-0"
            style={{
              background: bannerUrl
                ? `url(${bannerUrl}) center/cover no-repeat`
                : isHub
                ? "linear-gradient(135deg, #201e35 0%, #151424 100%)"
                : "linear-gradient(135deg, #182333 0%, #151424 100%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              borderBottom: "2.5px solid #0f0e1a",
              boxShadow: "none",
            }}
          >
            {/* Wavy / Contour Pattern Placeholder when no custom banner */}
            {!bannerUrl && (
              <div
                className={`dashboard-card-contours ${
                  isHub ? "" : "dashboard-card-contours--sky"
                } pointer-events-none`}
                style={{ opacity: 0.25 }}
                aria-hidden="true"
              />
            )}

            {/* Bottom Gradient Overlay for maximum text contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(14, 13, 24, 0.95) 0%, rgba(14, 13, 24, 0.45) 55%, rgba(14, 13, 24, 0.05) 100%)",
              }}
            />

            {/* Content: Verified / Partnered Badge (if applicable) + Name */}
            <div className="relative z-10 flex items-center gap-1.5 min-w-0">
              {isVerified && (
                <span
                  title="Verified Hub"
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/40 text-[10px] flex-shrink-0 font-bold"
                >
                  ✓
                </span>
              )}
              {isPartnered && !isVerified && (
                <span
                  title="Partnered Hub"
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] flex-shrink-0 font-bold"
                >
                  ★
                </span>
              )}
              <span className="font-['Sora'] font-bold text-[15px] text-white tracking-wide truncate leading-none drop-shadow-md">
                {currentTitle}
              </span>
            </div>
          </div>
        )}

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
