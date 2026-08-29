export type LifecycleAction = "lockdown" | "transfer" | "delete";

export type LifecycleRecovery = "STALE" | "DENIED" | "UNAVAILABLE" | "NOT_FOUND" | "INVALID";

export interface IdempotencyAttempt {
  fingerprint: string;
  key: string;
}

function errorCode(error: unknown): number | string | undefined {
  let current = error;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return undefined;
    if ("code" in current) return (current as { code?: number | string }).code;
    current = "cause" in current ? (current as { cause?: unknown }).cause : undefined;
  }
  return undefined;
}

export function classifyLifecycleError(error: unknown): LifecycleRecovery {
  const code = errorCode(error);
  if ([6, 9, 10, "CONFLICT", "ALREADY_EXISTS", "FAILED_PRECONDITION", "ABORTED"].includes(code as never)) {
    return "STALE";
  }
  if ([7, 16, "FORBIDDEN", "PERMISSION_DENIED", "UNAUTHENTICATED"].includes(code as never)) {
    return "DENIED";
  }
  if ([4, 14, "SERVICE_UNAVAILABLE", "DEADLINE_EXCEEDED", "UNAVAILABLE"].includes(code as never)) {
    return "UNAVAILABLE";
  }
  if ([5, "NOT_FOUND"].includes(code as never)) return "NOT_FOUND";
  return "INVALID";
}

export function idempotencyAttemptFor(
  current: IdempotencyAttempt | null,
  fingerprint: string,
  createKey: () => string = () => crypto.randomUUID(),
): IdempotencyAttempt {
  if (current?.fingerprint === fingerprint) return current;
  return { fingerprint, key: createKey() };
}

export function isExactHubNameConfirmation(confirmation: string, hubName: string): boolean {
  return confirmation === hubName;
}
