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
import { controlIdSchema, idempotencyKeySchema } from "~/schemas/controlLimits";

function throwMappedControlError(error: unknown, fallback: string): never {
  const code = typeof error === "object" && error && "code" in error
    ? Number((error as { code: unknown }).code)
    : undefined;
  if (code === 3) throw new ORPCError("BAD_REQUEST", { message: "The submitted values are invalid." });
  if (code === 5) throw new ORPCError("NOT_FOUND", { message: "This Hub resource is no longer available." });
  if (code === 6 || code === 9 || code === 10) {
    throw new ORPCError("CONFLICT", { message: "This item changed while you were editing it. Refresh and try again." });
  }
  if (code === 7 || code === 16) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to perform this action." });
  throw new ORPCError("SERVICE_UNAVAILABLE", { message: fallback });
}

export const hubRouter = base.router({
  ...hubFeaturesRouter,

  getUserHubs: protectedBase.handler(async ({ context }) => {
    requireCapability("HUB_LIST");
    try {
      return await hubService.getUserHubs(context.user.id);
    } catch (error) {
      throwMappedControlError(error, "Hub management is temporarily unavailable. Try again shortly.");
    }
  }),

  getHub: protectedBase
    .input(z.object({ hubId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      let hub;
      try {
        hub = await hubService.getHub(input.hubId, context.user.id);
      } catch (error) {
        throwMappedControlError(error, "This Hub is temporarily unavailable.");
      }
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
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "Hub could not be created." });
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
    .input(z.object({ hubId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      return connectionService.getHubConnections(input.hubId, context.user.id);
    }),


  toggleConnection: protectedBase
    .input(z.object({
      connectionId: controlIdSchema,
      enabled: z.boolean(),
      hubId: controlIdSchema,
      expectedVersion: z.number().int().positive(),
      idempotencyKey: idempotencyKeySchema,
    }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await connectionService.toggleConnection(context.user.id, input.connectionId, input.hubId, input.enabled, input.expectedVersion, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "This connection could not be updated." });
      }
      return { success: true };
    }),

  disconnectConnection: protectedBase
    .input(z.object({
      connectionId: controlIdSchema,
      hubId: controlIdSchema,
      expectedVersion: z.number().int().positive(),
      idempotencyKey: idempotencyKeySchema,
    }))
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await connectionService.disconnectConnection(context.user.id, input.connectionId, input.hubId, input.expectedVersion, input.idempotencyKey);
      if (!result.success) {
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "This connection could not be disconnected." });
      }
      return { success: true };
    }),

  createConnection: protectedBase
    .input(z.object({
      hubId: controlIdSchema,
      channelId: controlIdSchema,
      serverId: controlIdSchema,
      inviteCode: z.string().max(128).optional(),
      customName: z.string().trim().max(64).optional(),
      idempotencyKey: idempotencyKeySchema,
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
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "This connection could not be created." });
      }
      return { success: true };
    }),

  deleteHub: protectedBase
    .input(deleteHubSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      const result = await hubService.deleteHub(context.user.id, input);
      if (!result.success) {
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "Hub could not be deleted." });
      }
      return { success: true };
    }),

  transferOwnership: protectedBase
    .input(transferHubOwnershipSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      const result = await hubService.transferOwnership(context.user.id, input);
      if (!result.success) {
        throw new ORPCError(result.errorCode ?? "BAD_REQUEST", { message: result.error ?? "Ownership could not be transferred." });
      }
      return { success: true };
    }),

  lockdownHub: protectedBase
    .input(lockdownHubSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LIFECYCLE");
      try {
        return await hubService.lockdownHub(context.user.id, input);
      } catch (error) {
        throwMappedControlError(error, "Hub management is temporarily unavailable. Try again shortly.");
      }
    }),
});
