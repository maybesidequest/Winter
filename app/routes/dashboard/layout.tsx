import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { CreateHubWizard } from "~/components/CreateHubWizard";
import { IconRail } from "~/components/dashboard/IconRail";
import { MiddleSidebar } from "~/components/dashboard/MiddleSidebar";
import { SettingsModal } from "~/components/dashboard/SettingsModal";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { requireUser } from "~/services/auth.server";
import { CONTROL_CAPABILITIES, isCapabilityEnabled } from "~/services/capabilities.server";
import "~/styles/dashboard.css";
import { hubService } from "~/services/hub.server";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const capabilities = Object.fromEntries(
    Object.entries(CONTROL_CAPABILITIES).map(([name]) => [name, isCapabilityEnabled(name as keyof typeof CONTROL_CAPABILITIES)]),
  );
  let initialHubs: HubResource[] = [];
  if (capabilities.HUB_LIST || process.env.NODE_ENV === "development") {
    try {
      initialHubs = await hubService.getUserHubs(user.id);
    } catch {
      initialHubs = [];
    }
  }
  return { user, capabilities, initialHubs };
}

export function shouldRevalidate() {
  return false;
}

export default function DashboardLayout() {
  const { user, capabilities, initialHubs } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [instanceType, setInstanceType] = useState<"servers" | "hubs">(() =>
    location.pathname.startsWith("/dashboard/hubs") ? "hubs" : "servers"
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHubOpen, setIsCreateHubOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: servers = [], isLoading: serversLoading } = useQuery(
    orpc.server.list.queryOptions({ staleTime: 30_000 })
  );

  // Keep disabled capabilities quiet in production.  The sidebar uses the
  // same snapshot, so there is no reason to issue a request that the RPC will
  // deliberately reject.  Development keeps the existing opt-in preview.
  const hubListEnabled = Boolean(capabilities.HUB_LIST || import.meta.env.DEV);
  const { data: hubs = initialHubs, isLoading: hubsLoading } = useQuery(
    {
      ...orpc.hub.getUserHubs.queryOptions({ staleTime: 60_000 }),
      enabled: hubListEnabled,
      initialData: initialHubs.length > 0 ? initialHubs : undefined,
    }
  );

  const isLoading = instanceType === "servers" ? serversLoading : hubsLoading;

  const handleToggleInstanceType = (type: "servers" | "hubs") => {
    setInstanceType(type);
    if (type === "hubs" && !location.pathname.startsWith("/dashboard/hubs")) {
      navigate("/dashboard/hubs");
    } else if (type === "servers" && !location.pathname.startsWith("/dashboard/servers")) {
      navigate("/dashboard/servers");
    }
  };

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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#8175ee",
          colorBgBase: "#0b0c14",
          colorBgContainer: "#13141f",
          colorBgElevated: "#181726",
          colorBorder: "rgba(255, 255, 255, 0.08)",
          colorText: "#ffffff",
          colorTextSecondary: "rgba(255, 255, 255, 0.65)",
          borderRadius: 10,
        },
      }}
    >
      <div className="min-h-screen bg-[#0b0c14] text-white flex flex-col font-['Inter'] relative selection:bg-violet-500/40 selection:text-white">
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
            isLoading={isLoading}
            onOpenCreate={() => setIsCreateHubOpen(true)}
            capabilities={capabilities}
          />
          <MiddleSidebar
            instanceType={instanceType}
            servers={servers}
            hubs={hubs}
            isLoading={isLoading}
            user={user}
            onToggleInstanceType={handleToggleInstanceType}
            onOpenSettings={() => setIsSettingsOpen(true)}
            capabilities={capabilities}
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
                isLoading={isLoading}
                onOpenCreate={() => {
                  setMobileMenuOpen(false);
                  setIsCreateHubOpen(true);
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
                  onToggleInstanceType={handleToggleInstanceType}
                  onOpenSettings={() => {
                    setMobileMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  onNavigate={() => setMobileMenuOpen(false)}
                  capabilities={capabilities}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Zone C: Routed Outlet) */}
        <main
          className="flex-1 min-h-screen md:ml-[360px] p-4 sm:p-6 md:p-10 transition-all"
          style={{
            background: "radial-gradient(ellipse at top center, #151329 0%, #0b0c14 70%)",
          }}
        >
          <Outlet context={{ user, servers, hubs, isLoading, capabilities }} />
        </main>

        {/* Global Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          capabilities={capabilities}
        />

        {/* Create Hub Wizard Modal */}
        <CreateHubWizard
          mode="modal"
          open={isCreateHubOpen}
          onCancel={() => setIsCreateHubOpen(false)}
          isFirstHub={hubs.length === 0}
          onCreated={async (hubId) => {
            await queryClient.invalidateQueries({
              queryKey: orpc.hub.getUserHubs.queryOptions().queryKey,
            });
            navigate(`/dashboard/hubs/${hubId}/overview`);
          }}
        />
      </div>
    </ConfigProvider>
  );
}
