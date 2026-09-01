import {
  DeleteOutlined,
  LockOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import { HubSubjectSelector } from "~/components/dashboard/HubSubjectSelector";
import {
  isExactHubNameConfirmation,
  type LifecycleAction,
  type LifecycleRecovery,
} from "~/services/lifecycleIntent";

export interface LifecycleFailure {
  action: LifecycleAction;
  recovery: LifecycleRecovery;
  message: string;
}

interface HubLifecyclePanelProps {
  hubId: string;
  hubName: string;
  locked: boolean;
  isOwner: boolean;
  canLockdown: boolean;
  pendingAction?: LifecycleAction;
  failure?: LifecycleFailure;
  onLockdown: (locked: boolean, reason: string) => void;
  onTransferOwnership: (newOwnerId: string) => void;
  onDeleteHub: (confirmationName: string) => void;
  onRefresh: () => void;
  onRetry: () => void;
  onBackToHubs: () => void;
}

const RECOVERY_COPY: Record<LifecycleRecovery, { title: string; hint: string }> = {
  STALE: {
    title: "Hub changed",
    hint: "Refresh the Hub before trying this action again.",
  },
  DENIED: {
    title: "Action denied",
    hint: "Your current Hub role does not allow this lifecycle action.",
  },
  UNAVAILABLE: {
    title: "Control Plane unavailable",
    hint: "Retrying will safely reuse this action's retry key.",
  },
  NOT_FOUND: {
    title: "Hub no longer available",
    hint: "It may have been deleted, or your access may have been removed.",
  },
  INVALID: {
    title: "Action could not be completed",
    hint: "Check the submitted values before trying again.",
  },
};

export function HubLifecyclePanel({
  hubId,
  hubName,
  locked,
  isOwner,
  canLockdown,
  pendingAction,
  failure,
  onLockdown,
  onTransferOwnership,
  onDeleteHub,
  onRefresh,
  onRetry,
  onBackToHubs,
}: HubLifecyclePanelProps) {
  const [transferTarget, setTransferTarget] = useState("");
  const [lockReason, setLockReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => setDeleteConfirmation(""), [hubName]);

  const deleteConfirmed = isExactHubNameConfirmation(deleteConfirmation, hubName);
  const pending = pendingAction !== undefined;
  const recovery = failure ? RECOVERY_COPY[failure.recovery] : undefined;

  return (
    <div className="flex flex-col gap-6">
      {failure && recovery && (
        <div role="alert" aria-live="polite" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
          <strong className="block text-sm">{recovery.title}</strong>
          <span className="mt-1 block text-xs text-white/70">{failure.message} {recovery.hint}</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {failure.recovery === "STALE" && (
              <button type="button" className="dashboard-btn-secondary px-3 py-1.5 text-xs font-bold" onClick={onRefresh}>
                <ReloadOutlined /> Refresh Hub
              </button>
            )}
            {failure.recovery === "UNAVAILABLE" && (
              <button type="button" className="dashboard-btn-secondary px-3 py-1.5 text-xs font-bold" onClick={onRetry} disabled={pending}>
                <ReloadOutlined /> Retry {failure.action}
              </button>
            )}
            {failure.recovery === "NOT_FOUND" && (
              <button type="button" className="dashboard-btn-secondary px-3 py-1.5 text-xs font-bold" onClick={onBackToHubs}>
                Back to Hubs
              </button>
            )}
          </div>
        </div>
      )}

      {canLockdown && (
        <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
            <LockOutlined className="text-violet-400" />
            <h3 className="m-0 text-base font-bold text-white font-['Sora']">Emergency Lockdown</h3>
          </div>
          <div className="dashboard-toggle-row">
            <div>
              <strong className="block text-xs text-white">Pause Hub routing</strong>
              <small className="text-[11px] text-white/50">Stops bridge traffic without deleting connections.</small>
            </div>
            <DepthToggle
              checked={locked}
              disabled={pending}
              onChange={(next) => onLockdown(next, lockReason.trim())}
              aria-label="Pause Hub routing"
            />
          </div>
          <input
            className="dashboard-input text-xs"
            maxLength={500}
            value={lockReason}
            onChange={(event) => setLockReason(event.target.value)}
            placeholder="Reason recorded in the audit trail (optional)"
          />
        </section>
      )}

      {isOwner && (
        <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
            <UserSwitchOutlined className="text-amber-400" />
            <h3 className="m-0 text-base font-bold text-white font-['Sora']">Transfer Ownership</h3>
          </div>
          <p className="m-0 text-xs text-white/60">Transfer primary ownership to another Discord user. This cannot be undone.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="hub-transfer-subject">New owner</label>
            <HubSubjectSelector
              id="hub-transfer-subject"
              hubId={hubId}
              value={transferTarget}
              onChange={setTransferTarget}
              placeholder="Search by Discord name"
              disabled={pending}
            />
            <button
              type="button"
              className="dashboard-btn-secondary px-4 py-2 text-xs font-bold text-amber-300"
              disabled={pending || !transferTarget.trim()}
              onClick={() => onTransferOwnership(transferTarget.trim())}
            >
              Transfer Ownership
            </button>
          </div>
        </section>
      )}

      {isOwner && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-red-500/20 pb-3">
            <WarningOutlined className="text-red-400" />
            <h3 className="m-0 text-base font-bold text-red-300 font-['Sora']">Danger Zone</h3>
          </div>
          <label className="text-xs font-bold text-white" htmlFor="delete-hub-confirmation">
            Type <span className="text-red-300">{hubName}</span> exactly to confirm deletion
          </label>
          <input
            id="delete-hub-confirmation"
            className="dashboard-input text-xs"
            autoComplete="off"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
          />
          <button
            type="button"
            className="dashboard-btn-danger w-fit px-4 py-1.5 text-xs font-bold"
            disabled={pending || !deleteConfirmed}
            onClick={() => onDeleteHub(deleteConfirmation)}
          >
            <DeleteOutlined /> Delete Hub Permanently
          </button>
        </section>
      )}
    </div>
  );
}
