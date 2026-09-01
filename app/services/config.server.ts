/**
 * Validate credentials before the production HTTP listener starts. Keeping
 * this check in one place prevents route-level development fallbacks from
 * accidentally becoming the deployment's authentication configuration.
 */
export const PRODUCTION_REQUIRED_SECRETS = [
  "SESSION_SECRET",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_CALLBACK_URL",
  "JWT_SECRET",
  "BEACON_JWT_SECRET",
  "WINTER_DATABASE_URL",
  "WINTER_REDIS_URI",
] as const;

export function validateProductionConfig(
  env: NodeJS.ProcessEnv = process.env,
  runtimeMode = env.NODE_ENV || "production",
): void {
  if (runtimeMode !== "production") return;

  const missing: string[] = PRODUCTION_REQUIRED_SECRETS.filter((name) => !env[name]?.trim());
  if (!env.OAUTH_TOKEN_ENCRYPTION_KEYS?.trim() && !env.OAUTH_TOKEN_ENCRYPTION_KEY?.trim()) {
    missing.push("OAUTH_TOKEN_ENCRYPTION_KEYS");
  }
  if (missing.length > 0) {
    throw new Error(`Missing required production configuration: ${missing.join(", ")}`);
  }
}
