import { LoadingOutlined, SafetyCertificateOutlined, SendOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import type { Infraction } from "~/services/control/moderation.shared";

interface AppealSubmissionModalProps {
  infraction: Infraction | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function AppealSubmissionModal({
  infraction,
  open,
  isPending,
  onClose,
  onSubmit,
}: AppealSubmissionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
    }
  }, [open]);

  if (!infraction) return null;

  const cleanType = infraction.type.replace("SANCTION_TYPE_", "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      setError("Please provide a detailed explanation of at least 10 characters.");
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

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
          <span>Submit Moderation Appeal</span>
        </div>
      }
      styles={{
        root: { background: "#13141f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 },
        header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12, marginBottom: 0 },
        body: { paddingTop: 20 },
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Sanction Context */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col gap-2">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Sanction Details</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase">
              {cleanType}
            </span>
            <span className="text-sm font-semibold text-white">{infraction.hubName || "Hub Sanction"}</span>
          </div>
          <p className="text-white/70 m-0 mt-0.5 leading-relaxed">
            <span className="text-white/40 font-medium">Original reason: </span>
            {infraction.reason}
          </p>
        </div>

        {/* Reason field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="appeal-reason" className="text-white/80 font-semibold">
              Why should this sanction be reviewed or revoked?
            </label>
            <span className="text-white/40 text-xs">{reason.length} / 2000</span>
          </div>
          <textarea
            id="appeal-reason"
            rows={4}
            maxLength={2000}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Explain what happened and why you are appealing this sanction…"
            className="dashboard-input w-full p-3 rounded-xl resize-none text-xs text-white"
          />
          <p className="text-white/50 text-xs m-0">
            Be respectful and concise. Staff from <strong className="text-white/75">{infraction.hubName || "the Hub"}</strong> will review this statement.
          </p>
        </div>

        {error && (
          <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 p-2.5 rounded-lg m-0" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="dashboard-btn-secondary px-4 py-2 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || reason.trim().length < 10}
            className="dashboard-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            {isPending ? <LoadingOutlined /> : <SendOutlined />}
            <span>{isPending ? "Submitting…" : "Submit appeal"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

