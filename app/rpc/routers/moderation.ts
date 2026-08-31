import { ORPCError } from "@orpc/server";
import { base, protectedBase } from "../context";
import { hubStaffService } from "../../services/hubStaff.server";
import { z } from "zod";
import { requireCapability } from "~/rpc/capabilityGuard";
import { moderationFailureFor, moderationService } from "~/services/control/moderation";
import { controlCursorSchema, controlIdSchema, idempotencyKeySchema } from "~/schemas/controlLimits";

const hubRoleSchema = z.enum(["MANAGER", "MODERATOR"]);
const subjectSchema = z.union([
  z.object({ userId: controlIdSchema }).strict(),
  z.object({ serverId: controlIdSchema }).strict(),
]);
const lifecycleStateSchema = z.enum([
  "INFRACTION_LIFECYCLE_STATE_ACTIVE",
  "INFRACTION_LIFECYCLE_STATE_EXPIRED",
  "INFRACTION_LIFECYCLE_STATE_REVOKED",
]);
const sanctionTypeSchema = z.enum(["SANCTION_TYPE_WARN", "SANCTION_TYPE_MUTE", "SANCTION_TYPE_BAN"]);
const appealStatusSchema = z.enum(["APPEAL_STATUS_PENDING", "APPEAL_STATUS_APPROVED", "APPEAL_STATUS_REJECTED"]);

function throwModerationError(error: unknown): never {
  const failure = moderationFailureFor(error);
  if (failure?.kind === "STALE") throw new ORPCError("CONFLICT", { message: failure.message });
  if (failure?.kind === "DENIED") throw new ORPCError("FORBIDDEN", { message: failure.message });
  if (failure?.kind === "NOT_FOUND") throw new ORPCError("NOT_FOUND", { message: failure.message });
  if (failure?.kind === "UNAVAILABLE") throw new ORPCError("SERVICE_UNAVAILABLE", { message: failure.message });
  throw error;
}

async function withModerationErrors<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throwModerationError(error);
  }
}

export const moderationRouter = base.router({
  listMyAppealableInfractions: protectedBase.handler(async ({ context }) => {
    requireCapability("MODERATION");
    return moderationService.listMyAppealableInfractions(context.user.id);
  }),

  submitAppeal: protectedBase
    .input(z.object({
      hubId: controlIdSchema,
      infractionId: controlIdSchema,
      reason: z.string().trim().min(5).max(2_000),
      idempotencyKey: idempotencyKeySchema,
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.submitAppeal({ ...input, actorId: context.user.id }));
    }),

  listInfractions: protectedBase
    .input(z.object({
      hubId: controlIdSchema,
      subject: subjectSchema.optional(),
      lifecycleState: lifecycleStateSchema.optional(),
      sanctionType: sanctionTypeSchema.optional(),
      cursor: controlCursorSchema.optional(),
      limit: z.number().int().positive().max(100).optional(),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.listInfractions({ ...input, actorId: context.user.id }));
    }),

  getInfraction: protectedBase
    .input(z.object({ hubId: controlIdSchema, infractionId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getInfraction({ ...input, actorId: context.user.id }));
    }),

  applySanction: protectedBase
    .input(z.object({
      hubId: controlIdSchema,
      subject: subjectSchema,
      type: sanctionTypeSchema,
      reason: z.string().trim().min(1).max(1_000),
      durationSeconds: z.number().int().min(0).max(31_536_000).optional(),
      idempotencyKey: idempotencyKeySchema,
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.applySanction({ ...input, actorId: context.user.id }));
    }),

  revokeSanction: protectedBase
    .input(z.object({
      hubId: controlIdSchema, infractionId: controlIdSchema, reason: z.string().trim().min(1).max(1_000),
      expectedVersion: z.number().int().positive(), idempotencyKey: idempotencyKeySchema,
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.revokeSanction({ ...input, actorId: context.user.id }));
    }),

  listHubAppeals: protectedBase
    .input(z.object({ hubId: controlIdSchema, status: appealStatusSchema.optional(), subject: subjectSchema.optional(), cursor: controlCursorSchema.optional(), limit: z.number().int().positive().max(100).optional() }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.listHubAppeals({ ...input, actorId: context.user.id }));
    }),

  getAppeal: protectedBase
    .input(z.object({ hubId: controlIdSchema, appealId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getAppeal({ ...input, actorId: context.user.id }));
    }),

  approveAppeal: protectedBase
    .input(z.object({ hubId: controlIdSchema, appealId: controlIdSchema, resolutionReason: z.string().trim().min(1).max(2_000), expectedVersion: z.number().int().positive(), idempotencyKey: idempotencyKeySchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.approveAppeal({ ...input, actorId: context.user.id }));
    }),

  rejectAppeal: protectedBase
    .input(z.object({ hubId: controlIdSchema, appealId: controlIdSchema, resolutionReason: z.string().trim().min(1).max(2_000), expectedVersion: z.number().int().positive(), idempotencyKey: idempotencyKeySchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.rejectAppeal({ ...input, actorId: context.user.id }));
    }),

  getHubSafetySettings: protectedBase
    .input(z.object({ hubId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getHubSafetySettings({ ...input, actorId: context.user.id }));
    }),

  patchHubSafetySettings: protectedBase
    .input(z.object({ hubId: controlIdSchema, settings: z.record(z.string().max(64), z.boolean()), updateMask: z.array(z.string().max(64)).min(1).max(8), expectedVersion: z.number().int().positive(), idempotencyKey: idempotencyKeySchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.patchHubSafetySettings({ ...input, actorId: context.user.id, settings: input.settings as never, updateMask: input.updateMask as never }));
    }),

  getSafetyAssessment: protectedBase
    .input(z.object({ hubId: controlIdSchema, subject: subjectSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getSafetyAssessment({ ...input, actorId: context.user.id }));
    }),
  // ------------------------------------------------------------------ //
  // Hub staff management                                                 //
  // ------------------------------------------------------------------ //

  getStaff: protectedBase
    .input(z.object({ hubId: controlIdSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubStaffService.getStaff(input.hubId, context.user.id);
    }),

  addModerator: protectedBase
    .input(
      z.object({
        hubId: controlIdSchema,
        targetUserId: controlIdSchema,
        role: hubRoleSchema,
        expectedVersion: z.number().int().positive(),
      })
    )
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      const result = await hubStaffService.assignRole(
        context.user.id,
        input.targetUserId,
        input.hubId,
        input.role,
        input.expectedVersion
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),

  removeModerator: protectedBase
    .input(
      z.object({
        hubId: controlIdSchema,
        targetUserId: controlIdSchema,
        expectedVersion: z.number().int().positive(),
      })
    )
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      const result = await hubStaffService.removeRole(
        context.user.id,
        input.targetUserId,
        input.hubId,
        input.expectedVersion
      );
      if (!result.success) {
        throw new ORPCError("BAD_REQUEST", { message: result.error });
      }
      return { success: true };
    }),
});
