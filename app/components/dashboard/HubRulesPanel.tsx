import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import {
  RuleEditorModal,
  RuleItemCard,
  RulesEmptyState,
  useHubRulesMutations,
} from "./rules";
import {
  DashboardReadOnlyNotice,
  DashboardSectionCard,
  DashboardSectionTitle,
} from "./shared";

interface HubRulesPanelProps {
  hub: HubResource;
  canEdit: boolean;
}

export function HubRulesPanel({ hub, canEdit }: HubRulesPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: rules = [],
    isLoading,
    isError,
  } = useQuery(orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }));

  const {
    createRule,
    updateRule,
    deleteRule,
    reorderRules,
    isSaving,
    isReordering,
  } = useHubRulesMutations({
    hubId: hub.metadata.id,
    expectedVersion: hub.version,
    onMutationSuccess: () => {
      setModalOpen(false);
      setEditingRuleId(null);
      setTitle("");
      setDescription("");
    },
  });

  const moveRule = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= rules.length || isReordering) return;
    const ruleIds = rules.map((rule) => rule.id);
    [ruleIds[index], ruleIds[target]] = [ruleIds[target], ruleIds[index]];
    reorderRules(ruleIds);
  };

  const handleSubmit = () => {
    if (!title.trim()) return message.error("Title is required.");
    if (!description.trim()) return message.error("Description is required.");
    if (editingRuleId) {
      updateRule(editingRuleId, title.trim(), description.trim());
    } else {
      createRule(title.trim(), description.trim());
    }
  };

  const openCreateModal = () => {
    setEditingRuleId(null);
    setTitle("");
    setDescription("");
    setModalOpen(true);
  };

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Rules</DashboardSectionTitle>}
      extra={
        canEdit && (
          <button
            type="button"
            className="dashboard-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={isLoading || isError}
            onClick={openCreateModal}
          >
            <PlusOutlined />
            <span>Add Rule</span>
          </button>
        )
      }
    >
      {!canEdit && (
        <DashboardReadOnlyNotice message="Only staff with rule-management access can edit these rules." />
      )}
      {isError && (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300">
          Rules are temporarily unavailable. Try refreshing the page.
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="dashboard-subcard p-4 rounded-xl animate-pulse bg-white/[0.02] h-20" />
          ))}
        </div>
      )}

      {!isLoading && !isError && rules.length === 0 && (
        <RulesEmptyState canEdit={canEdit} onCreate={openCreateModal} />
      )}

      {!isLoading && rules.length > 0 && (
        <div className="flex flex-col gap-3">
          {rules.map((item, index) => (
            <RuleItemCard
              key={item.id}
              rule={item}
              index={index}
              isFirst={index === 0}
              isLast={index === rules.length - 1}
              canEdit={canEdit}
              isReordering={isReordering}
              onMoveUp={() => moveRule(index, -1)}
              onMoveDown={() => moveRule(index, 1)}
              onEdit={() => {
                setEditingRuleId(item.id);
                setTitle(item.title);
                setDescription(item.description);
                setModalOpen(true);
              }}
              onDelete={() => deleteRule(item.id)}
            />
          ))}
        </div>
      )}

      <RuleEditorModal
        open={modalOpen}
        isEditing={Boolean(editingRuleId)}
        isPending={isSaving}
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </DashboardSectionCard>
  );
}
