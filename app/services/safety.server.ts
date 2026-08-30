import type { SafetyItemResource, SafetyItemType } from "~/resources/safety";
import { permissionService } from "./permission.server";
import { polarizerClient } from "./polarizer.server";
import { moderationService } from "./control/moderation";

function timestamp(value: any): string | null {
  if (!value?.seconds) return null;
  return new Date(Number(value.seconds) * 1000 + Math.floor(Number(value.nanos || 0) / 1_000_000)).toISOString();
}

function normalize(type: SafetyItemType, item: any): SafetyItemResource {
  const reasonCodes = item.reasonCodes || [];
  const summary = type === "review" ? (reasonCodes.join(", ") || "Message held before delivery")
    : type === "report" ? (item.description || item.type || "Member report")
    : type === "appeal" ? (item.reason || "Moderation appeal")
    : item.reason || `${type[0].toUpperCase()}${type.slice(1)} record`;
  return {
    metadata: { id: item.id, createdAt: timestamp(item.createdAt), version: Number(item.version || 0) },
    spec: { type, summary, reasonCodes, subject: item.subject || {}, priority: item.priority },
    status: { state: item.status || "RESOURCE_STATUS_UNSPECIFIED", assignedTo: item.assignedTo, resolvedBy: item.resolvedBy },
  };
}

export const safetyService = {
  async list(actorId: string, input: { hubId: string; type: SafetyItemType; cursor?: string }) {
    // Infractions and appeals are canonical Control Plane resources. Polarizer
    // only owns message-review evidence and must never supply their state.
    if (input.type === "infraction") {
      const page = await moderationService.listInfractions({ hubId: input.hubId, actorId, cursor: input.cursor });
      return {
        items: page.items.map((item) => ({
          metadata: { id: item.id, createdAt: item.createdAt, version: item.version },
          spec: { type: "infraction" as const, summary: item.reason, reasonCodes: [], subject: item.subject || { userId: item.userId } },
          status: { state: item.lifecycleState, assignedTo: undefined, resolvedBy: item.revokedBy || undefined },
        })),
        nextCursor: page.nextCursor,
      };
    }
    if (input.type === "appeal") {
      const page = await moderationService.listHubAppeals({ hubId: input.hubId, actorId, cursor: input.cursor });
      return {
        items: page.items.map((item) => ({
          metadata: { id: item.id, createdAt: item.createdAt, version: item.version },
          spec: { type: "appeal" as const, summary: item.reason, reasonCodes: [], subject: { userId: item.userId } },
          status: { state: item.appealStatus, assignedTo: item.reviewerId || undefined, resolvedBy: item.reviewerId || undefined },
        })),
        nextCursor: page.nextCursor,
      };
    }
    await permissionService.assertCanPerform(actorId, input.hubId, "VIEW_LOGS");
    const methods = {
      review: polarizerClient.listReviews,
      report: polarizerClient.listReports,
      restriction: polarizerClient.listRestrictions,
    };
    const response = await methods[input.type](actorId, input.hubId, input.cursor);
    const collection = response.items || response.reports || response.appeals || response.infractions || response.restrictions || [];
    return { items: collection.map((item: any) => normalize(input.type, item)), nextCursor: response.page?.nextCursor || null };
  },

  async adjudicate(actorId: string, hubId: string, input: { reviewItemId: string; resolution: "APPROVE" | "REJECT" | "EXPIRE"; reason: string; expectedVersion: number }) {
    await permissionService.assertCanPerform(actorId, hubId, "MODERATE_MESSAGES");
    const result = await polarizerClient.adjudicateHeld(actorId, hubId, input);
    return { state: result.state, version: Number(result.version), deliveryPending: input.resolution === "APPROVE" };
  },
};
