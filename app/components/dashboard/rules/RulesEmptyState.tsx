import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

interface RulesEmptyStateProps {
  canEdit: boolean;
  onCreate: () => void;
}

export function RulesEmptyState({ canEdit, onCreate }: RulesEmptyStateProps) {
  return (
    <div className="dashboard-subcard flex flex-col items-center justify-center p-8 text-center rounded-xl border border-white/[0.08]">
      <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xl mb-3 shadow-[0_2px_0_0_rgba(129,117,238,0.25)]">
        <FileTextOutlined />
      </div>
      <h3 className="text-sm font-semibold text-white/90 mb-1">No custom rules configured</h3>
      <p className="text-xs text-white/50 max-w-sm mb-4">
        Set expectations and behavioral guidelines for all Discord servers and channels participating in this Hub.
      </p>
      {canEdit && (
        <button
          type="button"
          className="dashboard-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          onClick={onCreate}
        >
          <PlusOutlined />
          <span>Create First Rule</span>
        </button>
      )}
    </div>
  );
}

