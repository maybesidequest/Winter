import { DeleteOutlined, EditOutlined, PauseOutlined, PlayCircleOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, List, message, Modal, Popconfirm, Typography } from "antd";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardReadOnlyNotice, DashboardSectionCard, DashboardSectionTitle } from "./shared";

const { Paragraph, Text } = Typography;

interface HubAnnouncementsPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubAnnouncementsPanel({ hub, canEdit }: HubAnnouncementsPanelProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("Announcement");
  const [content, setContent] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState(0);
  const [desiredState, setDesiredState] = useState<"DRAFT" | "SCHEDULED" | "PAUSED">("DRAFT");
  const createKeyRef = useRef(crypto.randomUUID());
  const updateKeyRef = useRef(crypto.randomUUID());
  const deleteKeysRef = useRef(new Map<string, string>());

  const { data: announcements = [], isLoading, isError } = useQuery(
    orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const createMutation = useMutation(
    orpc.hub.createAnnouncement.mutationOptions({
      onSuccess: () => {
        message.success("Announcement queued for delivery.");
        setModalOpen(false);
        setTitle("Announcement");
        setContent("");
        setScheduledFor("");
        setRepeatIntervalMinutes(0);
        setDesiredState("DRAFT");
        createKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to create announcement."),
    })
  );

  const updateMutation = useMutation(
    orpc.hub.updateAnnouncement.mutationOptions({
      onSuccess: () => {
        message.success("Announcement updated.");
        setModalOpen(false);
        setEditingId(null);
        setTitle("Announcement");
        setContent("");
        setScheduledFor("");
        setRepeatIntervalMinutes(0);
        setDesiredState("DRAFT");
        updateKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update announcement."),
    })
  );

  const deleteMutation = useMutation(
    orpc.hub.deleteAnnouncement.mutationOptions({
      onSuccess: () => {
        message.success("Announcement deleted.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to delete announcement."),
    })
  );

  const transitionMutation = useMutation(
    orpc.hub.transitionAnnouncement.mutationOptions({
      onSuccess: () => {
        message.success("Announcement state updated.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listAnnouncements.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update announcement state."),
    }),
  );

  const deleteKeyFor = (announcementId: string) => {
    const existing = deleteKeysRef.current.get(announcementId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    deleteKeysRef.current.set(announcementId, created);
    return created;
  };

  const handleSubmit = () => {
    if (content.trim().length < 3) return message.error("Content must be at least 3 characters.");
    const schedule = scheduledFor ? new Date(scheduledFor).toISOString() : undefined;
    const nextState = schedule ? desiredState : "DRAFT";
    if (editingId) {
      const current = announcements.find((item) => item.id === editingId);
      if (!current) return message.error("Refresh before editing this announcement.");
      updateMutation.mutate({
        hubId: hub.metadata.id,
        announcementId: editingId,
        content: content.trim(),
        title: title.trim(),
        scheduledFor: schedule,
        repeatIntervalSeconds: repeatIntervalMinutes * 60,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        desiredState: nextState,
        expectedVersion: current.version,
        idempotencyKey: updateKeyRef.current,
      });
    } else {
      createMutation.mutate({
        hubId: hub.metadata.id,
        content: content.trim(),
        title: title.trim(),
        scheduledFor: schedule,
        repeatIntervalSeconds: repeatIntervalMinutes * 60,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        desiredState: nextState,
        idempotencyKey: createKeyRef.current,
      });
    }
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Announcements</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={isLoading || isError}
            onClick={() => {
              setEditingId(null);
              setTitle("Announcement");
              setContent("");
              setScheduledFor("");
              setRepeatIntervalMinutes(0);
              setDesiredState("DRAFT");
              createKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            <PlusOutlined />
            <span>New Announcement</span>
          </button>
        )
      }
    >
      {!canEdit && <DashboardReadOnlyNotice message="Only staff with announcement access can publish changes." />}
      {isError && <span className="text-xs text-red-300">Announcements are temporarily unavailable. Try again before making changes.</span>}
      <List
        loading={isLoading}
        dataSource={announcements}
        locale={{ emptyText: <span className="text-xs text-white/60">No announcements posted yet.</span> }}
        renderItem={(item) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit
                ? [
                  ...(item.desiredState !== "DRAFT" ? [
                    <Button
                      key="state"
                      type="text"
                      icon={item.desiredState === "SCHEDULED" ? <PauseOutlined /> : <PlayCircleOutlined />}
                      size="small"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                      onClick={() => transitionMutation.mutate({
                        hubId: hub.metadata.id,
                        announcementId: item.id,
                        desiredState: item.desiredState === "SCHEDULED" ? "PAUSED" : "SCHEDULED",
                        expectedVersion: item.version,
                        idempotencyKey: crypto.randomUUID(),
                      })}
                    />,
                  ] : []),
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    onClick={() => {
                      setEditingId(item.id);
                      setTitle(item.title);
                      setContent(item.content);
                      setScheduledFor(item.nextDelivery ? new Date(item.nextDelivery).toISOString().slice(0, 16) : "");
                      setRepeatIntervalMinutes(Math.floor(item.repeatIntervalSeconds / 60));
                      setDesiredState(item.desiredState);
                      updateKeyRef.current = crypto.randomUUID();
                      setModalOpen(true);
                    }}
                  />,
                  <Popconfirm
                    key="del"
                    title="Delete this announcement?"
                    onConfirm={() =>
                      deleteMutation.mutate(
                        {
                          hubId: hub.metadata.id,
                          announcementId: item.id,
                          expectedVersion: item.version,
                          idempotencyKey: deleteKeyFor(item.id),
                        },
                        { onSuccess: () => deleteKeysRef.current.delete(item.id) },
                      )
                    }
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>,
                ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<SendOutlined style={{ color: "#8175ee", fontSize: 18, marginTop: 4 }} />}
              title={
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                  {item.desiredState} · {item.deliveryState} · {item.nextDelivery ? `Next ${new Date(item.nextDelivery).toLocaleString()}` : "No next run"}
                </Text>
              }
              description={
                <Paragraph style={{ color: "rgba(255,255,255,0.9)", margin: 0, whiteSpace: "pre-wrap" }}>
                  {item.content}
                </Paragraph>
              }
            />
          </List.Item>
        )}
      />

          <Modal
        title={editingId ? "Edit Announcement" : "Create Announcement"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingId ? "Update" : "Broadcast"}
      >
        <div className="mt-4 flex flex-col gap-2">
          <label className="text-xs font-bold text-white/90">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="dashboard-input text-xs" />
          <label className="text-xs font-bold text-white/90">Announcement Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement to all connected servers..."
            rows={5}
            maxLength={2000}
            className="dashboard-textarea text-xs"
          />
          <label className="text-xs font-bold text-white/90">First delivery (optional)</label>
          <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="dashboard-input text-xs" />
          <label className="text-xs font-bold text-white/90">Repeat interval (minutes, 0 = one-time)</label>
          <input type="number" min={0} max={525600} value={repeatIntervalMinutes} onChange={(e) => setRepeatIntervalMinutes(Number(e.target.value))} className="dashboard-input text-xs" />
          <label className="text-xs font-bold text-white/90">Desired state</label>
          <select value={desiredState} onChange={(e) => setDesiredState(e.target.value as typeof desiredState)} className="dashboard-input text-xs">
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
