import { SaveOutlined } from "@ant-design/icons";

export interface ServerCallFloatingBannerProps {
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function ServerCallFloatingBanner({
  saving,
  onReset,
  onSave,
}: ServerCallFloatingBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-2xl bg-[#13141f]/95 border border-violet-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 w-[calc(100%-2rem)] max-w-lg"
    >
      <span className="text-xs font-semibold text-white text-center sm:text-left">
        Careful — you have unsaved call changes!
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={saving}
          className="dashboard-btn-secondary px-3.5 py-1.5 text-xs min-h-[36px] cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="dashboard-btn-primary px-4 py-1.5 text-xs min-h-[36px] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <SaveOutlined />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}

