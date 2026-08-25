import { z } from "zod";
import { protectedBase } from "~/rpc/context";
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
      return hubService.listRules(context.user.id, input.hubId);
    }),

  createRule: protectedBase
    .input(createHubRuleSchema)
    .handler(async ({ input, context }) => {
      return hubService.createRule(context.user.id, input);
    }),

  updateRule: protectedBase
    .input(updateHubRuleSchema)
    .handler(async ({ input, context }) => {
      return hubService.updateRule(context.user.id, input);
    }),

  deleteRule: protectedBase
    .input(deleteHubRuleSchema)
    .handler(async ({ input, context }) => {
      await hubService.deleteRule(context.user.id, input);
      return { success: true };
    }),

  reorderRules: protectedBase
    .input(reorderHubRulesSchema)
    .handler(async ({ input, context }) => {
      return hubService.reorderRules(context.user.id, input);
    }),

  listInvites: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listInvites(context.user.id, input.hubId);
    }),

  createInvite: protectedBase
    .input(createHubInviteSchema)
    .handler(async ({ input, context }) => {
      return hubService.createInvite(context.user.id, input);
    }),

  revokeInvite: protectedBase
    .input(revokeHubInviteSchema)
    .handler(async ({ input, context }) => {
      await hubService.revokeInvite(context.user.id, input);
      return { success: true };
    }),

  patchBadges: protectedBase
    .input(patchHubBadgesSchema)
    .handler(async ({ input, context }) => {
      return hubService.patchBadges(context.user.id, input);
    }),

  patchLogConfig: protectedBase
    .input(patchHubLogConfigSchema)
    .handler(async ({ input, context }) => {
      return hubService.patchLogConfig(context.user.id, input);
    }),

  listAnnouncements: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listAnnouncements(context.user.id, input.hubId);
    }),

  createAnnouncement: protectedBase
    .input(createHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      return hubService.createAnnouncement(context.user.id, input);
    }),

  updateAnnouncement: protectedBase
    .input(updateHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      return hubService.updateAnnouncement(context.user.id, input);
    }),

  deleteAnnouncement: protectedBase
    .input(deleteHubAnnouncementSchema)
    .handler(async ({ input, context }) => {
      await hubService.deleteAnnouncement(context.user.id, input);
      return { success: true };
    }),

  listStaff: protectedBase
    .input(z.object({ hubId: z.string() }))
    .handler(async ({ input, context }) => {
      return hubService.listStaff(context.user.id, input.hubId);
    }),

  assignStaffRole: protectedBase
    .input(assignHubStaffSchema)
    .handler(async ({ input, context }) => {
      return hubService.assignStaffRole(context.user.id, input);
    }),

  removeStaffRole: protectedBase
    .input(removeHubStaffSchema)
    .handler(async ({ input, context }) => {
      await hubService.removeStaffRole(context.user.id, input);
      return { success: true };
    }),
});
