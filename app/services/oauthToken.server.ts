import { winterStorage } from "./winterStorage.server";

const encoder = new TextEncoder();

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
  const response = await fetch("https://discord.com/api/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
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
  return refreshDiscordToken(userId, record.refreshToken);
}
