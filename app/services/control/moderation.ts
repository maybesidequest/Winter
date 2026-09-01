import type { Appeal as ProtoAppeal } from "~/generated/control/v1/static";
import type { AppealApprovalOutcome } from "~/generated/control/v1/static";
import { AppealStatus } from "~/generated/control/v1/static";
import type { ApplySanctionRequest } from "~/generated/control/v1/static";
import type { ApproveAppealRequest } from "~/generated/control/v1/static";
import type { GetAppealRequest } from "~/generated/control/v1/static";
import type { GetHubSafetySettingsRequest } from "~/generated/control/v1/static";
import type { GetInfractionRequest } from "~/generated/control/v1/static";
import type { GetSafetyAssessmentRequest } from "~/generated/control/v1/static";
import type { HubSafetySettings as ProtoHubSafetySettings } from "~/generated/control/v1/static";
import type { Infraction as ProtoInfraction } from "~/generated/control/v1/static";
import { InfractionLifecycleState } from "~/generated/control/v1/static";
import type { InfractionsResponse } from "~/generated/control/v1/static";
import type { ListHubAppealsRequest } from "~/generated/control/v1/static";
import type { ListHubAppealsResponse } from "~/generated/control/v1/static";
import type { ListInfractionsRequest } from "~/generated/control/v1/static";
import type { ListInfractionsResponse } from "~/generated/control/v1/static";
import type { ListMyAppealableInfractionsRequest } from "~/generated/control/v1/static";
import type { ModerationSubject as ProtoModerationSubject } from "~/generated/control/v1/static";
import type { PatchHubSafetySettingsRequest } from "~/generated/control/v1/static";
import type { RejectAppealRequest } from "~/generated/control/v1/static";
import type { RevokeSanctionRequest } from "~/generated/control/v1/static";
import type { SafetyAssessment as ProtoSafetyAssessment } from "~/generated/control/v1/static";
import type { SafetyRiskBand } from "~/generated/control/v1/static";
import type { SanctionEnforcementStatus } from "~/generated/control/v1/static";
import { SanctionType } from "~/generated/control/v1/static";
import type { SubmitAppealRequest } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

/** The Control Plane accepts exactly one human or server subject. */
export type ModerationSubject = { userId: string; serverId?: never } | { serverId: string; userId?: never };
export type ModerationFailureKind = "STALE" | "DENIED" | "UNAVAILABLE" | "NOT_FOUND";
export interface ModerationFailure { kind: ModerationFailureKind; message: string; }
export interface ModerationPage<T> { items: T[]; nextCursor: string | null; totalCount: number; }

export interface Infraction {
  id: string; hubId: string; userId: string; type: SanctionType; reason: string; issuerId: string; status: string;
  subject: ModerationSubject | null; version: number; lifecycleState: InfractionLifecycleState;
  enforcement: { status: SanctionEnforcementStatus; observedAt: string | null; error: string | null };
  expiresAt: string | null; createdAt: string | null; updatedAt: string | null; revokedAt: string | null;
  revokedBy: string | null; revocationReason: string | null; hubName?: string;
}
export interface Appeal {
  id: string; infractionId: string; hubId: string; userId: string; reason: string; status: string;
  appealStatus: AppealStatus; version: number; reviewerId: string | null; reviewedAt: string | null;
  resolutionReason: string | null; approvalOutcome: AppealApprovalOutcome; createdAt: string | null;
  updatedAt: string | null; infraction: Infraction | null;
}
export interface HubSafetySettings {
  hubId: string;
  spec: { hideLinks: boolean; spamFilter: boolean; blockInvites: boolean; blockNsfw: boolean; allowVideos: boolean; blockAttachments: boolean; blockTenorGifs: boolean };
  version: number; updatedAt: string | null;
}
export interface SafetyAssessment {
  subject: ModerationSubject | null; score: number; riskBand: SafetyRiskBand;
  approvedSignalSummaries: Array<{ code: string; summary: string; contribution: number; mitigating: boolean; observedAt: string | null }>;
  source: string; observedAt: string | null;
}

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | null {
  return value ? new Date((value.seconds ?? 0) * 1000 + (value.nanos ?? 0) / 1_000_000).toISOString() : null;
}
function nonEmpty(value: string | undefined): string | null { return value || null; }
function requestSubject(subject?: ModerationSubject): ProtoModerationSubject | undefined { return subject ? { ...subject } : undefined; }

