import type { ShouldRevalidateFunctionArgs } from "react-router";

type ServerWorkspaceRevalidationArgs = Pick<
  ShouldRevalidateFunctionArgs,
  "currentParams" | "nextParams" | "formMethod" | "defaultShouldRevalidate"
>;

export function shouldRevalidateServerWorkspace({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}: ServerWorkspaceRevalidationArgs): boolean {
  if (currentParams.serverId !== nextParams.serverId) return true;
  if (formMethod) return true;
  // Supplementary tab data is loaded by React Query. Re-running this route
  // loader for every tab would refetch the authoritative server projection
  // and block navigation on unrelated data.
  if (currentParams.view !== nextParams.view) return false;
  return defaultShouldRevalidate;
}
