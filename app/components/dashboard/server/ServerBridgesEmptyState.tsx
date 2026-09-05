import { LinkOutlined } from "@ant-design/icons";
import { message } from "antd";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export interface ServerBridgesEmptyStateProps {
  isFiltered: boolean;
  onOpenWizard: () => void;
  onResetFilters: () => void;
}

export function ServerBridgesEmptyState({
  isFiltered,
  onOpenWizard,
  onResetFilters,
}: ServerBridgesEmptyStateProps) {
  if (isFiltered) {
    return (
      <div
        className="p-8 rounded-2xl border flex flex-col items-center justify-center text-center gap-2"
        style={dashboardGlassCardStyle}
      >
        <p className="text-sm font-semibold text-white/80">No bridges match your filter</p>
        <p className="text-xs text-white/70">Try clearing your search query or selecting &quot;All&quot;.</p>
        <button
          type="button"
          onClick={onResetFilters}
          className="dashboard-btn-secondary px-4 py-2 min-h-[40px] text-xs font-semibold mt-2 cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div
      className="p-8 md:p-12 rounded-2xl border flex flex-col items-center justify-center text-center gap-4"
      style={dashboardGlassCardStyle}
    >
      {/* impeccable-disable-next-line ai-color-palette */}
      <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 text-2xl">
        <LinkOutlined />
      </div>
      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="text-base font-bold text-white font-['Sora']">
          Connect this server to a Hub
        </h3>
        <p className="text-xs text-white/70">
          Pick one of this server&apos;s channels and the Hub it should relay with. Messages will flow between the
          channel and the Hub&apos;s network.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenWizard}
        className="dashboard-btn-primary px-5 py-2.5 min-h-[44px] text-xs font-semibold mt-2 flex items-center gap-2 cursor-pointer"
      >
        <LinkOutlined />
        <span>Connect a channel</span>
      </button>
      <details className="mt-1 max-w-md w-full">
        <summary className="text-xs text-white/60 cursor-pointer hover:text-white/80 select-none">
          Prefer Discord commands?
        </summary>
        <div className="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono text-violet-300">
          <code>/hub join &lt;hub_name&gt;</code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText("/hub join ");
              message.success("Command copied to clipboard");
            }}
            className="text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-bold"
            title="Copy command"
          >
            Copy
          </button>
        </div>
      </details>
    </div>
  );
}
