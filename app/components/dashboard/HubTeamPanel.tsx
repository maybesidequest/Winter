import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Input, InputNumber, List, Modal, Select, Tag, Typography, message, Popconfirm } from "antd";
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
  const [role, setRole] = useState("");
  const [roleName, setRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState(2);
  const [editingRole, setEditingRole] = useState<(typeof roles)[number] | null>(null);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [editingRolePermissions, setEditingRolePermissions] = useState(0);
  const assignKeyRef = useRef(crypto.randomUUID());
  const createRoleKeyRef = useRef(crypto.randomUUID());
  const updateRoleKeyRef = useRef(crypto.randomUUID());
  const deleteRoleKeysRef = useRef(new Map<string, string>());
  const removeStaffKeysRef = useRef(new Map<string, string>());

  const { data: staff = [], isLoading: staffLoading, isError: staffError } = useQuery(
    orpc.hub.listStaff.queryOptions({ input: { hubId: hub.metadata.id } })
  );
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError } = useQuery(
    orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } }),
  );

  const assignMutation = useMutation(
    orpc.hub.assignStaffRole.mutationOptions({
      onSuccess: () => {
        message.success("Staff member assigned.");
        setModalOpen(false);
        setUserId("");
        assignKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listStaff.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to assign staff role."),
    })
  );

  const createRoleMutation = useMutation(
    orpc.hub.createRole.mutationOptions({
      onSuccess: () => {
        message.success("Role created.");
        setRoleName("");
        createRoleKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to create role."),
    }),
  );

  const deleteRoleMutation = useMutation(
    orpc.hub.deleteRole.mutationOptions({
      onSuccess: () => {
        message.success("Role deleted.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to delete role."),
    }),
  );

  const updateRoleMutation = useMutation(
    orpc.hub.updateRole.mutationOptions({
      onSuccess: () => {
        message.success("Role updated.");
        setEditingRole(null);
        updateRoleKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update role."),
    }),
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

  const keyFor = (keys: Map<string, string>, resourceId: string) => {
    const existing = keys.get(resourceId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    keys.set(resourceId, created);
    return created;
  };

  const handleAssign = () => {
    if (!userId.trim()) return message.error("User ID is required.");
    // Keep the dashboard assignment equivalent to the Bot's built-in role
    // templates. The Control Plane remains the authority for final validation.
    const selected = roles.find((item) => item.spec.name === role);
    if (!selected) return message.error("Select a valid Hub role.");
    assignMutation.mutate({
      hubId: hub.metadata.id,
      userId: userId.trim(),
      role,
      permissionsBitmask: selected.spec.permissionsBitmask,
      idempotencyKey: assignKeyRef.current,
    });
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Staff & Roles</DashboardSectionTitle>}
      extra={
        canEdit && !staffError && !rolesError && !rolesLoading && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="dashboard-btn-primary"
            onClick={() => {
              assignKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            Assign Staff
          </Button>
        )
      }
    >
      {canEdit && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="New role name" disabled={rolesLoading || rolesError} />
          <InputNumber min={0} value={rolePermissions} onChange={(value) => setRolePermissions(value ?? 0)} disabled={rolesLoading || rolesError} />
          <Button
            onClick={() => createRoleMutation.mutate({ hubId: hub.metadata.id, name: roleName.trim(), permissionsBitmask: rolePermissions, position: 0, idempotencyKey: createRoleKeyRef.current })}
            loading={createRoleMutation.isPending}
            disabled={rolesLoading || rolesError || !roleName.trim()}
          >
            Create role
          </Button>
        </div>
      )}
      {(staffError || rolesError) && (
        <Alert
          type="error"
          showIcon
          message="Team settings are temporarily unavailable."
          description="Refresh this page before making staff or role changes."
          style={{ marginBottom: 16 }}
        />
      )}
      <List
        loading={rolesLoading}
        size="small"
        dataSource={roles}
        locale={{ emptyText: "No roles available." }}
        renderItem={(item) => (
          <List.Item
            actions={canEdit && !item.status.protected ? [
              <Button
                key="edit-role"
                type="text"
                size="small"
                onClick={() => {
                  setEditingRole(item);
                  setEditingRoleName(item.spec.name);
                  setEditingRolePermissions(item.spec.permissionsBitmask);
                  updateRoleKeyRef.current = crypto.randomUUID();
                }}
              >
                Edit
              </Button>,
              <Popconfirm
                key="delete-role"
                title="Delete this role?"
                onConfirm={() =>
                  deleteRoleMutation.mutate(
                    { hubId: hub.metadata.id, roleId: item.metadata.id, expectedVersion: item.version, idempotencyKey: keyFor(deleteRoleKeysRef.current, item.metadata.id) },
                    { onSuccess: () => deleteRoleKeysRef.current.delete(item.metadata.id) },
                  )
                }
              >
                <Button type="text" danger size="small">Delete</Button>
              </Popconfirm>,
            ] : []}
          >
            <Tag>{item.spec.name}</Tag>
            <Text type="secondary">{item.spec.permissionsBitmask} · {item.status.memberCount} members</Text>
          </List.Item>
        )}
      />
      <Modal
        title="Edit Hub role"
        open={Boolean(editingRole)}
        confirmLoading={updateRoleMutation.isPending}
        onCancel={() => setEditingRole(null)}
        onOk={() => {
          if (!editingRole) return;
          updateRoleMutation.mutate({
            hubId: hub.metadata.id,
            roleId: editingRole.metadata.id,
            name: editingRoleName,
            permissionsBitmask: editingRolePermissions,
            position: editingRole.spec.position,
            expectedVersion: editingRole.version,
            idempotencyKey: updateRoleKeyRef.current,
          });
        }}
      >
        <Input value={editingRoleName} onChange={(e) => setEditingRoleName(e.target.value)} />
        <InputNumber min={0} value={editingRolePermissions} onChange={(value) => setEditingRolePermissions(value ?? 0)} style={{ marginTop: 12, width: "100%" }} />
      </Modal>
      <List
        loading={staffLoading}
        dataSource={staff}
        locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.4)" }}>No staff roles assigned.</Text> }}
        renderItem={(item) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit && !staffError && !rolesError
                ? [
                    <Popconfirm
                      key="del"
                      title="Remove this staff member?"
                      onConfirm={() =>
                        removeMutation.mutate(
                          {
                            hubId: hub.metadata.id,
                            userId: item.metadata.userId,
                            idempotencyKey: keyFor(removeStaffKeysRef.current, item.metadata.userId),
                          },
                          { onSuccess: () => removeStaffKeysRef.current.delete(item.metadata.userId) },
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
              value={role || undefined}
              onChange={setRole}
              placeholder="Select a Hub role"
              disabled={rolesLoading || rolesError || roles.length === 0}
              style={{ width: "100%" }}
              options={[
                ...roles.map((item) => ({ label: item.spec.name, value: item.spec.name })),
              ]}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
