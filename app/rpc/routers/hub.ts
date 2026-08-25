import { ORPCError } from "@orpc/server";
import { base, protectedBase } from "../context";
import { hubService } from "../../services/hub.server";
import { connectionService } from "../../services/connection.server";
import { messageService } from "../../services/message.server";
import { createHubSchema, patchHubConfigSchema } from "../../schemas/hub";
import { z } from "zod";

export const hubRouter = base.router({
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
      webhookUrl: z.string(),
      parentId: z.string().optional(),
    }))
    .handler(async ({ input, context }) => {
      const result = await connectionService.createConnection(
        context.user.id,
        input.hubId,
        input.channelId,
        input.serverId,
        input.webhookUrl,
        input.parentId
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  deleteHub: protectedBase
    .input(z.object({ hubId: z.string(), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const result = await hubService.deleteHub(context.user.id, input.hubId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  transferOwnership: protectedBase
    .input(z.object({
      hubId: z.string(),
      newOwnerId: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      const result = await hubService.transferOwnership(context.user.id, input.hubId, input.newOwnerId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  listRules: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listRules(context.user.id, input.hubId);
    }),

  createRule: protectedBase
    .input(z.object({
      hubId: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(1000),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.createRule(context.user.id, input);
    }),

  updateRule: protectedBase
    .input(z.object({
      hubId: z.string(),
      ruleId: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(1000),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.updateRule(context.user.id, input);
    }),

  deleteRule: protectedBase
    .input(z.object({
      hubId: z.string(),
      ruleId: z.string(),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      await hubService.deleteRule(context.user.id, input);
      return { success: true };
    }),

  reorderRules: protectedBase
    .input(z.object({
      hubId: z.string(),
      ruleIds: z.array(z.string()),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.reorderRules(context.user.id, input);
    }),

  listInvites: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listInvites(context.user.id, input.hubId);
    }),

  createInvite: protectedBase
    .input(z.object({
      hubId: z.string(),
      maxUses: z.number().optional(),
      durationSeconds: z.number().optional(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.createInvite(context.user.id, input);
    }),

  revokeInvite: protectedBase
    .input(z.object({
      hubId: z.string(),
      inviteCode: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      await hubService.revokeInvite(context.user.id, input);
      return { success: true };
    }),

  patchBadges: protectedBase
    .input(z.object({
      hubId: z.string(),
      ownerBadge: z.string().optional(),
      managerBadge: z.string().optional(),
      moderatorBadge: z.string().optional(),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.patchBadges(context.user.id, input);
    }),

  patchLogConfig: protectedBase
    .input(z.object({
      hubId: z.string(),
      channelId: z.string(),
      eventFlags: z.number(),
      notificationRoleId: z.string().optional(),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.patchLogConfig(context.user.id, input);
    }),

  listAnnouncements: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listAnnouncements(context.user.id, input.hubId);
    }),

  createAnnouncement: protectedBase
    .input(z.object({
      hubId: z.string(),
      content: z.string().min(1).max(2000),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.createAnnouncement(context.user.id, input);
    }),

  updateAnnouncement: protectedBase
    .input(z.object({
      hubId: z.string(),
      announcementId: z.string(),
      content: z.string().min(1).max(2000),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.updateAnnouncement(context.user.id, input);
    }),

  deleteAnnouncement: protectedBase
    .input(z.object({
      hubId: z.string(),
      announcementId: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      await hubService.deleteAnnouncement(context.user.id, input);
      return { success: true };
    }),

  listStaff: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listStaff(context.user.id, input.hubId);
    }),

  assignStaffRole: protectedBase
    .input(z.object({
      hubId: z.string(),
      userId: z.string(),
      role: z.string(),
      permissionsBitmask: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.assignStaffRole(context.user.id, input);
    }),

  removeStaffRole: protectedBase
    .input(z.object({
      hubId: z.string(),
      userId: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      await hubService.removeStaffRole(context.user.id, input);
      return { success: true };
    }),

  lockdownHub: protectedBase
    .input(z.object({
      hubId: z.string(),
      locked: z.boolean(),
      reason: z.string().default(""),
      expectedVersion: z.number(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      return hubService.lockdownHub(context.user.id, input);
    }),

  nukeMessages: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      const result = await hubService.nukeHubMessages(context.user.id, input.hubId);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true, deletedCount: result.deletedCount };
    }),
});
