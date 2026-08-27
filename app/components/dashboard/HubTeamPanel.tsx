import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, List, message, Modal, Popconfirm, Select, Tag, Typography } from "antd";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardSectionCard, DashboardSectionTitle, DepthToggle } from "./shared";

const { Text } = Typography;

export const HUB_ROLE_PERMISSIONS = [
  { key: "MANAGE_HUB_SETTINGS", label: "Manage Settings", desc: "Edit Hub branding, bio, and modules", bit: 1 },
  { key: "MODERATE_MESSAGES", label: "Moderate Messages", desc: "Warn members and moderate relayed chat", bit: 2 },
  { key: "MANAGE_CONNECTIONS", label: "Manage Bridges", desc: "Pause, resume, or disconnect Discord servers", bit: 4 },
  { key: "MANAGE_MODERATORS", label: "Manage Staff", desc: "Assign or modify roles and team access", bit: 8 },
  { key: "MANAGE_RULES", label: "Manage Rules", desc: "Create, edit, reorder, and remove hub rules", bit: 16 },
  { key: "VIEW_ANALYTICS", label: "View Analytics", desc: "View message volume and bridge statistics", bit: 32 },
  { key: "VIEW_LOGS", label: "View Logs & Audit", desc: "Access audit history and log channels", bit: 64 },
  { key: "MANAGE_BANS", label: "Manage Bans", desc: "Ban and unban users across connected channels", bit: 128 },
  { key: "ANNOUNCE", label: "Broadcast Announcements", desc: "Send cross-server announcements", bit: 4096 },
  { key: "LOCKDOWN_HUB", label: "Lockdown Hub", desc: "Emergency freeze on all bridge message traffic", bit: 8192 },
  { key: "MANAGE_INVITES", label: "Manage Invites", desc: "Create and revoke server invite codes", bit: 16384 },
] as const;

function getPermissionLabels(bitmask: number): string[] {
  if (bitmask === 0) return ["No permissions"];
  const labels: string[] = [];
  for (const perm of HUB_ROLE_PERMISSIONS) {
    if ((bitmask & perm.bit) === perm.bit) {
      labels.push(perm.label);
    }
  }
  return labels.length > 0 ? labels : [`Bitmask: ${bitmask}`];
}

