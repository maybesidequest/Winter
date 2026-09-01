import type { SafetyItemResource, SafetyItemType } from "~/resources/safety";
import { moderationService } from "./control/moderation";

/**
 * Winter does not own moderation data. Until the canonical Control Plane
 * exposes a particular collection, report it as unavailable instead of
 * reaching into a provider or presenting an empty queue as truth.
 */
export class SafetyCollectionUnavailableError extends Error {
  constructor(type: SafetyItemType) {
    super(`The Control Plane does not expose ${type} records yet.`);
    this.name = "SafetyCollectionUnavailableError";
  }
}

export const safetyService = {
  async list(actorId: string, input: { hubId: string; type: SafetyItemType; cursor?: string }) {
    if (input.type === "infraction") {
      const page = await moderationService.listInfractions({ hubId: input.hubId, actorId, cursor: input.cursor });
      return {
        items: page.items.map((item): SafetyItemResource => ({
          metadata: { id: item.id, createdAt: item.createdAt, version: item.version },
          spec: {
            type: "infraction",
            summary: item.reason,
            reasonCodes: [],
            subject: item.subject || { userId: item.userId },
          },
          status: {
            state: item.lifecycleState,
            assignedTo: undefined,
            resolvedBy: item.revokedBy || undefined,
          },
        })),
        nextCursor: page.nextCursor,
      };
    }

    if (input.type === "appeal") {
      const page = await moderationService.listHubAppeals({ hubId: input.hubId, actorId, cursor: input.cursor });
      return {
        items: page.items.map((item): SafetyItemResource => ({
          metadata: { id: item.id, createdAt: item.createdAt, version: item.version },
          spec: {
            type: "appeal",
            summary: item.reason,
            reasonCodes: [],
            subject: { userId: item.userId },
          },
          status: {
            state: item.appealStatus,
            assignedTo: item.reviewerId || undefined,
            resolvedBy: item.reviewerId || undefined,
          },
        })),
        nextCursor: page.nextCursor,
      };
    }

    throw new SafetyCollectionUnavailableError(input.type);
  },

  async adjudicate(
    _actorId: string,
    _hubId: string,
    _input: { reviewItemId: string; resolution: "APPROVE" | "REJECT" | "EXPIRE"; reason: string; expectedVersion: number },
  ): Promise<never> {
    throw new SafetyCollectionUnavailableError("review");
  },
};
