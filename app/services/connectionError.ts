export type ConnectionControlErrorCode =
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "CONFLICT"
  | "SERVICE_UNAVAILABLE"
  | "NOT_FOUND";

function controlCode(error: unknown): number | string | undefined {
  let current = error;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return undefined;
    const candidate = current as { grpcCode?: unknown; code?: unknown; cause?: unknown };
    // ControlPlaneError carries the numeric gRPC status as grpcCode; its
    // `code` is the human-readable name, which must not be classified.
    if (typeof candidate.grpcCode === "number") return candidate.grpcCode;
    if ("code" in candidate) return candidate.code as number | string;
    current = candidate.cause;
  }
  return undefined;
}

export function classifyConnectionControlError(error: unknown): ConnectionControlErrorCode {
  const code = controlCode(error);
  if (code === 5 || code === "NOT_FOUND") return "NOT_FOUND";
  if (code === 7 || code === "PERMISSION_DENIED") return "FORBIDDEN";
  if ([6, 9, 10, "ALREADY_EXISTS", "FAILED_PRECONDITION", "ABORTED"].includes(code as never)) {
    return "CONFLICT";
  }
  if ([4, 14, 16, "DEADLINE_EXCEEDED", "UNAVAILABLE", "UNAUTHENTICATED"].includes(code as never)) {
    return "SERVICE_UNAVAILABLE";
  }
  return "BAD_REQUEST";
}

export function connectionControlErrorMessage(error: unknown, fallback: string): string {
  const code = classifyConnectionControlError(error);
  if (code === "NOT_FOUND") return "This connection is no longer available.";
  if (code === "FORBIDDEN") return "You do not have permission to manage this connection.";
  if (code === "CONFLICT") return "This connection changed while you were editing it. Refresh and try again.";
  if (code === "SERVICE_UNAVAILABLE") return "Connection management is temporarily unavailable. Try again shortly.";
  return fallback;
}
