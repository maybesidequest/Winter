import { createCookieSessionStorage } from "react-router";
import { redis } from "~/redis.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable is required in production");
}

const configuredMaxAge = Number(process.env.SESSION_MAX_AGE_SECONDS || 43_200);
export const SESSION_MAX_AGE_SECONDS = Number.isInteger(configuredMaxAge) && configuredMaxAge >= 900 && configuredMaxAge <= 604_800
  ? configuredMaxAge
  : 43_200;
const SESSION_VERSION_PREFIX = "winter:session-version:";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    secrets: [sessionSecret || "dev_only_local_cookie_secret_key_32_bytes!"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

type SessionValues = {
  get(name: string): unknown;
  set(name: string, value: unknown): void;
};

function versionKey(userId: string): string {
  return `${SESSION_VERSION_PREFIX}${userId}`;
}

async function currentSessionVersion(userId: string): Promise<number> {
  const key = versionKey(userId);
  await redis.set(key, "1", "NX");
  const raw = await redis.get(key);
  const version = Number(raw);
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new Error("Session revocation state is unavailable.");
  }
  return version;
}

export async function bindSessionToUser(session: SessionValues, userId: string): Promise<void> {
  session.set("sessionVersion", await currentSessionVersion(userId));
  session.set("sessionIssuedAt", Date.now());
}

export async function isBoundSessionValid(session: SessionValues, userId: string): Promise<boolean> {
  const issuedAt = Number(session.get("sessionIssuedAt"));
  const version = Number(session.get("sessionVersion"));
  if (!Number.isFinite(issuedAt) || !Number.isSafeInteger(version) || version < 1) return false;
  if (issuedAt > Date.now() || Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000) return false;
  return version === await currentSessionVersion(userId);
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await redis.incr(versionKey(userId));
}
