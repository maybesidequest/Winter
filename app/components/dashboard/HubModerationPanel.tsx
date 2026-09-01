import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { orpc } from "~/lib/orpc";
import { moderationFailureFor, type ModerationFailure } from "~/services/control/moderation";
import {
  AppealList,
  HubSafetySettingsPanel,
  InfractionList,
  ModerationOperationNotice,
  SafetyAssessmentCard,
} from "~/components/dashboard/moderation";
import type { HubResource } from "~/resources/hub";
import { HubSubjectSelector } from "./HubSubjectSelector";

type AppealDecision = {
  kind: "approve" | "reject";
  appealId: string;
  expectedVersion: number;
  idempotencyKey: string;
  resolutionReason: string;
};

export function HubModerationPanel({ hub, canEdit }: { hub: HubResource; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [failure, setFailure] = useState<ModerationFailure | null>(null);
  const [subjectUserId, setSubjectUserId] = useState("");
  const [resolutionReason, setResolutionReason] = useState("");
  // Retained so an UNAVAILABLE retry replays the exact same mutation with the
  // same idempotency key — the control plane deduplicates on that key.
  const lastDecision = useRef<AppealDecision | null>(null);
  const canModerate = canEdit || hub.metadata.permissions.MODERATE_MESSAGES === true;

  const moderationQueryKeys = [
    orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
    orpc.moderation.listInfractions.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
    orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }).queryKey,
  ];

  const settingsQuery = useQuery(orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }));
  const infractionsQuery = useQuery(orpc.moderation.listInfractions.queryOptions({ input: { hubId: hub.metadata.id } }));
  const appealsQuery = useQuery(orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }));
  const assessmentQuery = useQuery({
    ...orpc.moderation.getSafetyAssessment.queryOptions({ input: { hubId: hub.metadata.id, subject: { userId: subjectUserId } } }),
    enabled: subjectUserId.trim().length > 0,
  });

  const refreshModeration = async () => {
    await Promise.all(moderationQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
  };

  const patchSettings = useMutation(orpc.moderation.patchHubSafetySettings.mutationOptions({
    onSuccess: async () => {
      setFailure(null);
      await queryClient.invalidateQueries({ queryKey: orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
    },
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const onAppealDecision = async () => {
    // An appeal decision can change the infraction lifecycle state too.
    setFailure(null);
    await refreshModeration();
  };
  const approveAppeal = useMutation(orpc.moderation.approveAppeal.mutationOptions({
    onSuccess: onAppealDecision,
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const rejectAppeal = useMutation(orpc.moderation.rejectAppeal.mutationOptions({
    onSuccess: onAppealDecision,
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const revokeSanction = useMutation(orpc.moderation.revokeSanction.mutationOptions({
    onSuccess: onAppealDecision,
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));

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

  const decide = (kind: "approve" | "reject", appeal: { id: string; version: number }) => {
    applyDecision({
      kind,
      appealId: appeal.id,
      expectedVersion: appeal.version,
      idempotencyKey: crypto.randomUUID(),
      // Fall back to the neutral default only when the reviewer left the
      // reason field empty; otherwise the typed reason is recorded verbatim.
      resolutionReason: resolutionReason.trim() || (kind === "approve" ? "Approved by Hub staff" : "Rejected by Hub staff"),
    });
  };

  const retryLastDecision = () => {
    const decision = lastDecision.current;
    if (decision) {
      applyDecision(decision);
      return;
    }
    setFailure(null);
    void refreshModeration();
  };

  const settings = settingsQuery.data;
  const assessmentState = subjectUserId.trim().length === 0 ? "idle" : assessmentQuery.isPending ? "loading" : assessmentQuery.isError ? "error" : "ready";
  return (
    <div className="flex max-w-4xl flex-col gap-5">
      {failure && <ModerationOperationNotice failure={failure} onRefresh={() => { setFailure(null); void refreshModeration(); }} onRetry={retryLastDecision} />}
      {settings ? <HubSafetySettingsPanel settings={settings} canEdit={canEdit} saving={patchSettings.isPending} onSave={(values, updateMask, expectedVersion) => patchSettings.mutate({ hubId: hub.metadata.id, settings: values, updateMask, expectedVersion, idempotencyKey: crypto.randomUUID() })} /> : settingsQuery.isLoading ? <p className="text-xs text-white/60">Loading canonical safety settings…</p> : null}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Sanctions</h3>
        {infractionsQuery.isError ? (
          <p role="alert" className="m-0 text-xs text-amber-300">Moderation records are temporarily unavailable. No state is assumed.</p>
        ) : infractionsQuery.isPending ? (
          <p className="m-0 animate-pulse text-xs text-white/60">Loading moderation records…</p>
        ) : (
          <InfractionList
            infractions={infractionsQuery.data?.items ?? []}
            onRevoke={canModerate ? (infraction, reason) => revokeSanction.mutate({
              hubId: hub.metadata.id,
              infractionId: infraction.id,
              reason,
              expectedVersion: infraction.version,
              idempotencyKey: crypto.randomUUID(),
            }) : undefined}
          />
        )}
      </section>
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Appeal review</h3>
        {canModerate && (
          <div className="mb-3">
            <label className="mb-1 block text-xs text-white/60" htmlFor="appeal-resolution-reason">Resolution reason (applied to your next decision)</label>
            <input
              id="appeal-resolution-reason"
              className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white placeholder:text-white/30"
              maxLength={2_000}
              placeholder="Why is this appeal being approved or rejected?"
              value={resolutionReason}
              onChange={(event) => setResolutionReason(event.target.value)}
            />
          </div>
        )}
        {appealsQuery.isError ? (
          <p role="alert" className="m-0 text-xs text-amber-300">Appeals are temporarily unavailable. No state is assumed.</p>
        ) : appealsQuery.isPending ? (
          <p className="m-0 animate-pulse text-xs text-white/60">Loading appeals…</p>
        ) : (
          <AppealList
            appeals={appealsQuery.data?.items ?? []}
            onApprove={canModerate ? (appeal) => decide("approve", appeal) : undefined}
            onReject={canModerate ? (appeal) => decide("reject", appeal) : undefined}
          />
        )}
      </section>
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white">Member safety assessment</h3>
          <div className="w-full sm:w-64">
            <label className="sr-only" htmlFor="hub-safety-subject">Member to assess</label>
            <HubSubjectSelector
              id="hub-safety-subject"
              hubId={hub.metadata.id}
              value={subjectUserId}
              onChange={setSubjectUserId}
              placeholder="Search by Discord name"
            />
          </div>
        </div>
        <SafetyAssessmentCard assessment={assessmentQuery.data ?? null} state={assessmentState} />
      </section>
    </div>
  );
}
