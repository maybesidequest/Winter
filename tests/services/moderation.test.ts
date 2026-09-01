import { describe, expect, it } from "bun:test";
import { moderationFailureFor, toAppeal, toHubSafetySettings, toInfraction, toSafetyAssessment } from "~/services/control/moderation";
import {
  AppealApprovalOutcome,
  AppealStatus,
  InfractionLifecycleState,
  InfractionStatus,
  SafetyRiskBand,
  SanctionEnforcementStatus,
  SanctionType,
} from "~/generated/control/v1/static";

describe("canonical moderation representations", () => {
  it("preserves lifecycle, enforcement, and its observed timestamp", () => {
    const infraction = toInfraction({ id: "i-1", hubId: "h-1", userId: "u-1", type: SanctionType.SANCTION_TYPE_BAN, reason: "Reason", issuerId: "mod", status: InfractionStatus.INFRACTION_STATUS_ACTIVE, expiresAt: undefined, createdAt: undefined, hubName: "", subject: { userId: "u-1" }, version: 3, lifecycleState: InfractionLifecycleState.INFRACTION_LIFECYCLE_STATE_ACTIVE, enforcementStatus: SanctionEnforcementStatus.SANCTION_ENFORCEMENT_STATUS_PENDING, updatedAt: undefined, enforcementObservedAt: { seconds: 1720000000, nanos: 0 }, enforcementError: "", revokedAt: undefined, revokedBy: "", revocationReason: "" });
    expect(infraction.lifecycleState).toBe(InfractionLifecycleState.INFRACTION_LIFECYCLE_STATE_ACTIVE);
    expect(infraction.enforcement).toEqual({ status: SanctionEnforcementStatus.SANCTION_ENFORCEMENT_STATUS_PENDING, observedAt: "2024-07-03T09:46:40.000Z", error: null });
  });
  it("keeps canonical appeal, settings, and approved assessment data", () => {
    const appeal = toAppeal({ id: "a-1", infractionId: "i-1", hubId: "h-1", userId: "u-1", reason: "Please review", status: "", createdAt: undefined, appealStatus: AppealStatus.APPEAL_STATUS_PENDING, version: 2, reviewerId: "", reviewedAt: undefined, resolutionReason: "", infraction: undefined, approvalOutcome: AppealApprovalOutcome.APPEAL_APPROVAL_OUTCOME_NOT_APPLICABLE, updatedAt: undefined });
    expect(appeal.appealStatus).toBe(AppealStatus.APPEAL_STATUS_PENDING);
    expect(toHubSafetySettings({ hubId: "h-1", hideLinks: true, spamFilter: true, blockInvites: false, blockNsfw: true, allowVideos: false, blockAttachments: false, blockTenorGifs: false, version: 7, updatedAt: undefined })).toMatchObject({ version: 7, spec: { hideLinks: true } });
    expect(toSafetyAssessment({ subject: { serverId: "s-1" }, score: 42, riskBand: SafetyRiskBand.SAFETY_RISK_BAND_MEDIUM, approvedSignalSummaries: [{ code: "SPAM", summary: "Repeated spam", contribution: 10, mitigating: false, observedAt: undefined }], source: "control", observedAt: undefined }).approvedSignalSummaries[0]?.code).toBe("SPAM");
  });
  it("maps Control Plane failures to explicit dashboard recovery states", () => {
    expect(moderationFailureFor({ code: 10, message: "changed" })?.kind).toBe("STALE");
    expect(moderationFailureFor({ code: 7 })?.kind).toBe("NOT_FOUND");
    expect(moderationFailureFor({ grpcCode: 7 })?.kind).toBe("NOT_FOUND");
    expect(moderationFailureFor({ code: 14 })?.kind).toBe("UNAVAILABLE");
    expect(moderationFailureFor({ code: 5 })?.kind).toBe("NOT_FOUND");
  });
});
