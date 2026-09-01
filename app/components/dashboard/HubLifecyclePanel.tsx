import {
  DeleteOutlined,
  LockOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Modal } from "antd";
import { useEffect, useState } from "react";
import { dashboardGlassCardStyle, DepthToggle } from "~/components/dashboard/shared";
import { orpc } from "~/lib/orpc";
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
  hubVersion: number;
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
  hubVersion,
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
  const [previewKind, setPreviewKind] = useState<"DELETE" | "TRANSFER_OWNERSHIP" | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const deletePreviewQuery = useQuery({
    ...orpc.previews.get.queryOptions({ input: { action: "DELETE", resourceType: "HUB", resourceId: hubId, expectedVersion: hubVersion } }),
    enabled: false,
  });
  const transferPreviewQuery = useQuery({
    ...orpc.previews.get.queryOptions({ input: { action: "TRANSFER_OWNERSHIP", resourceType: "HUB", resourceId: hubId, expectedVersion: hubVersion } }),
    enabled: false,
  });

  useEffect(() => setDeleteConfirmation(""), [hubName]);

  const deleteConfirmed = isExactHubNameConfirmation(deleteConfirmation, hubName);
  const pending = pendingAction !== undefined;
  const recovery = failure ? RECOVERY_COPY[failure.recovery] : undefined;
  const preview = previewKind === "DELETE" ? deletePreviewQuery.data : transferPreviewQuery.data;
  const previewLoading = deletePreviewQuery.isFetching || transferPreviewQuery.isFetching;

  const requestPreview = async (kind: "DELETE" | "TRANSFER_OWNERSHIP") => {
    setPreviewError(null);
    const result = kind === "DELETE" ? await deletePreviewQuery.refetch() : await transferPreviewQuery.refetch();
    if (result.data) {
      setPreviewKind(kind);
    } else {
      setPreviewError("Impact preview is temporarily unavailable. Refresh the Hub and try again.");
    }
  };

  const confirmPreview = () => {
    if (!preview || !previewKind) return;
    if (!preview.allowed) {
      setPreviewKind(null);
      setPreviewError("Control Plane did not authorize this action.");
      return;
    }
    if (preview.resourceVersion !== hubVersion) {
      setPreviewKind(null);
      setPreviewError("The Hub changed while you were reviewing this action. Refresh before trying again.");
      return;
    }
    if (previewKind === "DELETE" && preview.confirmationPhrase !== deleteConfirmation) {
      setPreviewError(`Type ${hubName} exactly to confirm deletion.`);
      return;
    }
    if (previewKind === "TRANSFER_OWNERSHIP" && !transferTarget.trim()) {
      setPreviewError("Choose a named new owner before confirming the transfer.");
      return;
    }
    if (previewKind === "DELETE") onDeleteHub(deleteConfirmation);
    else onTransferOwnership(transferTarget.trim());
    setPreviewKind(null);
  };

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
      {previewError && previewKind === null && <Alert type="error" showIcon message={previewError} />}

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
              onClick={() => void requestPreview("TRANSFER_OWNERSHIP")}
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
            onClick={() => void requestPreview("DELETE")}
          >
            <DeleteOutlined /> Delete Hub Permanently
          </button>
          {previewError && <Alert type="error" showIcon message={previewError} />}
        </section>
      )}

      <Modal
        title={previewKind === "DELETE" ? "Review Hub deletion" : "Review ownership transfer"}
        open={previewKind !== null}
        onCancel={() => setPreviewKind(null)}
        onOk={confirmPreview}
        confirmLoading={previewLoading}
        okText={previewKind === "DELETE" ? "Confirm permanent deletion" : "Confirm ownership transfer"}
        okButtonProps={previewKind === "DELETE" ? { danger: true } : undefined}
      >
        {previewError && <Alert type="error" showIcon message={previewError} />}
        {preview ? (
          <div className="flex flex-col gap-3">
            <p className="m-0 text-sm">{preview.summary}</p>
            <p className="m-0 text-xs text-black/65">
              {preview.affectedResources.length} related resource{preview.affectedResources.length === 1 ? "" : "s"} will be affected.
            </p>
            {preview.warnings.length > 0 && (
              <ul className="m-0 pl-5 text-xs text-amber-700">
                {preview.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            )}
            {previewKind === "DELETE" && (
              <p className="m-0 text-xs font-semibold text-red-700">This action cannot be undone. Your exact Hub-name confirmation is still required.</p>
            )}
          </div>
        ) : <p className="m-0 text-xs">Loading the canonical impact preview…</p>}
      </Modal>
    </div>
  );
}
