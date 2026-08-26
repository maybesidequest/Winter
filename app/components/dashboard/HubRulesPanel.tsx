import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, List, Modal, Typography, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { orpc } from "~/lib/orpc";
import { DashboardSectionCard, DashboardSectionTitle } from "./shared";
import type { HubResource } from "~/resources/hub";

const { Paragraph, Text } = Typography;

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

  const { data: rules = [], isLoading } = useQuery(
    orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } })
  );

  const createMutation = useMutation(
    orpc.hub.createRule.mutationOptions({
      onSuccess: () => {
        message.success("Rule added successfully.");
        setModalOpen(false);
        setTitle("");
        setDescription("");
        createKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to add rule."),
    })
  );

  const updateMutation = useMutation(
    orpc.hub.updateRule.mutationOptions({
      onSuccess: () => {
        message.success("Rule updated successfully.");
        setModalOpen(false);
        setEditingRuleId(null);
        setTitle("");
        setDescription("");
        updateKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to update rule."),
    })
  );

  const deleteMutation = useMutation(
    orpc.hub.deleteRule.mutationOptions({
      onSuccess: () => {
        message.success("Rule deleted.");
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to delete rule."),
    })
  );

  const reorderMutation = useMutation(
    orpc.hub.reorderRules.mutationOptions({
      onSuccess: () => {
        message.success("Rule order updated.");
        reorderKeyRef.current = crypto.randomUUID();
        queryClient.invalidateQueries({ queryKey: orpc.hub.listRules.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
        queryClient.invalidateQueries({ queryKey: orpc.hub.getHub.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
      },
      onError: (err) => message.error(err.message || "Failed to reorder rules."),
    }),
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

  return (
    <DashboardSectionCard
      title={<DashboardSectionTitle>Hub Rules</DashboardSectionTitle>}
      extra={
        canEdit && (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="dashboard-btn-primary"
            onClick={() => {
              setEditingRuleId(null);
              setTitle("");
              setDescription("");
              createKeyRef.current = crypto.randomUUID();
              setModalOpen(true);
            }}
          >
            Add Rule
          </Button>
        )
      }
    >
      <List
        loading={isLoading}
        dataSource={rules}
        locale={{ emptyText: <Text style={{ color: "rgba(255,255,255,0.4)" }}>No custom rules set.</Text> }}
        renderItem={(item, index) => (
          <List.Item
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            actions={
              canEdit
                ? [
                    <Button
                      key="up"
                      type="text"
                      icon={<ArrowUpOutlined />}
                      size="small"
                      disabled={index === 0 || reorderMutation.isPending}
                      aria-label={`Move rule ${index + 1} up`}
                      onClick={() => moveRule(index, -1)}
                    />,
                    <Button
                      key="down"
                      type="text"
                      icon={<ArrowDownOutlined />}
                      size="small"
                      disabled={index === rules.length - 1 || reorderMutation.isPending}
                      aria-label={`Move rule ${index + 1} down`}
                      onClick={() => moveRule(index, 1)}
                    />,
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                      onClick={() => {
                        setEditingRuleId(item.id);
                        setTitle(item.title);
                        setDescription(item.description);
                        updateKeyRef.current = crypto.randomUUID();
                        setModalOpen(true);
                      }}
                    />,
                    <Popconfirm
                      key="del"
                      title="Delete this rule?"
                      onConfirm={() =>
                        deleteMutation.mutate(
                          {
                            hubId: hub.metadata.id,
                            ruleId: item.id,
                            expectedVersion: hub.version,
                            idempotencyKey: deleteKeyFor(item.id),
                          },
                          { onSuccess: () => deleteKeysRef.current.delete(item.id) },
                        )
                      }
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              title={
                <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                  {index + 1}. {item.title}
                </Text>
              }
              description={
                <Paragraph style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  {item.description}
                </Paragraph>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingRuleId ? "Edit Rule" : "Add Hub Rule"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingRuleId ? "Update" : "Create"}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Title
            </Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Respect everyone"
              maxLength={100}
            />
          </div>
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>
              Description
            </Text>
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed guidelines or enforcement policy"
              rows={3}
              maxLength={1000}
            />
          </div>
        </div>
      </Modal>
    </DashboardSectionCard>
  );
}
