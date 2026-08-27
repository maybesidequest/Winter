import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedBase } from "~/rpc/context";
import { requireCapability } from "~/rpc/capabilityGuard";
import { hubService } from "~/services/hub.server";
import {
  createHubRuleSchema,
  updateHubRuleSchema,
  reorderHubRulesSchema,
  deleteHubRuleSchema,
  createHubInviteSchema,
  revokeHubInviteSchema,
  createHubAnnouncementSchema,
  updateHubAnnouncementSchema,
  deleteHubAnnouncementSchema,
  patchHubBadgesSchema,
  patchHubLogConfigSchema,
  assignHubStaffSchema,
  removeHubStaffSchema,
  createHubRoleSchema,
  updateHubRoleSchema,
  deleteHubRoleSchema,
} from "~/schemas/hub";

function mapControlError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error
    ? Number((error as { code: unknown }).code)
    : undefined;
  if (code === 3) throw new ORPCError("BAD_REQUEST", { message: "The submitted values are invalid." });
  if (code === 5) throw new ORPCError("NOT_FOUND", { message: "This Hub resource is no longer available." });
  if (code === 6 || code === 9 || code === 10) {
    throw new ORPCError("CONFLICT", { message: "This item changed while you were editing it. Refresh and try again." });
  }
  if (code === 7 || code === 16) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to perform this action." });
  if (code === 4 || code === 14) {
    throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Hub management is temporarily unavailable. Try again shortly." });
  }
  throw error;
}

async function controlCall<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return mapControlError(error);
  }
}

export const hubFeaturesRouter = protectedBase.router({
  getBadges: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_BADGES");
      return controlCall(() => hubService.getBadges(context.user.id, input.hubId));
    }),

  getLogConfig: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LOGGING");
      return controlCall(() => hubService.getLogConfig(context.user.id, input.hubId));
    }),

  listRules: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return controlCall(() => hubService.listRules(context.user.id, input.hubId));
    }),

  listAudit: protectedBase
    .input(z.object({ hubId: z.string(), limit: z.number().int().min(1).max(100).optional(), offset: z.number().int().min(0).optional() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_AUDIT");
      return controlCall(() => hubService.listAudit(context.user.id, input));
    }),

  createRule: protectedBase
    .input(createHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return controlCall(() => hubService.createRule(context.user.id, input));
    }),

  updateRule: protectedBase
    .input(updateHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return controlCall(() => hubService.updateRule(context.user.id, input));
    }),

  deleteRule: protectedBase
    .input(deleteHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      await controlCall(() => hubService.deleteRule(context.user.id, input));
      return { success: true };
    }),

  reorderRules: protectedBase
    .input(reorderHubRulesSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return controlCall(() => hubService.reorderRules(context.user.id, input));
    }),

  listInvites: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      return controlCall(() => hubService.listInvites(context.user.id, input.hubId));
    }),

  createInvite: protectedBase
    .input(createHubInviteSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      return controlCall(() => hubService.createInvite(context.user.id, input));
    }),

  revokeInvite: protectedBase
    .input(revokeHubInviteSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      await controlCall(() => hubService.revokeInvite(context.user.id, input));
      return { success: true };
    }),

  patchBadges: protectedBase
    .input(patchHubBadgesSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_BADGES");
      return controlCall(() => hubService.patchBadges(context.user.id, input));
    }),

  patchLogConfig: protectedBase
    .input(patchHubLogConfigSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LOGGING");
      return controlCall(() => hubService.patchLogConfig(context.user.id, input));
    }),

  listAnnouncements: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return controlCall(() => hubService.listAnnouncements(context.user.id, input.hubId));
    }),

  createAnnouncement: protectedBase
    .input(createHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return controlCall(() => hubService.createAnnouncement(context.user.id, input));
    }),

  updateAnnouncement: protectedBase
    .input(updateHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return controlCall(() => hubService.updateAnnouncement(context.user.id, input));
    }),

  deleteAnnouncement: protectedBase
    .input(deleteHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      await controlCall(() => hubService.deleteAnnouncement(context.user.id, input));
      return { success: true };
    }),

  listStaff: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return controlCall(() => hubService.listStaff(context.user.id, input.hubId));
    }),

  assignStaffRole: protectedBase
    .input(assignHubStaffSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return controlCall(() => hubService.assignStaffRole(context.user.id, input));
    }),

  removeStaffRole: protectedBase
    .input(removeHubStaffSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      await controlCall(() => hubService.removeStaffRole(context.user.id, input));
      return { success: true };
    }),

  listRoles: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return controlCall(() => hubService.listRoles(context.user.id, input.hubId));
    }),

  createRole: protectedBase
    .input(createHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return controlCall(() => hubService.createRole(context.user.id, input));
    }),

  updateRole: protectedBase
    .input(updateHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return controlCall(() => hubService.updateRole(context.user.id, input));
    }),

  deleteRole: protectedBase
    .input(deleteHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      await controlCall(() => hubService.deleteRole(context.user.id, input));
      return { success: true };
    }),
});
