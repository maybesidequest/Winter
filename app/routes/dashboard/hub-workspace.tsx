import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { message } from "antd";
import { orpc } from "~/lib/orpc";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { HubWorkspaceTabs } from "~/components/dashboard/HubWorkspaceTabs";
import { toggleSettingsFlag, type HubSettingsFlag } from "~/schemas/hub";

const VIEW_TITLES: Record<string, { title: string; desc: string }> = {
  overview: { title: "Overview", desc: "Hub status and activity at a glance." },
  general: { title: "General", desc: "Manage identity, branding, and description." },
  connections: { title: "Connections", desc: "Manage connected Discord servers and channels." },
  moderation: { title: "Moderation", desc: "Manage safety settings, rules, and access." },
  modules: { title: "Modules", desc: "Choose how messages and attachments move through the hub." },
  logging: { title: "Logging", desc: "Configure log channels and notification roles." },
  badges: { title: "Badges", desc: "Choose which staff badges appear on relayed messages." },
  invites: { title: "Invites", desc: "Create and revoke hub invite codes." },
  team: { title: "Team", desc: "Manage staff roles and permissions." },
  announcements: { title: "Announcements", desc: "Schedule announcements across connected servers." },
  settings: { title: "Settings", desc: "Manage visibility, localization, ownership, and deletion." },
};

const LEGACY_VIEWS: Record<string, string> = {
  routes: "connections",
  safety: "moderation",
  rules: "moderation",
  members: "team",
};

const PHASE_1_VIEWS = new Set(["overview", "general"]);

export default function HubWorkspace() {
  const params = useParams();
  const hubId = params.hubId || "";
  const requestedView = params.view || "overview";
  const requestedTab = LEGACY_VIEWS[requestedView] || requestedView;
  const activeTab = PHASE_1_VIEWS.has(requestedTab) || import.meta.env.DEV ? requestedTab : "overview";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: hubDetail, isLoading: isHubLoading, isError } = useQuery(
    orpc.hub.getHub.queryOptions({ input: { hubId } })
  );
  const { data: hubs = [] } = useQuery(orpc.hub.getUserHubs.queryOptions());
  const hub = hubDetail || hubs.find((h) => h.metadata.id === hubId);
  const isLoading = isHubLoading && !hub;
  const connectionsEnabled = import.meta.env.DEV && activeTab === "connections";
  const { data: connections = [] } = useQuery({
    ...orpc.hub.getConnections.queryOptions({ input: { hubId } }),
    enabled: connectionsEnabled,
  });

  const patchMutation = useMutation(
    orpc.hub.patchConfig.mutationOptions({
      onSuccess: async () => {
        message.success("Hub configuration saved successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey });
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to save hub configuration."),
    })
  );


  const toggleRouteMutation = useMutation(
    orpc.hub.toggleConnection.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey });
      },
    })
  );

  const disconnectRouteMutation = useMutation(
    orpc.hub.disconnectConnection.mutationOptions({
      onSuccess: async () => {
        message.success("Bridge disconnected successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey });
      },
    })
  );

  const deleteHubMutation = useMutation(
    orpc.hub.deleteHub.mutationOptions({
      onSuccess: async () => {
        message.success("Hub deleted successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
        navigate("/dashboard/hubs");
      },
      onError: (err) => message.error(err.message || "Failed to delete hub."),
    })
  );

  const transferOwnershipMutation = useMutation(
    orpc.hub.transferOwnership.mutationOptions({
      onSuccess: async () => {
        message.success("Ownership transferred successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to transfer ownership."),
    })
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-pulse">
        <div className="h-10 w-64 bg-white/[0.08] rounded-xl" />
        <div className="h-64 w-full bg-white/[0.05] rounded-3xl" />
      </div>
    );
  }

  if (isError || !hub) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ExclamationCircleOutlined className="text-red-400 text-lg" />
            <h3 className="text-base font-bold text-white m-0">Hub Not Found</h3>
          </div>
          <p className="text-xs text-white/60">This Hub does not exist or you do not have permission to view it.</p>
          <Link to="/dashboard/hubs" className="dashboard-btn-secondary w-fit px-4 py-2 text-xs font-bold mt-2">
            <ArrowLeftOutlined /> Back to Hubs
          </Link>
        </div>
      </div>
    );
  }

  const currentView = VIEW_TITLES[activeTab] || {
    title: `${activeTab[0].toUpperCase()}${activeTab.slice(1)}`,
    desc: `Manage ${activeTab} for ${hub.metadata.name}.`,
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Hub Control Plane"
        title={`${hub.metadata.name} · ${currentView.title}`}
        description={currentView.desc}
        actions={
          <Link to="/dashboard/hubs" className="dashboard-btn-secondary px-4 py-2 text-xs font-bold">
            <ArrowLeftOutlined />
            <span>All Hubs</span>
          </Link>
        }
      />
      <HubWorkspaceTabs
        activeTab={activeTab}
        hub={hub}
        connections={connections}
        canEdit={!!hub.metadata.permissions?.MANAGE_HUB_SETTINGS}
        canManageConnections={!!hub.metadata.permissions?.MANAGE_CONNECTIONS}
        isOwner={hub.metadata.effectiveRole === "OWNER"}
        isSaving={patchMutation.isPending}
        saveError={patchMutation.error instanceof Error ? patchMutation.error.message : undefined}
        isRoutePending={toggleRouteMutation.isPending || disconnectRouteMutation.isPending}
        onSaveConfig={(changes) => patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), version: hub.version, ...changes })}
        onToggleRoute={(conn) => toggleRouteMutation.mutate({ hubId, connectionId: conn.metadata.id, enabled: !conn.spec.connected })}
        onDisconnectRoute={(conn) => disconnectRouteMutation.mutate({ hubId, connectionId: conn.metadata.id })}
        onToggleModuleFlag={(flag, enabled) => {
          const updatedSettings = toggleSettingsFlag(hub.spec.settings, flag as HubSettingsFlag, enabled);
          patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), settings: updatedSettings, version: hub.version });
        }}
        onDeleteHub={() => deleteHubMutation.mutate({ hubId, confirmationName: hub.metadata.name, expectedVersion: hub.version, idempotencyKey: crypto.randomUUID() })}
        onTransferOwnership={(newOwnerId) => transferOwnershipMutation.mutate({ hubId, newOwnerId, expectedVersion: hub.version, idempotencyKey: crypto.randomUUID() })}
      />
    </div>
  );
}
