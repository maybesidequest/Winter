import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, InputNumber, List, Modal, Typography, message, Popconfirm, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Text } = Typography;

interface HubInvitesPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubInvitesPanel({ hub, canEdit }: HubInvitesPanelProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [maxUses, setMaxUses] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(86400);

  const { data: invites = [], isLoading } = useQuery(
    orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const createMutation = useMutation(
    orpc.hub.createInvite.mutationOptions({
      onSuccess: () => {
        message.success("Invite created successfully.");
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to create invite."),
    })
  );

  const revokeMutation = useMutation(
    orpc.hub.revokeInvite.mutationOptions({
      onSuccess: () => {
        message.success("Invite revoked.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listInvites.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to revoke invite."),
    })
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success("Invite code copied to clipboard!");
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Invites</DashboardSectionTitle>}
      extra={
        canEdit && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="dashboard-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Create Invite
          </Button>
        )
      }
    >
      <List
        loading={isLoading}
        dataSource={invites}
        locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.4)" }}>No active invites.</Text> }}
        renderItem={(item) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit
                ? [
                    <Button
                      key="copy"
                      type="text"
                      icon={<CopyOutlined />}
                      size="small"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onClick={() => handleCopy(item.code)}
                    />,
                    <Popconfirm
                      key="del"
                      title="Revoke this invite code?"
                      onConfirm={() =>
                        revokeMutation.mutate({
                          hubId: hub.metadata.id,
                          inviteCode: item.code,
                          idempotencyKey: crypto.randomUUID(),
                        })
                      }
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text code style={{ color: "#a897ea" }}>{item.code}</Text>
                  <Tag color={item.maxUses > 0 && item.uses >= item.maxUses ? "red" : "blue"}>
                    {item.uses} / {item.maxUses > 0 ? item.maxUses : "∞"} uses
                  </Tag>
                </div>
              }
              description={
                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  Expires: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}
                </Text>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Create Hub Invite"
        open={modalOpen}
        onOk={() =>
          createMutation.mutate({
            hubId: hub.metadata.id,
            maxUses,
            durationSeconds,
            idempotencyKey: crypto.randomUUID(),
          })
        }
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending}
        okText="Generate"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Max Uses (0 = unlimited)
            </Text>
            <InputNumber
              value={maxUses}
              onChange={(val) => setMaxUses(val || 0)}
              min={0}
              max={1000}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Duration in Seconds (0 = never expires)
            </Text>
            <InputNumber
              value={durationSeconds}
              onChange={(val) => setDurationSeconds(val || 0)}
              min={0}
              step={3600}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}

