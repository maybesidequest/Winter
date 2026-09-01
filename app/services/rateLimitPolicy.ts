export type RateLimitPolicy = {
  name: string;
  limit: number;
  windowSeconds: number;
};

const MUTATION_SEGMENTS = new Set([
  "add",
  "acknowledge",
  "adjudicateHeld",
  "approveAppeal",
  "assignStaffRole",
  "connect",
  "create",
  "createAnnouncement",
  "createInvite",
  "createRole",
  "createRule",
  "delete",
  "deleteAnnouncement",
  "deleteRole",
  "deleteRule",
  "disconnectBridge",
  "lockdown",
  "patch",
  "patchBadges",
  "patchCallConfig",
  "patchLogConfig",
  "patchPreferences",
  "patchPrefix",
  "quickConnect",
  "rejectAppeal",
  "remove",
  "removeBlock",
  "removeModerator",
  "removeStaffRole",
  "repairBridge",
  "reorderRules",
  "revokeInvite",
  "revokeSanction",
  "submitAppeal",
  "submitFeedback",
  "toggleBridge",
  "transitionAnnouncement",
  "upvote",
  "update",
  "updateAnnouncement",
  "updateRole",
  "updateRule",
]);

export function rateLimitPolicyForPath(path: readonly (string | number)[]): RateLimitPolicy {
  const segment = String(path.at(-1) ?? "");
  if (segment === "search") return { name: "search", limit: 30, windowSeconds: 60 };
  if (segment === "export" || segment === "exportData") {
    return { name: "exports", limit: 2, windowSeconds: 60 };
  }
  if (MUTATION_SEGMENTS.has(segment)) return { name: "mutations", limit: 30, windowSeconds: 60 };
  return { name: "reads", limit: 120, windowSeconds: 60 };
}