export function toModerationSubject(value: ProtoModerationSubject | null | undefined): ModerationSubject | null {
  if (value?.userId) return { userId: value.userId };
  if (value?.serverId) return { serverId: value.serverId };
  return null;
}
export function toInfraction(value: ProtoInfraction): Infraction {
  return {
    id: value.id, hubId: value.hubId, userId: value.userId, type: value.type, reason: value.reason, issuerId: value.issuerId, status: value.status,
    subject: toModerationSubject(value.subject), version: value.version, lifecycleState: value.lifecycleState,
    enforcement: { status: value.enforcementStatus, observedAt: timestamp(value.enforcementObservedAt), error: nonEmpty(value.enforcementError) },
    expiresAt: timestamp(value.expiresAt), createdAt: timestamp(value.createdAt), updatedAt: timestamp(value.updatedAt), revokedAt: timestamp(value.revokedAt),
    revokedBy: nonEmpty(value.revokedBy), revocationReason: nonEmpty(value.revocationReason), hubName: value.hubName || undefined,
  };
}
export function toAppeal(value: ProtoAppeal): Appeal {
  return {
    id: value.id, infractionId: value.infractionId, hubId: value.hubId, userId: value.userId, reason: value.reason, status: value.status,
    appealStatus: value.appealStatus, version: value.version, reviewerId: nonEmpty(value.reviewerId), reviewedAt: timestamp(value.reviewedAt),
    resolutionReason: nonEmpty(value.resolutionReason), approvalOutcome: value.approvalOutcome, createdAt: timestamp(value.createdAt), updatedAt: timestamp(value.updatedAt),
    infraction: value.infraction ? toInfraction(value.infraction) : null,
  };
}
export function toHubSafetySettings(value: ProtoHubSafetySettings): HubSafetySettings {
  return { hubId: value.hubId, spec: {
    hideLinks: value.hideLinks, spamFilter: value.spamFilter, blockInvites: value.blockInvites, blockNsfw: value.blockNsfw,
    allowVideos: value.allowVideos, blockAttachments: value.blockAttachments, blockTenorGifs: value.blockTenorGifs,
  }, version: value.version, updatedAt: timestamp(value.updatedAt) };
}
export function toSafetyAssessment(value: ProtoSafetyAssessment): SafetyAssessment {
  return { subject: toModerationSubject(value.subject), score: value.score, riskBand: value.riskBand,
    approvedSignalSummaries: value.approvedSignalSummaries.map((signal) => ({ code: signal.code, summary: signal.summary, contribution: signal.contribution, mitigating: signal.mitigating, observedAt: timestamp(signal.observedAt) })),
    source: value.source, observedAt: timestamp(value.observedAt) };
}

/** Explicit error state for callers; unknown errors intentionally remain unknown. */
export function moderationFailureFor(error: unknown): ModerationFailure | null {
  const detail = error && typeof error === "object" ? error as { code?: unknown; message?: unknown; cause?: { code?: unknown } } : undefined;
  const code = detail?.code ?? detail?.cause?.code;
  const message = typeof detail?.message === "string" ? detail.message : "The moderation operation could not be completed.";
  if ([9, 10, "ABORTED", "FAILED_PRECONDITION", "CONFLICT"].includes(code as never)) return { kind: "STALE", message };
  if ([7, 16, "PERMISSION_DENIED", "UNAUTHENTICATED", "FORBIDDEN"].includes(code as never)) return { kind: "DENIED", message };
  if ([4, 14, "DEADLINE_EXCEEDED", "UNAVAILABLE", "SERVICE_UNAVAILABLE"].includes(code as never)) return { kind: "UNAVAILABLE", message };
  if ([5, "NOT_FOUND"].includes(code as never)) return { kind: "NOT_FOUND", message };
  return null;
}

