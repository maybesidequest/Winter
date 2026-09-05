import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubConnectionResource } from "~/resources/connection";
import type { HubResource } from "~/resources/hub";
import { HubLogStreamCard } from "./HubLogStreamCard";
import {
  CATEGORY_TABS,
  INITIAL_STREAMS_MAP,
  LOG_STREAMS,
  parseConfigToStreams,
  type LogCategory,
  type LogStreamKey,
  type StreamsMap,
} from "./hubLoggingStreams";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle } from "./shared";

interface HubLoggingPanelProps {
  hub: HubResource;
  connections: HubConnectionResource[];
  canEdit: boolean;
}

export function HubLoggingPanel({ hub, connections, canEdit }: HubLoggingPanelProps) {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<LogCategory>("all");
  const [streams, setStreams] = useState<StreamsMap>(INITIAL_STREAMS_MAP);
  const saveKeyRef = useRef(crypto.randomUUID());

  const logQuery = useQuery(orpc.hub.getLogConfig.queryOptions({ input: { hubId: hub.metadata.id } }));
  const connectedServers = useMemo(
    () =>
      Array.from(
        new Map(connections.map((c) => [c.spec.serverId, c.status.serverName || "Server unavailable"])).entries()
      ).map(([id, name]) => ({ id, name })),
    [connections]
  );

  useEffect(() => {
    if (!logQuery.data) return;
    const defaultServer = connectedServers[0]?.id || "";
    setStreams((prev) => parseConfigToStreams(logQuery.data, defaultServer, prev));
  }, [logQuery.data, connectedServers]);

  const patchLogMutation = useMutation(
    orpc.hub.patchLogConfig.mutationOptions({
      onSuccess: () => {
        message.success("Logging destinations updated successfully.");
        saveKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.getLogConfig.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update logging destinations."),
    })
  );

  const isDirty = useMemo(() => {
    if (!logQuery.data) return false;
    return LOG_STREAMS.some((s) => {
      const origCh = ((logQuery.data[s.channelField] as string) || (s.key === "modLogs" ? logQuery.data.channelId : "") || "").trim();
      const origRole = ((logQuery.data[s.roleField] as string) || (s.key === "modLogs" ? logQuery.data.notificationRoleId : "") || "").trim();
      return origCh !== (streams[s.key]?.channelId || "").trim() || origRole !== (streams[s.key]?.roleId || "").trim();
    });
  }, [logQuery.data, streams]);

  const updateStream = (key: LogStreamKey, patch: Partial<StreamsMap[LogStreamKey]>) => {
    setStreams((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    const streamFields = Object.fromEntries(
      LOG_STREAMS.flatMap((s) => [
        [s.channelField, streams[s.key]?.channelId.trim() || null],
        [s.roleField, streams[s.key]?.roleId.trim() || null],
      ])
    );
    patchLogMutation.mutate({
      hubId: hub.metadata.id,
      expectedVersion: hub.version,
      channelId: streams.modLogs.channelId.trim() || undefined,
      notificationRoleId: streams.modLogs.roleId.trim() || undefined,
      eventFlags: 7,
      ...streamFields,
      idempotencyKey: saveKeyRef.current,
    });
  };

  const filteredStreams = LOG_STREAMS.filter(
    (s) => activeCategory === "all" || s.category === activeCategory
  );

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Logging & Notifications</DashboardSectionTitle>}
      extra={
        canEdit && (
          <div className="flex items-center gap-2">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  if (!logQuery.data) return;
                  const defaultServer = connectedServers[0]?.id || "";
                  setStreams(parseConfigToStreams(logQuery.data, defaultServer));
                }}
                disabled={patchLogMutation.isPending}
                className="dashboard-btn-secondary px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer"
              >
                <ReloadOutlined className="text-xs" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              disabled={!isDirty || patchLogMutation.isPending || logQuery.isLoading || logQuery.isError}
              onClick={handleSave}
              className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckOutlined className="text-xs" />
              <span>{patchLogMutation.isPending ? "Saving..." : "Save Logging"}</span>
            </button>
          </div>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only staff with logging-management access can change destinations or roles." />}

      <div className="flex flex-col gap-4">
        {logQuery.isError && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-200">
            Logging settings are temporarily unavailable. Please reload the page.
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Log Stream Categories">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab.key)}
                className={`dashboard-pill-btn px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  isActive ? "dashboard-pill-btn--active text-white font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1.5 tabular-nums opacity-60">({tab.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {filteredStreams.map((stream) => {
            const current = streams[stream.key];
            return (
              <HubLogStreamCard
                key={stream.key}
                streamKey={stream.key}
                title={stream.title}
                description={stream.description}
                category={stream.category}
                icon={stream.icon}
                channelId={current?.channelId}
                roleId={current?.roleId}
                selectedServerId={current?.serverId || ""}
                connectedServers={connectedServers}
                canEdit={canEdit}
                disabled={patchLogMutation.isPending || logQuery.isLoading}
                onServerChange={(serverId) => updateStream(stream.key, { serverId, channelId: "", roleId: "" })}
                onChannelChange={(channelId) => updateStream(stream.key, { channelId })}
                onRoleChange={(roleId) => updateStream(stream.key, { roleId })}
                onClear={() => updateStream(stream.key, { channelId: "", roleId: "" })}
              />
            );
          })}
        </div>
      </div>
    </DashboardSectionCard>
  );
}
