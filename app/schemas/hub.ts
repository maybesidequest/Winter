import { z } from "zod";

export const HubVisibility = z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]);
export type HubVisibilityType = z.infer<typeof HubVisibility>;

export const HubSettingsFlags = {
  REACTIONS: 1,
  HIDE_LINKS: 2,
  SPAM_FILTER: 4,
  BLOCK_INVITES: 8,
  USE_NICKNAMES: 16,
  BLOCK_NSFW: 32,
  ALLOW_VIDEOS: 64,
  BLOCK_ATTACHMENTS: 128,
  BLOCK_TENOR_GIFS: 256,
} as const;

export type HubSettingsFlag = keyof typeof HubSettingsFlags;

export function hasSettingsFlag(bitmask: number, flag: keyof typeof HubSettingsFlags): boolean {
  return (bitmask & HubSettingsFlags[flag]) !== 0;
}

export function toggleSettingsFlag(bitmask: number, flag: keyof typeof HubSettingsFlags, enabled: boolean): number {
  if (enabled) {
    return bitmask | HubSettingsFlags[flag];
  }
  return bitmask & ~HubSettingsFlags[flag];
}

export const createHubSchema = z.object({
  name: z.string()
    .min(1, "Add a hub name.")
    .max(100, "Hub name must be 100 characters or less."),
  shortDescription: z.string()
    .min(1, "Add a short description.")
    .max(100, "Short description must be 100 characters or less."),
  description: z.string()
    .max(1024, "Full description must be 1024 characters or less.")
    .optional(),
  visibility: HubVisibility.default("PUBLIC"),
  language: z.string().min(1, "Choose a primary language.").default("English"),
  region: z.string().min(1, "Choose a region.").default("Global"),
  welcomeMessage: z.string().optional(),
  iconUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  // Generated once at the mutation boundary and reused if the request is retried.
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export type CreateHubInput = z.infer<typeof createHubSchema>;

export const patchHubConfigSchema = z.object({
  hubId: z.string(),
  idempotencyKey: z.string().min(1, "Retryable changes need an idempotency key."),
  name: z.string().min(1).max(100).optional(),
  shortDescription: z.string().max(100).optional().nullable(),
  description: z.string().max(1024).optional().nullable(),
  iconUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
  bannerUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
  language: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  visibility: HubVisibility.optional(),
  nsfw: z.boolean().optional(),
  locked: z.boolean().optional(),
  appealCooldownHours: z.number().min(0).max(8760).optional(),
  welcomeMessage: z.string().max(2000).optional().nullable(),
  settings: z.number().int().min(0).optional(),
  version: z.number().int().min(1),
});

export type PatchHubConfigInput = z.infer<typeof patchHubConfigSchema>;

export const createHubRuleSchema = z.object({
  hubId: z.string(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const updateHubRuleSchema = z.object({
  hubId: z.string(),
  ruleId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const reorderHubRulesSchema = z.object({
  hubId: z.string(),
  ruleIds: z.array(z.string()),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const deleteHubRuleSchema = z.object({
  hubId: z.string(),
  ruleId: z.string(),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const createHubInviteSchema = z.object({
  hubId: z.string(),
  maxUses: z.number().int().min(0).default(0),
  durationSeconds: z.number().int().min(0).default(0),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const revokeHubInviteSchema = z.object({
  hubId: z.string(),
  inviteCode: z.string().min(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const createHubAnnouncementSchema = z.object({
  hubId: z.string(),
  content: z.string().trim().min(3, "Content must be at least 3 characters").max(2000),
  title: z.string().trim().min(1).max(200).default("Announcement"),
  scheduledFor: z.string().datetime({ offset: true }).optional(),
  repeatIntervalSeconds: z.number().int().min(0).max(31_536_000).default(0),
  timeZone: z.string().min(1).max(64).default("UTC"),
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]).default("DRAFT"),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const updateHubAnnouncementSchema = z.object({
  hubId: z.string(),
  announcementId: z.string(),
  content: z.string().trim().min(3, "Content must be at least 3 characters").max(2000),
  title: z.string().trim().min(1).max(200).optional(),
  scheduledFor: z.string().datetime({ offset: true }).optional(),
  repeatIntervalSeconds: z.number().int().min(0).max(31_536_000).optional(),
  timeZone: z.string().min(1).max(64).optional(),
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]).optional(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const deleteHubAnnouncementSchema = z.object({
  hubId: z.string(),
  announcementId: z.string(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const transitionHubAnnouncementSchema = z.object({
  hubId: z.string(),
  announcementId: z.string(),
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const patchHubBadgesSchema = z.object({
  hubId: z.string(),
  ownerBadge: z.string().max(32).optional().nullable(),
  managerBadge: z.string().max(32).optional().nullable(),
  moderatorBadge: z.string().max(32).optional().nullable(),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const patchHubLogConfigSchema = z.object({
  hubId: z.string(),
  // An empty channel clears logging. The Control Plane validates whether a
  // non-empty channel belongs to this Hub and is usable.
  channelId: z.string().max(32),
  eventFlags: z.number().int().min(0).default(0),
  notificationRoleId: z.string().optional().nullable(),
  expectedVersion: z.number().int().default(1),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const assignHubStaffSchema = z.object({
  hubId: z.string(),
  userId: z.string().min(1),
  role: z.string().min(1),
  permissionsBitmask: z.number().int().default(0),
  roleId: z.string().optional(),
  expectedVersion: z.number().int().default(0),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const removeHubStaffSchema = z.object({
  hubId: z.string(),
  userId: z.string().min(1),
  roleId: z.string().optional(),
  expectedVersion: z.number().int().default(0),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const createHubRoleSchema = z.object({
  hubId: z.string(),
  name: z.string().trim().min(1).max(64),
  permissionsBitmask: z.number().int().nonnegative(),
  position: z.number().int().default(0),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const updateHubRoleSchema = createHubRoleSchema.extend({
  roleId: z.string().min(1),
  expectedVersion: z.number().int().positive(),
});

export const deleteHubRoleSchema = z.object({
  hubId: z.string(),
  roleId: z.string().min(1),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export const lockdownHubSchema = z.object({
  hubId: z.string(),
  locked: z.boolean(),
  reason: z.string().max(500).default(""),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export type LockdownHubInput = z.infer<typeof lockdownHubSchema>;

export const transferHubOwnershipSchema = z.object({
  hubId: z.string(),
  newOwnerId: z.string().min(1),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export type TransferHubOwnershipInput = z.infer<typeof transferHubOwnershipSchema>;

export const deleteHubSchema = z.object({
  hubId: z.string(),
  confirmationName: z.string().min(1),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1, "A retry key is required."),
});

export type DeleteHubInput = z.infer<typeof deleteHubSchema>;
