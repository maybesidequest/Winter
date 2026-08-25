import type { HubResource, HubSpec } from "~/resources/hub";

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
