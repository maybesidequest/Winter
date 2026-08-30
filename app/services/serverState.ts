export type ServerDataState = "not_requested" | "loading" | "ready" | "empty" | "permission_denied" | "unavailable";

export function stateForCollection(enabled: boolean, itemCount: number): ServerDataState {
  if (!enabled) return "not_requested";
  return itemCount === 0 ? "empty" : "ready";
}

function errorDetails(error: unknown): { message: string; code?: number | string } {
  if (!error || typeof error !== "object") return { message: "" };
  const value = error as { message?: unknown; details?: unknown; code?: unknown; cause?: unknown };
  const own = [value.message, value.details].filter((item): item is string => typeof item === "string").join(" ");
  const nested = value.cause ? errorDetails(value.cause) : { message: "" };
  return {
    message: `${own} ${nested.message}`.trim(),
    code: value.code === undefined ? nested.code : (value.code as number | string),
  };
}

export function stateForControlError(error: unknown): {
  state: Exclude<ServerDataState, "not_requested" | "loading" | "ready" | "empty">;
  message: string;
} {
  const details = errorDetails(error);
  const permissionCode = details.code === 7 || details.code === "PERMISSION_DENIED";
  if (permissionCode || /permission|denied|manage server|forbidden/i.test(details.message)) {
    return { state: "permission_denied", message: "You do not have permission to view this server data." };
  }
  return { state: "unavailable", message: "This server data is temporarily unavailable. Try again shortly." };
}
