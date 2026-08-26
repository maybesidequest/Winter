import type { HubBadgeConfig, HubLogConfig } from "./types";
import type { GetHubBadgesRequest } from "~/generated/control/v1/interchat/control/v1/GetHubBadgesRequest";
import type { GetHubLogConfigRequest } from "~/generated/control/v1/interchat/control/v1/GetHubLogConfigRequest";
import type { HubBadgeConfig as ProtoHubBadgeConfig } from "~/generated/control/v1/interchat/control/v1/HubBadgeConfig";
import type { HubLogConfig as ProtoHubLogConfig } from "~/generated/control/v1/interchat/control/v1/HubLogConfig";
import type { PatchHubBadgesRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubBadgesRequest";
import type { PatchHubLogConfigRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubLogConfigRequest";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

export const hubBadgesLogsService = {
  async getBadges(hubId: string, actorId: string): Promise<HubBadgeConfig> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetHubBadgesRequest, ProtoHubBadgeConfig>(clients.hubClient.GetBadges.bind(clients.hubClient), {
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
    const response = await invokeUnary<PatchHubBadgesRequest, ProtoHubBadgeConfig>(clients.hubClient.PatchBadges.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ownerBadge: input.ownerBadge ?? "",
      managerBadge: input.managerBadge ?? "",
      moderatorBadge: input.moderatorBadge ?? "",
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

  async getLogConfig(hubId: string, actorId: string): Promise<HubLogConfig> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetHubLogConfigRequest, ProtoHubLogConfig>(clients.hubClient.GetLogConfig.bind(clients.hubClient), {
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
