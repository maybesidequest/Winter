import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Typography, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle, DepthToggle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Text } = Typography;

interface HubLoggingPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubLoggingPanel({ hub, canEdit }: HubLoggingPanelProps) {
  const queryClient = useQueryClient();
  const [channelId, setChannelId] = useState<string>("");
  const [notificationRoleId, setNotificationRoleId] = useState<string>("");
  const [logMessages, setLogMessages] = useState<boolean>(true);
  const [logModeration, setLogModeration] = useState<boolean>(true);
  const [logConnections, setLogConnections] = useState<boolean>(true);
  const saveKeyRef = useRef(crypto.randomUUID());
  const submittedDraftRef = useRef<string | null>(null);
  const logQuery = useQuery(orpc.hub.getLogConfig.queryOptions({ input: { hubId: hub.metadata.id } }));
  useEffect(() => {
    if (!logQuery.data) return;
    setChannelId(logQuery.data.channelId || "");
    setNotificationRoleId(logQuery.data.notificationRoleId || "");
    setLogMessages(Boolean(logQuery.data.eventFlags & 1));
    setLogModeration(Boolean(logQuery.data.eventFlags & 2));
    setLogConnections(Boolean(logQuery.data.eventFlags & 4));
  }, [logQuery.data]);

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
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            className="dashboard-btn-primary"
            loading={patchLogMutation.isPending}
            onClick={handleSave}
          >
            Save Logging
          </Button>
        )
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {logQuery.isError && <Text type="danger">Logging settings are temporarily unavailable.</Text>}
        <div>
          <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
            Discord Log Channel ID
          </Text>
          <Input
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="e.g. 123456789012345678"
            disabled={!canEdit}
          />
        </div>
        <div>
          <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
            Staff Notification Role ID
          </Text>
          <Input
            value={notificationRoleId}
            onChange={(e) => setNotificationRoleId(e.target.value)}
            placeholder="e.g. 987654321098765432"
            disabled={!canEdit}
          />
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text style={{ color: "rgba(255,255,255,0.85)", display: "block" }}>Log Message Events</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Deletions, edits, and cross-posts</Text>
            </div>
            <DepthToggle checked={logMessages} onChange={setLogMessages} disabled={!canEdit} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text style={{ color: "rgba(255,255,255,0.85)", display: "block" }}>Log Moderation Actions</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Warns, mutes, kicks, bans, and appeals</Text>
            </div>
            <DepthToggle checked={logModeration} onChange={setLogModeration} disabled={!canEdit} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text style={{ color: "rgba(255,255,255,0.85)", display: "block" }}>Log Connection Events</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Server joins, leaves, and channel pauses</Text>
            </div>
            <DepthToggle checked={logConnections} onChange={setLogConnections} disabled={!canEdit} />
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
