import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  IdcardOutlined,
  LinkOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { orpc } from "~/lib/orpc";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubSummary } from "~/components/dashboard/HubSummary";
import { HubFeaturePlaceholder } from "~/components/dashboard/HubFeaturePlaceholder";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubSafetyView } from "~/components/dashboard/HubSafetyView";
import { HubRulesPanel } from "~/components/dashboard/HubRulesPanel";
import { HubInvitesPanel } from "~/components/dashboard/HubInvitesPanel";
import { HubBadgesPanel } from "~/components/dashboard/HubBadgesPanel";
import { HubLoggingPanel } from "~/components/dashboard/HubLoggingPanel";
import { HubAnnouncementsPanel } from "~/components/dashboard/HubAnnouncementsPanel";
import { HubTeamPanel } from "~/components/dashboard/HubTeamPanel";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubSettingsPanel } from "~/components/dashboard/HubSettingsPanel";

import { toggleSettingsFlag, type HubSettingsFlag } from "~/schemas/hub";
import type { HubConnectionResource } from "~/resources/connection";

const showUnfinishedFeatures = import.meta.env.DEV;

export default function HubWorkspace() {
  const params = useParams();
  const hubId = params.hubId || "";
  const legacyViews: Record<string, string> = {
    routes: "connections",
    safety: "moderation",
    rules: "moderation",
    members: "team",
  };
  const requestedView = params.view || "overview";
  const activeTab = legacyViews[requestedView] || requestedView;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: hubs = [], isLoading, isError } = useQuery(orpc.hub.getUserHubs.queryOptions());
  const hub = hubs.find((h) => h.metadata.id === hubId);

  const { data: connections = [] } = useQuery(
    orpc.hub.getConnections.queryOptions({ input: { hubId } })
  );

  const patchMutation = useMutation(
    orpc.hub.patchConfig.mutationOptions({
      onSuccess: async () => {
        message.success("Hub configuration saved successfully.");
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getUserHubs.queryOptions().queryKey,
        });
      },
      onError: (err) => {
        message.error(err.message || "Failed to save hub configuration.");
      },
    })
  );

  const toggleRouteMutation = useMutation(
    orpc.hub.toggleConnection.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey,
        });
      },
    })
  );

  const disconnectRouteMutation = useMutation(
    orpc.hub.disconnectConnection.mutationOptions({
      onSuccess: async () => {
        message.success("Bridge disconnected successfully.");
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey,
        });
      },
    })
  );

  const deleteHubMutation = useMutation(
    orpc.hub.deleteHub.mutationOptions({
      onSuccess: async () => {
        message.success("Hub deleted successfully.");
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getUserHubs.queryOptions().queryKey,
        });
        navigate("/dashboard/hubs");
      },
      onError: (err) => message.error(err.message || "Failed to delete hub."),
    })
  );

  const transferOwnershipMutation = useMutation(
    orpc.hub.transferOwnership.mutationOptions({
      onSuccess: async () => {
        message.success("Ownership transferred successfully.");
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getUserHubs.queryOptions().queryKey,
        });
      },
      onError: (err) => message.error(err.message || "Failed to transfer ownership."),
    })
  );

  const nukeMessagesMutation = useMutation(
    orpc.hub.nukeMessages.mutationOptions({
      onSuccess: (data) => {
        message.success(`Purged ${data.deletedCount ?? 0} messages successfully.`);
      },
      onError: (err) => message.error(err.message || "Failed to purge messages."),
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
          <p className="text-xs text-white/60">
            This Hub does not exist or you do not have permission to view its control plane.
          </p>
          <Link to="/dashboard/hubs" className="dashboard-btn-secondary w-fit px-4 py-2 text-xs font-bold mt-2">
            <ArrowLeftOutlined /> Back to Hubs
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = hub.metadata.permissions.MANAGE_HUB_SETTINGS;
  const canManageConnections = hub.metadata.permissions.MANAGE_CONNECTIONS;
  const isOwner = hub.metadata.effectiveRole === "OWNER";

  const handleToggleModuleFlag = (flag: string, enabled: boolean) => {
    const updatedSettings = toggleSettingsFlag(hub.spec.settings, flag as HubSettingsFlag, enabled);
    patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), settings: updatedSettings, version: hub.version });
  };
  const viewTitles: Record<string, { title: string; desc: string }> = {
    overview: {
      title: "Overview",
      desc: hub.spec.shortDescription || hub.spec.description || "Hub status and activity at a glance.",
    },
    general: {
      title: "General",
      desc: "Manage the hub's identity, branding, and description.",
    },
    connections: {
      title: "Connections",
      desc: "Manage connected Discord servers and channels.",
    },
    moderation: {
      title: "Moderation",
      desc: "Manage safety settings, message rules, and network access.",
    },
    modules: {
      title: "Modules",
      desc: "Choose how messages and attachments move through the hub.",
    },
    logging: {
      title: "Logging",
      desc: "Configure log channels and notification roles.",
    },
    badges: {
      title: "Badges",
      desc: "Choose which staff badges appear on relayed messages.",
    },
    invites: {
      title: "Invites",
      desc: "Create and revoke hub invite codes.",
    },
    team: {
      title: "Team",
      desc: "Manage staff roles and permissions.",
    },
    announcements: {
      title: "Announcements",
      desc: "Schedule announcements across connected servers.",
    },
    settings: {
      title: "Settings",
      desc: "Manage visibility, localization, ownership, and deletion.",
    },
  };

  const currentView = viewTitles[activeTab] || {
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
          <div className="flex items-center gap-3">
            <Link to="/dashboard/hubs" className="dashboard-btn-secondary px-4 py-2 text-xs font-bold">
              <ArrowLeftOutlined />
              <span>All Hubs</span>
            </Link>
          </div>
        }
      />

      {activeTab === "overview" && <HubSummary hub={hub} />}

      {activeTab === "general" && (
        <HubOverview
          hub={hub}
          canEdit={canEdit}
          saving={patchMutation.isPending}
          onSave={(changes) => patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), version: hub.version, ...changes })}
        />
      )}

      {activeTab === "connections" && (
        <HubRoutes
          connections={connections}
          canManage={canManageConnections}
          pending={toggleRouteMutation.isPending || disconnectRouteMutation.isPending}
          onToggle={(conn) =>
            toggleRouteMutation.mutate({
              hubId,
              connectionId: conn.metadata.id,
              enabled: !conn.spec.connected,
            })
          }
          onDisconnect={(conn) =>
            disconnectRouteMutation.mutate({
              hubId,
              connectionId: conn.metadata.id,
            })
          }
        />
      )}

      {activeTab === "moderation" && (
        <div className="flex flex-col gap-6">
          <HubSafetyView
            hub={hub}
            canEdit={canEdit}
            saving={patchMutation.isPending}
            onSave={(changes) => patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), version: hub.version, ...changes })}
          />
          <HubRulesPanel hub={hub} canEdit={canEdit} />
        </div>
      )}

      {activeTab === "modules" && (
        <div className="max-w-4xl">
          <HubSettingsPanel
            settings={hub.spec.settings}
            canEdit={canEdit}
            onToggleFlag={handleToggleModuleFlag}
          />
        </div>
      )}

      {activeTab === "settings" && (
        <HubSettings
          hub={hub}
          canEdit={canEdit}
          isOwner={isOwner}
          saving={patchMutation.isPending}
          onSave={(changes) => patchMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID(), version: hub.version, ...changes })}
          onDeleteHub={() => deleteHubMutation.mutate({ hubId, idempotencyKey: crypto.randomUUID() })}
          onTransferOwnership={(newOwnerId) => transferOwnershipMutation.mutate({ hubId, newOwnerId, idempotencyKey: crypto.randomUUID() })}
          onNukeMessages={() => nukeMessagesMutation.mutate({ hubId })}
        />
      )}

      {activeTab === "logging" && (
        <div className="max-w-4xl">
          <HubLoggingPanel hub={hub} canEdit={canEdit} />
        </div>
      )}

      {activeTab === "badges" && (
        <div className="max-w-4xl">
          <HubBadgesPanel hub={hub} canEdit={canEdit} />
        </div>
      )}

      {activeTab === "invites" && (
        <div className="max-w-4xl">
          <HubInvitesPanel hub={hub} canEdit={canEdit} />
        </div>
      )}

      {activeTab === "team" && (
        <div className="max-w-4xl">
          <HubTeamPanel hub={hub} canEdit={canEdit} />
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="max-w-4xl">
          <HubAnnouncementsPanel hub={hub} canEdit={canEdit} />
        </div>
      )}
    </div>
  );
}
