export const HUB_CREATION_UNAVAILABLE_MESSAGE =
  "Hub creation is not enabled for this release cohort. Existing Hubs remain available.";

/**
 * Hub listing and Hub lifecycle are separately rolled out. Never expose a
 * create action solely because the actor may list existing Hubs: the mutation
 * itself is fail-closed at the ORPC boundary.
 */
export function canCreateHub(capabilities: Record<string, boolean>): boolean {
  return capabilities.HUB_LIFECYCLE === true;
}
