import {
  ApartmentOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { Link, useLoaderData, useOutletContext, useParams, type ShouldRevalidateFunctionArgs } from "react-router";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { ServerBlocklistCard } from "~/components/dashboard/server/ServerBlocklistCard";
import { ServerBridgesCard } from "~/components/dashboard/server/ServerBridgesCard";
import { ServerCallSettingsCard } from "~/components/dashboard/server/ServerCallSettingsCard";
import { ServerOverviewCard } from "~/components/dashboard/server/ServerOverviewCard";
import { ServerSettingsCard } from "~/components/dashboard/server/ServerSettingsCard";
import { requireUser } from "~/services/auth.server";
import { isCapabilityEnabled } from "~/services/capabilities.server";
import { serverService } from "~/services/server.server";
import type { Route } from "./+types/server-workspace";

export function shouldRevalidate({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  // Revalidate on mutations (e.g. updating prefix, call config, bridges) or revalidator.revalidate()
  if (formMethod || defaultShouldRevalidate) return true;
  // Revalidate if navigating to a different server
  if (currentParams.serverId !== nextParams.serverId) return true;
  // Revalidate if switching views so the loader fetches the required view data
  if (currentParams.view !== nextParams.view) return true;
  return false;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const serverId = params.serverId;
  if (!serverId) {
    throw new Response("Server not found", { status: 404 });
  }

  const server = await serverService.get(user.id, serverId);
  const requestedView = params.view || "overview";

  // Performance optimization: only load supplementary data when on the respective view
  const shouldLoadChannels =
    server.status.botInstalled &&
    isCapabilityEnabled("CONNECTIONS") &&
    (requestedView === "calls" || requestedView === "bridges");

  const shouldLoadBridges =
    server.status.botInstalled &&
    isCapabilityEnabled("CONNECTIONS") &&
    requestedView === "bridges";

  const shouldLoadBlocks =
    server.status.botInstalled &&
    isCapabilityEnabled("SERVER_BLOCKLIST") &&
    (requestedView === "safety" || requestedView === "blocklist");

  const [channels, bridges, blocks] = await Promise.all([
    shouldLoadChannels
      ? serverService.channels(user.id, serverId)
      : Promise.resolve([]),
    shouldLoadBridges
      ? serverService.bridges(user.id, serverId)
      : Promise.resolve([]),
    shouldLoadBlocks
      ? serverService.blocklist(user.id, serverId)
      : Promise.resolve([]),
  ]);

  return {
    server,
    channels,
    bridges,
    blocks,
  };
}

const VISIBLE_SERVER_VIEWS = new Set(["overview", "bridges", "calls", "safety", "settings"]);
const VIEW_CAPABILITIES: Record<string, string> = {
  bridges: "CONNECTIONS",
  calls: "SERVER_CONFIG",
  safety: "SERVER_BLOCKLIST",
  settings: "SERVER_CONFIG",
};
const LEGACY_VIEWS: Record<string, string> = { blocklist: "safety" };

type DashboardContext = {
  capabilities?: Record<string, boolean>;
};

export default function ServerWorkspace() {
  const { server, channels, bridges, blocks } = useLoaderData<typeof loader>();
  const { capabilities = {} } = useOutletContext<DashboardContext>();
  const params = useParams();
  const requestedView = LEGACY_VIEWS[params.view || "overview"] || params.view || "overview";
  const requestedCapability = VIEW_CAPABILITIES[requestedView];
  const viewEnabled = !requestedCapability || capabilities[requestedCapability] === true;
  const view = VISIBLE_SERVER_VIEWS.has(requestedView) && viewEnabled ? requestedView : "overview";

  const viewTitles: Record<string, { title: string; desc: string; icon: ReactNode }> = {
    overview: {
      title: "Server Overview",
      desc: `Status, bridge summary, and call statistics for ${server.metadata.name}.`,
      icon: <CloudServerOutlined />,
    },
    bridges: {
      title: "Hubs",
      desc: `Hub connections for ${server.metadata.name}.`,
      icon: <ApartmentOutlined />,
    },
    calls: {
      title: "Calls",
      desc: `Call channels and privacy settings for ${server.metadata.name}.`,
      icon: <ThunderboltOutlined />,
    },
    safety: {
      title: "Blocklist",
      desc: `Users and servers blocked from interacting with ${server.metadata.name}.`,
      icon: <SafetyCertificateOutlined />,
    },
    blocklist: {
      title: "Blocklist",
      desc: `Users and servers blocked from interacting with ${server.metadata.name}.`,
      icon: <SafetyCertificateOutlined />,
    },
    settings: {
      title: "Settings",
      desc: `Bot integration status, command prefix, and Discord permissions for ${server.metadata.name}.`,
      icon: <SettingOutlined />,
    },
  };

  const currentView = viewTitles[view] || viewTitles.overview;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Server Controls"
        title={`${server.metadata.name} · ${currentView.title}`}
        description={currentView.desc}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/servers"
              className="dashboard-btn-secondary px-4 py-2 text-xs font-bold"
            >
              All Servers
            </Link>
          </div>
        }
      />

      {/* In-page Horizontal Tabs Bar (Mobile Only) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-white/[0.08] bg-[#1e1f2b] shadow-[0_2px_0_0_rgba(10,8,23,0.75)] overflow-x-auto md:hidden">
        {[
          { key: "overview", label: "Overview", icon: <CloudServerOutlined /> },
          { key: "bridges", label: "Hubs", icon: <ApartmentOutlined />, count: bridges.length, capability: "CONNECTIONS" },
          { key: "calls", label: "Calls", icon: <ThunderboltOutlined />, count: server.spec.lobbyChannelIds.length > 0 ? server.spec.lobbyChannelIds.length : undefined, capability: "SERVER_CONFIG" },
          { key: "safety", label: "Blocklist", icon: <SafetyCertificateOutlined />, count: blocks.length, capability: "SERVER_BLOCKLIST" },
          { key: "settings", label: "Settings", icon: <SettingOutlined />, capability: "SERVER_CONFIG" },
        ].filter((tab) => !tab.capability || capabilities[tab.capability] === true).map((tab) => {
          const isActive = view === tab.key;
          return (
            <Link
              key={tab.key}
              to={`/dashboard/servers/${server.metadata.id}/${tab.key === "overview" ? "" : tab.key}`}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                ? "bg-[#2b274c] text-violet-200 border border-violet-500/40 shadow-[0_1.5px_0_0_#5b4ccb] font-bold"
                : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] shadow-[0_1.5px_0_0_rgba(255,255,255,0.06)]"
                }`}
            >
              <span className={isActive ? "text-violet-300" : "text-white/50"}>{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-violet-500/30 text-violet-200 border border-violet-400/30" : "bg-white/10 text-white/60"
                  }`}>
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {view === "overview" && (
        <ServerOverviewCard
          server={server}
          bridgesCount={server.status.connectionCount ?? bridges.length}
          blocksCount={blocks.length > 0 ? blocks.length : undefined}
        />
      )}
      {view === "bridges" && <ServerBridgesCard server={server} bridges={bridges} channels={channels} />}
      {view === "calls" && <ServerCallSettingsCard server={server} channels={channels} />}
      {(view === "safety" || view === "blocklist") && (
        <ServerBlocklistCard server={server} blocks={blocks} />
      )}
      {view === "settings" && <ServerSettingsCard server={server} />}
    </div>
  );
}
