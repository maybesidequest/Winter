import { z } from "zod";

export const listServersSchema = z
  .object({
    forceRefresh: z.boolean().optional(),
  })
  .optional();
export type ListServersInput = z.infer<typeof listServersSchema>;

export const serverIdSchema = z.object({ serverId: z.string().min(1) });
export const patchCallConfigSchema = serverIdSchema.extend({
  pingOnMatch: z.boolean(),
  autoRequeueOnSkip: z.boolean(),
  filterNsfw: z.boolean(),
  lobbyChannelIds: z.array(z.string()).max(1, "Select at most one Call channel."),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
});
export type PatchCallConfigInput = z.infer<typeof patchCallConfigSchema>;

export const patchPrefixSchema = serverIdSchema.extend({
  prefix: z.string().trim().min(1, "Prefix cannot be empty.").max(10, "Prefix cannot exceed 10 characters."),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
});
export type PatchPrefixInput = z.infer<typeof patchPrefixSchema>;

export const addBlockSchema = serverIdSchema.extend({
  targetType: z.enum(["user", "server"]),
  targetId: z.string().min(17).max(21).regex(/^\d+$/, "Target ID must be numeric snowflake"),
  reason: z.string().trim().min(1, "Reason is required.").max(500),
  idempotencyKey: z.string().min(1),
});
export type AddBlockInput = z.infer<typeof addBlockSchema>;

export const removeBlockSchema = serverIdSchema.extend({
  blockId: z.string().min(1),
  idempotencyKey: z.string().min(1),
});
export type RemoveBlockInput = z.infer<typeof removeBlockSchema>;

export const toggleBridgeSchema = serverIdSchema.extend({
  connectionId: z.string().min(1),
  enabled: z.boolean(),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
});

export const bridgeActionSchema = serverIdSchema.extend({
  connectionId: z.string().min(1),
  expectedVersion: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
});
