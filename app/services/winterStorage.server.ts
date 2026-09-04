import { and, desc, eq, sql } from "drizzle-orm";
import { db, getWinterPool } from "../db/db.server";
import { winterFavorites, winterOauthTokens, winterSavedViews } from "../../drizzle/schema";

export interface StoredOAuthTokenRecord {
  id: string;
  userId: string;
  scope: string;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: string;
  updatedAt: string;
  encryptionKeyId: string;
}

export interface FavoriteRecord {
  resourceType: string;
  resourceId: string;
  createdAt: string;
}

export type SavedViewStateValue = string | string[] | null;
export type SavedViewState = Record<string, SavedViewStateValue>;

export interface SavedViewRecord {
  viewType: string;
  name: string;
  state: SavedViewState;
  createdAt: string;
  updatedAt: string;
}

function requiredIdentifier(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > 128) throw new Error(`${field} must contain 1-128 characters`);
  return normalized;
}

function normalizeViewState(state: SavedViewState): SavedViewState {
  const normalized: SavedViewState = {};
  for (const key of Object.keys(state).sort()) {
    if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(key)) {
      throw new Error(`Saved view state key is invalid: ${key}`);
    }
    const value = state[key];
    if (value === null) {
      normalized[key] = null;
    } else if (typeof value === "string") {
      normalized[key] = value;
    } else if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      normalized[key] = [...new Set(value)].sort();
    } else {
      throw new Error(`Saved view state value is invalid: ${key}`);
    }
  }
  const encoded = Buffer.byteLength(JSON.stringify(normalized), "utf8");
  if (encoded > 8192) throw new Error("Saved view state must be at most 8 KiB");
  return normalized;
}

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export const winterStorage = {
  async checkReady(): Promise<void> {
    // Schema creation belongs to the dedicated migration job. Failing here
    // makes a missing or incompatible migration visible to readiness instead
    // of silently changing production state from an application request.
    const pool = getWinterPool();
    await pool.query("SELECT 1 FROM winter_oauth_tokens LIMIT 1");
    await pool.query("SELECT 1 FROM winter_favorites LIMIT 1");
    await pool.query("SELECT 1 FROM winter_saved_views LIMIT 1");
  },

  async saveTokens(record: {
    userId: string;
    scope: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date;
    encryptionKeyId: string;
  }): Promise<void> {
    const id = `discord:${record.userId}`;

    await db
      .insert(winterOauthTokens)
      .values({
        id,
        userId: record.userId,
        accountId: record.userId,
        providerId: "discord",
        scope: record.scope,
        accessToken: record.accessToken,
        refreshToken: record.refreshToken,
        accessTokenExpiresAt: record.expiresAt,
        encryptionKeyId: record.encryptionKeyId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: winterOauthTokens.id,
        set: {
          scope: record.scope,
          accessToken: record.accessToken,
          refreshToken: record.refreshToken,
          accessTokenExpiresAt: record.expiresAt,
          encryptionKeyId: record.encryptionKeyId,
          updatedAt: new Date(),
        },
      });
  },

  async getTokens(userId: string): Promise<StoredOAuthTokenRecord | null> {
    const id = `discord:${userId}`;

    const rows = await db
      .select()
      .from(winterOauthTokens)
      .where(eq(winterOauthTokens.id, id))
      .limit(1);
    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.userId,
      scope: row.scope,
      accessToken: row.accessToken,
      refreshToken: row.refreshToken,
      accessTokenExpiresAt: iso(row.accessTokenExpiresAt),
      encryptionKeyId: row.encryptionKeyId,
      updatedAt: iso(row.updatedAt),
    };
  },

  async listFavorites(userId: string): Promise<FavoriteRecord[]> {
    const rows = await db
      .select({
        resourceType: winterFavorites.resourceType,
        resourceId: winterFavorites.resourceId,
        createdAt: winterFavorites.createdAt,
      })
      .from(winterFavorites)
      .where(eq(winterFavorites.userId, requiredIdentifier(userId, "userId")))
      .orderBy(desc(winterFavorites.createdAt), winterFavorites.resourceId);
    return rows.map((row) => ({ ...row, createdAt: iso(row.createdAt) }));
  },

  async addFavorite(userId: string, resourceType: string, resourceId: string): Promise<FavoriteRecord> {
    const values = {
      userId: requiredIdentifier(userId, "userId"),
      resourceType: requiredIdentifier(resourceType, "resourceType"),
      resourceId: requiredIdentifier(resourceId, "resourceId"),
    };
    const rows = await db
      .insert(winterFavorites)
      .values(values)
      .onConflictDoUpdate({
        target: [winterFavorites.userId, winterFavorites.resourceType, winterFavorites.resourceId],
        set: { resourceId: values.resourceId },
      })
      .returning({
        resourceType: winterFavorites.resourceType,
        resourceId: winterFavorites.resourceId,
        createdAt: winterFavorites.createdAt,
      });
    const row = rows[0];
    return { ...row, createdAt: iso(row.createdAt) };
  },

  async removeFavorite(userId: string, resourceType: string, resourceId: string): Promise<void> {
    await db
      .delete(winterFavorites)
      .where(
        and(
          eq(winterFavorites.userId, requiredIdentifier(userId, "userId")),
          eq(winterFavorites.resourceType, requiredIdentifier(resourceType, "resourceType")),
          eq(winterFavorites.resourceId, requiredIdentifier(resourceId, "resourceId")),
        ),
      );
  },

  async listSavedViews(userId: string, viewType: string): Promise<SavedViewRecord[]> {
    const rows = await db
      .select({
        viewType: winterSavedViews.viewType,
        name: winterSavedViews.name,
        state: winterSavedViews.state,
        createdAt: winterSavedViews.createdAt,
        updatedAt: winterSavedViews.updatedAt,
      })
      .from(winterSavedViews)
      .where(
        and(
          eq(winterSavedViews.userId, requiredIdentifier(userId, "userId")),
          eq(winterSavedViews.viewType, requiredIdentifier(viewType, "viewType")),
        ),
      )
      .orderBy(winterSavedViews.name);
    return rows.map((row) => ({
      ...row,
      state: row.state as SavedViewState,
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
    }));
  },

  async saveView(userId: string, viewType: string, name: string, state: SavedViewState): Promise<SavedViewRecord> {
    const normalized = normalizeViewState(state);
    const rows = await db
      .insert(winterSavedViews)
      .values({
        userId: requiredIdentifier(userId, "userId"),
        viewType: requiredIdentifier(viewType, "viewType"),
        name: requiredIdentifier(name, "name"),
        state: normalized,
      })
      .onConflictDoUpdate({
        target: [winterSavedViews.userId, winterSavedViews.viewType, winterSavedViews.name],
        set: { state: normalized, updatedAt: sql`NOW()` },
      })
      .returning({
        viewType: winterSavedViews.viewType,
        name: winterSavedViews.name,
        state: winterSavedViews.state,
        createdAt: winterSavedViews.createdAt,
        updatedAt: winterSavedViews.updatedAt,
      });
    const row = rows[0];
    return {
      ...row,
      state: row.state as SavedViewState,
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
    };
  },

  async deleteView(userId: string, viewType: string, name: string): Promise<void> {
    await db
      .delete(winterSavedViews)
      .where(
        and(
          eq(winterSavedViews.userId, requiredIdentifier(userId, "userId")),
          eq(winterSavedViews.viewType, requiredIdentifier(viewType, "viewType")),
          eq(winterSavedViews.name, requiredIdentifier(name, "name")),
        ),
      );
  },
};