export const moderationService = {
  async applySanction(input: { hubId: string; subject?: ModerationSubject; userId?: string; type: SanctionType; reason: string; durationSeconds?: number; actorId: string; idempotencyKey: string }): Promise<Infraction> {
    const subject = input.subject ?? (input.userId ? { userId: input.userId } : undefined);
    if (!subject) throw new Error("A moderation subject is required.");
    const client = getServiceClients().moderationClient;
    const response = await invokeUnary<ApplySanctionRequest, ProtoInfraction>(client.applySanction.bind(client), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, userId: "userId" in subject ? subject.userId : "",
      subject: requestSubject(subject), type: input.type, reason: input.reason, durationSeconds: input.durationSeconds ?? 0,
      operationId: input.idempotencyKey,
    });
    return toInfraction(response);
  },
  async revokeSanction(input: { hubId: string; infractionId: string; reason: string; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<Infraction> {
    const client = getServiceClients().moderationClient;
    return toInfraction(await invokeUnary<RevokeSanctionRequest, ProtoInfraction>(client.revokeSanction.bind(client), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, infractionId: input.infractionId, reason: input.reason, expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    }));
  },
  async listInfractions(input: { hubId: string; actorId: string; subject?: ModerationSubject; lifecycleState?: InfractionLifecycleState; sanctionType?: SanctionType; limit?: number; cursor?: string }): Promise<ModerationPage<Infraction>> {
    const client = getServiceClients().moderationClient;
    const response = await invokeUnary<ListInfractionsRequest, ListInfractionsResponse>(client.listInfractions.bind(client), {
      context: makeRequestContext(input.actorId), hubId: input.hubId, subject: requestSubject(input.subject),
      lifecycleState: input.lifecycleState ?? InfractionLifecycleState.INFRACTION_LIFECYCLE_STATE_UNSPECIFIED,
      sanctionType: input.sanctionType ?? SanctionType.SANCTION_TYPE_UNSPECIFIED, limit: input.limit ?? 50, cursor: input.cursor ?? "",
    });
    return { items: response.infractions.map(toInfraction), nextCursor: nonEmpty(response.nextCursor), totalCount: response.totalCount };
  },
  async getInfraction(input: { hubId: string; infractionId: string; actorId: string }): Promise<Infraction> {
    const client = getServiceClients().moderationClient;
    return toInfraction(await invokeUnary<GetInfractionRequest, ProtoInfraction>(client.getInfraction.bind(client), { context: makeRequestContext(input.actorId), hubId: input.hubId, infractionId: input.infractionId }));
  },
  async listHubAppeals(input: { hubId: string; actorId: string; status?: AppealStatus; subject?: ModerationSubject; limit?: number; cursor?: string }): Promise<ModerationPage<Appeal>> {
    const client = getServiceClients().moderationClient;
    const response = await invokeUnary<ListHubAppealsRequest, ListHubAppealsResponse>(client.listHubAppeals.bind(client), {
      context: makeRequestContext(input.actorId), hubId: input.hubId,
      status: input.status ?? AppealStatus.APPEAL_STATUS_PENDING, subject: requestSubject(input.subject), limit: input.limit ?? 50, cursor: input.cursor ?? "",
    });
    return { items: response.appeals.map(toAppeal), nextCursor: nonEmpty(response.nextCursor), totalCount: response.totalCount };
  },
  async getAppeal(input: { hubId: string; appealId: string; actorId: string }): Promise<Appeal> {
    const client = getServiceClients().moderationClient;
    return toAppeal(await invokeUnary<GetAppealRequest, ProtoAppeal>(client.getAppeal.bind(client), { context: makeRequestContext(input.actorId), hubId: input.hubId, appealId: input.appealId }));
  },
  async approveAppeal(input: { hubId: string; appealId: string; resolutionReason: string; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<Appeal> {
    const client = getServiceClients().moderationClient;
    return toAppeal(await invokeUnary<ApproveAppealRequest, ProtoAppeal>(client.approveAppeal.bind(client), { context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, appealId: input.appealId, resolutionReason: input.resolutionReason, expectedVersion: input.expectedVersion, operationId: input.idempotencyKey }));
  },
  async rejectAppeal(input: { hubId: string; appealId: string; resolutionReason: string; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<Appeal> {
    const client = getServiceClients().moderationClient;
    return toAppeal(await invokeUnary<RejectAppealRequest, ProtoAppeal>(client.rejectAppeal.bind(client), { context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, appealId: input.appealId, resolutionReason: input.resolutionReason, expectedVersion: input.expectedVersion, operationId: input.idempotencyKey }));
  },
  async getHubSafetySettings(input: { hubId: string; actorId: string }): Promise<HubSafetySettings> {
    const client = getServiceClients().moderationClient;
    return toHubSafetySettings(await invokeUnary<GetHubSafetySettingsRequest, ProtoHubSafetySettings>(client.getHubSafetySettings.bind(client), { context: makeRequestContext(input.actorId), hubId: input.hubId }));
  },
  async patchHubSafetySettings(input: { hubId: string; settings: Partial<HubSafetySettings["spec"]>; updateMask: Array<keyof HubSafetySettings["spec"]>; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<HubSafetySettings> {
    const client = getServiceClients().moderationClient;
    return toHubSafetySettings(await invokeUnary<PatchHubSafetySettingsRequest, ProtoHubSafetySettings>(client.patchHubSafetySettings.bind(client), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, settings: {
        hubId: input.hubId,
        hideLinks: input.settings.hideLinks ?? false,
        spamFilter: input.settings.spamFilter ?? false,
        blockInvites: input.settings.blockInvites ?? false,
        blockNsfw: input.settings.blockNsfw ?? false,
        allowVideos: input.settings.allowVideos ?? false,
        blockAttachments: input.settings.blockAttachments ?? false,
        blockTenorGifs: input.settings.blockTenorGifs ?? false,
        version: 0,
      }, updateMask: input.updateMask, expectedVersion: input.expectedVersion, operationId: input.idempotencyKey,
    }));
  },
  async getSafetyAssessment(input: { hubId: string; subject: ModerationSubject; actorId: string }): Promise<SafetyAssessment> {
    const client = getServiceClients().moderationClient;
    return toSafetyAssessment(await invokeUnary<GetSafetyAssessmentRequest, ProtoSafetyAssessment>(client.getSafetyAssessment.bind(client), { context: makeRequestContext(input.actorId), hubId: input.hubId, subject: requestSubject(input.subject) }));
  },
  async getInfractions(params: { hubId: string; userId?: string; actorId: string }): Promise<Infraction[]> {
    return (await moderationService.listInfractions({ ...params, subject: params.userId ? { userId: params.userId } : undefined })).items;
  },
  async listMyAppealableInfractions(actorId: string): Promise<Infraction[]> {
    const client = getServiceClients().moderationClient;
    const response = await invokeUnary<ListMyAppealableInfractionsRequest, InfractionsResponse>(client.listMyAppealableInfractions.bind(client), { context: makeRequestContext(actorId) });
    return response.infractions.map(toInfraction);
  },
  async submitAppeal(input: { hubId: string; infractionId: string; reason: string; actorId: string; idempotencyKey: string }): Promise<Appeal> {
    const client = getServiceClients().moderationClient;
    return toAppeal(await invokeUnary<SubmitAppealRequest, ProtoAppeal>(client.submitAppeal.bind(client), { context: makeRequestContext(input.actorId, true, input.idempotencyKey), hubId: input.hubId, infractionId: input.infractionId, reason: input.reason, operationId: input.idempotencyKey }));
  },
};
