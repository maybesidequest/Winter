import type { HubBadgeConfig, HubLogConfig } from "./types";
import type { HubBadgeConfig as ProtoHubBadgeConfig } from "~/generated/control/v1/interchat/control/v1/HubBadgeConfig";
import type { HubLogConfig as ProtoHubLogConfig } from "~/generated/control/v1/interchat/control/v1/HubLogConfig";
import type { PatchHubBadgesRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubBadgesRequest";
import type { PatchHubLogConfigRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubLogConfigRequest";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

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
    const response = await invokeUnary<PatchHubBadgesRequest, ProtoHubBadgeConfig>(clients.hubClient.PatchBadges.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ownerBadge: input.ownerBadge,
      managerBadge: input.managerBadge,
      moderatorBadge: input.moderatorBadge,
      expectedVersion: input.expectedVersion,
    });
    return {
      hubId: response.hubId || input.hubId,
      ownerBadge: response.ownerBadge || undefined,
      managerBadge: response.managerBadge || undefined,
      moderatorBadge: response.moderatorBadge || undefined,
    };
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
    const response = await invokeUnary<PatchHubLogConfigRequest, ProtoHubLogConfig>(clients.hubClient.PatchLogConfig.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      channelId: input.channelId,
      eventFlags: input.eventFlags,
      notificationRoleId: input.notificationRoleId,
      expectedVersion: input.expectedVersion,
    });
    return {
      hubId: response.hubId || input.hubId,
      channelId: response.channelId || input.channelId,
      eventFlags: Number(response.eventFlags || 0),
      notificationRoleId: response.notificationRoleId || undefined,
    };
  },
};
