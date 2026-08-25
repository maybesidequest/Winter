import {
  pgTable,
  index,
  timestamp,
  text,
  integer,
  date,
  bigint,
  boolean,
  unique,
  varchar,
  jsonb,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const hubActivityLevel = pgEnum("HubActivityLevel", ["LOW", "MEDIUM", "HIGH"]);
export const hubVisibility = pgEnum("HubVisibility", ["PUBLIC", "PRIVATE", "UNLISTED"]);

// -------------------------------------------------------------------------
// Winter-Owned Schema (WINTER_DATABASE_URL)
// -------------------------------------------------------------------------

export const winterOAuthTokens = pgTable(
  "winter_oauth_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull().default("discord"),
    scope: text("scope").notNull().default("identify guilds"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_winter_oauth_tokens_user_id").on(table.userId),
  ]
);

// -------------------------------------------------------------------------
// Public Discovery & Top.gg Read-Models
// -------------------------------------------------------------------------

export const user = pgTable(
  "User",
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text(),
    emailVerified: timestamp({ mode: "string" }),
    image: text(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    locale: text().default("en").notNull(),
    showBadges: boolean().default(true).notNull(),
    badges: text().array().default([]).notNull(),
    activityLevel: hubActivityLevel().default("LOW").notNull(),
    customerId: text(),
    lastVoted: timestamp({ mode: "string" }),
    mentionOnReply: boolean().default(true).notNull(),
    showNsfwHubs: boolean().default(false).notNull(),
    voteRemindersEnabled: boolean().default(true).notNull(),
  },
  (table) => [
    unique("User_customerId_key").on(table.customerId),
    unique("User_email_key").on(table.email),
  ]
);

export const userStats = pgTable(
  "UserStats",
  {
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    userId: text().primaryKey().notNull(),
    voteCount: integer().default(0).notNull(),
    reputation: integer().default(0).notNull(),
    messageCount: integer().default(0).notNull(),
    callCount: integer().default(0).notNull(),
    hubJoinCount: integer().default(0).notNull(),
    currentStreak: integer().default(0).notNull(),
    longestStreak: integer().default(0).notNull(),
    streakFreezes: integer().default(0).notNull(),
    lastStreakDate: date(),
  }
);

export const hub = pgTable(
  "Hub",
  {
    id: text().primaryKey().notNull(),
    name: varchar({ length: 64 }).notNull(),
    description: varchar({ length: 2048 }).notNull(),
    shortDescription: varchar({ length: 128 }),
    visibility: hubVisibility().default("PUBLIC").notNull(),
    language: varchar({ length: 10 }),
    region: varchar({ length: 32 }),
    welcomeMessage: varchar({ length: 1024 }),
    iconUrl: text(),
    bannerUrl: text(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    lastActive: timestamp({ mode: "string" }),
    locked: boolean().default(false).notNull(),

    ownerId: text().notNull(),
    nsfw: boolean().default(false).notNull(),
    activityLevel: hubActivityLevel().default("LOW").notNull(),
    verified: boolean().default(false).notNull(),
    partnered: boolean().default(false).notNull(),
    featured: boolean().default(false).notNull(),
    weeklyMessageCount: integer().default(0).notNull(),
    averageRating: doublePrecision().default(0).notNull(),
    connectionCount: integer().default(0).notNull(),
    upvoteCount: integer().default(0).notNull(),
    reviewCount: integer().default(0).notNull(),
    appealCooldownHours: integer().default(168).notNull(),
    rules: jsonb().$type<string[]>().default([]).notNull(),
    settings: bigint({ mode: "number" }).default(0).notNull(),
    customBadges: jsonb(),
    version: integer().default(1).notNull(),
  },
  (table) => [
    unique("Hub_name_key").on(table.name),
  ]
);

export const connection = pgTable(
  "Connection",
  {
    id: text().primaryKey().notNull(),
    hubId: text().notNull(),
    serverId: text().notNull(),
    channelId: text(),
    connected: boolean().default(true).notNull(),
    pausedByBot: boolean().default(false).notNull(),
    pauseReason: text(),
    lastActive: timestamp({ mode: "string" }),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    version: integer().default(1).notNull(),
  }
);

export const serverData = pgTable(
  "ServerData",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    prefix: text(),
    hideServerName: boolean().default(false).notNull(),
    pingOnMatch: boolean().default(false).notNull(),
    autoRequeueOnSkip: boolean().default(false).notNull(),
    autoRequeueOnHangup: boolean().default(false).notNull(),
    filterNsfw: boolean().default(true).notNull(),
    lobbyChannelIds: text().array().default([]).notNull(),
    callCount: integer().default(0).notNull(),
    messageCount: integer().default(0).notNull(),
    version: integer().default(1).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  }
);

export const tag = pgTable(
  "Tag",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    category: text(),
    description: text(),
    color: text(),
    isOfficial: boolean().default(false).notNull(),
    usageCount: integer().default(0).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    unique("Tag_name_key").on(table.name),
  ]
);

export const hubToTag = pgTable(
  "_HubToTag",
  {
    a: text("A").notNull(),
    b: text("B").notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  }
);

export const hubActivityMetrics = pgTable(
  "HubActivityMetrics",
  {
    id: text().primaryKey().notNull(),
    hubId: text().notNull(),
    lastUpdated: timestamp({ mode: "string" }).defaultNow().notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    messagesLast24h: integer("messagesLast24h").default(0).notNull(),
    activeUsersLast24h: integer("activeUsersLast24h").default(0).notNull(),
    newConnectionsLast24h: integer("newConnectionsLast24h").default(0).notNull(),
    messagesLast7d: integer("messagesLast7d").default(0).notNull(),
    activeUsersLast7d: integer("activeUsersLast7d").default(0).notNull(),
    newConnectionsLast7d: integer("newConnectionsLast7d").default(0).notNull(),
    memberGrowthRate: doublePrecision().default(0).notNull(),
    engagementRate: doublePrecision().default(0).notNull(),
    trendingScore: doublePrecision().default(0).notNull(),
  }
);

export const hubUpvote = pgTable(
  "HubUpvote",
  {
    id: text().primaryKey().notNull(),
    hubId: text().notNull(),
    userId: text().notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    unique("HubUpvote_hubId_userId_key").on(table.hubId, table.userId),
  ]
);
