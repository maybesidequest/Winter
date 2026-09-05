import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

interface HubUnsavedChangesModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function HubUnsavedChangesModal({
  open,
  title,
  description,
  confirmLabel = "Discard Changes",
  cancelLabel = "Keep Editing",
  destructive = true,
  onConfirm,
  onCancel,
}: HubUnsavedChangesModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
      aria-describedby="unsaved-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 flex flex-col gap-4 shadow-2xl"
        style={{
          ...dashboardGlassCardStyle,
          background: "#181726",
          borderColor: "rgba(255, 255, 255, 0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              destructive ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-violet-500/15 text-violet-300 border border-violet-500/30"
            }`}
          >
            <ExclamationCircleOutlined />
          </div>
          <h3 id="unsaved-modal-title" className="text-base font-bold text-white font-['Sora'] m-0">
            {title}
          </h3>
        </div>

        <p id="unsaved-modal-desc" className="text-sm text-white/70 leading-relaxed m-0">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="dashboard-btn-secondary px-4 py-2 text-xs font-bold cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              destructive
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 shadow-[0_1.5px_0_0_rgba(239,68,68,0.4)]"
                : "dashboard-btn-primary"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

