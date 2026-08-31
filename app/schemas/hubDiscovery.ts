import { z } from "zod";
import { controlCursorSchema, controlIdSchema, idempotencyKeySchema } from "./controlLimits";

export const HubDiscoverySortOptions = [
  "trending",
  "upvotes",
  "rating",
  "active",
  "growing",
  "popular",
  "newest",
] as const;

export type HubDiscoverySort = (typeof HubDiscoverySortOptions)[number];

export const hubDiscoveryQuerySchema = z.object({
  search: z.string().max(100).optional(),
  sort: z.enum(HubDiscoverySortOptions).default("trending"),
  tags: z.array(z.string().trim().min(1).max(64)).max(10).optional(),
  language: z.string().max(64).optional(),
  region: z.string().max(64).optional(),
  nsfw: z.boolean().default(false),
  page: z.number().int().min(1).max(20).default(1),
  // Control Plane uses keyset cursors. The service also accepts page for
  // backwards compatibility with the existing dashboard URL.
  cursor: controlCursorSchema.optional(),
  limit: z.number().int().min(1).max(50).default(24),
});

export type HubDiscoveryQueryInput = z.infer<typeof hubDiscoveryQuerySchema>;

export const hubUpvoteInputSchema = z.object({
  hubId: controlIdSchema,
  idempotencyKey: idempotencyKeySchema,
});

export type HubUpvoteInput = z.infer<typeof hubUpvoteInputSchema>;

export const quickConnectInputSchema = z.object({
  hubId: controlIdSchema,
  serverId: controlIdSchema,
  channelId: controlIdSchema,
  inviteCode: z.string().max(128).optional(),
  customName: z.string().trim().max(64).optional(),
  idempotencyKey: idempotencyKeySchema,
});

export type QuickConnectInput = z.infer<typeof quickConnectInputSchema>;
