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
    channelId?: string;
    eventFlags?: number;
    notificationRoleId?: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
    modLogsChannelId?: string;
    modLogsRoleId?: string;
    joinLeavesChannelId?: string;
    joinLeavesRoleId?: string;
    messageModerationChannelId?: string;
    messageModerationRoleId?: string;
    reportsChannelId?: string;
    reportsRoleId?: string;
    networkAlertsChannelId?: string;
    networkAlertsRoleId?: string;
    appealsChannelId?: string;
    appealsRoleId?: string;
    safetyAlertsChannelId?: string;
    safetyAlertsRoleId?: string;
  }): Promise<HubLogConfig> {
    const clients = getServiceClients();
    const modChannel = input.modLogsChannelId !== undefined ? input.modLogsChannelId : (input.channelId ?? "");
    const modRole = input.modLogsRoleId !== undefined ? input.modLogsRoleId : (input.notificationRoleId ?? "");
    const response = await invokeUnary<PatchHubLogConfigRequest, ProtoHubLogConfig>(clients.hubClient.patchLogConfig.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      channelId: modChannel,
      eventFlags: input.eventFlags ?? 0,
      notificationRoleId: modRole,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
      modLogsChannelId: input.modLogsChannelId,
      modLogsRoleId: input.modLogsRoleId,
      joinLeavesChannelId: input.joinLeavesChannelId,
      joinLeavesRoleId: input.joinLeavesRoleId,
      messageModerationChannelId: input.messageModerationChannelId,
      messageModerationRoleId: input.messageModerationRoleId,
      reportsChannelId: input.reportsChannelId,
      reportsRoleId: input.reportsRoleId,
      networkAlertsChannelId: input.networkAlertsChannelId,
      networkAlertsRoleId: input.networkAlertsRoleId,
      appealsChannelId: input.appealsChannelId,
      appealsRoleId: input.appealsRoleId,
      safetyAlertsChannelId: input.safetyAlertsChannelId,
      safetyAlertsRoleId: input.safetyAlertsRoleId,
    });
    return {
      hubId: response.hubId || input.hubId,
      channelId: response.channelId || response.modLogsChannelId || "",
      eventFlags: Number(response.eventFlags || 0),
      notificationRoleId: response.notificationRoleId || response.modLogsRoleId || undefined,
      modLogsChannelId: response.modLogsChannelId || response.channelId || undefined,
      modLogsRoleId: response.modLogsRoleId || response.notificationRoleId || undefined,
      joinLeavesChannelId: response.joinLeavesChannelId || undefined,
      joinLeavesRoleId: response.joinLeavesRoleId || undefined,
      messageModerationChannelId: response.messageModerationChannelId || undefined,
      messageModerationRoleId: response.messageModerationRoleId || undefined,
      reportsChannelId: response.reportsChannelId || undefined,
      reportsRoleId: response.reportsRoleId || undefined,
      networkAlertsChannelId: response.networkAlertsChannelId || undefined,
      networkAlertsRoleId: response.networkAlertsRoleId || undefined,
      appealsChannelId: response.appealsChannelId || undefined,
      appealsRoleId: response.appealsRoleId || undefined,
      safetyAlertsChannelId: response.safetyAlertsChannelId || undefined,
      safetyAlertsRoleId: response.safetyAlertsRoleId || undefined,
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
      channelId: response.channelId || response.modLogsChannelId || "",
      eventFlags: Number(response.eventFlags || 0),
      notificationRoleId: response.notificationRoleId || response.modLogsRoleId || undefined,
      modLogsChannelId: response.modLogsChannelId || response.channelId || undefined,
      modLogsRoleId: response.modLogsRoleId || response.notificationRoleId || undefined,
      joinLeavesChannelId: response.joinLeavesChannelId || undefined,
      joinLeavesRoleId: response.joinLeavesRoleId || undefined,
      messageModerationChannelId: response.messageModerationChannelId || undefined,
      messageModerationRoleId: response.messageModerationRoleId || undefined,
      reportsChannelId: response.reportsChannelId || undefined,
      reportsRoleId: response.reportsRoleId || undefined,
      networkAlertsChannelId: response.networkAlertsChannelId || undefined,
      networkAlertsRoleId: response.networkAlertsRoleId || undefined,
      appealsChannelId: response.appealsChannelId || undefined,
      appealsRoleId: response.appealsRoleId || undefined,
      safetyAlertsChannelId: response.safetyAlertsChannelId || undefined,
      safetyAlertsRoleId: response.safetyAlertsRoleId || undefined,
    };
  },
};