interface HubTeamPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubTeamPanel({ hub, canEdit }: HubTeamPanelProps) {
  const queryClient = useQueryClient();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [roleName, setRoleName] = useState("");
  const [roleBitmask, setRoleBitmask] = useState(2);
  const [editingRole, setEditingRole] = useState<(typeof roles)[number] | null>(null);

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
        setAssignModalOpen(false);
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
        message.success("Role created successfully.");
        setRoleModalOpen(false);
        setRoleName("");
        setRoleBitmask(2);
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
        setRoleModalOpen(false);
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
    const found = roles.find((item) => item.spec.name === selectedRole);
    if (!found) return message.error("Select a valid Hub role.");
    assignMutation.mutate({
      hubId: hub.metadata.id,
      userId: userId.trim(),
      role: selectedRole,
      permissionsBitmask: found.spec.permissionsBitmask,
      roleId: found.metadata.id,
      expectedVersion: hub.version,
      idempotencyKey: assignKeyRef.current,
    });
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) return message.error("Role name is required.");
    if (editingRole) {
      updateRoleMutation.mutate({
        hubId: hub.metadata.id,
        roleId: editingRole.metadata.id,
        name: roleName.trim(),
        permissionsBitmask: roleBitmask,
        position: editingRole.spec.position,
        expectedVersion: editingRole.version,
        idempotencyKey: updateRoleKeyRef.current,
      });
    } else {
      createRoleMutation.mutate({
        hubId: hub.metadata.id,
        name: roleName.trim(),
        permissionsBitmask: roleBitmask,
        position: 0,
        idempotencyKey: createRoleKeyRef.current,
      });
    }
  };

  const togglePermission = (bit: number) => {
    setRoleBitmask((prev) => ((prev & bit) === bit ? prev & ~bit : prev | bit));
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Staff & Roles</DashboardSectionTitle>}
      extra={
        canEdit && !staffError && !rolesError && !rolesLoading && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingRole(null);
                setRoleName("");
                setRoleBitmask(2);
                createRoleKeyRef.current = crypto.randomUUID();
                setRoleModalOpen(true);
              }}
              className="dashboard-btn-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <SafetyCertificateOutlined />
              <span>Create Role</span>
            </button>
            <button
              type="button"
              onClick={() => {
                assignKeyRef.current = crypto.randomUUID();
                setAssignModalOpen(true);
              }}
              className="dashboard-btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusOutlined />
              <span>Assign Staff</span>
            </button>
          </div>
        )
      }
    >
      {(staffError || rolesError) && (
        <Alert
          type="error"
          showIcon
          message="Team settings are temporarily unavailable."
          description="Refresh this page before making staff or role changes."
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Roles Section */}
      <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/90 tracking-wide uppercase">Configured Roles</span>
          <span className="text-[11px] text-white/60">{roles.length} available</span>
        </div>

        <List
          loading={rolesLoading}
          size="small"
          dataSource={roles}
          locale={{ emptyText: <span className="text-xs text-white/60">No roles configured.</span> }}
          renderItem={(item) => {
            const grantedLabels = getPermissionLabels(item.spec.permissionsBitmask);
            return (
              <List.Item
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                actions={
                  canEdit && !item.status.protected
                    ? [
                      <Button
                        key="edit-role"
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        style={{ color: "rgba(255,255,255,0.7)" }}
                        onClick={() => {
                          setEditingRole(item);
                          setRoleName(item.spec.name);
                          setRoleBitmask(item.spec.permissionsBitmask);
                          updateRoleKeyRef.current = crypto.randomUUID();
                          setRoleModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        key="delete-role"
                        title="Delete this role?"
                        onConfirm={() =>
                          deleteRoleMutation.mutate(
                            {
                              hubId: hub.metadata.id,
                              roleId: item.metadata.id,
                              expectedVersion: item.version,
                              idempotencyKey: keyFor(deleteRoleKeysRef.current, item.metadata.id),
                            },
                            { onSuccess: () => deleteRoleKeysRef.current.delete(item.metadata.id) },
                          )
                        }
                      >
                        <Button type="text" danger size="small" icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]
                    : []
                }
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <Tag color="purple" style={{ margin: 0, fontWeight: 600 }}>
                      {item.spec.name}
                    </Tag>
                    {item.status.protected && (
                      <span className="text-[10px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">
                        System Protected
                      </span>
                    )}
                    <span className="text-xs text-white/60">
                      · {item.status.memberCount} {item.status.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {grantedLabels.slice(0, 4).map((label) => (
                      <span
                        key={label}
                        className="text-[10px] bg-white/[0.04] text-white/70 px-2 py-0.5 rounded-md border border-white/[0.04]"
                      >
                        {label}
                      </span>
                    ))}
                    {grantedLabels.length > 4 && (
                      <span className="text-[10px] text-white/50 bg-white/[0.02] px-1.5 py-0.5 rounded">
                        +{grantedLabels.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      {/* Staff Assignments Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/90 tracking-wide uppercase">Staff Assignments</span>
          <span className="text-[11px] text-white/60">{staff.length} active</span>
        </div>

        <List
          loading={staffLoading}
          dataSource={staff}
          locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.6)" }}>No staff roles assigned.</Text> }}
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
                            expectedVersion: hub.version,
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
                    <Tag color={item.spec.role === "OWNER" ? "gold" : item.spec.role === "MANAGER" ? "purple" : "cyan"}>
                      {item.spec.role}
                    </Tag>
                  </div>
                }
                description={
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                    Assigned by {item.spec.assignedBy || "System"}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Role Creation / Editing Modal with Permissions Matrix */}
      <Modal
        title={editingRole ? `Edit Role: ${editingRole.spec.name}` : "Create Hub Role"}
        open={roleModalOpen}
        confirmLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
        onCancel={() => setRoleModalOpen(false)}
        onOk={handleSaveRole}
        okText={editingRole ? "Save Role" : "Create Role"}
        width={560}
      >
        <div className="flex flex-col gap-4 mt-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Moderator, Assistant, Community Lead"
              className="dashboard-input text-xs"
              maxLength={64}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/90">Role Permissions</label>
              <span className="text-[11px] text-violet-300 font-mono">Bitmask: {roleBitmask}</span>
            </div>
            <p className="text-[11px] text-white/60 m-0">
              Select the capabilities granted to members assigned this role.
            </p>

            <div className="flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 mt-1">
              {HUB_ROLE_PERMISSIONS.map((perm) => {
                const checked = (roleBitmask & perm.bit) === perm.bit;
                return (
                  <label
                    key={perm.key}
                    className="flex items-center justify-between p-2.5 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5 pr-3">
                      <span className="text-xs font-semibold text-white/90">{perm.label}</span>
                      <span className="text-[11px] text-white/60">{perm.desc}</span>
                    </div>
                    <DepthToggle
                      checked={checked}
                      onChange={() => togglePermission(perm.bit)}
                      aria-label={perm.label}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Staff Assignment Modal */}
      <Modal
        title="Assign Hub Staff Role"
        open={assignModalOpen}
        onOk={handleAssign}
        onCancel={() => setAssignModalOpen(false)}
        confirmLoading={assignMutation.isPending}
        okText="Assign Member"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Discord User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. 123456789012345678"
              className="dashboard-input text-xs"
            />
            <span className="text-[11px] text-white/60">Enter the member's numeric Discord snowflake ID.</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Role</label>
            <Select
              value={selectedRole || undefined}
              onChange={setSelectedRole}
              placeholder="Select a role"
              disabled={rolesLoading || rolesError || roles.length === 0}
              style={{ width: "100%" }}
              options={roles.map((item) => ({ label: item.spec.name, value: item.spec.name }))}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
