import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";

export interface RuleItem {
  id: string;
  title: string;
  description: string;
}

interface RuleItemCardProps {
  rule: RuleItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  canEdit: boolean;
  isReordering: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RuleItemCard({
  rule,
  index,
  isFirst,
  isLast,
  canEdit,
  isReordering,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: RuleItemCardProps) {
  return (
    <div className="dashboard-subcard p-4 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all">
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono font-bold text-xs shadow-[0_1.5px_0_0_#5b4ccb]">
          #{index + 1}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white/95 break-words m-0">{rule.title}</h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed whitespace-pre-wrap break-words m-0">
            {rule.description}
          </p>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-1.5 self-end sm:self-start pt-1 sm:pt-0">
          <button
            type="button"
            title="Move rule up"
            disabled={isFirst || isReordering}
            onClick={onMoveUp}
            className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowUpOutlined />
          </button>
          <button
            type="button"
            title="Move rule down"
            disabled={isLast || isReordering}
            onClick={onMoveDown}
            className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowDownOutlined />
          </button>
          <button
            type="button"
            title="Edit rule"
            onClick={onEdit}
            className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center cursor-pointer text-violet-300 hover:text-violet-200"
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete this rule?"
            description="This rule will be permanently removed from this Hub."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={onDelete}
          >
            <button
              type="button"
              title="Delete rule"
              className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center cursor-pointer text-red-400 hover:text-red-300 hover:border-red-500/40"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
}

