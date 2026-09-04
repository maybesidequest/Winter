import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import {
  AppealsEmptyState,
  AppealSubmissionModal,
  InfractionCard,
  SubmittedAppealsSection,
  getStoredSubmittedAppeals,
  saveStoredSubmittedAppeal,
  type SubmittedAppealRecord,
} from "~/components/dashboard/appeals";
import { dashboardGlassCardStyle } from "~/components/dashboard/shared";
import { PageHeader, Section } from "~/components/dashboard/WorkspacePrimitives";
import { orpc } from "~/lib/orpc";
import type { Infraction } from "~/services/control/moderation.shared";

export default function AppealsPage() {
  const { capabilities = {} } = useOutletContext<{ capabilities?: Record<string, boolean> }>();
  const queryClient = useQueryClient();
  const appealKeys = useRef<Record<string, string>>({});
  const [selectedInfraction, setSelectedInfraction] = useState<Infraction | null>(null);
  const [submittedAppeals, setSubmittedAppeals] = useState<SubmittedAppealRecord[]>([]);

  useEffect(() => {
    setSubmittedAppeals(getStoredSubmittedAppeals());
  }, []);

  const infractionsQuery = useQuery({
    ...orpc.moderation.listMyAppealableInfractions.queryOptions(),
    enabled: capabilities.MODERATION || import.meta.env.DEV,
  });

  const submitAppeal = useMutation(
    orpc.moderation.submitAppeal.mutationOptions({
      onSuccess: async (_, variables) => {
        message.success("Appeal submitted. Hub moderators will review your request.");
        if (selectedInfraction) {
          const record: SubmittedAppealRecord = {
            infractionId: selectedInfraction.id,
            hubId: selectedInfraction.hubId,
            hubName: selectedInfraction.hubName,
            sanctionType: selectedInfraction.type,
            originalReason: selectedInfraction.reason,
            appealReason: variables.reason,
            submittedAt: new Date().toISOString(),
          };
          saveStoredSubmittedAppeal(record);
          setSubmittedAppeals(getStoredSubmittedAppeals());
        }
        setSelectedInfraction(null);
        await queryClient.invalidateQueries({
          queryKey: orpc.moderation.listMyAppealableInfractions.queryOptions().queryKey,
        });
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to submit appeal. Please try again.";
        message.error(msg);
      },
    }),
  );

  if (!capabilities.MODERATION && !import.meta.env.DEV) {
    return <Navigate to="/dashboard" replace />;
  }

  const infractions = infractionsQuery.data || [];

  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Moderation Appeals"
        description="Review sanctions on your account and submit an appeal for eligible Hub infractions."
      />

      <div className="flex flex-col gap-6">
        {submittedAppeals.length > 0 && <SubmittedAppealsSection records={submittedAppeals} />}

        <Section title="Appealable Sanctions">
          {infractionsQuery.isLoading && (
            <div className="dashboard-alert dashboard-alert--sage flex items-center gap-2">
              <LoadingOutlined /> Loading infractions…
            </div>
          )}

          {infractionsQuery.isError && (
            <div className="dashboard-alert">Unable to load infractions at this time. Please try again later.</div>
          )}

          {!infractionsQuery.isLoading && !infractionsQuery.isError && (
            <>
              {infractions.length === 0 ? (
                <AppealsEmptyState />
              ) : (
                <div style={dashboardGlassCardStyle} className="p-4 rounded-2xl flex flex-col gap-3">
                  {infractions.map((item) => (
                    <InfractionCard
                      key={item.id}
                      infraction={item}
                      onAppeal={() => {
                        setSelectedInfraction(item);
                        appealKeys.current[item.id] ??= crypto.randomUUID();
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </Section>
      </div>

      <AppealSubmissionModal
        infraction={selectedInfraction}
        open={Boolean(selectedInfraction)}
        isPending={submitAppeal.isPending}
        onClose={() => setSelectedInfraction(null)}
        onSubmit={(reason) => {
          if (!selectedInfraction) return;
          submitAppeal.mutate({
            hubId: selectedInfraction.hubId,
            infractionId: selectedInfraction.id,
            reason,
            idempotencyKey: (appealKeys.current[selectedInfraction.id] ??= crypto.randomUUID()),
          });
        }}
      />
    </>
  );
}
