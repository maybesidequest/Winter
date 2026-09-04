// Client-safe moderation types and helpers. This module must never import
// "./transport" (or anything reachable from it): it is loaded by dashboard
// components, and pulling in the gRPC runtime breaks the browser bundle with
// "process is not defined".
import type { AppealApprovalOutcome, AppealStatus, InfractionLifecycleState, SafetyRiskBand, SanctionEnforcementStatus } from "~/generated/control/v1/static";
import { SanctionType } from "~/generated/control/v1/static";

/** The Control Plane accepts exactly one human or server subject. */
export type ModerationSubject = { userId: string; serverId?: never } | { serverId: string; userId?: never };
export type ModerationFailureKind = "STALE" | "UNAVAILABLE" | "NOT_FOUND";
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

/** Explicit error state for callers; unknown errors intentionally remain unknown. */
export function moderationFailureFor(error: unknown): ModerationFailure | null {
  const detail = error && typeof error === "object"
    ? error as { code?: unknown; grpcCode?: unknown; message?: unknown; cause?: { code?: unknown } }
    : undefined;
  // Classify on the numeric gRPC status; ControlPlaneError's `code` is the
  // human-readable name and must never be pattern-matched.
  const code = detail?.grpcCode ?? detail?.code ?? detail?.cause?.code;
  const message = typeof detail?.message === "string" ? detail.message : "The moderation operation could not be completed.";
  if ([9, 10, "ABORTED", "FAILED_PRECONDITION", "CONFLICT"].includes(code as never)) return { kind: "STALE", message };
  // Moderation records are Hub-private and the Control Plane checks existence
  // before permission, so denied and missing surface identically.
  if ([5, 7, 16, "NOT_FOUND", "PERMISSION_DENIED", "UNAUTHENTICATED"].includes(code as never)) {
    return { kind: "NOT_FOUND", message: "Moderation record not found or access denied." };
  }
  if ([4, 14, "DEADLINE_EXCEEDED", "UNAVAILABLE", "SERVICE_UNAVAILABLE"].includes(code as never)) return { kind: "UNAVAILABLE", message };
  return null;
}
