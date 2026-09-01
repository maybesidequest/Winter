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

export const winterStorage = {
  async checkReady(): Promise<void> {
    // Schema creation belongs to the dedicated migration job. Failing here
    // makes a missing or incompatible migration visible to readiness instead
    // of silently changing production state from an application request.
    await getWinterPool().query("SELECT 1 FROM winter_oauth_tokens LIMIT 1");
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
};
