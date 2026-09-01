-- Winter-owned storage only. Apply through the dedicated migration job before
-- the application deployment; the application never creates tables at runtime.
CREATE TABLE IF NOT EXISTS winter_oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL DEFAULT 'discord',
  scope TEXT NOT NULL DEFAULT 'identify guilds',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  access_token_expires_at TIMESTAMPTZ NOT NULL,
  encryption_key_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE winter_oauth_tokens
  ADD COLUMN IF NOT EXISTS encryption_key_id TEXT;

UPDATE winter_oauth_tokens
SET encryption_key_id = COALESCE(NULLIF(encryption_key_id, ''), 'legacy')
WHERE encryption_key_id IS NULL OR encryption_key_id = '';

ALTER TABLE winter_oauth_tokens
  ALTER COLUMN encryption_key_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_winter_oauth_tokens_user_id
  ON winter_oauth_tokens(user_id);

CREATE TABLE IF NOT EXISTS winter_favorites (
  user_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_type, resource_id)
);

CREATE TABLE IF NOT EXISTS winter_saved_views (
  user_id TEXT NOT NULL,
  view_type TEXT NOT NULL,
  name TEXT NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, view_type, name),
  CONSTRAINT winter_saved_views_state_size CHECK (pg_column_size(state) <= 8192)
);
