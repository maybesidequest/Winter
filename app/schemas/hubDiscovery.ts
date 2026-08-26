import { z } from "zod";

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
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  region: z.string().optional(),
  nsfw: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(24),
});

export type HubDiscoveryQueryInput = z.infer<typeof hubDiscoveryQuerySchema>;

export const hubUpvoteInputSchema = z.object({
  hubId: z.string().min(1),
  idempotencyKey: z.string().min(1),
});

export type HubUpvoteInput = z.infer<typeof hubUpvoteInputSchema>;

export const quickConnectInputSchema = z.object({
  hubId: z.string().min(1),
  serverId: z.string().min(1),
  channelId: z.string().min(1),
  inviteCode: z.string().optional(),
  customName: z.string().optional(),
});

export type QuickConnectInput = z.infer<typeof quickConnectInputSchema>;

