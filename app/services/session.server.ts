import { createCookieSessionStorage } from "react-router";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable is required in production");
}

// Keep the cookie lifetime bounded even when a deployment omits the optional
// override.  A session cookie is an authentication credential, not a durable
// browser preference.
const configuredMaxAge = Number(process.env.SESSION_MAX_AGE_SECONDS || 43_200);
export const SESSION_MAX_AGE_SECONDS = Number.isInteger(configuredMaxAge) && configuredMaxAge >= 900 && configuredMaxAge <= 604_800
  ? configuredMaxAge
  : 43_200;

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
