import { controlHubService } from "~/services/control.server";
import { hubStaffService } from "~/services/control/hubs/staff";
import { hubRoleService } from "~/services/control/hubs/roles";

export const hubFeaturesService = {
  async getBadges(userId: string, hubId: string) {
    return controlHubService.getBadges(hubId, userId);
  },

  async getLogConfig(userId: string, hubId: string) {
    return controlHubService.getLogConfig(hubId, userId);
  },
  async listAudit(userId: string, input: { hubId: string; limit?: number; offset?: number }) {
    return controlHubService.listAudit({ ...input, actorId: userId });
  },
  async listRules(userId: string, hubId: string) {
    return controlHubService.listRules(hubId, userId);
  },

  async createRule(userId: string, input: { hubId: string; title: string; description: string; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.createRule({ ...input, actorId: userId });
  },

  async updateRule(userId: string, input: { hubId: string; ruleId: string; title: string; description: string; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.updateRule({ ...input, actorId: userId });
  },

  async deleteRule(userId: string, input: { hubId: string; ruleId: string; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.deleteRule({ ...input, actorId: userId });
  },

  async reorderRules(userId: string, input: { hubId: string; ruleIds: string[]; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.reorderRules({ ...input, actorId: userId });
  },

  async listInvites(userId: string, hubId: string) {
    return controlHubService.listInvites(hubId, userId);
  },

  async createInvite(userId: string, input: { hubId: string; maxUses?: number; durationSeconds?: number; idempotencyKey: string }) {
    return controlHubService.createInvite({ ...input, actorId: userId });
  },

  async revokeInvite(userId: string, input: { hubId: string; inviteCode: string; idempotencyKey: string }) {
    return controlHubService.revokeInvite({ ...input, actorId: userId });
  },

  async patchBadges(userId: string, input: { hubId: string; ownerBadge?: string | null; managerBadge?: string | null; moderatorBadge?: string | null; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.patchBadges({
      hubId: input.hubId,
      ownerBadge: input.ownerBadge ?? undefined,
      managerBadge: input.managerBadge ?? undefined,
      moderatorBadge: input.moderatorBadge ?? undefined,
      expectedVersion: input.expectedVersion,
      idempotencyKey: input.idempotencyKey,
      actorId: userId,
    });
  },

  async patchLogConfig(userId: string, input: { hubId: string; channelId: string; eventFlags: number; notificationRoleId?: string | null; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.patchLogConfig({
      hubId: input.hubId,
      channelId: input.channelId,
      eventFlags: input.eventFlags,
      notificationRoleId: input.notificationRoleId ?? undefined,
      expectedVersion: input.expectedVersion,
      idempotencyKey: input.idempotencyKey,
      actorId: userId,
    });
  },

  async listAnnouncements(userId: string, hubId: string) {
    return controlHubService.listAnnouncements(hubId, userId);
  },

  async createAnnouncement(userId: string, input: { hubId: string; content: string; idempotencyKey: string; title?: string; scheduledFor?: string; repeatIntervalSeconds?: number; timeZone?: string; desiredState?: "DRAFT" | "SCHEDULED" | "PAUSED" }) {
    return controlHubService.createAnnouncement({ ...input, actorId: userId });
  },

  async updateAnnouncement(userId: string, input: { hubId: string; announcementId: string; content: string; idempotencyKey: string; expectedVersion: number; title?: string; scheduledFor?: string; repeatIntervalSeconds?: number; timeZone?: string; desiredState?: "DRAFT" | "SCHEDULED" | "PAUSED" }) {
    return controlHubService.updateAnnouncement({ ...input, actorId: userId });
  },

  async deleteAnnouncement(userId: string, input: { hubId: string; announcementId: string; idempotencyKey: string; expectedVersion: number }) {
    return controlHubService.deleteAnnouncement({ ...input, actorId: userId });
  },

  async transitionAnnouncement(userId: string, input: { hubId: string; announcementId: string; desiredState: "DRAFT" | "SCHEDULED" | "PAUSED"; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.transitionAnnouncement({ ...input, actorId: userId });
  },

  async listStaff(userId: string, hubId: string) {
    return hubStaffService.listStaff(hubId, userId);
  },

  async assignStaffRole(userId: string, input: { hubId: string; userId: string; role: string; permissionsBitmask: number; roleId?: string; expectedVersion?: number; idempotencyKey: string }) {
    return hubStaffService.assignStaffRole({ ...input, actorId: userId });
  },

  async removeStaffRole(userId: string, input: { hubId: string; userId: string; roleId?: string; expectedVersion?: number; idempotencyKey: string }) {
    return hubStaffService.removeStaffRole({ ...input, actorId: userId });
  },

  async listRoles(userId: string, hubId: string) {
    return hubRoleService.listRoles(hubId, userId);
  },

  async createRole(userId: string, input: { hubId: string; name: string; permissionsBitmask: number; position?: number; idempotencyKey: string }) {
    return hubRoleService.createRole({ ...input, position: input.position ?? 0, actorId: userId });
  },

  async updateRole(userId: string, input: { hubId: string; roleId: string; name: string; permissionsBitmask: number; position?: number; expectedVersion: number; idempotencyKey: string }) {
    return hubRoleService.updateRole({ ...input, position: input.position ?? 0, actorId: userId });
  },

  async deleteRole(userId: string, input: { hubId: string; roleId: string; expectedVersion: number; idempotencyKey: string }) {
    return hubRoleService.deleteRole({ ...input, actorId: userId });
  },
};
