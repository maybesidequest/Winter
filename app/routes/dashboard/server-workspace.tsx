import {
  ApartmentOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Link, useLoaderData, useNavigation, useOutletContext, useParams, useRevalidator, type ShouldRevalidateFunctionArgs } from "react-router";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { ServerBlocklistCard } from "~/components/dashboard/server/ServerBlocklistCard";
import { ServerBridgesCard } from "~/components/dashboard/server/ServerBridgesCard";
import { ServerCallSettingsCard } from "~/components/dashboard/server/ServerCallSettingsCard";
import { ServerMobileTabs } from "~/components/dashboard/server/ServerMobileTabs";
import { ServerOverviewCard } from "~/components/dashboard/server/ServerOverviewCard";
import { ServerSettingsCard } from "~/components/dashboard/server/ServerSettingsCard";
import { requireUser, type User } from "~/services/auth.server";
import { serverService } from "~/services/server.server";
import { shouldRevalidateServerWorkspace } from "~/services/serverWorkspaceNavigation";
import { stateForCollection, stateForControlError, type ServerDataState } from "~/services/serverState";
import { orpc } from "~/lib/orpc";
import type { Route } from "./+types/server-workspace";

export function shouldRevalidate({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  return shouldRevalidateServerWorkspace({
    currentParams,
    nextParams,
    formMethod,
    defaultShouldRevalidate,
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const serverId = params.serverId;
  if (!serverId) {
    throw new Response("Server not found", { status: 404 });
  }

  let server: Awaited<ReturnType<typeof serverService.get>>;
  try {
    server = await serverService.get(user.id, serverId);
  } catch (error) {
    const failure = stateForControlError(error);
    return {
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      server: null,
      serverState: failure.state,
      serverError: failure.message,
    };
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
    server,
    serverState: "ready" as const,
    serverError: null,
  };
}

const VISIBLE_SERVER_VIEWS = new Set(["overview", "bridges", "calls", "safety", "settings"]);
const VIEW_CAPABILITIES: Record<string, readonly string[]> = {
  bridges: ["CONNECTIONS"],
  calls: ["SERVER_CONFIG", "CONNECTIONS"],
  safety: ["SERVER_BLOCKLIST"],
  settings: ["SERVER_CONFIG"],
};
const LEGACY_VIEWS: Record<string, string> = { blocklist: "safety" };

type DashboardContext = {
  user?: User;
  capabilities?: Record<string, boolean>;
};

function collectionStateForQuery(
  enabled: boolean,
  query: { isPending: boolean; isError: boolean; error: unknown; data?: unknown[] },
): { state: ServerDataState; error?: string } {
  if (!enabled) return { state: "not_requested" };
  if (query.isPending) return { state: "loading" };
  if (query.isError) {
    const failure = stateForControlError(query.error);
    return { state: failure.state, error: failure.message };
  }
  return { state: stateForCollection(true, query.data?.length ?? 0) };
}

export default function ServerWorkspace() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const queryClient = useQueryClient();
  const { user: contextUser, capabilities = {} } = useOutletContext<DashboardContext>();
  const user = data.user || contextUser;
  const params = useParams();
  const serverId = params.serverId || "";
  const requestedView = LEGACY_VIEWS[params.view || "overview"] || params.view || "overview";
  const requestedCapabilities = VIEW_CAPABILITIES[requestedView];
  const viewEnabled = !requestedCapabilities || requestedCapabilities.every((capability) => capabilities[capability] === true);
  const view = VISIBLE_SERVER_VIEWS.has(requestedView) && viewEnabled ? requestedView : "overview";
  const server = data.server;

  const shouldLoadChannels = Boolean(
    server?.status.botInstalled &&
    capabilities.CONNECTIONS === true &&
    view === "calls",
  );
  const shouldLoadBridges = Boolean(
    server?.status.botInstalled &&
    capabilities.CONNECTIONS === true &&
    (view === "bridges" || view === "overview"),
  );
  const shouldLoadBlocks = Boolean(
    server?.status.botInstalled &&
    capabilities.SERVER_BLOCKLIST === true &&
    view === "safety",
  );

  const channelsQuery = useQuery({
    ...orpc.server.channels.queryOptions({ input: { serverId } }),
    enabled: shouldLoadChannels,
    staleTime: 30_000,
  });
  const bridgesQuery = useQuery({
    ...orpc.server.bridges.queryOptions({ input: { serverId } }),
    enabled: shouldLoadBridges,
    staleTime: 30_000,
  });
  const blocksQuery = useQuery({
    ...orpc.server.blocklist.queryOptions({ input: { serverId } }),
    enabled: shouldLoadBlocks,
    staleTime: 30_000,
  });

  const refreshServerProjection = () => {
    void queryClient.invalidateQueries({
      queryKey: orpc.server.list.queryOptions().queryKey,
    });
    revalidator.revalidate();
  };

  const serverPath = `/dashboard/servers/${serverId}`;
  const serverDataIsForCurrentRoute = !server || server.metadata.id === serverId;
  const isSameServerNavigation = Boolean(
    navigation.state !== "idle" &&
    navigation.location &&
    (navigation.location.pathname === serverPath || navigation.location.pathname.startsWith(`${serverPath}/`)),
  );
  if (navigation.state !== "idle" && (!isSameServerNavigation || !serverDataIsForCurrentRoute)) {
    return (
      <main className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-pulse p-4 sm:p-0" aria-busy="true">
        <div className="flex flex-col gap-2 pb-6 border-b border-white/[0.08]">
          <div className="h-4 w-28 bg-white/[0.08] rounded-md" />
          <div className="h-8 w-64 bg-white/[0.12] rounded-lg" />
          <div className="h-4 w-96 bg-white/[0.06] rounded-md mt-1" />
        </div>
        <div className="h-10 w-full max-w-md bg-white/[0.06] rounded-xl" />
        <div className="h-72 w-full bg-white/[0.03] rounded-2xl border border-white/[0.06]" />
      </main>
    );
  }
  if (!server) {
    const denied = data.serverState === "permission_denied";
    return (
      <main className="max-w-2xl mx-auto p-6">
        <div className="dashboard-alert" role="alert">
          <h1 className="text-lg font-bold">{denied ? "Server access denied" : "Server controls unavailable"}</h1>
          <p>{data.serverError}</p>
          {!denied && (
            <button className="dashboard-button dashboard-button--primary mt-4" onClick={() => revalidator.revalidate()} disabled={revalidator.state !== "idle"}>
              {revalidator.state === "idle" ? "Retry" : "Retrying…"}
            </button>
          )}
        </div>
      </main>
    );
  }

  const channels = channelsQuery.data ?? [];
  const bridges = bridgesQuery.data ?? [];
  const blocks = blocksQuery.data ?? [];
  const channelsState = collectionStateForQuery(shouldLoadChannels, channelsQuery);
  const bridgesState = collectionStateForQuery(shouldLoadBridges, bridgesQuery);
  const blocksState = collectionStateForQuery(shouldLoadBlocks, blocksQuery);

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
  const viewDataState = view === "calls"
    ? channelsState
    : view === "bridges"
      ? bridgesState
      : view === "safety" || view === "blocklist"
        ? blocksState
        : null;
  const viewUnavailable = viewDataState && (viewDataState.state === "permission_denied" || viewDataState.state === "unavailable");
  const viewNeedsAttention = Boolean(viewUnavailable || (!server.status.botInstalled && view !== "overview"));
  const viewQuery = view === "calls"
    ? channelsQuery
    : view === "bridges"
      ? bridgesQuery
      : view === "safety" || view === "blocklist"
        ? blocksQuery
        : null;
  const viewAttentionMessage = !server.status.botInstalled && view !== "overview"
    ? "Install InterChat in this Discord server before managing this data."
    : viewDataState?.error || "This section is currently unavailable.";

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

      <ServerMobileTabs
        server={server}
        currentView={view}
        capabilities={capabilities}
        blocksCount={blocks.length}
      />

      {view === "overview" && (
        <ServerOverviewCard
          server={server}
          user={user}
          bridges={bridges}
          bridgesCount={server.status.connectionCount}
          blocksCount={blocks.length}
          onServerUpdated={refreshServerProjection}
        />
      )}
      {viewNeedsAttention && (
        <div className="dashboard-alert" role="alert">
          <p>{viewAttentionMessage}</p>
          {viewDataState?.state === "unavailable" && (
            <button
              className="dashboard-button dashboard-button--primary mt-3"
              onClick={() => {
                if (viewQuery) {
                  void viewQuery.refetch();
                } else {
                  revalidator.revalidate();
                }
              }}
              disabled={viewQuery ? viewQuery.isFetching : revalidator.state !== "idle"}
            >
              {viewQuery?.isFetching || revalidator.state !== "idle" ? "Retrying…" : "Retry"}
            </button>
          )}
        </div>
      )}
      {view === "bridges" && !viewNeedsAttention && (
        <ServerBridgesCard
          server={server}
          bridges={bridges}
          channels={channels}
          isLoading={bridgesQuery.isLoading}
          onServerUpdated={refreshServerProjection}
        />
      )}
      {view === "calls" && !viewNeedsAttention && (
        <ServerCallSettingsCard
          server={server}
          channels={channels}
          channelsLoading={channelsQuery.isLoading}
          onServerUpdated={refreshServerProjection}
        />
      )}
      {(view === "safety" || view === "blocklist") && !viewNeedsAttention && (
        <ServerBlocklistCard
          server={server}
          blocks={blocks}
          isLoading={blocksQuery.isLoading}
        />
      )}
      {view === "settings" && !viewNeedsAttention && (
        <ServerSettingsCard
          server={server}
          onServerUpdated={refreshServerProjection}
        />
      )}
    </div>
  );
}
