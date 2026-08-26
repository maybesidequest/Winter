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

export const hubFeaturesRouter = protectedBase.router({
  getBadges: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_BADGES");
      return hubService.getBadges(context.user.id, input.hubId);
    }),

  getLogConfig: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LOGGING");
      return hubService.getLogConfig(context.user.id, input.hubId);
    }),

  listRules: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return hubService.listRules(context.user.id, input.hubId);
    }),

  listAudit: protectedBase
    .input(z.object({ hubId: z.string(), limit: z.number().int().min(1).max(100).optional(), offset: z.number().int().min(0).optional() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_AUDIT");
      return hubService.listAudit(context.user.id, input);
    }),

  createRule: protectedBase
    .input(createHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return hubService.createRule(context.user.id, input);
    }),

  updateRule: protectedBase
    .input(updateHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return hubService.updateRule(context.user.id, input);
    }),

  deleteRule: protectedBase
    .input(deleteHubRuleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      await hubService.deleteRule(context.user.id, input);
      return { success: true };
    }),

  reorderRules: protectedBase
    .input(reorderHubRulesSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return hubService.reorderRules(context.user.id, input);
    }),

  listInvites: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      return hubService.listInvites(context.user.id, input.hubId);
    }),

  createInvite: protectedBase
    .input(createHubInviteSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      return hubService.createInvite(context.user.id, input);
    }),

  revokeInvite: protectedBase
    .input(revokeHubInviteSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_INVITES");
      await hubService.revokeInvite(context.user.id, input);
      return { success: true };
    }),

  patchBadges: protectedBase
    .input(patchHubBadgesSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_BADGES");
      return hubService.patchBadges(context.user.id, input);
    }),

  patchLogConfig: protectedBase
    .input(patchHubLogConfigSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_LOGGING");
      return hubService.patchLogConfig(context.user.id, input);
    }),

  listAnnouncements: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return hubService.listAnnouncements(context.user.id, input.hubId);
    }),

  createAnnouncement: protectedBase
    .input(createHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return hubService.createAnnouncement(context.user.id, input);
    }),

  updateAnnouncement: protectedBase
    .input(updateHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      return hubService.updateAnnouncement(context.user.id, input);
    }),

  deleteAnnouncement: protectedBase
    .input(deleteHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_ANNOUNCEMENTS");
      await hubService.deleteAnnouncement(context.user.id, input);
      return { success: true };
    }),

  listStaff: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubService.listStaff(context.user.id, input.hubId);
    }),

  assignStaffRole: protectedBase
    .input(assignHubStaffSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubService.assignStaffRole(context.user.id, input);
    }),

  removeStaffRole: protectedBase
    .input(removeHubStaffSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      await hubService.removeStaffRole(context.user.id, input);
      return { success: true };
    }),

  listRoles: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubService.listRoles(context.user.id, input.hubId);
    }),

  createRole: protectedBase
    .input(createHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubService.createRole(context.user.id, input);
    }),

  updateRole: protectedBase
    .input(updateHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      return hubService.updateRole(context.user.id, input);
    }),

  deleteRole: protectedBase
    .input(deleteHubRoleSchema)
    .handler(async ({ input, context }) => {
      requireCapability("HUB_TEAM");
      await hubService.deleteRole(context.user.id, input);
      return { success: true };
    }),
});
