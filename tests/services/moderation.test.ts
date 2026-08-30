import { describe, expect, it } from "bun:test";
import { moderationFailureFor, toAppeal, toHubSafetySettings, toInfraction, toSafetyAssessment } from "~/services/control/moderation";

describe("canonical moderation representations", () => {
  it("preserves lifecycle, enforcement, and its observed timestamp", () => {
    const infraction = toInfraction({ id: "i-1", hubId: "h-1", userId: "u-1", type: "SANCTION_TYPE_BAN", reason: "Reason", issuerId: "mod", status: "INFRACTION_STATUS_ACTIVE", expiresAt: null, createdAt: null, hubName: "", subject: { userId: "u-1", subject: "userId" }, version: 3, lifecycleState: "INFRACTION_LIFECYCLE_STATE_ACTIVE", enforcementStatus: "SANCTION_ENFORCEMENT_STATUS_PENDING", updatedAt: null, enforcementObservedAt: { seconds: 1720000000, nanos: 0 }, enforcementError: "", revokedAt: null, revokedBy: "", revocationReason: "" });
    expect(infraction.lifecycleState).toBe("INFRACTION_LIFECYCLE_STATE_ACTIVE");
    expect(infraction.enforcement).toEqual({ status: "SANCTION_ENFORCEMENT_STATUS_PENDING", observedAt: "2024-07-03T09:46:40.000Z", error: null });
  });
  it("keeps canonical appeal, settings, and approved assessment data", () => {
    const appeal = toAppeal({ id: "a-1", infractionId: "i-1", hubId: "h-1", userId: "u-1", reason: "Please review", status: "", createdAt: null, appealStatus: "APPEAL_STATUS_PENDING", version: 2, reviewerId: "", reviewedAt: null, resolutionReason: "", infraction: null, approvalOutcome: "APPEAL_APPROVAL_OUTCOME_NOT_APPLICABLE", updatedAt: null });
    expect(appeal.appealStatus).toBe("APPEAL_STATUS_PENDING");
    expect(toHubSafetySettings({ hubId: "h-1", hideLinks: true, spamFilter: true, blockInvites: false, blockNsfw: true, allowVideos: false, blockAttachments: false, blockTenorGifs: false, version: 7, updatedAt: null })).toMatchObject({ version: 7, spec: { hideLinks: true } });
    expect(toSafetyAssessment({ subject: { serverId: "s-1", subject: "serverId" }, score: 42, riskBand: "SAFETY_RISK_BAND_MEDIUM", approvedSignalSummaries: [{ code: "SPAM", summary: "Repeated spam", contribution: 10, mitigating: false, observedAt: null }], source: "control", observedAt: null }).approvedSignalSummaries[0]?.code).toBe("SPAM");
  });
  it("maps Control Plane failures to explicit dashboard recovery states", () => {
    expect(moderationFailureFor({ code: 10, message: "changed" })?.kind).toBe("STALE");
    expect(moderationFailureFor({ code: 7 })?.kind).toBe("DENIED");
    expect(moderationFailureFor({ code: 14 })?.kind).toBe("UNAVAILABLE");
    expect(moderationFailureFor({ code: 5 })?.kind).toBe("NOT_FOUND");
  });
});
