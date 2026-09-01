import { ORPCError } from "@orpc/server";
import { base, protectedBase } from "../context";
import { hubStaffService } from "../../services/hubStaff.server";
import { z } from "zod";
import { requireCapability } from "~/rpc/capabilityGuard";
import { moderationFailureFor, moderationService } from "~/services/control/moderation";
import { AppealStatus, InfractionLifecycleState, SanctionType } from "~/generated/control/v1/static";

const hubRoleSchema = z.enum(["MANAGER", "MODERATOR"]);
const subjectSchema = z.union([
  z.object({ userId: z.string().min(1) }).strict(),
  z.object({ serverId: z.string().min(1) }).strict(),
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
      hubId: z.string().min(1),
      infractionId: z.string().min(1),
      reason: z.string().trim().min(5).max(2_000),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.submitAppeal({ ...input, actorId: context.user.id }));
    }),

  listInfractions: protectedBase
    .input(z.object({
      hubId: z.string().min(1),
      subject: subjectSchema.optional(),
      lifecycleState: lifecycleStateSchema.optional(),
      sanctionType: sanctionTypeSchema.optional(),
      cursor: z.string().optional(),
      limit: z.number().int().positive().max(100).optional(),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.listInfractions({
        ...input,
        lifecycleState: input.lifecycleState as InfractionLifecycleState | undefined,
        sanctionType: input.sanctionType as SanctionType | undefined,
        actorId: context.user.id,
      }));
    }),

  getInfraction: protectedBase
    .input(z.object({ hubId: z.string().min(1), infractionId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getInfraction({ ...input, actorId: context.user.id }));
    }),

  applySanction: protectedBase
    .input(z.object({
      hubId: z.string().min(1),
      subject: subjectSchema,
      type: sanctionTypeSchema,
      reason: z.string().trim().min(1).max(2_000),
      durationSeconds: z.number().int().nonnegative().optional(),
      idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.applySanction({
        ...input,
        type: input.type as SanctionType,
        actorId: context.user.id,
      }));
    }),

  revokeSanction: protectedBase
    .input(z.object({
      hubId: z.string().min(1), infractionId: z.string().min(1), reason: z.string().trim().min(1).max(2_000),
      expectedVersion: z.number().int().positive(), idempotencyKey: z.string().min(1),
    }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.revokeSanction({ ...input, actorId: context.user.id }));
    }),

  listHubAppeals: protectedBase
    .input(z.object({ hubId: z.string().min(1), status: appealStatusSchema.optional(), subject: subjectSchema.optional(), cursor: z.string().optional(), limit: z.number().int().positive().max(100).optional() }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.listHubAppeals({
        ...input,
        status: input.status as AppealStatus | undefined,
        actorId: context.user.id,
      }));
    }),

  getAppeal: protectedBase
    .input(z.object({ hubId: z.string().min(1), appealId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getAppeal({ ...input, actorId: context.user.id }));
    }),

  approveAppeal: protectedBase
    .input(z.object({ hubId: z.string().min(1), appealId: z.string().min(1), resolutionReason: z.string().trim().min(1).max(2_000), expectedVersion: z.number().int().positive(), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.approveAppeal({ ...input, actorId: context.user.id }));
    }),

  rejectAppeal: protectedBase
    .input(z.object({ hubId: z.string().min(1), appealId: z.string().min(1), resolutionReason: z.string().trim().min(1).max(2_000), expectedVersion: z.number().int().positive(), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.rejectAppeal({ ...input, actorId: context.user.id }));
    }),

  getHubSafetySettings: protectedBase
    .input(z.object({ hubId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getHubSafetySettings({ ...input, actorId: context.user.id }));
    }),

  patchHubSafetySettings: protectedBase
    .input(z.object({ hubId: z.string().min(1), settings: z.record(z.string(), z.boolean()), updateMask: z.array(z.string()).min(1), expectedVersion: z.number().int().positive(), idempotencyKey: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.patchHubSafetySettings({ ...input, actorId: context.user.id, settings: input.settings as never, updateMask: input.updateMask as never }));
    }),

  getSafetyAssessment: protectedBase
    .input(z.object({ hubId: z.string().min(1), subject: subjectSchema }))
    .handler(async ({ input, context }) => {
      requireCapability("MODERATION");
      return withModerationErrors(() => moderationService.getSafetyAssessment({ ...input, actorId: context.user.id }));
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
        hubId: z.string(),
        targetUserId: z.string(),
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
