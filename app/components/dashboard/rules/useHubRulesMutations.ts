import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRef } from "react";
import { orpc } from "~/lib/orpc";

interface UseHubRulesMutationsOptions {
  hubId: string;
  expectedVersion: number;
  onMutationSuccess?: () => void;
}

export function useHubRulesMutations({
  hubId,
  expectedVersion,
  onMutationSuccess,
}: UseHubRulesMutationsOptions) {
  const queryClient = useQueryClient();
  const createKeyRef = useRef(crypto.randomUUID());
  const updateKeyRef = useRef(crypto.randomUUID());
  const deleteKeysRef = useRef(new Map<string, string>());
  const reorderKeyRef = useRef(crypto.randomUUID());

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: orpc.hub.listRules.queryOptions({ input: { hubId } }).queryKey,
      }),
      queryClient.invalidateQueries({
        queryKey: orpc.hub.getHub.queryOptions({ input: { hubId } }).queryKey,
      }),
    ]);
  };

  const createMutation = useMutation(
    orpc.hub.createRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule added successfully.");
        createKeyRef.current = crypto.randomUUID();
        await invalidateAll();
        onMutationSuccess?.();
      },
      onError: (err) => message.error(err.message || "Failed to add rule."),
    }),
  );

  const updateMutation = useMutation(
    orpc.hub.updateRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule updated successfully.");
        updateKeyRef.current = crypto.randomUUID();
        await invalidateAll();
        onMutationSuccess?.();
      },
      onError: (err) => message.error(err.message || "Failed to update rule."),
    }),
  );

  const deleteMutation = useMutation(
    orpc.hub.deleteRule.mutationOptions({
      onSuccess: async () => {
        message.success("Rule deleted.");
        await invalidateAll();
      },
      onError: (err) => message.error(err.message || "Failed to delete rule."),
    }),
  );

  const reorderMutation = useMutation(
    orpc.hub.reorderRules.mutationOptions({
      onSuccess: async () => {
        message.success("Rule order updated.");
        reorderKeyRef.current = crypto.randomUUID();
        await invalidateAll();
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

  const createRule = (title: string, description: string) => {
    createMutation.mutate({
      hubId,
      title,
      description,
      expectedVersion,
      idempotencyKey: createKeyRef.current,
    });
  };

  const updateRule = (ruleId: string, title: string, description: string) => {
    updateMutation.mutate({
      hubId,
      ruleId,
      title,
      description,
      expectedVersion,
      idempotencyKey: updateKeyRef.current,
    });
  };

  const deleteRule = (ruleId: string) => {
    deleteMutation.mutate(
      {
        hubId,
        ruleId,
        expectedVersion,
        idempotencyKey: deleteKeyFor(ruleId),
      },
      { onSuccess: () => deleteKeysRef.current.delete(ruleId) },
    );
  };

  const reorderRules = (ruleIds: string[]) => {
    reorderMutation.mutate({
      hubId,
      ruleIds,
      expectedVersion,
      idempotencyKey: reorderKeyRef.current,
    });
  };

  return {
    createRule,
    updateRule,
    deleteRule,
    reorderRules,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}

