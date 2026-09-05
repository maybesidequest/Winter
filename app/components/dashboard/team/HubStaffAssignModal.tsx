import { Modal } from "antd";
import { DashboardSelect } from "~/components/dashboard/shared";
import { HubSubjectSelector } from "~/components/dashboard/HubSubjectSelector";

interface RoleOption {
  metadata: { id: string };
  spec: { name: string; permissionsBitmask: number };
}

interface HubStaffAssignModalProps {
  open: boolean;
  hubId: string;
  userId: string;
  selectedRole: string;
  roles: RoleOption[];
  rolesLoading: boolean;
  rolesError: boolean;
  isPending: boolean;
  onUserIdChange: (userId: string) => void;
  onRoleChange: (role: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function HubStaffAssignModal({
  open,
  hubId,
  userId,
  selectedRole,
  roles,
  rolesLoading,
  rolesError,
  isPending,
  onUserIdChange,
  onRoleChange,
  onClose,
  onSubmit,
}: HubStaffAssignModalProps) {
  return (
    <Modal
      title="Assign Hub Staff Role"
      open={open}
      onOk={onSubmit}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Assign Member"
    >
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90" htmlFor="hub-staff-subject">
            Member
          </label>
          <HubSubjectSelector
            id="hub-staff-subject"
            hubId={hubId}
            value={userId}
            onChange={onUserIdChange}
            placeholder="Search by Discord name"
          />
          <span id="hub-staff-subject-help" className="text-xs text-white/60">
            Choose a named member from this Hub.
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90" htmlFor="hub-staff-role">
            Role
          </label>
          <DashboardSelect
            id="hub-staff-role"
            value={selectedRole || undefined}
            onChange={onRoleChange}
            placeholder="Select a role"
            disabled={rolesLoading || rolesError || roles.length === 0}
            className="w-full"
            options={roles.map((item) => ({ label: item.spec.name, value: item.spec.name }))}
          />
        </div>
      </div>
    </Modal>
  );
}

