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
} from "~/schemas/hub";

export const hubFeaturesRouter = protectedBase.router({
  listRules: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      requireCapability("HUB_RULES");
      return hubService.listRules(context.user.id, input.hubId);
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
});
