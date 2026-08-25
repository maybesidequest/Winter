import type { HubResource, HubSpec } from "~/resources/hub";
import { getServiceClients, invokeRpc, makeRequestContext } from "./transport";

export interface HubRule {
  id: string;
  hubId: string;
  ruleNumber: number;
  title: string;
  description: string;
  createdAt?: string;
}

export interface HubInvite {
  id: string;
  hubId: string;
  code: string;
  creatorId: string;
  uses: number;
  maxUses: number;
  expiresAt?: string;
  createdAt?: string;
}

export interface HubBadgeConfig {
  hubId: string;
  ownerBadge?: string;
  managerBadge?: string;
  moderatorBadge?: string;
}

export interface HubLogConfig {
  hubId: string;
  channelId: string;
  eventFlags: number;
  notificationRoleId?: string;
}

export interface HubAnnouncement {
  id: string;
  hubId: string;
  authorId: string;
  content: string;
  scheduledFor?: string;
  sentAt?: string;
  createdAt?: string;
}

export interface HubStaffMember {
  metadata: { userId: string; hubId: string; assignedAt?: string };
  spec: { role: string; permissionsBitmask: number; assignedBy: string };
  status: { active: boolean; effectivePermissions: string[] };
}

export const hubService = {
  async createHub(input: {
    name: string;
    description: string;
    shortDescription?: string | null;
    visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
    iconUrl?: string | null;
    bannerUrl?: string | null;
    welcomeMessage?: string | null;
    language?: string | null;
    region?: string | null;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      spec: {
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription || null,
        visibility: input.visibility || "PUBLIC",
        iconUrl: input.iconUrl || null,
        bannerUrl: input.bannerUrl || null,
        welcomeMessage: input.welcomeMessage || null,
        language: input.language || "en",
        region: input.region || "us",
      },
    });
  },

  async getHub(hubId: string, actorId: string): Promise<HubResource> {

    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "GetHub", {
      context: makeRequestContext(actorId),
      hubId,
    });
  },

  async patchHub(input: {
    hubId: string;
    spec: Partial<HubSpec>;
    updateMask: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      spec: input.spec,
      updateMask: { paths: input.updateMask },
      expectedVersion: input.expectedVersion,
    });
  },

  async listRules(hubId: string, actorId: string): Promise<HubRule[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ rules?: HubRule[] }>(clients.hubClient, "ListRules", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.rules || [];
  },

  async createRule(input: {
    hubId: string;
    title: string;
    description: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
    });
  },

  async updateRule(input: {
    hubId: string;
    ruleId: string;
    title: string;
    description: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "UpdateRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
    });
  },

  async deleteRule(input: {
    hubId: string;
    ruleId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      expectedVersion: input.expectedVersion,
    });
  },

  async reorderRules(input: {
    hubId: string;
    ruleIds: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ rules?: HubRule[] }>(clients.hubClient, "ReorderRules", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleIds: input.ruleIds,
      expectedVersion: input.expectedVersion,
    });
    return res.rules || [];
  },

  async listInvites(hubId: string, actorId: string): Promise<HubInvite[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ invites?: HubInvite[] }>(clients.hubClient, "ListInvites", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.invites || [];
  },

  async createInvite(input: {
    hubId: string;
    maxUses?: number;
    durationSeconds?: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubInvite> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateInvite", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      maxUses: input.maxUses || 0,
      durationSeconds: input.durationSeconds || 0,
    });
  },

  async revokeInvite(input: {
    hubId: string;
    inviteCode: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "RevokeInvite", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      inviteCode: input.inviteCode,
    });
  },

  async patchBadges(input: {
    hubId: string;
    ownerBadge?: string;
    managerBadge?: string;
    moderatorBadge?: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubBadgeConfig> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchBadges", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ownerBadge: input.ownerBadge,
      managerBadge: input.managerBadge,
      moderatorBadge: input.moderatorBadge,
      expectedVersion: input.expectedVersion,
    });
  },

  async patchLogConfig(input: {
    hubId: string;
    channelId: string;
    eventFlags: number;
    notificationRoleId?: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubLogConfig> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchLogConfig", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      channelId: input.channelId,
      eventFlags: input.eventFlags,
      notificationRoleId: input.notificationRoleId,
      expectedVersion: input.expectedVersion,
    });
  },

  async listAnnouncements(hubId: string, actorId: string): Promise<HubAnnouncement[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ announcements?: HubAnnouncement[] }>(
      clients.hubClient,
      "ListAnnouncements",
      {
        context: makeRequestContext(actorId),
        hubId,
      }
    );
    return res.announcements || [];
  },

  async createAnnouncement(input: {
    hubId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      content: input.content,
    });
  },

  async updateAnnouncement(input: {
    hubId: string;
    announcementId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "UpdateAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      content: input.content,
    });
  },

  async deleteAnnouncement(input: {
    hubId: string;
    announcementId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
    });
  },

  async listStaff(hubId: string, actorId: string): Promise<HubStaffMember[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ staff?: HubStaffMember[] }>(clients.hubClient, "ListStaff", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.staff || [];
  },

  async assignStaffRole(input: {
    hubId: string;
    userId: string;
    role: string;
    permissionsBitmask: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubStaffMember> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "AssignStaffRole", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      role: input.role,
      permissionsBitmask: input.permissionsBitmask,
    });
  },

  async removeStaffRole(input: {
    hubId: string;
    userId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "RemoveStaffRole", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
    });
  },

  async lockdownHub(input: {
    hubId: string;
    locked: boolean;
    reason: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "LockdownHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      locked: input.locked,
      reason: input.reason,
      expectedVersion: input.expectedVersion,
    });
  },

  async transferOwnership(input: {
    hubId: string;
    newOwnerId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "TransferOwnership", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      newOwnerId: input.newOwnerId,
      expectedVersion: input.expectedVersion,
    });
  },

  async deleteHub(input: {
    hubId: string;
    confirmationName: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      confirmationName: input.confirmationName,
      expectedVersion: input.expectedVersion,
    });
  },
};

