import pg from "pg";

let pool: pg.Pool | null = null;

function getWinterPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.WINTER_DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "WINTER_DATABASE_URL environment variable is required"
      );
    }

    pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

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

export const winterStorage = {
  async checkReady(): Promise<void> {
    // Schema creation belongs to the dedicated migration job. Failing here
    // makes a missing or incompatible migration visible to readiness instead
    // of silently changing production state from an application request.
    await getWinterPool().query("SELECT 1 FROM winter_oauth_tokens LIMIT 1");
    await getWinterPool().query("SELECT 1 FROM winter_favorites LIMIT 1");
    await getWinterPool().query("SELECT 1 FROM winter_saved_views LIMIT 1");
  },

  async saveTokens(record: {
    userId: string;
    scope: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date;
    encryptionKeyId: string;
  }): Promise<void> {
    const p = getWinterPool();
    const id = `discord:${record.userId}`;
    const now = new Date().toISOString();

    await p.query(
      `
      INSERT INTO winter_oauth_tokens (
        id, user_id, account_id, provider_id, scope, access_token, refresh_token, access_token_expires_at, encryption_key_id, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        scope = EXCLUDED.scope,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        access_token_expires_at = EXCLUDED.access_token_expires_at,
        encryption_key_id = EXCLUDED.encryption_key_id,
        updated_at = EXCLUDED.updated_at
    `,
      [
        id,
        record.userId,
        record.userId,
        "discord",
        record.scope,
        record.accessToken,
        record.refreshToken,
        record.expiresAt.toISOString(),
        record.encryptionKeyId,
        now,
      ]
    );
  },

  async getTokens(userId: string): Promise<StoredOAuthTokenRecord | null> {
    const p = getWinterPool();
    const id = `discord:${userId}`;

    const res = await p.query<StoredOAuthTokenRecord>(
      `
      SELECT id, user_id as "userId", scope, access_token as "accessToken",
             refresh_token as "refreshToken", access_token_expires_at as "accessTokenExpiresAt",
             encryption_key_id as "encryptionKeyId", updated_at as "updatedAt"
      FROM winter_oauth_tokens
      WHERE id = $1
      LIMIT 1
    `,
      [id]
    );

    return res.rows[0] || null;
  },

  async listFavorites(userId: string): Promise<FavoriteRecord[]> {
    const p = getWinterPool();
    const res = await p.query<FavoriteRecord>(
      `SELECT resource_type as "resourceType", resource_id as "resourceId", created_at as "createdAt"
       FROM winter_favorites WHERE user_id = $1 ORDER BY created_at DESC, resource_id ASC`,
      [requiredIdentifier(userId, "userId")],
    );
    return res.rows;
  },

  async addFavorite(userId: string, resourceType: string, resourceId: string): Promise<FavoriteRecord> {
    const p = getWinterPool();
    const values = [requiredIdentifier(userId, "userId"), requiredIdentifier(resourceType, "resourceType"), requiredIdentifier(resourceId, "resourceId")];
    const res = await p.query<FavoriteRecord>(
      `INSERT INTO winter_favorites (user_id, resource_type, resource_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, resource_type, resource_id) DO UPDATE SET resource_id = EXCLUDED.resource_id
       RETURNING resource_type as "resourceType", resource_id as "resourceId", created_at as "createdAt"`,
      values,
    );
    return res.rows[0];
  },

  async removeFavorite(userId: string, resourceType: string, resourceId: string): Promise<void> {
    const p = getWinterPool();
    await p.query(
      "DELETE FROM winter_favorites WHERE user_id = $1 AND resource_type = $2 AND resource_id = $3",
      [requiredIdentifier(userId, "userId"), requiredIdentifier(resourceType, "resourceType"), requiredIdentifier(resourceId, "resourceId")],
    );
  },

  async listSavedViews(userId: string, viewType: string): Promise<SavedViewRecord[]> {
    const p = getWinterPool();
    const res = await p.query<SavedViewRecord>(
      `SELECT view_type as "viewType", name, state, created_at as "createdAt", updated_at as "updatedAt"
       FROM winter_saved_views WHERE user_id = $1 AND view_type = $2 ORDER BY name ASC`,
      [requiredIdentifier(userId, "userId"), requiredIdentifier(viewType, "viewType")],
    );
    return res.rows;
  },

  async saveView(userId: string, viewType: string, name: string, state: SavedViewState): Promise<SavedViewRecord> {
    const p = getWinterPool();
    const values = [
      requiredIdentifier(userId, "userId"),
      requiredIdentifier(viewType, "viewType"),
      requiredIdentifier(name, "name"),
      normalizeViewState(state),
    ];
    const res = await p.query<SavedViewRecord>(
      `INSERT INTO winter_saved_views (user_id, view_type, name, state)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (user_id, view_type, name) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()
       RETURNING view_type as "viewType", name, state, created_at as "createdAt", updated_at as "updatedAt"`,
      [values[0], values[1], values[2], JSON.stringify(values[3])],
    );
    return res.rows[0];
  },

  async deleteView(userId: string, viewType: string, name: string): Promise<void> {
    const p = getWinterPool();
    await p.query(
      "DELETE FROM winter_saved_views WHERE user_id = $1 AND view_type = $2 AND name = $3",
      [requiredIdentifier(userId, "userId"), requiredIdentifier(viewType, "viewType"), requiredIdentifier(name, "name")],
    );
  },
};
