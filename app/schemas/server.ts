import { z } from "zod";

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

export const addBlockSchema = serverIdSchema.extend({
  targetType: z.enum(["user", "server"]),
  targetId: z.string().min(17).max(21).regex(/^\d+$/, "Target ID must be numeric snowflake"),
  reason: z.string().max(500).optional(),
});
export type AddBlockInput = z.infer<typeof addBlockSchema>;

export const removeBlockSchema = serverIdSchema.extend({
  blockId: z.string().min(1),
});
export type RemoveBlockInput = z.infer<typeof removeBlockSchema>;
