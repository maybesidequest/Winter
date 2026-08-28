export type ServerDataState = "not_requested" | "ready" | "empty" | "permission_denied" | "unavailable";

export function stateForControlError(error: unknown): {
  state: Exclude<ServerDataState, "not_requested" | "ready" | "empty">;
  message: string;
} {
  const message = error instanceof Error ? error.message : "";
  if (/permission|denied|manage server|forbidden/i.test(message)) {
    return { state: "permission_denied", message: "You do not have permission to view this server data." };
  }
  return { state: "unavailable", message: "This server data is temporarily unavailable. Try again shortly." };
}
