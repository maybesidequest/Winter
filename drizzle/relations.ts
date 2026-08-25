import { relations } from "drizzle-orm/relations";
import { user, userStats, hub, connection, hubToTag, tag, hubUpvote } from "./schema";

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(user, {
    fields: [userStats.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  userStats: many(userStats),
  hubs: many(hub),
  hubUpvotes: many(hubUpvote),
}));

export const hubRelations = relations(hub, ({ one, many }) => ({
  owner: one(user, {
    fields: [hub.ownerId],
    references: [user.id],
  }),
  connections: many(connection),
  hubUpvotes: many(hubUpvote),
  hubToTags: many(hubToTag),
}));

export const connectionRelations = relations(connection, ({ one }) => ({
  hub: one(hub, {
    fields: [connection.hubId],
    references: [hub.id],
  }),
}));

export const hubToTagRelations = relations(hubToTag, ({ one }) => ({
  hub: one(hub, {
    fields: [hubToTag.a],
    references: [hub.id],
  }),
  tag: one(tag, {
    fields: [hubToTag.b],
    references: [tag.id],
  }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  hubToTags: many(hubToTag),
}));

export const hubUpvoteRelations = relations(hubUpvote, ({ one }) => ({
  hub: one(hub, {
    fields: [hubUpvote.hubId],
    references: [hub.id],
  }),
  user: one(user, {
    fields: [hubUpvote.userId],
    references: [user.id],
  }),
}));
