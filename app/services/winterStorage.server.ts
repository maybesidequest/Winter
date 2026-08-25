import pg from "pg";

let pool: pg.Pool | null = null;
let schemaInitPromise: Promise<void> | null = null;

function getWinterPool(): pg.Pool {
  if (!pool) {
    const connectionString =
      process.env.WINTER_DATABASE_URL || process.env.DATABASE_URL;

    if (!connectionString && process.env.NODE_ENV === "production") {
      throw new Error(
        "WINTER_DATABASE_URL environment variable is required in production"
      );
    }

    pool = new pg.Pool({
      connectionString:
        connectionString ||
        "postgresql://postgres:postgres@localhost:5432/winter",
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

async function ensureWinterSchema(): Promise<void> {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      const p = getWinterPool();
      await p.query(`
        CREATE TABLE IF NOT EXISTS winter_oauth_tokens (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          account_id TEXT NOT NULL,
          provider_id TEXT NOT NULL DEFAULT 'discord',
          scope TEXT NOT NULL DEFAULT 'identify guilds',
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          access_token_expires_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_winter_oauth_tokens_user_id ON winter_oauth_tokens(user_id);
      `);
    })();
  }
  return schemaInitPromise;
}

export interface StoredOAuthTokenRecord {
  id: string;
  userId: string;
  scope: string;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: string;
  updatedAt: string;
}

export const winterStorage = {
  async saveTokens(record: {
    userId: string;
    scope: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date;
  }): Promise<void> {
    await ensureWinterSchema();
    const p = getWinterPool();
    const id = `discord:${record.userId}`;
    const now = new Date().toISOString();

    await p.query(
      `
      INSERT INTO winter_oauth_tokens (
        id, user_id, account_id, provider_id, scope, access_token, refresh_token, access_token_expires_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        scope = EXCLUDED.scope,
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        access_token_expires_at = EXCLUDED.access_token_expires_at,
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
        now,
      ]
    );
  },

  async getTokens(userId: string): Promise<StoredOAuthTokenRecord | null> {
    await ensureWinterSchema();
    const p = getWinterPool();
    const id = `discord:${userId}`;

    const res = await p.query<StoredOAuthTokenRecord>(
      `
      SELECT id, user_id as "userId", scope, access_token as "accessToken",
             refresh_token as "refreshToken", access_token_expires_at as "accessTokenExpiresAt",
             updated_at as "updatedAt"
      FROM winter_oauth_tokens
      WHERE id = $1
      LIMIT 1
    `,
      [id]
    );

    return res.rows[0] || null;
  },
};
