import { ORPCError } from "@orpc/server";
import { base, protectedBase } from "../context";
import { hubStaffService } from "../../services/hubStaff.server";
import { z } from "zod";
import { requireCapability } from "~/rpc/capabilityGuard";
import { moderationService } from "~/services/control/moderation";

const hubRoleSchema = z.enum(["MANAGER", "MODERATOR"]);

export const moderationRouter = base.router({
  listMyAppealableInfractions: protectedBase.handler(async ({ context }) => {
    requireCapability("MODERATION");
    return moderationService.listMyAppealableInfractions(context.user.id);
  }),

  submitAppeal: protectedBase
    .input(z.object({
      hubId: z.string().min(1),
      infractionId: z.string().min(1),
      reason: z.string().trim().min(5).max(2_000),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return moderationService.submitAppeal({ ...input, actorId: context.user.id });
    }),
  // ------------------------------------------------------------------ //
  // Hub staff management                                                 //
  // ------------------------------------------------------------------ //

  getStaff: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubStaffService.getStaff(input.hubId, context.user.id);
    }),

  addModerator: protectedBase
    .input(
      z.object({
        hubId: z.string(),
        targetUserId: z.string(),
        role: hubRoleSchema,
      })
    )
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      const result = await hubStaffService.assignRole(
        context.user.id,
        input.targetUserId,
        input.hubId,
        input.role
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  removeModerator: protectedBase
    .input(
      z.object({
        hubId: z.string(),
        targetUserId: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      const result = await hubStaffService.removeRole(
        context.user.id,
        input.targetUserId,
        input.hubId
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),
});
