import { ORPCError } from "@orpc/server";
import { protectedBase } from "../context";
import { requireCapability } from "~/rpc/capabilityGuard";
import { hubDiscoveryService } from "../../services/hubDiscovery.server";
import {
  hubDiscoveryQuerySchema,
  hubUpvoteInputSchema,
  quickConnectInputSchema,
} from "../../schemas/hubDiscovery";

export const hubDiscoveryRouter = protectedBase.router({
  search: protectedBase
    .input(hubDiscoveryQuerySchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_DISCOVERY");
      return hubDiscoveryService.searchPublicHubs(input, context.user.id);
    }),

  getFeatured: protectedBase.handler(async () => {
    requireCapability("HUB_DISCOVERY");
    return hubDiscoveryService.getFeaturedHubs();
  }),

  getPopularTags: protectedBase.handler(async () => {
    requireCapability("HUB_DISCOVERY");
    return hubDiscoveryService.getPopularTags();
  }),

  upvote: protectedBase
    .input(hubUpvoteInputSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_UPVOTE");
      const result = await hubDiscoveryService.upvoteHub(context.user.id, input.hubId);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return result;
    }),

  quickConnect: protectedBase
    .input(quickConnectInputSchema)
    .handler(async ({ input, context }) => {
      requireCapability("CONNECTIONS");
      const result = await hubDiscoveryService.quickConnect(context.user.id, input);
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return result;
    }),
});
