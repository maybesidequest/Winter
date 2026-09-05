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
import type { PatchHubConfigInput } from "~/schemas/hub";
import { HubSubjectSelector } from "./HubSubjectSelector";

interface HubModerationPanelProps {
  hub: HubResource;
  canEdit: boolean;
  onSaveConfig?: (changes: Partial<PatchHubConfigInput>) => void;
  isSaving?: boolean;
}

export function HubModerationPanel({ hub, canEdit, onSaveConfig, isSaving = false }: HubModerationPanelProps) {
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
  const [subTab, setSubTab] = useState<"desk" | "policies">("desk");
  const [appealCooldown, setAppealCooldown] = useState<number>(hub.spec.appealCooldownHours ?? 168);

  return (
    <div className="flex max-w-4xl flex-col gap-5">
      <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setSubTab("desk")}
          className={`dashboard-pill-btn cursor-pointer ${
            subTab === "desk" ? "dashboard-pill-btn--active" : ""
          }`}
        >
          <span>Live Desk</span>
          {(appealsQuery.data?.items?.length ?? 0) > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-violet-400 text-[#0b0c14] text-[10px] font-bold">
              {appealsQuery.data?.items.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("policies")}
          className={`dashboard-pill-btn cursor-pointer ${
            subTab === "policies" ? "dashboard-pill-btn--active" : ""
          }`}
        >
          <span>Safety Policies</span>
        </button>
      </div>

      {failure && (
        <ModerationOperationNotice
          failure={failure}
          onRefresh={() => { setFailure(null); void refreshModeration(); }}
          onRetry={retryLastDecision}
        />
      )}

      {subTab === "policies" && (
        <>
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

          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white m-0 font-['Sora']">
                  Appeal Cooldown Period
                </h3>
                <p className="text-xs text-white/65 m-0 mt-0.5">
                  Specify how long sanctioned members must wait before submitting a new infraction appeal.
                </p>
              </div>
              {canEdit && onSaveConfig && (
                <button
                  type="button"
                  disabled={isSaving || appealCooldown === (hub.spec.appealCooldownHours ?? 168)}
                  onClick={() => onSaveConfig({ appealCooldownHours: appealCooldown })}
                  className="dashboard-btn-primary !min-h-[32px] !px-3.5 !py-1 !text-xs !font-bold"
                >
                  {isSaving ? "Saving…" : "Save Cooldown"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="hub-appeal-cooldown-policies"
                type="number"
                min={0}
                max={8760}
                value={appealCooldown}
                disabled={!canEdit || isSaving}
                onChange={(e) => setAppealCooldown(Number(e.target.value))}
                className="dashboard-input text-xs w-28"
              />
              <span className="text-xs text-white/60">
                hours ({Math.round(((appealCooldown || 0) / 24) * 10) / 10} days)
              </span>
            </div>
          </section>
        </>
      )}

      {subTab === "desk" && (
        <>
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
        </>
      )}
    </div>
  );
}
