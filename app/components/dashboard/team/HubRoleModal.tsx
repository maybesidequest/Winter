import { Modal } from "antd";
import { DepthToggle } from "~/components/dashboard/shared";

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

export function getPermissionLabels(bitmask: number): string[] {
  if (bitmask === 0) return ["No permissions"];
  const labels: string[] = [];
  for (const perm of HUB_ROLE_PERMISSIONS) {
    if ((bitmask & perm.bit) === perm.bit) {
      labels.push(perm.label);
    }
  }
  return labels.length > 0 ? labels : [`Bitmask: ${bitmask}`];
}

interface HubRoleModalProps {
  open: boolean;
  isEditing: boolean;
  roleName: string;
  roleBitmask: number;
  isPending: boolean;
  onRoleNameChange: (name: string) => void;
  onTogglePermission: (bit: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function HubRoleModal({
  open,
  isEditing,
  roleName,
  roleBitmask,
  isPending,
  onRoleNameChange,
  onTogglePermission,
  onClose,
  onSubmit,
}: HubRoleModalProps) {
  return (
    <Modal
      title={isEditing ? `Edit Role: ${roleName}` : "Create Hub Role"}
      open={open}
      confirmLoading={isPending}
      onCancel={onClose}
      onOk={onSubmit}
      okText={isEditing ? "Save Role" : "Create Role"}
      width={560}
    >
      <div className="flex flex-col gap-4 mt-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="hub-role-name-input" className="text-xs font-bold text-white/90">
            Role Name
          </label>
          <input
            id="hub-role-name-input"
            type="text"
            value={roleName}
            onChange={(e) => onRoleNameChange(e.target.value)}
            placeholder="e.g. Moderator, Assistant, Community Lead"
            className="dashboard-input text-sm min-h-[42px]"
            maxLength={64}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white/90">Role Permissions</label>
            <span className="text-xs text-violet-300 font-mono">Bitmask: {roleBitmask}</span>
          </div>
          <p className="text-xs text-white/60 m-0">
            Select the capabilities granted to members assigned this role.
          </p>

          <div className="flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#181726] p-1 mt-1">
            {HUB_ROLE_PERMISSIONS.map((perm) => {
              const checked = (roleBitmask & perm.bit) === perm.bit;
              return (
                <label
                  key={perm.key}
                  className="flex items-center justify-between p-2.5 hover:bg-[#1d1b2e] rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 pr-3">
                    <span className="text-xs font-semibold text-white/90">{perm.label}</span>
                    <span className="text-xs text-white/60">{perm.desc}</span>
                  </div>
                  <DepthToggle
                    checked={checked}
                    onChange={() => onTogglePermission(perm.bit)}
                    aria-label={perm.label}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

