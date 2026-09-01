import type { HubBadgeConfig, HubLogConfig } from "./types";
import type { GetHubBadgesRequest } from "~/generated/control/v1/static";
import type { GetHubLogConfigRequest } from "~/generated/control/v1/static";
import type { HubBadgeConfig as ProtoHubBadgeConfig } from "~/generated/control/v1/static";
import type { HubLogConfig as ProtoHubLogConfig } from "~/generated/control/v1/static";
import type { PatchHubBadgesRequest } from "~/generated/control/v1/static";
import type { PatchHubLogConfigRequest } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

export const hubBadgesLogsService = {
  async getBadges(hubId: string, actorId: string): Promise<HubBadgeConfig> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetHubBadgesRequest, ProtoHubBadgeConfig>(clients.hubClient.getBadges.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return {
      hubId: response.hubId || hubId,
      ownerBadge: response.ownerBadge || undefined,
      managerBadge: response.managerBadge || undefined,
      moderatorBadge: response.moderatorBadge || undefined,
    };
  },

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
    const response = await invokeUnary<PatchHubBadgesRequest, ProtoHubBadgeConfig>(clients.hubClient.patchBadges.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ownerBadge: input.ownerBadge ?? "",
      managerBadge: input.managerBadge ?? "",
      moderatorBadge: input.moderatorBadge ?? "",
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    const response = await invokeUnary<PatchHubLogConfigRequest, ProtoHubLogConfig>(clients.hubClient.patchLogConfig.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      channelId: input.channelId,
      eventFlags: input.eventFlags,
      notificationRoleId: input.notificationRoleId ?? "",
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return {
      hubId: response.hubId || input.hubId,
      channelId: response.channelId || input.channelId,
      eventFlags: Number(response.eventFlags || 0),
      notificationRoleId: response.notificationRoleId || undefined,
    };
  },

  async getLogConfig(hubId: string, actorId: string): Promise<HubLogConfig> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetHubLogConfigRequest, ProtoHubLogConfig>(clients.hubClient.getLogConfig.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return {
      hubId: response.hubId || hubId,
      channelId: response.channelId || "",
      eventFlags: Number(response.eventFlags || 0),
      notificationRoleId: response.notificationRoleId || undefined,
    };
  },
};
