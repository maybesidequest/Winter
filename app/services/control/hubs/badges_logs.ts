import type { HubBadgeConfig, HubLogConfig } from "./types";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

export const hubBadgesLogsService = {
  async patchBadges(input: {
    hubId: string;
    ownerBadge?: string;
    managerBadge?: string;
    moderatorBadge?: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubBadgeConfig> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchBadges", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ownerBadge: input.ownerBadge,
      managerBadge: input.managerBadge,
      moderatorBadge: input.moderatorBadge,
      expectedVersion: input.expectedVersion,
    });
  },

  async patchLogConfig(input: {
    hubId: string;
    channelId: string;
    eventFlags: number;
    notificationRoleId?: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubLogConfig> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchLogConfig", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      channelId: input.channelId,
      eventFlags: input.eventFlags,
      notificationRoleId: input.notificationRoleId,
      expectedVersion: input.expectedVersion,
    });
  },
};
