import { ORPCError } from "@orpc/server";
import { redis } from "~/redis.server";
import { requireCapability } from "~/rpc/capabilityGuard";
import {
  addBlockSchema,
  bridgeActionSchema,
  listServersSchema,
  patchCallConfigSchema,
  patchPrefixSchema,
  removeBlockSchema,
  serverIdSchema,
  toggleBridgeSchema,
} from "~/schemas/server";
import { serverService } from "~/services/server.server";
import { base, protectedBase } from "../context";

export const serverRouter = base.router({
  list: protectedBase
    .input(listServersSchema)
    .handler(async ({ input, context }) => {
      requireCapability("SERVER_CONFIG");
      const forceRefresh = Boolean(input?.forceRefresh);
      if (forceRefresh) {
        const rateLimitKey = `ratelimit:server_refresh:${context.user.id}`;
        const isLimited = await redis.get(rateLimitKey);
        if (isLimited) {
          throw new ORPCError("TOO_MANY_REQUESTS", {
            message: "Please wait 5 seconds before refreshing servers again.",
          });
        }
        await redis.set(rateLimitKey, "1", "EX", 5);
      }
      return serverService.list(context.user.id, forceRefresh);
    }),
  get: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_CONFIG");
      return serverService.get(context.user.id, input.serverId);
    }),
  channels: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => {
      requireCapability("CONNECTIONS");
      return serverService.channels(context.user.id, input.serverId);
    }),
  patchCallConfig: protectedBase
    .input(patchCallConfigSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_CONFIG");
      return serverService.updateCallConfig(context.user.id, input);
    }),
  patchPrefix: protectedBase
    .input(patchPrefixSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_CONFIG");
      return serverService.updatePrefix(context.user.id, input);
    }),
  bridges: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => {
      requireCapability("CONNECTIONS");
      return serverService.bridges(context.user.id, input.serverId);
    }),
  blocklist: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_BLOCKLIST");
      return serverService.blocklist(context.user.id, input.serverId);
    }),
  addBlock: protectedBase
    .input(addBlockSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_BLOCKLIST");
      return serverService.addBlock(context.user.id, input);
    }),
  removeBlock: protectedBase
    .input(removeBlockSchema)
    .handler(({ input, context }) => {
      requireCapability("SERVER_BLOCKLIST");
      return serverService.removeBlock(context.user.id, input);
    }),
  toggleBridge: protectedBase
    .input(toggleBridgeSchema)
    .handler(({ input, context }) => {
      requireCapability("CONNECTIONS");
      return serverService.toggleBridge(context.user.id, input);
    }),
  repairBridge: protectedBase
    .input(bridgeActionSchema)
    .handler(({ input, context }) => {
      requireCapability("CONNECTIONS");
      return serverService.repairBridge(context.user.id, input);
    }),
  disconnectBridge: protectedBase
    .input(bridgeActionSchema)
    .handler(({ input, context }) => {
      requireCapability("CONNECTIONS");
      return serverService.disconnectBridge(context.user.id, input);
    }),
});
