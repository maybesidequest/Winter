import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { IconRail } from "~/components/dashboard/IconRail";
import { MiddleSidebar } from "~/components/dashboard/MiddleSidebar";
import type { HubResource } from "~/resources/hub";
import type { ServerResource } from "~/resources/server";
import type { User } from "~/services/auth.server";

interface DashboardMobileNavProps {
  instanceType: "servers" | "hubs";
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  servers: ServerResource[];
  hubs: HubResource[];
  isLoading: boolean;
  user: User;
  onToggleInstanceType: (type: "servers" | "hubs") => void;
  onOpenCreateHub: () => void;
  onOpenSettings: () => void;
  capabilities: Record<string, boolean>;
}

export function DashboardMobileNav({
  instanceType,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  servers,
  hubs,
  isLoading,
  user,
  onToggleInstanceType,
  onOpenCreateHub,
  onOpenSettings,
  capabilities,
}: DashboardMobileNavProps) {
  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden sticky top-0 z-40 h-14 bg-[#13141f]/95 backdrop-blur-md border-b border-white/[0.08] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/images/interchat.png" alt="InterChat Logo" className="w-6 h-6 rounded-md object-contain" />
          <span className="text-[15.5px] font-['Sora'] font-extrabold tracking-wide text-white">InterChat</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-semibold border border-violet-500/30">
            {instanceType === "hubs" ? "Hubs" : "Servers"}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobileMenu}
          />

          <div className="relative z-10 flex h-full max-w-[320px] w-full shadow-2xl animate-slideRight">
            <IconRail
              instanceType={instanceType}
              servers={servers}
              hubs={hubs}
              isLoading={isLoading}
              onOpenCreate={() => {
                onCloseMobileMenu();
                onOpenCreateHub();
              }}
              capabilities={capabilities}
            />
            <div className="flex-1 bg-[#13141f]">
              <MiddleSidebar
                instanceType={instanceType}
                servers={servers}
                hubs={hubs}
                isLoading={isLoading}
                user={user}
                onToggleInstanceType={onToggleInstanceType}
                onOpenSettings={() => {
                  onCloseMobileMenu();
                  onOpenSettings();
                }}
                onNavigate={onCloseMobileMenu}
                capabilities={capabilities}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
