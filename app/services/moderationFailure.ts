export type ModerationFailureKind = "STALE" | "DENIED" | "UNAVAILABLE" | "NOT_FOUND";

export interface ModerationFailure {
  kind: ModerationFailureKind;
  message: string;
}

/** Maps Control Plane failures to dashboard recovery states without server imports. */
export function moderationFailureFor(error: unknown): ModerationFailure | null {
  const detail = error && typeof error === "object"
    ? error as { code?: unknown; message?: unknown; cause?: { code?: unknown } }
    : undefined;
  const code = detail?.code ?? detail?.cause?.code;
  const message = typeof detail?.message === "string"
    ? detail.message
    : "The moderation operation could not be completed.";

  if ([9, 10, "ABORTED", "FAILED_PRECONDITION", "CONFLICT"].includes(code as never)) {
    return { kind: "STALE", message };
  }
  if ([7, 16, "PERMISSION_DENIED", "UNAUTHENTICATED", "FORBIDDEN"].includes(code as never)) {
    return { kind: "DENIED", message };
  }
  if ([4, 14, "DEADLINE_EXCEEDED", "UNAVAILABLE", "SERVICE_UNAVAILABLE"].includes(code as never)) {
    return { kind: "UNAVAILABLE", message };
  }
  if ([5, "NOT_FOUND"].includes(code as never)) {
    return { kind: "NOT_FOUND", message };
  }
  return null;
}
