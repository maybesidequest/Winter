import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export interface PermissionDef {
  name: string;
  desc: string;
  bit: number;
}

export const REQUIRED_PERMISSIONS: PermissionDef[] = [
  { name: "Manage Webhooks", desc: "Required for cross-server message bridging and Userphone", bit: 1 << 29 },
  { name: "Manage Messages", desc: "Required for automod deletion and moderation panel commands", bit: 1 << 13 },
  { name: "View Channels", desc: "Required for bot responsiveness and command handling", bit: 1 << 10 },
  { name: "Send Messages", desc: "Required for bot responsiveness and command handling", bit: 1 << 11 },
  { name: "Embed Links & Attach Files", desc: "Required for rich card rendering and attachment relay", bit: (1 << 14) | (1 << 15) },
];

export interface ServerPermissionsGridProps {
  botPermissions: number;
  permissionsKnown: boolean;
}

export function ServerPermissionsGrid({ botPermissions, permissionsKnown }: ServerPermissionsGridProps) {
  return (
    <div
      className="p-6 rounded-2xl border flex flex-col gap-4"
      style={dashboardGlassCardStyle}
    >
      <div>
        <h3 className="text-sm font-bold text-white font-['Sora']">
          Required Discord Permissions
        </h3>
        <p className="text-xs text-white/70 mt-0.5">
          Verified permissions for InterChat bot inside this Discord server
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REQUIRED_PERMISSIONS.map((perm) => {
          const hasPerm = permissionsKnown && (botPermissions & perm.bit) === perm.bit;
          const isMissing = permissionsKnown && !hasPerm;

          return (
            <div
              key={perm.name}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${hasPerm
                ? "bg-emerald-500/[0.04] border-emerald-500/20"
                : isMissing
                  ? "bg-amber-500/[0.04] border-amber-500/20"
                  : "bg-white/[0.03] border-white/[0.06]"
                }`}
            >
              {hasPerm ? (
                <CheckCircleOutlined className="text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : isMissing ? (
                <ExclamationCircleOutlined className="text-amber-400 mt-0.5 flex-shrink-0" />
              ) : (
                <ExclamationCircleOutlined className="text-white/40 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">{perm.name}</span>
                <span className="text-xs text-white/70">
                  {permissionsKnown
                    ? hasPerm
                      ? `Granted. ${perm.desc}`
                      : `Missing. ${perm.desc}`
                    : "Permission status not available."}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

