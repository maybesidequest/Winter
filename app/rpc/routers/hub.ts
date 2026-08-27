import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base, protectedBase } from "~/rpc/context";
import { hubService } from "~/services/hub.server";
import { connectionService } from "~/services/connection.server";
import {
  createHubSchema,
  patchHubConfigSchema,
  lockdownHubSchema,
  transferHubOwnershipSchema,
  deleteHubSchema,
} from "~/schemas/hub";
import { hubFeaturesRouter } from "./hubFeaturesRouter";
import { requireCapability } from "~/rpc/capabilityGuard";

export const hubRouter = base.router({
  ...hubFeaturesRouter,

  getUserHubs: protectedBase.handler(async ({ context }) => {
    requireCapability("HUB_LIST");
    return hubService.getUserHubs(context.user.id);
  }),

  getHub: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      const hub = await hubService.getHub(input.hubId, context.user.id);
      if (!hub) {
        throw new ORPCError("NOT_FOUND", { message: "Hub not found or access denied." });
      }
      return hub;
    }),


  createHub: protectedBase
    .input(createHubSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      const result = await hubService.createHub(context.user.id, input, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true, hubId: result.hubId };
    }),

  patchConfig: protectedBase
    .input(patchHubConfigSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_CONFIG");
      const result = await hubService.updateHubConfig(context.user.id, input);
      if (!result.success) {
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error });
      }
      return { success: true, hub: result.hub };
    }),

  getConnections: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      return connectionService.getHubConnections(input.hubId, context.user.id);
    }),


  toggleConnection: protectedBase
    .input(z.object({
      connectionId: z.string(),
      enabled: z.boolean(),
      hubId: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await connectionService.toggleConnection(context.user.id, input.connectionId, input.hubId, input.enabled, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  disconnectConnection: protectedBase
    .input(z.object({
      connectionId: z.string(),
      hubId: z.string(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await connectionService.disconnectConnection(context.user.id, input.connectionId, input.hubId, input.idempotencyKey);
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
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await connectionService.createConnection(
        context.user.id,
        input.hubId,
        input.channelId,
        input.serverId,
        input.idempotencyKey,
        input.inviteCode,
        input.customName,
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  deleteHub: protectedBase
    .input(deleteHubSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      const result = await hubService.deleteHub(context.user.id, input.hubId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  transferOwnership: protectedBase
    .input(transferHubOwnershipSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      const result = await hubService.transferOwnership(context.user.id, input.hubId, input.newOwnerId, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError("FORBIDDEN", { message: result.error });
      }
      return { success: true };
    }),

  lockdownHub: protectedBase
    .input(lockdownHubSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      return hubService.lockdownHub(context.user.id, input);
    }),
});
