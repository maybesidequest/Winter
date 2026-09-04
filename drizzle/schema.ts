import { index, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

// Baseline for these tables is the node-pg-migrate job in
// migrations/202609010001_winter_owned_storage.sql — that job owns creating
// them; this schema must stay definitionally identical to it.

export const winterOauthTokens = pgTable("winter_oauth_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull().default("discord"),
  scope: text("scope").notNull().default("identify guilds"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }).notNull(),
  encryptionKeyId: text("encryption_key_id").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_winter_oauth_tokens_user_id").on(table.userId),
]);

export const winterFavorites = pgTable("winter_favorites", {
  userId: text("user_id").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.resourceType, table.resourceId] }),
]);

export const winterSavedViews = pgTable("winter_saved_views", {
  userId: text("user_id").notNull(),
  viewType: text("view_type").notNull(),
  name: text("name").notNull(),
  state: jsonb("state").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.viewType, table.name] }),
]);
