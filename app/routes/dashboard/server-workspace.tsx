import {
  ApartmentOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router";
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

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const serverId = params.serverId;
  if (!serverId) {
    throw new Response("Server not found", { status: 404 });
  }

  const server = await serverService.get(user.id, serverId);
  const [channels, bridges, blocks] = await Promise.all([
    server.status.botInstalled && isCapabilityEnabled("CONNECTIONS")
      ? serverService.channels(user.id, serverId)
      : Promise.resolve([]),
    server.status.botInstalled && isCapabilityEnabled("CONNECTIONS")
      ? serverService.bridges(user.id, serverId)
      : Promise.resolve([]),
    server.status.botInstalled && isCapabilityEnabled("SERVER_BLOCKLIST")
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

      {view === "overview" && <ServerOverviewCard server={server} />}
      {view === "bridges" && <ServerBridgesCard server={server} bridges={bridges} />}
      {view === "calls" && <ServerCallSettingsCard server={server} channels={channels} />}
      {(view === "safety" || view === "blocklist") && (
        <ServerBlocklistCard server={server} blocks={blocks} />
      )}
      {view === "settings" && <ServerSettingsCard server={server} />}
    </div>
  );
}
