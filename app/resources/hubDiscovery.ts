export type HubPublicMetadata = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string | null;
};

export type HubPublicSpec = {
  description?: string | null;
  shortDescription: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  language: string | null;
  region: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  nsfw: boolean;
  rules?: string[];
};

export type HubPublicStatus = {
  verified: boolean;
  partnered: boolean;
  featured: boolean;
  connectionCount?: number;
  weeklyMessageCount?: number;
  averageRating: number | null;
  reviewCount?: number;
  upvoteCount?: number;
  monthlyUpvotes?: number;
  activityLevel: "LOW" | "MEDIUM" | "HIGH";
  trendingScore?: number;
  messagesLast24h?: number;
  activeUsersLast24h?: number;
  newConnectionsLast7d?: number;
  memberGrowthRate?: number;
  hasVotedToday?: boolean;
};

export type HubTagResource = {
  id: string;
  name: string;
  category?: string | null;
  color?: string | null;
  usageCount?: number;
};

export type HubPublicResource = {
  metadata: HubPublicMetadata;
  spec: HubPublicSpec;
  status: HubPublicStatus;
  tags: HubTagResource[];
};

export type HubSearchResult = {
  items: HubPublicResource[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    nextCursor?: string;
  };
};
