import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ClusterOutlined,
  SettingOutlined,
  ApiOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { orpc } from "~/lib/orpc";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { HubOverview } from "~/components/dashboard/HubOverview";
import { HubRoutes } from "~/components/dashboard/HubRoutes";
import { HubSettings } from "~/components/dashboard/HubSettings";
import { HubSettingsPanel } from "~/components/dashboard/HubSettingsPanel";
import { toggleSettingsFlag, type HubSettingsFlag } from "~/schemas/hub";
import type { HubConnectionResource } from "~/resources/connection";

const TABS = [
  { id: "overview", label: "Overview", icon: ClusterOutlined },
  { id: "routes", label: "Connected Routes", icon: ApiOutlined },
  { id: "settings", label: "Settings & Profile", icon: SettingOutlined },
  { id: "modules", label: "Broadcast Modules", icon: AppstoreOutlined },
] as const;

export default function HubWorkspace() {
  const params = useParams();
  const hubId = params.hubId || "";
  const activeTab = params.view || "overview";
  const queryClient = useQueryClient();

  const { data: hubs = [], isLoading, isError } = useQuery(orpc.hub.getUserHubs.queryOptions());
  const hub = hubs.find((h) => h.metadata.id === hubId);

  const { data: connections = [], isLoading: connectionsLoading } = useQuery(
    orpc.hub.getConnections.queryOptions({ input: { hubId } })
  );

  const patchMutation = useMutation(
    orpc.hub.patchConfig.mutationOptions({
      onSuccess: async () => {
        message.success("Hub settings saved successfully.");
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
        await queryClient.invalidateQueries({
          queryKey: orpc.hub.getConnections.queryOptions({ input: { hubId } }).queryKey,
        });
      },
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

  const handleToggleModuleFlag = (flag: string, enabled: boolean) => {
    const updatedSettings = toggleSettingsFlag(hub.spec.settings, flag as HubSettingsFlag, enabled);
    patchMutation.mutate({ hubId, settings: updatedSettings });
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Hub Control Plane"
        title={hub.metadata.name}
        description={hub.spec.shortDescription || hub.spec.description || "Manage settings, linked routes, and moderation."}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/dashboard/hubs" className="dashboard-btn-secondary px-4 py-2 text-xs font-bold">
              <ArrowLeftOutlined />
              <span>All Hubs</span>
            </Link>
          </div>
        }
      />

      {/* Workspace Tabs Navigation */}
      <div className="dashboard-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            to={`/dashboard/hubs/${hubId}/${id}`}
            aria-current={activeTab === id ? "page" : undefined}
            className="flex items-center gap-2"
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* Tab Content Rendering */}
      {activeTab === "overview" && <HubOverview hub={hub} />}

      {activeTab === "routes" && (
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

      {activeTab === "settings" && (
        <HubSettings
          hub={hub}
          canEdit={canEdit}
          saving={patchMutation.isPending}
          onSave={(changes) => patchMutation.mutate({ hubId, ...changes })}
        />
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
    </div>
  );
}
