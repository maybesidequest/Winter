import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base, protectedBase } from "~/rpc/context";
import { hubService } from "~/services/hub.server";
import { connectionService } from "~/services/connection.server";
import { messageService } from "~/services/message.server";
import {
  createHubSchema,
  patchHubConfigSchema,
  lockdownHubSchema,
  transferHubOwnershipSchema,
  deleteHubSchema,
} from "~/schemas/hub";
import { hubFeaturesRouter } from "./hubFeaturesRouter";

export const hubRouter = base.router({
  ...hubFeaturesRouter,

  getUserHubs: protectedBase.handler(async ({ context }) => {
    return hubService.getUserHubs(context.user.id);
  }),

  createHub: protectedBase
    .input(createHubSchema)
    .handler(async ({ input, context }) => {
      const result = await hubService.createHub(context.user.id, input);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true, hubId: result.hubId };
    }),

  patchConfig: protectedBase
    .input(patchHubConfigSchema)
    .handler(async ({ input, context }) => {
      const result = await hubService.updateHubConfig(context.user.id, input);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  getConnections: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return connectionService.getHubConnections(input.hubId, context.user.id);
    }),

  getRecentMessages: protectedBase
    .input(z.object({ hubId: z.string(), limit: z.number().optional().default(50), cursor: z.string().optional() }))
    .handler(async ({ input, context }) => {
      return messageService.getRecentMessages(input.hubId, context.user.id, input.limit, input.cursor);
    }),

  sendMessage: protectedBase
    .input(z.object({
      hubId: z.string(),
      content: z.string().min(1).max(4000),
      guildId: z.string(),
      channelId: z.string(),
    }))
    .handler(async ({ input, context }) => {
      const result = await messageService.sendMessage(
        input.hubId,
        input.content,
        context.user.id,
        input.guildId,
        input.channelId
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true, messageId: result.messageId };
    }),

  toggleConnection: protectedBase
    .input(z.object({
      connectionId: z.string(),
      enabled: z.boolean(),
      hubId: z.string(),
    }))
    .handler(async ({ input, context }) => {
      const result = await connectionService.toggleConnection(context.user.id, input.connectionId, input.hubId, input.enabled);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  disconnectConnection: protectedBase
    .input(z.object({
      connectionId: z.string(),
      hubId: z.string(),
    }))
    .handler(async ({ input, context }) => {
      const result = await connectionService.disconnectConnection(context.user.id, input.connectionId, input.hubId);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  createConnection: protectedBase
    .input(z.object({
      hubId: z.string(),
      channelId: z.string(),
      serverId: z.string(),
      inviteCode: z.string().optional(),
      customName: z.string().optional(),
    }))
    .handler(async ({ input, context }) => {
      const result = await connectionService.createConnection(
        context.user.id,
        input.hubId,
        input.channelId,
        input.serverId,
        input.inviteCode,
        input.customName
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  deleteHub: protectedBase
    .input(deleteHubSchema)
    .handler(async ({ input, context }) => {
      const result = await hubService.deleteHub(context.user.id, input.hubId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  transferOwnership: protectedBase
    .input(transferHubOwnershipSchema)
    .handler(async ({ input, context }) => {
      const result = await hubService.transferOwnership(context.user.id, input.hubId, input.newOwnerId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  lockdownHub: protectedBase
    .input(lockdownHubSchema)
    .handler(async ({ input, context }) => {
      return hubService.lockdownHub(context.user.id, input);
    }),
});
