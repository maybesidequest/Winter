import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { DashboardSelect } from "./DashboardSelect";
import { HubSubjectSelector } from "./HubSubjectSelector";

export interface HubLogStreamCardProps {
  streamKey: string;
  title: string;
  description: string;
  category: "moderation" | "community" | "security";
  icon: ReactNode;
  channelId?: string;
  roleId?: string;
  selectedServerId: string;
  connectedServers: Array<{ id: string; name: string }>;
  canEdit: boolean;
  disabled?: boolean;
  onServerChange: (serverId: string) => void;
  onChannelChange: (channelId: string) => void;
  onRoleChange: (roleId: string) => void;
  onClear: () => void;
}

export function HubLogStreamCard({
  streamKey,
  title,
  description,
  icon,
  channelId,
  roleId,
  selectedServerId,
  connectedServers,
  canEdit,
  disabled = false,
  onServerChange,
  onChannelChange,
  onRoleChange,
  onClear,
}: HubLogStreamCardProps) {
  const isConfigured = Boolean(channelId && channelId.trim().length > 0);
  const serverOptions = useMemo(
    () => connectedServers.map((s) => ({ value: s.id, label: s.name })),
    [connectedServers]
  );

  return (
    <div className="dashboard-subcard p-4 flex flex-col gap-3.5 transition-colors hover:border-white/[0.12]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 shrink-0">
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="m-0 text-sm font-bold text-white font-['Sora'] tracking-tight">{title}</h3>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircleOutlined className="text-xs" /> Configured
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] text-white/40 border border-white/[0.08]">
                  Not Configured
                </span>
              )}
            </div>
            <p className="m-0 text-xs text-white/60 leading-relaxed max-w-prose mt-0.5">{description}</p>
          </div>
        </div>

        {isConfigured && canEdit && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="dashboard-btn-secondary px-2.5 py-1 text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer hover:text-red-400 shrink-0"
            title={`Clear ${title} destination`}
            aria-label={`Clear ${title}`}
          >
            <DeleteOutlined className="text-xs" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/[0.04]">
        {connectedServers.length > 1 && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70" htmlFor={`${streamKey}-server`}>
              Source Server
            </label>
            <DashboardSelect
              id={`${streamKey}-server`}
              aria-label={`${title} server`}
              value={selectedServerId}
              onChange={onServerChange}
              options={serverOptions}
              disabled={disabled || !canEdit || connectedServers.length === 0}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70" htmlFor={`${streamKey}-channel`}>
            Discord Channel
          </label>
          <HubSubjectSelector
            id={`${streamKey}-channel`}
            hubId={selectedServerId}
            selectorType="SELECTOR_TYPE_CHANNEL"
            value={channelId || ""}
            onChange={onChannelChange}
            placeholder="Search channels by name"
            disabled={disabled || !canEdit || !selectedServerId}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70" htmlFor={`${streamKey}-role`}>
            Staff Role (Optional)
          </label>
          <HubSubjectSelector
            id={`${streamKey}-role`}
            hubId={selectedServerId}
            selectorType="SELECTOR_TYPE_ROLE"
            value={roleId || ""}
            onChange={onRoleChange}
            placeholder="Search roles to ping"
            disabled={disabled || !canEdit || !selectedServerId}
          />
        </div>
      </div>
    </div>
  );
}

