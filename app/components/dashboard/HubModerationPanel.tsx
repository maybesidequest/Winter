import {
  AuditOutlined,
  HistoryOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
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
import { HubAppealCooldownCard } from "~/components/dashboard/moderation/HubAppealCooldownCard";
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

  const pendingAppealsCount = appealsQuery.data?.items?.length ?? 0;
  const infractionsCount = infractionsQuery.data?.items?.length ?? 0;

  return (
    <div className="flex max-w-4xl flex-col gap-6 w-full">
      {/* Moderation Sub-tabs */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setSubTab("desk")}
          className={`dashboard-pill-btn cursor-pointer flex items-center gap-2 ${
            subTab === "desk" ? "dashboard-pill-btn--active" : ""
          }`}
        >
          <AuditOutlined />
          <span>Live Desk</span>
          {pendingAppealsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-violet-400 text-[#0b0c14] text-xs font-bold">
              {pendingAppealsCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("policies")}
          className={`dashboard-pill-btn cursor-pointer flex items-center gap-2 ${
            subTab === "policies" ? "dashboard-pill-btn--active" : ""
          }`}
        >
          <SafetyCertificateOutlined />
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
        <div className="flex flex-col gap-6">
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
            <div className="rounded-2xl border p-6 animate-pulse text-xs text-white/60" style={dashboardGlassCardStyle}>
              Loading canonical safety policies…
            </div>
          ) : null}

          <HubAppealCooldownCard
            hub={hub}
            canEdit={canEdit}
            isSaving={isSaving}
            onSaveConfig={onSaveConfig}
          />
        </div>
      )}

      {subTab === "desk" && (
        <div className="flex flex-col gap-6">
          {/* Appeals Review Card */}
          <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <InboxOutlined className="text-violet-400 text-base" />
                <h3 className="text-base font-bold text-white font-['Sora'] m-0">Pending Infraction Appeals</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 font-semibold">
                  {pendingAppealsCount} awaiting review
                </span>
              </div>
            </div>

            {appealsQuery.isError ? (
              <div role="alert" className="rounded-xl border border-[#ff8c73]/30 bg-[#ff8c73]/10 px-3 py-2 text-xs text-[#ff8c73]">
                Appeals service is temporarily unreachable. Please retry shortly.
              </div>
            ) : appealsQuery.isPending ? (
              <p className="m-0 animate-pulse text-xs text-white/60">Loading pending appeals…</p>
            ) : (
              <AppealList
                appeals={appealsQuery.data?.items ?? []}
                onOpenDecision={canModerate ? openDecisionModal : undefined}
              />
            )}
          </section>

          {/* Sanctions & Infractions Card */}
          <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <HistoryOutlined className="text-sky-400 text-base" />
                <h3 className="text-base font-bold text-white font-['Sora'] m-0">Enforced Sanctions</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 font-semibold">
                  {infractionsCount} total logged
                </span>
              </div>
            </div>

            {infractionsQuery.isError ? (
              <div role="alert" className="rounded-xl border border-[#ff8c73]/30 bg-[#ff8c73]/10 px-3 py-2 text-xs text-[#ff8c73]">
                Infractions log is temporarily unreachable. Please retry shortly.
              </div>
            ) : infractionsQuery.isPending ? (
              <p className="m-0 animate-pulse text-xs text-white/60">Loading infraction records…</p>
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

          {/* Member Safety Assessment Card */}
          <section className="rounded-2xl border p-6 flex flex-col gap-4" style={dashboardGlassCardStyle}>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <UserOutlined className="text-emerald-400 text-base" />
                <h3 className="text-base font-bold text-white font-['Sora'] m-0">Member Safety Assessment</h3>
              </div>
              <div className="w-full sm:w-72">
                <label className="sr-only" htmlFor="hub-safety-subject">Member to assess</label>
                <HubSubjectSelector
                  id="hub-safety-subject"
                  hubId={hub.metadata.id}
                  value={subjectUserId}
                  onChange={setSubjectUserId}
                  placeholder="Search member by Discord username…"
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
      )}
    </div>
  );
}
