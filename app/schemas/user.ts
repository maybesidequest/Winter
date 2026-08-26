import { z } from "zod";

export const patchUserPreferencesSchema = z.object({
  locale: z.string().min(1).max(10).optional(),
  showBadges: z.boolean().optional(),
  mentionOnReply: z.boolean().optional(),
  showNsfwHubs: z.boolean().optional(),
  voteRemindersEnabled: z.boolean().optional(),
  streaksEnabled: z.boolean().optional(),
  activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
});

export type PatchUserPreferencesInput = z.infer<typeof patchUserPreferencesSchema>;

export const patchDashboardPreferencesSchema = z.object({
  theme: z.enum(["system", "night", "paper"]).optional(),
  compactMode: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  soundAlerts: z.boolean().optional(),
});

export type PatchDashboardPreferencesInput = z.infer<typeof patchDashboardPreferencesSchema>;

export const userCallHistoryQuerySchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
});

export type UserCallHistoryQueryInput = z.infer<typeof userCallHistoryQuerySchema>;
