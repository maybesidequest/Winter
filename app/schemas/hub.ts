import { z } from "zod";
import { controlIdSchema, idempotencyKeySchema, optionalHttpUrlSchema } from "./controlLimits";

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
    .trim()
    .min(3, "Hub name must be at least 3 characters.")
    .max(32, "Hub name must be 32 characters or less."),
  shortDescription: z.string()
    .min(1, "Add a short description.")
    .max(100, "Short description must be 100 characters or less."),
  description: z.string()
    .max(1000, "Full description must be 1000 characters or less.")
    .optional(),
  visibility: HubVisibility.default("PUBLIC"),
  language: z.string().min(1, "Choose a primary language.").max(64).default("English"),
  region: z.string().min(1, "Choose a region.").max(64).default("Global"),
  welcomeMessage: z.string().max(2000).optional(),
  iconUrl: optionalHttpUrlSchema.optional(),
  bannerUrl: optionalHttpUrlSchema.optional(),
  // Generated once at the mutation boundary and reused if the request is retried.
  idempotencyKey: idempotencyKeySchema,
});

export type CreateHubInput = z.infer<typeof createHubSchema>;

export const patchHubConfigSchema = z.object({
  hubId: controlIdSchema,
  idempotencyKey: idempotencyKeySchema,
  name: z.string().trim().min(2).max(50).optional(),
  shortDescription: z.string().max(100).optional().nullable(),
  description: z.string().max(1024).optional().nullable(),
  iconUrl: optionalHttpUrlSchema.optional().nullable(),
  bannerUrl: optionalHttpUrlSchema.optional().nullable(),
  language: z.string().max(64).optional().nullable(),
  region: z.string().max(64).optional().nullable(),
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
  hubId: controlIdSchema,
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const updateHubRuleSchema = z.object({
  hubId: controlIdSchema,
  ruleId: controlIdSchema,
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const reorderHubRulesSchema = z.object({
  hubId: controlIdSchema,
  ruleIds: z.array(controlIdSchema).max(100),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const deleteHubRuleSchema = z.object({
  hubId: controlIdSchema,
  ruleId: controlIdSchema,
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const createHubInviteSchema = z.object({
  hubId: controlIdSchema,
  maxUses: z.number().int().min(0).max(10_000).default(0),
  durationSeconds: z.number().int().min(0).max(2_592_000).default(0),
  idempotencyKey: idempotencyKeySchema,
});

export const revokeHubInviteSchema = z.object({
  hubId: controlIdSchema,
  inviteCode: z.string().min(1).max(128),
  idempotencyKey: idempotencyKeySchema,
});

export const createHubAnnouncementSchema = z.object({
  hubId: controlIdSchema,
  content: z.string().trim().min(3, "Content must be at least 3 characters").max(4000),
  title: z.string().trim().min(1).max(200).default("Announcement"),
  scheduledFor: z.string().datetime({ offset: true }).optional(),
  repeatIntervalSeconds: z.number().int().min(0).max(31_536_000).default(0),
  timeZone: z.string().min(1).max(64).default("UTC"),
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]).default("DRAFT"),
  idempotencyKey: idempotencyKeySchema,
});

export const updateHubAnnouncementSchema = z.object({
  hubId: controlIdSchema,
  announcementId: controlIdSchema,
  content: z.string().trim().min(3, "Content must be at least 3 characters").max(4000),
  title: z.string().trim().min(1).max(200).optional(),
  scheduledFor: z.string().datetime({ offset: true }).optional(),
  repeatIntervalSeconds: z.number().int().min(0).max(31_536_000).optional(),
  timeZone: z.string().min(1).max(64).optional(),
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]).optional(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const deleteHubAnnouncementSchema = z.object({
  hubId: controlIdSchema,
  announcementId: controlIdSchema,
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const transitionHubAnnouncementSchema = z.object({
  hubId: controlIdSchema,
  announcementId: controlIdSchema,
  desiredState: z.enum(["DRAFT", "SCHEDULED", "PAUSED"]),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const patchHubBadgesSchema = z.object({
  hubId: controlIdSchema,
  ownerBadge: z.string().max(32).optional().nullable(),
  managerBadge: z.string().max(32).optional().nullable(),
  moderatorBadge: z.string().max(32).optional().nullable(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const patchHubLogConfigSchema = z.object({
  hubId: controlIdSchema,
  // An empty channel clears logging. The Control Plane validates whether a
  // non-empty channel belongs to this Hub and is usable.
  channelId: z.string().max(32),
  eventFlags: z.number().int().min(0).default(0),
  notificationRoleId: controlIdSchema.optional().nullable(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const assignHubStaffSchema = z.object({
  hubId: controlIdSchema,
  userId: controlIdSchema,
  role: z.string().min(1).max(64),
  permissionsBitmask: z.number().int().default(0),
  roleId: controlIdSchema.optional(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const removeHubStaffSchema = z.object({
  hubId: controlIdSchema,
  userId: controlIdSchema,
  roleId: controlIdSchema.optional(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const createHubRoleSchema = z.object({
  hubId: controlIdSchema,
  name: z.string().trim().min(1).max(64),
  permissionsBitmask: z.number().int().nonnegative(),
  position: z.number().int().default(0),
  idempotencyKey: idempotencyKeySchema,
});

export const updateHubRoleSchema = createHubRoleSchema.extend({
  roleId: controlIdSchema,
  expectedVersion: z.number().int().positive(),
});

export const deleteHubRoleSchema = z.object({
  hubId: controlIdSchema,
  roleId: controlIdSchema,
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export const lockdownHubSchema = z.object({
  hubId: controlIdSchema,
  locked: z.boolean(),
  reason: z.string().max(500).default(""),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export type LockdownHubInput = z.infer<typeof lockdownHubSchema>;

export const transferHubOwnershipSchema = z.object({
  hubId: controlIdSchema,
  newOwnerId: controlIdSchema,
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export type TransferHubOwnershipInput = z.infer<typeof transferHubOwnershipSchema>;

export const deleteHubSchema = z.object({
  hubId: controlIdSchema,
  confirmationName: z.string().min(1).max(50),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: idempotencyKeySchema,
});

export type DeleteHubInput = z.infer<typeof deleteHubSchema>;
