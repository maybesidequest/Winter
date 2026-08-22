import { base, protectedBase } from "../context";
import { userService } from "../../services/user.server";
import {
  patchUserPreferencesSchema,
  patchDashboardPreferencesSchema,
  userCallHistoryQuerySchema,
} from "../../schemas/user";

export const userRouter = base.router({
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
