import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import type { HubResource } from "~/resources/hub";
import {
  moderationFailureFor,
  type Appeal,
  type ModerationFailure,
} from "~/services/control/moderation.shared";

export type AppealDecision = {
  kind: "approve" | "reject";
  appealId: string;
  expectedVersion: number;
  idempotencyKey: string;
  resolutionReason: string;
};

interface UseHubModerationActionsOptions {
  hub: HubResource;
  onRefresh: () => Promise<void>;
}

export function useHubModerationActions({ hub, onRefresh }: UseHubModerationActionsOptions) {
  const queryClient = useQueryClient();
  const [failure, setFailure] = useState<ModerationFailure | null>(null);
  const [decisionTarget, setDecisionTarget] = useState<{
    appeal: Appeal;
    kind: "approve" | "reject";
  } | null>(null);

  const lastDecision = useRef<AppealDecision | null>(null);

  const patchSettings = useMutation(
    orpc.moderation.patchHubSafetySettings.mutationOptions({
      onSuccess: async () => {
        setFailure(null);
        await queryClient.invalidateQueries({
          queryKey: orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
        });
      },
      onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
    }),
  );

  const onAppealDecision = async () => {
    setFailure(null);
    setDecisionTarget(null);
    await onRefresh();
  };

  const approveAppeal = useMutation(
    orpc.moderation.approveAppeal.mutationOptions({
      onSuccess: onAppealDecision,
      onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
    }),
  );

  const rejectAppeal = useMutation(
    orpc.moderation.rejectAppeal.mutationOptions({
      onSuccess: onAppealDecision,
      onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
    }),
  );

  const revokeSanction = useMutation(
    orpc.moderation.revokeSanction.mutationOptions({
      onSuccess: onAppealDecision,
      onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
    }),
  );

  const applyDecision = (decision: AppealDecision) => {
    lastDecision.current = decision;
    const payload = {
      hubId: hub.metadata.id,
      appealId: decision.appealId,
      resolutionReason: decision.resolutionReason,
      expectedVersion: decision.expectedVersion,
      idempotencyKey: decision.idempotencyKey,
    };
    if (decision.kind === "approve") {
      approveAppeal.mutate(payload);
    } else {
      rejectAppeal.mutate(payload);
    }
  };

  const openDecisionModal = (appeal: Appeal, kind: "approve" | "reject") => {
    setDecisionTarget({ appeal, kind });
  };

  const handleConfirmDecision = (kind: "approve" | "reject", resolutionReason: string) => {
    if (!decisionTarget) return;
    applyDecision({
      kind,
      appealId: decisionTarget.appeal.id,
      expectedVersion: decisionTarget.appeal.version,
      idempotencyKey: crypto.randomUUID(),
      resolutionReason: resolutionReason.trim(),
    });
  };

  const retryLastDecision = () => {
    const decision = lastDecision.current;
    if (decision) {
      applyDecision(decision);
      return;
    }
    setFailure(null);
    void onRefresh();
  };

  return {
    failure,
    setFailure,
    decisionTarget,
    setDecisionTarget,
    openDecisionModal,
    handleConfirmDecision,
    retryLastDecision,
    patchSettings,
    revokeSanction,
    isDecisionPending: approveAppeal.isPending || rejectAppeal.isPending,
  };
}

