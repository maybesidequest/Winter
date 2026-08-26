import { base, protectedBase } from "../context";
import { z } from "zod";
import { userService } from "../../services/user.server";
import {
  patchUserPreferencesSchema,
  patchDashboardPreferencesSchema,
  userCallHistoryQuerySchema,
} from "../../schemas/user";

export const userRouter = base.router({
  getInbox: protectedBase.handler(async ({ context }) => userService.getInbox(context.user.id)),

  acknowledgeInbox: protectedBase
    .input(z.object({ itemId: z.string().min(1), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      await userService.acknowledgeInbox(context.user.id, input.itemId, input.idempotencyKey);
      return { success: true };
    }),
  get: protectedBase.handler(async ({ context }) => {
    return userService.getUserResource(context.user.id);
  }),

  patchPreferences: protectedBase
    .input(patchUserPreferencesSchema)
    .handler(async ({ input, context }) => {
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
