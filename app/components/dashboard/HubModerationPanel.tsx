import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

export function HubModerationPanel({ hub, canEdit }: { hub: HubResource; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [failure, setFailure] = useState<ModerationFailure | null>(null);
  const [subjectUserId, setSubjectUserId] = useState("");
  const settingsQuery = useQuery(orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }));
  const infractionsQuery = useQuery(orpc.moderation.listInfractions.queryOptions({ input: { hubId: hub.metadata.id } }));
  const appealsQuery = useQuery(orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }));
  const assessmentQuery = useQuery({
    ...orpc.moderation.getSafetyAssessment.queryOptions({ input: { hubId: hub.metadata.id, subject: { userId: subjectUserId } } }),
    enabled: subjectUserId.trim().length > 0,
  });
  const patchSettings = useMutation(orpc.moderation.patchHubSafetySettings.mutationOptions({
    onSuccess: async () => {
      setFailure(null);
      await queryClient.invalidateQueries({ queryKey: orpc.moderation.getHubSafetySettings.queryOptions({ input: { hubId: hub.metadata.id } }).queryKey });
    },
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const approveAppeal = useMutation(orpc.moderation.approveAppeal.mutationOptions({
    onSuccess: async () => {
      setFailure(null);
      await queryClient.invalidateQueries({ queryKey: orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }).queryKey });
    },
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const rejectAppeal = useMutation(orpc.moderation.rejectAppeal.mutationOptions({
    onSuccess: async () => {
      setFailure(null);
      await queryClient.invalidateQueries({ queryKey: orpc.moderation.listHubAppeals.queryOptions({ input: { hubId: hub.metadata.id, status: "APPEAL_STATUS_PENDING" } }).queryKey });
    },
    onError: (error) => setFailure(moderationFailureFor(error) ?? { kind: "UNAVAILABLE", message: error.message }),
  }));
  const settings = settingsQuery.data;
  return (
    <div className="flex max-w-4xl flex-col gap-5">
      {failure && <ModerationOperationNotice failure={failure} onRefresh={() => { setFailure(null); void queryClient.invalidateQueries(); }} onRetry={() => setFailure(null)} />}
      {settings ? <HubSafetySettingsPanel settings={settings} canEdit={canEdit} saving={patchSettings.isPending} onSave={(values, updateMask, expectedVersion) => patchSettings.mutate({ hubId: hub.metadata.id, settings: values, updateMask, expectedVersion, idempotencyKey: crypto.randomUUID() })} /> : settingsQuery.isLoading ? <p className="text-xs text-white/60">Loading canonical safety settings…</p> : null}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Sanctions</h3>
        <InfractionList infractions={infractionsQuery.data?.items ?? []} />
      </section>
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-3 text-sm font-bold text-white">Appeal review</h3>
        <AppealList
          appeals={appealsQuery.data?.items ?? []}
          onApprove={(appeal) => approveAppeal.mutate({ hubId: hub.metadata.id, appealId: appeal.id, resolutionReason: "Approved by Hub staff", expectedVersion: appeal.version, idempotencyKey: crypto.randomUUID() })}
          onReject={(appeal) => rejectAppeal.mutate({ hubId: hub.metadata.id, appealId: appeal.id, resolutionReason: "Rejected by Hub staff", expectedVersion: appeal.version, idempotencyKey: crypto.randomUUID() })}
        />
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
        <SafetyAssessmentCard assessment={assessmentQuery.data ?? null} />
      </section>
    </div>
  );
}
