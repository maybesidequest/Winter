import type { ReactNode } from "react";
import { useLoaderData, useParams, Link } from "react-router";
import type { Route } from "./+types/server-workspace";
import {
  CloudServerOutlined,
  PhoneOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { requireUser } from "~/services/auth.server";
import { serverService } from "~/services/server.server";
import { ServerOverviewCard } from "~/components/dashboard/server/ServerOverviewCard";
import { ServerCallSettingsCard } from "~/components/dashboard/server/ServerCallSettingsCard";
import { ServerBridgesCard } from "~/components/dashboard/server/ServerBridgesCard";
import { ServerBlocklistCard } from "~/components/dashboard/server/ServerBlocklistCard";
import type {
  DiscordChannelResource,
  ServerBlockResource,
  ServerBridgeResource,
  ServerResource,
} from "~/resources/server";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const serverId = params.serverId;
  if (!serverId) {
    throw new Response("Server not found", { status: 404 });
  }

  const server = await serverService.get(user.id, serverId);
  const [channels, bridges, blocks] = await Promise.all([
    server.status.botInstalled ? serverService.channels(user.id, serverId) : Promise.resolve([]),
    server.status.botInstalled ? serverService.bridges(user.id, serverId) : Promise.resolve([]),
    server.status.botInstalled ? serverService.blocklist(user.id, serverId) : Promise.resolve([]),
  ]);

  return {
    server,
    channels,
    bridges,
    blocks,
  };
}

export default function ServerWorkspace() {
  const { server, channels, bridges, blocks } = useLoaderData<typeof loader>();
  const params = useParams();
  const view = params.view || "overview";

  const viewTitles: Record<string, { title: string; desc: string; icon: ReactNode }> = {
    overview: {
      title: "Server Overview",
      desc: `Status, bridge summary, and call statistics for ${server.metadata.name}.`,
      icon: <CloudServerOutlined />,
    },
    calls: {
      title: "Userphone",
      desc: `Allowed matchmaking channels and call privacy/behavior toggles for ${server.metadata.name}.`,
      icon: <PhoneOutlined />,
    },
    bridges: {
      title: "Hub Bridges",
      desc: `Active Discord channel bridges connected to cross-server Hubs in ${server.metadata.name}.`,
      icon: <ApartmentOutlined />,
    },
    blocklist: {
      title: "Server Blocklist",
      desc: `Users and servers blocked from interacting with ${server.metadata.name} in Calls and Hubs.`,
      icon: <SafetyCertificateOutlined />,
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
      {view === "calls" && <ServerCallSettingsCard server={server} channels={channels} />}
      {view === "bridges" && <ServerBridgesCard server={server} bridges={bridges} />}
      {view === "blocklist" && <ServerBlocklistCard server={server} blocks={blocks} />}
    </div>
  );
}

