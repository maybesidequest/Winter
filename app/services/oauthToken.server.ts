import { winterStorage } from "./winterStorage.server";
import { redis } from "~/redis.server";
import { fetchDiscord } from "./discordHttp.server";

const encoder = new TextEncoder();
const refreshes = new Map<string, Promise<string>>();
const REFRESH_LOCK_TTL_MS = 15_000;
const REFRESH_WAIT_MS = 10_000;

async function encryptionKey() {
  const secret = process.env.OAUTH_TOKEN_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("OAUTH_TOKEN_ENCRYPTION_KEY environment variable is required");
  }
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptToken(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(), encoder.encode(value));
  return Buffer.concat([Buffer.from(iv), Buffer.from(encrypted)]).toString("base64url");
}

export async function decryptToken(value: string) {
  const payload = Buffer.from(value, "base64url");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: payload.subarray(0, 12) }, await encryptionKey(), payload.subarray(12));
  return new TextDecoder().decode(decrypted);
}

type DiscordTokens = { accessToken: string; refreshToken?: string; expiresIn: number; scope?: string };

export async function saveDiscordTokens(userId: string, tokens: DiscordTokens) {
  const encryptedAccessToken = await encryptToken(tokens.accessToken);
  const encryptedRefreshToken = tokens.refreshToken ? await encryptToken(tokens.refreshToken) : null;
  const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

  await winterStorage.saveTokens({
    userId,
    scope: tokens.scope || "identify guilds",
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
    expiresAt,
  });
}

async function refreshDiscordToken(userId: string, encryptedRefreshToken: string) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    client_secret: process.env.DISCORD_CLIENT_SECRET || "",
    grant_type: "refresh_token",
    refresh_token: await decryptToken(encryptedRefreshToken),
  });
  const response = await fetchDiscord("https://discord.com/api/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error("Discord authorization expired. Sign in again.");
  const data = await response.json() as { access_token: string; refresh_token?: string; expires_in: number; scope?: string };
  await saveDiscordTokens(userId, { accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in, scope: data.scope });
  return data.access_token;
}

export async function getDiscordAccessToken(userId: string) {
  const record = await winterStorage.getTokens(userId);
  if (!record?.accessToken) throw new Error("Discord authorization is unavailable. Sign in again.");
  const expiresAt = record.accessTokenExpiresAt ? new Date(record.accessTokenExpiresAt).getTime() : 0;
  if (expiresAt > Date.now() + 60_000) return decryptToken(record.accessToken);
  if (!record.refreshToken) throw new Error("Discord authorization expired. Sign in again.");
  const active = refreshes.get(userId);
  if (active) return active;

  const refresh = refreshWithDistributedLock(userId);
  refreshes.set(userId, refresh);
  try {
    return await refresh;
  } finally {
    if (refreshes.get(userId) === refresh) refreshes.delete(userId);
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function freshStoredAccessToken(userId: string): Promise<string | null> {
  const current = await winterStorage.getTokens(userId);
  const expiresAt = current?.accessTokenExpiresAt ? new Date(current.accessTokenExpiresAt).getTime() : 0;
  if (current?.accessToken && expiresAt > Date.now() + 60_000) return decryptToken(current.accessToken);
  return null;
}

async function refreshWithDistributedLock(userId: string): Promise<string> {
  const lockKey = `winter:oauth-refresh-lock:${userId}`;
  const lockToken = crypto.randomUUID();
  const acquired = await redis.set(lockKey, lockToken, "PX", REFRESH_LOCK_TTL_MS, "NX");

  if (acquired === "OK") {
    try {
      const alreadyRefreshed = await freshStoredAccessToken(userId);
      if (alreadyRefreshed) return alreadyRefreshed;
      const current = await winterStorage.getTokens(userId);
      if (!current?.refreshToken) throw new Error("Discord authorization expired. Sign in again.");
      return await refreshDiscordToken(userId, current.refreshToken);
    } finally {
      try {
        await redis.eval(
          "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
          1,
          lockKey,
          lockToken,
        );
      } catch {
        // The lock has a short TTL, so release failure must not hide a
        // successful token refresh from the caller.
      }
    }
  }

  const deadline = Date.now() + REFRESH_WAIT_MS;
  while (Date.now() < deadline) {
    await delay(100);
    const refreshed = await freshStoredAccessToken(userId);
    if (refreshed) return refreshed;
    if (!(await redis.exists(lockKey))) return refreshWithDistributedLock(userId);
  }
  throw new Error("Discord authorization refresh is busy. Try again.");
}
