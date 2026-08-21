import { useState, useEffect } from "react";
import { Outlet, useLocation, useLoaderData } from "react-router";
import type { Route } from "./+types/layout";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { IconRail } from "~/components/dashboard/IconRail";
import { MiddleSidebar } from "~/components/dashboard/MiddleSidebar";
import { SettingsModal } from "~/components/dashboard/SettingsModal";
import { requireUser } from "~/services/auth.server";
import { serverService } from "~/services/server.server";
import { hubService } from "~/services/hub.server";
import "~/styles/dashboard.css";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const [servers, hubs] = await Promise.all([
    serverService.list(user.id).catch((err) => {
      console.error("Failed to load user servers:", err);
      return [];
    }),
    hubService.getUserHubs(user.id).catch((err) => {
      console.error("Failed to load user hubs:", err);
      return [];
    }),
  ]);
  return { user, servers, hubs };
}

export default function DashboardLayout() {
  const { user, servers, hubs } = useLoaderData<typeof loader>();
  const location = useLocation();
  const [instanceType, setInstanceType] = useState<"servers" | "hubs">("servers");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-switch instance toggle based on current route
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/hubs")) {
      setInstanceType("hubs");
    } else if (location.pathname.startsWith("/dashboard/servers")) {
      setInstanceType("servers");
    }
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#11121b] text-white flex flex-col font-['Inter'] relative selection:bg-violet-500/40 selection:text-white">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden sticky top-0 z-40 h-14 bg-[#151424]/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">InterChat</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-semibold border border-violet-500/30">
            {instanceType === "hubs" ? "Hubs" : "Servers"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </header>

      {/* Desktop Persistent Left Zones (Rail + Middle Sidebar) */}
      <div className="hidden md:flex">
        <IconRail
          instanceType={instanceType}
          servers={servers}
          hubs={hubs}
          onOpenCreate={() => setIsSettingsOpen(true)}
        />
        <MiddleSidebar
          instanceType={instanceType}
          servers={servers}
          hubs={hubs}
          onToggleInstanceType={setInstanceType}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex h-full max-w-[320px] w-full shadow-2xl animate-slideRight">
            <IconRail
              instanceType={instanceType}
              servers={servers}
              hubs={hubs}
              onOpenCreate={() => {
                setMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
            />
            <div className="flex-1 bg-[#151424]">
              <MiddleSidebar
                instanceType={instanceType}
                servers={servers}
                hubs={hubs}
                onToggleInstanceType={setInstanceType}
                onOpenSettings={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area (Zone C: Routed Outlet) */}
      <main
        className="flex-1 min-h-screen md:ml-[344px] p-4 sm:p-6 md:p-10 transition-all"
        style={{
          background: "radial-gradient(ellipse at top center, #19172b 0%, #11121b 70%)",
        }}
      >
        <Outlet context={{ user, servers, hubs }} />
      </main>

      {/* Global Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

