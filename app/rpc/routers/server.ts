import { base, protectedBase } from "../context";
import { serverService } from "~/services/server.server";
import {
  addBlockSchema,
  patchCallConfigSchema,
  removeBlockSchema,
  serverIdSchema,
} from "~/schemas/server";

export const serverRouter = base.router({
  list: protectedBase.handler(({ context }) => serverService.list(context.user.id)),
  get: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => serverService.get(context.user.id, input.serverId)),
  channels: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => serverService.channels(context.user.id, input.serverId)),
  patchCallConfig: protectedBase
    .input(patchCallConfigSchema)
    .handler(({ input, context }) => serverService.updateCallConfig(context.user.id, input)),
  bridges: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => serverService.bridges(context.user.id, input.serverId)),
  blocklist: protectedBase
    .input(serverIdSchema)
    .handler(({ input, context }) => serverService.blocklist(context.user.id, input.serverId)),
  addBlock: protectedBase
    .input(addBlockSchema)
    .handler(({ input, context }) => serverService.addBlock(context.user.id, input)),
  removeBlock: protectedBase
    .input(removeBlockSchema)
    .handler(({ input, context }) => serverService.removeBlock(context.user.id, input)),
});

