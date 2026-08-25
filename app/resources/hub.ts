import type { PermissionAction } from "~/permissions/config";

export type ResourceMetadata = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  effectiveRole?: string;
  permissions?: Record<PermissionAction, boolean>;
};

export type Resource<TSpec, TStatus = never> = {
  metadata: ResourceMetadata;
  spec: TSpec;
  status?: TStatus;
  version?: number;
};

export type HubSpec = {
  description: string;
  shortDescription: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  language: string | null;
  region: string | null;
  welcomeMessage: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  locked: boolean;
  nsfw: boolean;
  rules: string[];
  appealCooldownHours: number;
  settings: number;
};

export type HubStatus = {
  activityLevel: "LOW" | "MEDIUM" | "HIGH";
  verified: boolean;
  partnered: boolean;
  featured: boolean;
  weeklyMessageCount: number;
  averageRating: number | null;
  connectionCount: number;
  upvoteCount: number;
  reviewCount: number;
};

export type HubResource = {
  metadata: ResourceMetadata & {
    effectiveRole: string;
    permissions: Record<PermissionAction, boolean>;
  };
  spec: HubSpec;
  status: HubStatus;
  version: number;
};


export type HubRuleSpec = {
  title: string;
  description: string;
};

export type HubRuleStatus = {
  ruleNumber: number;
};

export type HubRuleResource = Resource<HubRuleSpec, HubRuleStatus>;

export type HubInviteSpec = {
  maxUses: number;
  durationSeconds: number;
  expiresAt: string | null;
};

export type HubInviteStatus = {
  code: string;
  uses: number;
  isExpired: boolean;
  isRevoked: boolean;
};

export type HubInviteResource = Resource<HubInviteSpec, HubInviteStatus>;

export type HubAnnouncementSpec = {
  content: string;
  scheduledFor: string | null;
};

export type HubAnnouncementStatus = {
  authorId: string;
  sentAt: string | null;
  deliveryStatus: string;
};

export type HubAnnouncementResource = Resource<HubAnnouncementSpec, HubAnnouncementStatus>;

export type HubBadgeConfigSpec = {
  ownerBadge: string | null;
  managerBadge: string | null;
  moderatorBadge: string | null;
};

export type HubBadgeConfigStatus = {
  customBadgesEnabled: boolean;
};

export type HubBadgeConfigResource = Resource<HubBadgeConfigSpec, HubBadgeConfigStatus>;

export type HubLogConfigSpec = {
  channelId: string | null;
  eventFlags: number;
  notificationRoleId: string | null;
};

export type HubLogConfigStatus = {
  isConfigured: boolean;
};

export type HubLogConfigResource = Resource<HubLogConfigSpec, HubLogConfigStatus>;

export type HubStaffMemberSpec = {
  role: string;
  permissionsBitmask: number;
};

export type HubStaffMemberStatus = {
  active: boolean;
  effectivePermissions: string[];
};

export type HubStaffMemberResource = Resource<HubStaffMemberSpec, HubStaffMemberStatus>;

