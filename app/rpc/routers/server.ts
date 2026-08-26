import { base, protectedBase } from "../context";
import { serverService } from "~/services/server.server";
import { requireCapability } from "~/rpc/capabilityGuard";
import {
  addBlockSchema,
  patchCallConfigSchema,
  patchPrefixSchema,
  removeBlockSchema,
  serverIdSchema,
  toggleBridgeSchema,
  bridgeActionSchema,
} from "~/schemas/server";

export const serverRouter = base.router({
  list: protectedBase.handler(({ context }) => {
    requireCapability("SERVER_CONFIG");
    return serverService.list(context.user.id);
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
