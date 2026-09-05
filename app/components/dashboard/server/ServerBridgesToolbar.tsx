import {
  ApartmentOutlined,
  CompassOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";

export interface ServerBridgesToolbarProps {
  activeCount: number;
  pausedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "paused";
  onStatusFilterChange: (filter: "all" | "active" | "paused") => void;
  onOpenWizard: () => void;
}

export function ServerBridgesToolbar({
  activeCount,
  pausedCount,
  totalCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenWizard,
}: ServerBridgesToolbarProps) {
  return (
    <div
      className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
      style={dashboardGlassCardStyle}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-lg shadow-sm flex-shrink-0">
          <ApartmentOutlined />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-['Sora'] m-0">
            Connected Hub Bridges
          </h2>
          <p className="text-xs text-white/70 m-0 mt-0.5">
            {activeCount} active · {pausedCount} paused · {totalCount} total
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input with accessible label */}
        <div className="relative">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none" />
          <input
            type="text"
            aria-label="Search connected bridges"
            placeholder="Search channels or hubs…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="dashboard-input text-xs pl-8 pr-3 py-2 min-h-[40px] w-44 sm:w-48"
          />
        </div>

        {/* Status Filter Pills with aria-pressed */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Bridge status filters">
          <button
            type="button"
            aria-pressed={statusFilter === "all"}
            onClick={() => onStatusFilterChange("all")}
            className={`dashboard-pill-btn min-h-[40px] px-3.5 text-xs font-semibold cursor-pointer ${statusFilter === "all" ? "dashboard-pill-btn--active" : ""
              }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            aria-pressed={statusFilter === "active"}
            onClick={() => onStatusFilterChange("active")}
            className={`dashboard-pill-btn min-h-[40px] px-3.5 text-xs font-semibold cursor-pointer ${statusFilter === "active" ? "dashboard-pill-btn--active" : ""
              }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            aria-pressed={statusFilter === "paused"}
            onClick={() => onStatusFilterChange("paused")}
            className={`dashboard-pill-btn min-h-[40px] px-3.5 text-xs font-semibold cursor-pointer ${statusFilter === "paused" ? "dashboard-pill-btn--active" : ""
              }`}
          >
            Paused ({pausedCount})
          </button>
        </div>

        {/* Connect a channel */}
        <button
          type="button"
          onClick={onOpenWizard}
          className="dashboard-btn-primary px-3.5 py-2 min-h-[40px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          title="Connect a channel on this server to a Hub"
        >
          <LinkOutlined />
          <span>Connect a channel</span>
        </button>

        {/* Hub Directory Link */}
        <Link
          to="/dashboard/browse"
          className="dashboard-btn-secondary px-3.5 py-2 min-h-[40px] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          title="Browse all available public hubs"
        >
          <CompassOutlined />
          <span>Browse Hubs</span>
        </Link>
      </div>
    </div>
  );
}
