import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orpc } from "~/lib/orpc";
import {
  AppealDecisionModal,
  AppealList,
  HubSafetySettingsPanel,
  InfractionList,
  ModerationOperationNotice,
  SafetyAssessmentCard,
  useHubModerationActions,
} from "~/components/dashboard/moderation";
import type { HubResource } from "~/resources/hub";
import { HubSubjectSelector } from "./HubSubjectSelector";

export function HubModerationPanel({ hub, canEdit }: { hub: HubResource; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [subjectUserId, setSubjectUserId] = useState("");
  const canModerate = canEdit || hub.metadata.permissions.MODERATE_MESSAGES === true;

  const moderationQueryKeys = [
    orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
    orpc.moderation.listInfractions.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey,
    orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }).queryKey,
  ];

  const refreshModeration = async () => {
    await Promise.all(moderationQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
  };

  const settingsQuery = useQuery(orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }));
  const infractionsQuery = useQuery(orpc.moderation.listInfractions.queryOptions({ input: { hubId: hub.metadata.id } }));
  const appealsQuery = useQuery(orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }));
  const assessmentQuery = useQuery({
    ...orpc.moderation.getSafetyAssessment.queryOptions({ input: { hubId: hub.metadata.id, subject: { userId: subjectUserId } } }),
    enabled: subjectUserId.trim().length > 0,
  });

  const {
    failure,
    setFailure,
    decisionTarget,
    setDecisionTarget,
    openDecisionModal,
    handleConfirmDecision,
    retryLastDecision,
    patchSettings,
    revokeSanction,
    isDecisionPending,
  } = useHubModerationActions({ hub, onRefresh: refreshModeration });

  const settings = settingsQuery.data;
  const assessmentState = subjectUserId.trim().length === 0 ? "idle" : assessmentQuery.isPending ? "loading" : assessmentQuery.isError ? "error" : "ready";

  return (
    <div className="flex max-w-4xl flex-col gap-5">
      {failure && (
        <ModerationOperationNotice
          failure={failure}
          onRefresh={() => { setFailure(null); void refreshModeration(); }}
          onRetry={retryLastDecision}
        />
      )}

      {settings ? (
        <HubSafetySettingsPanel
          settings={settings}
          canEdit={canEdit}
          saving={patchSettings.isPending}
          onSave={(values, updateMask, expectedVersion) =>
            patchSettings.mutate({
              hubId: hub.metadata.id,
              settings: values,
              updateMask,
              expectedVersion,
              idempotencyKey: crypto.randomUUID(),
            })
          }
        />
      ) : settingsQuery.isLoading ? (
        <p className="text-xs text-white/60">Loading canonical safety settings…</p>
      ) : null}

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Sanctions</h3>
        {infractionsQuery.isError ? (
          <p role="alert" className="m-0 text-xs text-amber-300">
            Moderation records are temporarily unavailable. No state is assumed.
          </p>
        ) : infractionsQuery.isPending ? (
          <p className="m-0 animate-pulse text-xs text-white/60">Loading moderation records…</p>
        ) : (
          <InfractionList
            infractions={infractionsQuery.data?.items ?? []}
            onRevoke={
              canModerate
                ? (infraction, reason) =>
                    revokeSanction.mutate({
                      hubId: hub.metadata.id,
                      infractionId: infraction.id,
                      reason,
                      expectedVersion: infraction.version,
                      idempotencyKey: crypto.randomUUID(),
                    })
                : undefined
            }
          />
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Appeal review</h3>
        {appealsQuery.isError ? (
          <p role="alert" className="m-0 text-xs text-amber-300">
            Appeals are temporarily unavailable. No state is assumed.
          </p>
        ) : appealsQuery.isPending ? (
          <p className="m-0 animate-pulse text-xs text-white/60">Loading appeals…</p>
        ) : (
          <AppealList
            appeals={appealsQuery.data?.items ?? []}
            onOpenDecision={canModerate ? openDecisionModal : undefined}
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

      <AppealDecisionModal
        appeal={decisionTarget?.appeal ?? null}
        initialKind={decisionTarget?.kind ?? "approve"}
        open={Boolean(decisionTarget)}
        isPending={isDecisionPending}
        onClose={() => setDecisionTarget(null)}
        onConfirm={handleConfirmDecision}
      />
    </div>
  );
}
