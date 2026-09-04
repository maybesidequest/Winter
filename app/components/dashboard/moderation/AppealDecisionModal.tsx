import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import type { Appeal } from "~/services/control/moderation.shared";

interface AppealDecisionModalProps {
  appeal: Appeal | null;
  initialKind: "approve" | "reject";
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (kind: "approve" | "reject", resolutionReason: string) => void;
}

export function AppealDecisionModal({
  appeal, initialKind, open, isPending, onClose, onConfirm,
}: AppealDecisionModalProps) {
  const [kind, setKind] = useState<"approve" | "reject">(initialKind);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setKind(initialKind);
      setReason("");
      setError(null);
    }
  }, [open, initialKind]);

  if (!appeal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Please provide an audit resolution reason.");
      return;
    }
    if (trimmed.length < 5) {
      setError("Resolution reason must be at least 5 characters.");
      return;
    }
    setError(null);
    onConfirm(kind, trimmed);
  };

  const sanctionType = appeal.infraction?.type?.replace("SANCTION_TYPE_", "") || "SANCTION";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      title={
        <div className="flex items-center gap-2.5 text-white font-['Sora'] text-base">
          <SafetyCertificateOutlined className="text-[#8175ee]" />
          <span>Review Moderation Appeal</span>
        </div>
      }
      className="dashboard-modal"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 text-xs">
        {/* Appeal and Sanction Context */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                {sanctionType}
              </span>
              <span className="text-white/80 font-mono text-xs">
                User: {appeal.userId}
              </span>
            </div>
            {appeal.createdAt && (
              <span className="text-white/45 text-xs">
                Submitted: {new Date(appeal.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {appeal.infraction?.reason && (
            <div>
              <span className="text-white/50 block text-xs font-semibold">
                Original Sanction Reason:
              </span>
              <p className="text-white/80 m-0 mt-0.5 italic">
                "{appeal.infraction.reason}"
              </p>
            </div>
          )}
          <div>
            <span className="text-white/50 block text-xs font-semibold">
              User Appeal Explanation:
            </span>
            <p className="text-white/90 m-0 mt-0.5 p-2 rounded-lg bg-black/40 border border-white/5 whitespace-pre-wrap">
              {appeal.reason}
            </p>
          </div>
        </div>

        {/* Decision Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-white/70 font-semibold">Decision Action</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind("approve")}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                kind === "approve"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-white/[0.02] text-white/50 border-white/10 hover:text-white"
              }`}
            >
              <CheckCircleOutlined />
              <span>Approve Appeal</span>
            </button>

            <button
              type="button"
              onClick={() => setKind("reject")}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                kind === "reject"
                  ? "bg-red-500/20 text-red-300 border-red-500/40 shadow-sm"
                  : "bg-white/[0.02] text-white/50 border-white/10 hover:text-white"
              }`}
            >
              <CloseCircleOutlined />
              <span>Reject Appeal</span>
            </button>
          </div>
          <span className="text-xs text-white/50">
            {kind === "approve"
              ? "Approving this appeal revokes the active sanction and restores the member's access."
              : "Rejecting this appeal leaves the sanction in effect."}
          </span>
        </div>

        {/* Dedicated Resolution Reason Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="modal-resolution-reason" className="text-white/70 font-semibold">
            Audit Resolution Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            id="modal-resolution-reason"
            rows={3}
            maxLength={2000}
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder={
              kind === "approve"
                ? "e.g., Member acknowledged mistake, removed unauthorized message, and agreed to adhere to rules."
                : "e.g., Insufficient remorse; repeated infraction of community conduct rules."
            }
            className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#8175ee] focus:outline-none transition-colors"
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
          <div className="flex justify-between text-xs text-white/40">
            <span>Permanently attached to this specific appeal record.</span>
            <span>{reason.length}/2000</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="dashboard-btn-secondary !min-h-[34px] !px-4 !py-1.5 !text-xs !font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`${
              kind === "approve" ? "dashboard-btn-primary" : "dashboard-btn-danger"
            } !min-h-[34px] !px-4 !py-1.5 !text-xs !font-bold`}
          >
            {isPending
              ? "Recording decision…"
              : kind === "approve"
                ? "Confirm & Approve"
                : "Confirm & Reject"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
