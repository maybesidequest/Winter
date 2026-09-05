import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, message, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import { getPermissionLabels, HubRoleModal } from "./team/HubRoleModal";
import { HubStaffAssignModal } from "./team/HubStaffAssignModal";

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
    orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } })
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
    })
  );

  const deleteRoleMutation = useMutation(
    orpc.hub.deleteRole.mutationOptions({
      onSuccess: () => {
        message.success("Role deleted.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRoles.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to delete role."),
    })
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

  const keyFor = (keys: Map<string, string>, resourceId: string) => {
    const existing = keys.get(resourceId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    keys.set(resourceId, created);
    return created;
  };

  const handleAssign = () => {
    if (!userId.trim()) return message.error("Choose a named member.");
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
              className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
          <span className="text-xs text-white/60">{roles.length} available</span>
        </div>

        {rolesLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse h-16" />
            ))}
          </div>
        ) : roles.length > 0 ? (
          <div className="flex flex-col gap-2">
            {roles.map((item) => {
              const grantedLabels = getPermissionLabels(item.spec.permissionsBitmask);
              return (
                <div
                  key={item.metadata.id}
                  className="dashboard-subcard p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-[#1d1b2e]"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#c4b5fd] bg-violet-500/15 px-2 py-0.5 rounded border border-violet-500/30">
                        {item.spec.name}
                      </span>
                      {item.status.protected && (
                        <span className="text-xs text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-medium">
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
                          className="text-xs bg-white/[0.04] text-white/70 px-2 py-0.5 rounded-md border border-white/[0.04]"
                        >
                          {label}
                        </span>
                      ))}
                      {grantedLabels.length > 4 && (
                        <span className="text-xs text-white/50 bg-white/[0.02] px-1.5 py-0.5 rounded">
                          +{grantedLabels.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {canEdit && !item.status.protected && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        className="dashboard-btn-secondary px-2.5 py-1 text-xs font-semibold"
                        onClick={() => {
                          setEditingRole(item);
                          setRoleName(item.spec.name);
                          setRoleBitmask(item.spec.permissionsBitmask);
                          updateRoleKeyRef.current = crypto.randomUUID();
                          setRoleModalOpen(true);
                        }}
                      >
                        <EditOutlined />
                        <span>Edit</span>
                      </button>
                      <Popconfirm
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
                        <button
                          type="button"
                          className="dashboard-btn-danger px-2.5 py-1 text-xs font-semibold"
                        >
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-xs text-white/60">No roles configured.</span>
        )}
      </div>

      {/* Staff Assignments Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/90 tracking-wide uppercase">Staff Assignments</span>
          <span className="text-xs text-white/60">{staff.length} active</span>
        </div>

        {staffLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse h-16" />
            ))}
          </div>
        ) : staff.length > 0 ? (
          <div className="flex flex-col gap-2">
            {staff.map((item) => (
              <div
                key={item.metadata.userId}
                className="dashboard-subcard p-3.5 rounded-xl flex items-center justify-between gap-3 transition-colors hover:bg-[#1d1b2e]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/30 flex items-center justify-center text-xs text-violet-200 flex-shrink-0 shadow-[0_1.5px_0_0_#5b4ccb]">
                    <UserOutlined />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate font-['Sora']">
                        Staff member
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          item.spec.role === "OWNER"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : item.spec.role === "MANAGER"
                            ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                            : "bg-sky-500/15 text-sky-300 border-sky-500/30"
                        }`}
                      >
                        {item.spec.role}
                      </span>
                    </div>
                    <span className="text-xs text-white/50 truncate mt-0.5">
                      Assigned by {item.spec.assignedBy || "System"}
                    </span>
                  </div>
                </div>

                {canEdit && !staffError && !rolesError && (
                  <Popconfirm
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
                    <button
                      type="button"
                      className="dashboard-btn-danger px-2.5 py-1 text-xs font-semibold"
                      title="Remove staff member"
                    >
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-white/60">No staff roles assigned.</span>
        )}
      </div>

      <HubRoleModal
        open={roleModalOpen}
        isEditing={Boolean(editingRole)}
        roleName={roleName}
        roleBitmask={roleBitmask}
        isPending={createRoleMutation.isPending || updateRoleMutation.isPending}
        onRoleNameChange={setRoleName}
        onTogglePermission={togglePermission}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleSaveRole}
      />

      <HubStaffAssignModal
        open={assignModalOpen}
        hubId={hub.metadata.id}
        userId={userId}
        selectedRole={selectedRole}
        roles={roles}
        rolesLoading={rolesLoading}
        rolesError={Boolean(rolesError)}
        isPending={assignMutation.isPending}
        onUserIdChange={setUserId}
        onRoleChange={setSelectedRole}
        onClose={() => setAssignModalOpen(false)}
        onSubmit={handleAssign}
      />
    </DashboardSectionCard>
  );
}
