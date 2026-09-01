import { CheckOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import type { HubConnectionResource } from "~/resources/connection";
import { HubSubjectSelector } from "./HubSubjectSelector";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle, DepthToggle } from "./shared";

interface HubLoggingPanelProps {
  hub: HubResource;
  connections: HubConnectionResource[];
  canEdit: boolean;
}

export function HubLoggingPanel({ hub, connections, canEdit }: HubLoggingPanelProps) {
  const queryClient = useQueryClient();
  const [channelId, setChannelId] = useState<string>("");
  const [notificationRoleId, setNotificationRoleId] = useState<string>("");
  const [selectedServerId, setSelectedServerId] = useState<string>("");
  const [logMessages, setLogMessages] = useState<boolean>(true);
  const [logModeration, setLogModeration] = useState<boolean>(true);
  const [logConnections, setLogConnections] = useState<boolean>(true);
  const saveKeyRef = useRef(crypto.randomUUID());
  const submittedDraftRef = useRef<string | null>(null);
  const logQuery = useQuery(orpc.hub.getLogConfig.queryOptions({ input: { hubId: hub.metadata.id } }));
  const connectedServers = useMemo(
    () => Array.from(new Map(connections.map((connection) => [connection.spec.serverId, connection.status.serverName || "Server name unavailable"])).entries()).map(([id, name]) => ({ id, name })),
    [connections],
  );

  useEffect(() => {
    if (!logQuery.data) return;
    setChannelId(logQuery.data.channelId || "");
    setNotificationRoleId(logQuery.data.notificationRoleId || "");
    const configuredServer = connections.find((connection) => connection.spec.channelId === logQuery.data.channelId)?.spec.serverId;
    setSelectedServerId(configuredServer || connectedServers[0]?.id || "");
    setLogMessages(Boolean(logQuery.data.eventFlags & 1));
    setLogModeration(Boolean(logQuery.data.eventFlags & 2));
    setLogConnections(Boolean(logQuery.data.eventFlags & 4));
  }, [connectedServers, connections, logQuery.data]);

  const patchLogMutation = useMutation(
    orpc.hub.patchLogConfig.mutationOptions({
      onSuccess: () => {
        message.success("Logging configuration saved.");
        submittedDraftRef.current = null;
        saveKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.getUserHubs.queryOptions().queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update logging config."),
    })
  );

  const handleSave = () => {
    let flags = 0;
    if (logMessages) flags |= 1;
    if (logModeration) flags |= 2;
    if (logConnections) flags |= 4;

    const input = {
      hubId: hub.metadata.id,
      channelId: channelId.trim(),
      eventFlags: flags,
      notificationRoleId: notificationRoleId.trim() || undefined,
      expectedVersion: hub.version,
    };
    const draft = JSON.stringify(input);
    if (submittedDraftRef.current !== draft) {
      saveKeyRef.current = crypto.randomUUID();
      submittedDraftRef.current = draft;
    }
    patchLogMutation.mutate({ ...input, idempotencyKey: saveKeyRef.current });
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Logging & Notifications</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            disabled={logQuery.isLoading || logQuery.isError || patchLogMutation.isPending}
            onClick={handleSave}
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CheckOutlined />
            <span>{patchLogMutation.isPending ? "Saving..." : "Save Logging"}</span>
          </button>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only staff with logging-management access can change destinations or event types." />}

      <div className="flex flex-col gap-5">
        {logQuery.isLoading && <span className="text-xs text-white/60">Loading logging settings…</span>}
        {logQuery.isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
            Logging settings are temporarily unavailable. Try again before saving.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-log-server">Connected Server</label>
            <select
              id="hub-log-server"
              className="dashboard-input text-xs"
              value={selectedServerId}
              onChange={(event) => {
                setSelectedServerId(event.target.value);
                setChannelId("");
                setNotificationRoleId("");
              }}
              disabled={!canEdit || logQuery.isLoading || logQuery.isError || connectedServers.length === 0}
            >
              {connectedServers.length === 0 ? <option value="">Connect a Server first</option> : null}
              {connectedServers.map((server) => <option key={server.id} value={server.id}>{server.name}</option>)}
            </select>
            <span className="text-[11px] text-white/60">Destinations must belong to an authorized connected Server.</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-log-channel">Discord Log Channel</label>
            <HubSubjectSelector
              id="hub-log-channel"
              hubId={selectedServerId}
              selectorType="SELECTOR_TYPE_CHANNEL"
              value={channelId}
              onChange={setChannelId}
              placeholder="Search channels by name"
              disabled={!canEdit || logQuery.isLoading || logQuery.isError || !selectedServerId}
            />
            <span className="text-[11px] text-white/60">The channel where automated relay events are dispatched.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90" htmlFor="hub-notification-role">Staff Notification Role</label>
            <HubSubjectSelector
              id="hub-notification-role"
              hubId={selectedServerId}
              selectorType="SELECTOR_TYPE_ROLE"
              value={notificationRoleId}
              onChange={setNotificationRoleId}
              placeholder="Search roles by name"
              disabled={!canEdit || logQuery.isLoading || logQuery.isError || !selectedServerId}
            />
            <span className="text-[11px] text-white/60">Optional role pinged for critical security or appeal events.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
          <span className="text-xs font-bold text-white/90 uppercase tracking-wide">Dispatched Event Types</span>

          <div className="flex flex-col divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-1">
            <label className="flex items-center justify-between py-3 px-1.5 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer">
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="text-xs font-bold text-white">Log Message Events</span>
                <span className="text-[11px] text-white/60">Deletions, edits, and cross-server message deliveries</span>
              </div>
              <DepthToggle
                checked={logMessages}
                onChange={setLogMessages}
                disabled={!canEdit || logQuery.isLoading || logQuery.isError}
                aria-label="Log Message Events"
              />
            </label>

            <label className="flex items-center justify-between py-3 px-1.5 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer">
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="text-xs font-bold text-white">Log Moderation Actions</span>
                <span className="text-[11px] text-white/60">Warnings, mutes, kicks, bans, and member appeals</span>
              </div>
              <DepthToggle
                checked={logModeration}
                onChange={setLogModeration}
                disabled={!canEdit || logQuery.isLoading || logQuery.isError}
                aria-label="Log Moderation Actions"
              />
            </label>

            <label className="flex items-center justify-between py-3 px-1.5 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer">
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="text-xs font-bold text-white">Log Connection Events</span>
                <span className="text-[11px] text-white/60">Server bridge joins, leaves, and channel pauses</span>
              </div>
              <DepthToggle
                checked={logConnections}
                onChange={setLogConnections}
                disabled={!canEdit || logQuery.isLoading || logQuery.isError}
                aria-label="Log Connection Events"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
