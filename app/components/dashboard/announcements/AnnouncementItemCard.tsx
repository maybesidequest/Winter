import {
  DeleteOutlined,
  EditOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  desiredState: "DRAFT" | "SCHEDULED" | "PAUSED";
  deliveryState: string;
  nextDelivery?: string | null;
  repeatIntervalSeconds: number;
  version?: number;
}

interface AnnouncementItemCardProps {
  item: AnnouncementItem;
  canEdit: boolean;
  onToggleState: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AnnouncementItemCard({
  item,
  canEdit,
  onToggleState,
  onEdit,
  onDelete,
}: AnnouncementItemCardProps) {
  return (
    <div className="dashboard-subcard p-4 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors hover:bg-[#1d1b2e]">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm flex-shrink-0 mt-0.5 shadow-[0_1.5px_0_0_#5b4ccb]">
          <SendOutlined />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white truncate font-['Sora']">
              {item.title || "Announcement"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                item.desiredState === "SCHEDULED"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : item.desiredState === "PAUSED"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-white/[0.06] text-white/70 border-white/10"
              }`}
            >
              {item.desiredState}
            </span>
            <span className="text-xs text-white/50">{item.deliveryState}</span>
          </div>
          <p className="text-xs text-white/80 whitespace-pre-wrap m-0 leading-relaxed">
            {item.content}
          </p>
          <span className="text-xs text-white/40 mt-0.5">
            {item.nextDelivery
              ? `Next delivery: ${new Date(item.nextDelivery).toLocaleString()}`
              : "No scheduled delivery"}
          </span>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-start">
          {item.desiredState !== "DRAFT" && (
            <button
              type="button"
              className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center"
              title={item.desiredState === "SCHEDULED" ? "Pause delivery" : "Resume delivery"}
              onClick={onToggleState}
            >
              {item.desiredState === "SCHEDULED" ? <PauseOutlined /> : <PlayCircleOutlined />}
            </button>
          )}
          <button
            type="button"
            className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center text-violet-300 hover:text-violet-200"
            title="Edit announcement"
            onClick={onEdit}
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete this announcement?"
            onConfirm={onDelete}
          >
            <button
              type="button"
              className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center text-red-400 hover:text-red-300 hover:border-red-500/40"
              title="Delete announcement"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
}

