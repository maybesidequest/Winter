import { ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import type { LifecycleFailure } from "~/components/dashboard/HubLifecyclePanel";
import { HubWorkspaceTabs } from "~/components/dashboard/HubWorkspaceTabs";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { toggleSettingsFlag, type HubSettingsFlag } from "~/schemas/hub";
import type { PermissionAction } from "~/permissions/config";
import { requireUser } from "~/services/auth.server";
import { hubService } from "~/services/hub.server";
import type { Route } from "./+types/hub-workspace";
import {
  classifyLifecycleError,
  idempotencyAttemptFor,
  type IdempotencyAttempt,
  type LifecycleAction,
} from "~/services/lifecycleIntent";

const VIEW_TITLES: Record<string, { title: string; desc: string }> = {
  overview: { title: "Overview", desc: "Hub status, activity, and identity settings." },
  general: { title: "General", desc: "Manage identity, branding, and description." },
  connections: { title: "Connections", desc: "Manage connected Discord servers and channels." },
  moderation: { title: "Moderation", desc: "Manage safety settings, rules, and access." },
  rules: { title: "Rules", desc: "Keep the Hub rules clear and current." },
  modules: { title: "Modules", desc: "Choose how messages and attachments move through the hub." },
  logging: { title: "Logging", desc: "Configure log channels and notification roles." },
  badges: { title: "Badges", desc: "Choose which staff badges appear on relayed messages." },
  invites: { title: "Invites", desc: "Create and revoke hub invite codes." },
  team: { title: "Team", desc: "Manage staff roles and permissions." },
  announcements: { title: "Announcements", desc: "Schedule announcements across connected servers." },
  audit: { title: "Audit history", desc: "Review changes made to this Hub." },
  settings: { title: "Settings", desc: "Manage visibility, localization, ownership, and deletion." },
};

const LEGACY_VIEWS: Record<string, string> = {
  general: "overview",
  routes: "connections",
  safety: "moderation",
  members: "team",
};

const VISIBLE_HUB_VIEWS = new Set(["overview", "connections", "moderation", "rules", "modules", "logging", "badges", "invites", "team", "announcements", "audit", "settings"]);

const VIEW_CAPABILITIES: Record<string, string> = {
  general: "HUB_CONFIG",
  connections: "CONNECTIONS",
  moderation: "MODERATION",
  modules: "HUB_CONFIG",
  rules: "HUB_RULES",
  logging: "HUB_LOGGING",
  badges: "HUB_BADGES",
  invites: "HUB_INVITES",
  team: "HUB_TEAM",
  announcements: "HUB_ANNOUNCEMENTS",
  audit: "HUB_AUDIT",
  settings: "HUB_CONFIG",
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const hubId = params.hubId;
  if (!hubId) {
    throw new Response("Hub not found", { status: 404 });
  }

  let hub: HubResource | null = null;
  try {
    hub = await hubService.getHub(hubId, user.id);
  } catch {
    hub = null;
  }

  return { initialHub: hub };
}

type DashboardContext = {
  capabilities?: Record<string, boolean>;
};

export default function HubWorkspace({ loaderData }: Route.ComponentProps) {
  const params = useParams();
  const context = useOutletContext<DashboardContext>() || {};
  const { capabilities = {} } = context;
  const hubId = params.hubId || "";
  const requestedView = params.view || "overview";
  const requestedTab = LEGACY_VIEWS[requestedView] || requestedView;
  const requestedCapability = VIEW_CAPABILITIES[requestedTab];
  const viewEnabled = !requestedCapability || capabilities[requestedCapability] || import.meta.env.DEV;
  // Navigation is not an authorization boundary.  Direct URLs must follow
  // the same production capability snapshot as the sidebar, otherwise a
  // hidden feature can still render (and issue its RPCs) when pasted in.
  const activeTab = ((VISIBLE_HUB_VIEWS.has(requestedTab) && viewEnabled) || import.meta.env.DEV) ? requestedTab : "overview";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const patchAttemptRef = useRef<{ fingerprint: string; key: string } | null>(null);
  const lifecycleAttemptsRef = useRef<Partial<Record<LifecycleAction, IdempotencyAttempt>>>({});
  const lifecycleRetryRef = useRef<(() => void) | null>(null);
  const [lifecycleFailure, setLifecycleFailure] = useState<LifecycleFailure>();

  const recordLifecycleFailure = (action: LifecycleAction, error: unknown) => {
    setLifecycleFailure({
      action,
      recovery: classifyLifecycleError(error),
      message: error instanceof Error ? error.message : "The lifecycle action failed.",
    });
  };

  const clearLifecycleAttempt = (action: LifecycleAction) => {
    delete lifecycleAttemptsRef.current[action];
    lifecycleRetryRef.current = null;
    setLifecycleFailure(undefined);
  };

  const lifecycleKey = (action: LifecycleAction, fingerprint: string) => {
    const attempt = idempotencyAttemptFor(lifecycleAttemptsRef.current[action] ?? null, fingerprint);
    lifecycleAttemptsRef.current[action] = attempt;
    return attempt.key;
  };

  const { data: hubDetail, isLoading: isHubLoading, isError } = useQuery({
    ...orpc.hub.getHub.queryOptions({ input: { hubId }, staleTime: 60_000 }),
    enabled: Boolean(hubId),
    initialData: loaderData?.initialHub ?? undefined,
  });
  const hubListEnabled = Boolean(capabilities.HUB_LIST || import.meta.env.DEV);
  const { data: hubs = [] } = useQuery({
    ...orpc.hub.getUserHubs.queryOptions({ staleTime: 60_000 }),
    enabled: hubListEnabled,
  });
  const hub = hubDetail || loaderData?.initialHub || hubs.find((h) => h.metadata.id === hubId);
  const isLoading = isHubLoading && !hub;
  const connectionsEnabled = (capabilities.CONNECTIONS || import.meta.env.DEV) && activeTab === "connections";
  const { data: connections = [] } = useQuery({
    ...orpc.hub.getConnections.queryOptions({ input: { hubId } }),
    enabled: connectionsEnabled,
  });

  const patchMutation = useMutation(
    orpc.hub.patchConfig.mutationOptions({
      onSuccess: async (result) => {
        patchAttemptRef.current = null;
        message.success("Hub configuration saved successfully.");
        // Render the exact resource returned by the Control Plane immediately;
        // the follow-up invalidation reconciles other cached projections.
        if (result.hub) {
          queryClient.setQueryData(
            orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey,
            result.hub,
          );
        }
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
      onError: async (err) => {
        message.error(err.message || "Failed to update this bridge.");
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
      onError: async (err) => {
        message.error(err.message || "Failed to disconnect this bridge.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey });
      },
    })
  );

  const deleteHubMutation = useMutation(
    orpc.hub.deleteHub.mutationOptions({
      onSuccess: async () => {
        clearLifecycleAttempt("delete");
        message.success("Hub deleted successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
        navigate("/dashboard/hubs");
      },
      onError: (err) => recordLifecycleFailure("delete", err),
    })
  );

  const transferOwnershipMutation = useMutation(
    orpc.hub.transferOwnership.mutationOptions({
      onSuccess: async () => {
        clearLifecycleAttempt("transfer");
        message.success("Ownership transferred successfully.");
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey });
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
      },
      onError: (err) => recordLifecycleFailure("transfer", err),
    })
  );

  const lockdownMutation = useMutation(
    orpc.hub.lockdownHub.mutationOptions({
      onSuccess: async (updatedHub) => {
        clearLifecycleAttempt("lockdown");
        message.success(updatedHub.spec.locked ? "Hub lockdown enabled." : "Hub lockdown lifted.");
        queryClient.setQueryData(
          orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey,
          updatedHub,
        );
        await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
      },
      onError: (err) => recordLifecycleFailure("lockdown", err),
    }),
  );

  const patchConfig = (changes: Record<string, unknown>) => {
    if (!hub?.version) {
      message.error("Hub version is unavailable. Refresh before saving.");
      return;
    }
    const fingerprint = JSON.stringify({ hubId, version: hub.version, changes });
    if (!patchAttemptRef.current || patchAttemptRef.current.fingerprint !== fingerprint) {
      patchAttemptRef.current = { fingerprint, key: crypto.randomUUID() };
    }
    patchMutation.mutate({
      hubId,
      idempotencyKey: patchAttemptRef.current.key,
      version: hub.version,
      ...changes,
    });
  };

  const deleteHub = (confirmationName: string) => {
    if (!hub) return;
    setLifecycleFailure(undefined);
    const fingerprint = JSON.stringify({ hubId, confirmationName, expectedVersion: hub.version });
    const input = {
      hubId,
      confirmationName,
      expectedVersion: hub.version,
      idempotencyKey: lifecycleKey("delete", fingerprint),
    };
    lifecycleRetryRef.current = () => deleteHubMutation.mutate(input);
    deleteHubMutation.mutate(input);
  };

  const transferOwnership = (newOwnerId: string) => {
    if (!hub) return;
    setLifecycleFailure(undefined);
    const fingerprint = JSON.stringify({ hubId, newOwnerId, expectedVersion: hub.version });
    const input = {
      hubId,
      newOwnerId,
      expectedVersion: hub.version,
      idempotencyKey: lifecycleKey("transfer", fingerprint),
    };
    lifecycleRetryRef.current = () => transferOwnershipMutation.mutate(input);
    transferOwnershipMutation.mutate(input);
  };

  const lockdownHub = (locked: boolean, reason: string) => {
    if (!hub) return;
    setLifecycleFailure(undefined);
    const fingerprint = JSON.stringify({ hubId, locked, reason, expectedVersion: hub.version });
    const input = {
      hubId,
      locked,
      reason,
      expectedVersion: hub.version,
      idempotencyKey: lifecycleKey("lockdown", fingerprint),
    };
    lifecycleRetryRef.current = () => lockdownMutation.mutate(input);
    lockdownMutation.mutate(input);
  };

  const refreshLifecycle = async () => {
    await queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey });
    await queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
    setLifecycleFailure(undefined);
  };

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

  const hasPerm = (action: PermissionAction) => hub.metadata.permissions[action] === true;

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
        canEdit={hasPerm("MANAGE_HUB_SETTINGS")}
        canManageConnections={hasPerm("MANAGE_CONNECTIONS")}
        isOwner={hub.metadata.effectiveRole === "OWNER"}
        canLockdown={hub.metadata.effectiveRole === "OWNER" || hasPerm("LOCKDOWN_HUB")}
        isSaving={patchMutation.isPending}
        saveError={patchMutation.error instanceof Error ? patchMutation.error.message : undefined}
        isRoutePending={toggleRouteMutation.isPending || disconnectRouteMutation.isPending}
        onSaveConfig={(changes) => patchConfig(changes)}
        onToggleRoute={(conn) => toggleRouteMutation.mutate({ hubId, connectionId: conn.metadata.id, enabled: !conn.spec.connected, expectedVersion: conn.version, idempotencyKey: crypto.randomUUID() })}
        onDisconnectRoute={(conn) => disconnectRouteMutation.mutate({ hubId, connectionId: conn.metadata.id, expectedVersion: conn.version, idempotencyKey: crypto.randomUUID() })}
        onToggleModuleFlag={(flag, enabled) => {
          const updatedSettings = toggleSettingsFlag(hub.spec.settings, flag as HubSettingsFlag, enabled);
          patchConfig({ settings: updatedSettings });
        }}
        pendingLifecycleAction={
          deleteHubMutation.isPending
            ? "delete"
            : transferOwnershipMutation.isPending
              ? "transfer"
              : lockdownMutation.isPending
                ? "lockdown"
                : undefined
        }
        lifecycleFailure={lifecycleFailure}
        onLockdownHub={lockdownHub}
        onDeleteHub={deleteHub}
        onTransferOwnership={transferOwnership}
        onRefreshLifecycle={refreshLifecycle}
        onRetryLifecycle={() => lifecycleRetryRef.current?.()}
        onBackToHubs={() => navigate("/dashboard/hubs")}
      />
    </div>
  );
}
