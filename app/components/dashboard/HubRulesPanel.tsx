import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Modal, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
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
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createKeyRef = useRef(crypto.randomUUID());
  const updateKeyRef = useRef(crypto.randomUUID());
  const deleteKeysRef = useRef(new Map<string, string>());
  const reorderKeyRef = useRef(crypto.randomUUID());

  const {
    data: rules = [],
    isLoading,
    isError,
  } = useQuery(orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }));

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
      }),
      queryClient.invalidateQueries({
        queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
      }),
    ]);
  };

  const createMutation = useMutation(
    orpc.hub.createRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule added successfully.");
        setModalOpen(false);
        setTitle("");
        setDescription("");
        createKeyRef.current = crypto.randomUUID();
        await invalidateAll();
      },
      onError: (err) => message.error(err.message || "Failed to add rule."),
    })
  );

  const updateMutation = useMutation(
    orpc.hub.updateRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule updated successfully.");
        setModalOpen(false);
        setEditingRuleId(null);
        setTitle("");
        setDescription("");
        updateKeyRef.current = crypto.randomUUID();
        await invalidateAll();
      },
      onError: (err) => message.error(err.message || "Failed to update rule."),
    })
  );

  const deleteMutation = useMutation(
    orpc.hub.deleteRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule deleted.");
        await invalidateAll();
      },
      onError: (err) => message.error(err.message || "Failed to delete rule."),
    })
  );

  const reorderMutation = useMutation(
    orpc.hub.reorderRules.mutationOptions({
      onSuccess: async () => {
        message.success("Rule order updated.");
        reorderKeyRef.current = crypto.randomUUID();
        await invalidateAll();
      },
      onError: (err) => message.error(err.message || "Failed to reorder rules."),
    })
  );

  const deleteKeyFor = (ruleId: string) => {
    const existing = deleteKeysRef.current.get(ruleId);
    if (existing) return existing;
    const created = crypto.randomUUID();
    deleteKeysRef.current.set(ruleId, created);
    return created;
  };

  const moveRule = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= rules.length || reorderMutation.isPending) return;
    const ruleIds = rules.map((rule) => rule.id);
    [ruleIds[index], ruleIds[target]] = [ruleIds[target], ruleIds[index]];
    reorderMutation.mutate({
      hubId: hub.metadata.id,
      ruleIds,
      expectedVersion: hub.version,
      idempotencyKey: reorderKeyRef.current,
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) return message.error("Title is required.");
    if (!description.trim()) return message.error("Description is required.");
    if (editingRuleId) {
      updateMutation.mutate({
        hubId: hub.metadata.id,
        ruleId: editingRuleId,
        title: title.trim(),
        description: description.trim(),
        expectedVersion: hub.version,
        idempotencyKey: updateKeyRef.current,
      });
    } else {
      createMutation.mutate({
        hubId: hub.metadata.id,
        title: title.trim(),
        description: description.trim(),
        expectedVersion: hub.version,
        idempotencyKey: createKeyRef.current,
      });
    }
  };

  const openCreateModal = () => {
    setEditingRuleId(null);
    setTitle("");
    setDescription("");
    createKeyRef.current = crypto.randomUUID();
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
            <div
              key={i}
              className="dashboard-subcard p-4 rounded-xl animate-pulse bg-white/[0.02] h-20"
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && rules.length === 0 && (
        <div
          className="dashboard-subcard flex flex-col items-center justify-center p-8 text-center rounded-xl border border-white/[0.08]"
        >
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
              onClick={openCreateModal}
            >
              <PlusOutlined />
              <span>Create First Rule</span>
            </button>
          )}
        </div>
      )}

      {!isLoading && rules.length > 0 && (
        <div className="flex flex-col gap-3">
          {rules.map((item, index) => (
            <div
              key={item.id}
              className="dashboard-subcard p-4 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono font-bold text-xs shadow-[0_1.5px_0_0_#5b4ccb]">
                  #{index + 1}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white/95 break-words">{item.title}</h4>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                    {item.description}
                  </p>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-1.5 self-end sm:self-start pt-1 sm:pt-0">
                  <button
                    type="button"
                    title="Move rule up"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => moveRule(index, -1)}
                    className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowUpOutlined />
                  </button>
                  <button
                    type="button"
                    title="Move rule down"
                    disabled={index === rules.length - 1 || reorderMutation.isPending}
                    onClick={() => moveRule(index, 1)}
                    className="dashboard-btn-secondary p-2 text-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowDownOutlined />
                  </button>
                  <button
                    type="button"
                    title="Edit rule"
                    onClick={() => {
                      setEditingRuleId(item.id);
                      setTitle(item.title);
                      setDescription(item.description);
                      updateKeyRef.current = crypto.randomUUID();
                      setModalOpen(true);
                    }}
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
                    onConfirm={() =>
                      deleteMutation.mutate(
                        {
                          hubId: hub.metadata.id,
                          ruleId: item.id,
                          expectedVersion: hub.version,
                          idempotencyKey: deleteKeyFor(item.id),
                        },
                        { onSuccess: () => deleteKeysRef.current.delete(item.id) }
                      )
                    }
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
          ))}
        </div>
      )}

      <Modal
        title={<span className="text-white font-bold">{editingRuleId ? "Edit Rule" : "Add Hub Rule"}</span>}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingRuleId ? "Save Changes" : "Create Rule"}
        cancelButtonProps={{ className: "dashboard-btn-secondary" }}
        okButtonProps={{ className: "dashboard-btn-primary" }}
      >
        <div className="flex flex-col gap-3.5 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Rule Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Be respectful and avoid toxic behavior"
              maxLength={100}
              className="dashboard-input text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/90">Description & Guidelines</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain expected behavior, prohibited content, or disciplinary actions..."
              rows={4}
              maxLength={1000}
              className="dashboard-textarea text-xs"
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
