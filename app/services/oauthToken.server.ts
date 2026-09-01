import { winterStorage } from "./winterStorage.server";

const encoder = new TextEncoder();

type KeyRing = { activeId: string; keys: Map<string, string> };

function keyRing(): KeyRing {
  const entries = process.env.OAUTH_TOKEN_ENCRYPTION_KEYS
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf("=");
      if (separator <= 0) throw new Error("OAUTH_TOKEN_ENCRYPTION_KEYS entries must be keyId=secret");
      return [entry.slice(0, separator), entry.slice(separator + 1)] as const;
    }) || [];
  const legacySecret = process.env.OAUTH_TOKEN_ENCRYPTION_KEY?.trim();
  if (legacySecret && entries.length === 0) entries.push(["default", legacySecret]);
  const keys = new Map(entries);
  const activeId = process.env.OAUTH_TOKEN_ENCRYPTION_ACTIVE_KEY_ID?.trim() || entries.at(-1)?.[0];
  if (!activeId || !keys.has(activeId)) {
    throw new Error("A valid active OAuth token encryption key is required");
  }
  return { activeId, keys };
}

async function encryptionKey(secret: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export function activeEncryptionKeyId(): string {
  return keyRing().activeId;
}

export async function encryptToken(value: string): Promise<string> {
  const ring = keyRing();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(ring.keys.get(ring.activeId)!), encoder.encode(value));
  const payload = Buffer.concat([Buffer.from(iv), Buffer.from(encrypted)]).toString("base64url");
  return `${ring.activeId}.${payload}`;
}

export function encryptionKeyIdFromToken(value: string): string {
  const separator = value.indexOf(".");
  return separator > 0 ? value.slice(0, separator) : "legacy";
}

export async function decryptToken(value: string): Promise<string> {
  const ring = keyRing();
  const keyId = encryptionKeyIdFromToken(value);
  const encoded = keyId === "legacy" ? value : value.slice(keyId.length + 1);
  const secret = ring.keys.get(keyId) || (keyId === "legacy" ? process.env.OAUTH_TOKEN_ENCRYPTION_KEY : undefined);
  if (!secret) throw new Error(`OAuth token encryption key ${keyId} is unavailable`);
  const payload = Buffer.from(encoded, "base64url");
  if (payload.length <= 12) throw new Error("Invalid encrypted OAuth token");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: payload.subarray(0, 12) }, await encryptionKey(secret), payload.subarray(12));
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
    encryptionKeyId: activeEncryptionKeyId(),
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
  const accessToken = await decryptToken(record.accessToken);
  const tokenKeyId = encryptionKeyIdFromToken(record.accessToken);
  if (tokenKeyId !== activeEncryptionKeyId() && record.refreshToken) {
    // Rotate records opportunistically while retaining old keys as
    // decrypt-only during the configured rotation window.
    await saveDiscordTokens(userId, {
      accessToken,
      refreshToken: await decryptToken(record.refreshToken),
      expiresIn: Math.max(1, Math.floor((new Date(record.accessTokenExpiresAt).getTime() - Date.now()) / 1000)),
      scope: record.scope,
    });
  }
  const expiresAt = record.accessTokenExpiresAt ? new Date(record.accessTokenExpiresAt).getTime() : 0;
  if (expiresAt > Date.now() + 60_000) return accessToken;
  if (!record.refreshToken) throw new Error("Discord authorization expired. Sign in again.");
  return refreshDiscordToken(userId, record.refreshToken);
}
