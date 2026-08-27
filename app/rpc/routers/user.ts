import { base, protectedBase } from "../context";
import { z } from "zod";
import { userService } from "../../services/user.server";
import { requireCapability } from "~/rpc/capabilityGuard";
import {
  patchUserPreferencesSchema,
  patchDashboardPreferencesSchema,
  userCallHistoryQuerySchema,
} from "../../schemas/user";

export const userRouter = base.router({
  getProfile: protectedBase.handler(async ({ context }) => {
    requireCapability("USER_PROFILE");
    return userService.getProfile(context.user.id);
  }),

  getActivity: protectedBase
    .input(z.object({ year: z.number().int().min(2000).max(2200), month: z.number().int().min(1).max(12), limit: z.number().int().min(1).max(20).default(5) }))
    .handler(async ({ input, context }) => {
      requireCapability("USER_ACTIVITY");
      return userService.getActivity(context.user.id, input);
    }),

  getLeaderboard: protectedBase
    .input(z.object({
      kind: z.enum(["MESSAGES", "CALLS", "VOTES", "STREAKS", "SERVERS"]),
      limit: z.number().int().min(1).max(100).default(20),
      offset: z.number().int().min(0).max(10_000).default(0),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("USER_ACTIVITY");
      return userService.getLeaderboard(
        context.user.id,
        `LEADERBOARD_KIND_${input.kind}`,
        input.limit,
        input.offset,
      );
    }),

  submitFeedback: protectedBase
    .input(z.object({
      category: z.enum(["general", "dashboard", "hub", "safety"]),
      message: z.string().trim().min(10).max(2_000),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("USER_FEEDBACK");
      return userService.submitFeedback(context.user.id, input.category, input.message, input.idempotencyKey);
    }),

  getInbox: protectedBase.handler(async ({ context }) => {
    requireCapability("USER_INBOX");
    return userService.getInbox(context.user.id);
  }),

  acknowledgeInbox: protectedBase
    .input(z.object({ itemId: z.string().min(1), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("USER_INBOX");
      await userService.acknowledgeInbox(context.user.id, input.itemId, input.idempotencyKey);
      return { success: true };
    }),
  get: protectedBase.handler(async ({ context }) => {
    requireCapability("USER_PROFILE");
    return userService.getUserResource(context.user.id);
  }),

  patchPreferences: protectedBase
    .input(patchUserPreferencesSchema)
    .handler(async ({ input, context }) => {
      requireCapability("USER_PREFERENCES");
      return userService.patchUserPreferences(context.user.id, input);
    }),

  patchDashboardPreferences: protectedBase
    .input(patchDashboardPreferencesSchema)
    .handler(async ({ input, context }) => {
      return userService.patchDashboardPreferences(context.user.id, input);
    }),

  callHistory: protectedBase
    .input(userCallHistoryQuerySchema)
    .handler(async ({ input, context }) => {
      return userService.getCallHistory(context.user.id, input);
    }),

  locales: base.handler(async () => {
    return userService.getSupportedLocales();
  }),
});
