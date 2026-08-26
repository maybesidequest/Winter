import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, List, Modal, Typography, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Paragraph, Text } = Typography;

interface HubAnnouncementsPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubAnnouncementsPanel({ hub, canEdit }: HubAnnouncementsPanelProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState("");
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
        setContent("");
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
        setContent("");
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

  const deleteKeyFor = (announcementId: string) => {
    const existing = deleteKeysRef.current.get(announcementId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    deleteKeysRef.current.set(announcementId, created);
    return created;
  };

  const handleSubmit = () => {
    if (!content.trim()) return message.error("Content cannot be empty.");
    if (editingId) {
      updateMutation.mutate({
        hubId: hub.metadata.id,
        announcementId: editingId,
        content: content.trim(),
        idempotencyKey: updateKeyRef.current,
      });
    } else {
      createMutation.mutate({
        hubId: hub.metadata.id,
        content: content.trim(),
        idempotencyKey: createKeyRef.current,
      });
    }
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Announcements</DashboardSectionTitle>}
      extra={
        canEdit && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="dashboard-btn-primary"
            disabled={isLoading || isError}
            onClick={() => {
              setEditingId(null);
              setContent("");
              createKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            New Announcement
          </Button>
        )
      }
    >
      {isError && <Text type="danger">Announcements are temporarily unavailable. Try again before making changes.</Text>}
      <List
        loading={isLoading}
        dataSource={announcements}
        locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.4)" }}>No announcements yet.</Text> }}
        renderItem={(item) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit
                ? [
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onClick={() => {
                        setEditingId(item.id);
                        setContent(item.content);
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
                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  Posted {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </Text>
              }
              description={
                <Paragraph style={{ color: "rgba(255,255,255,0.85)", margin: 0, whiteSpace: "pre-wrap" }}>
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
        <div style={{ marginTop: 16 }}>
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement to all connected servers..."
            rows={5}
            maxLength={2000}
          />
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
