import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, List, Modal, Select, Tag, Typography, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Text } = Typography;

interface HubTeamPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubTeamPanel({ hub, canEdit }: HubTeamPanelProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MODERATOR");

  const { data: staff = [], isLoading } = useQuery(
    orpc.hub.listStaff.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const assignMutation = useMutation(
    orpc.hub.assignStaffRole.mutationOptions({
      onSuccess: () => {
        message.success("Staff member assigned.");
        setModalOpen(false);
        setUserId("");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listStaff.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to assign staff role."),
    })
  );

  const removeMutation = useMutation(
    orpc.hub.removeStaffRole.mutationOptions({
      onSuccess: () => {
        message.success("Staff role removed.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listStaff.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to remove staff role."),
    })
  );

  const handleAssign = () => {
    if (!userId.trim()) return message.error("User ID is required.");
    // Keep the dashboard assignment equivalent to the Bot's built-in role
    // templates. The Control Plane remains the authority for final validation.
    const bitmask = role === "MANAGER" ? 3839 : 1535;
    assignMutation.mutate({
      hubId: hub.metadata.id,
      userId: userId.trim(),
      role,
      permissionsBitmask: bitmask,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Staff & Roles</DashboardSectionTitle>}
      extra={
        canEdit && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="dashboard-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Assign Staff
          </Button>
        )
      }
    >
      <List
        loading={isLoading}
        dataSource={staff}
        locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.4)" }}>No staff roles assigned.</Text> }}
        renderItem={(item) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit
                ? [
                    <Popconfirm
                      key="del"
                      title="Remove this staff member?"
                      onConfirm={() =>
                        removeMutation.mutate({
                          hubId: hub.metadata.id,
                          userId: item.metadata.userId,
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
              avatar={<UserOutlined style={{ color: "#a897ea", fontSize: 20, marginTop: 4 }} />}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                    User ID: {item.metadata.userId}
                  </Text>
                  <Tag color={item.spec.role === "OWNER" ? "gold" : (item.spec.role === "MANAGER" ? "purple" : "cyan")}>
                    {item.spec.role}
                  </Tag>
                </div>
              }
              description={
                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  Assigned by {item.spec.assignedBy || "System"}
                </Text>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Assign Hub Staff Role"
        open={modalOpen}
        onOk={handleAssign}
        onCancel={() => setModalOpen(false)}
        confirmLoading={assignMutation.isPending}
        okText="Assign"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Discord User ID
            </Text>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. 123456789012345678"
            />
          </div>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Role Tier
            </Text>
            <Select
              value={role}
              onChange={setRole}
              style={{ width: "100%" }}
              options={[
                { label: "Moderator (Manage Messages & Sanctions)", value: "MODERATOR" },
                { label: "Manager (Manage Hub Settings & Invites)", value: "MANAGER" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
