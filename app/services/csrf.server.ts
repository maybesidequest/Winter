import { timingSafeEqual } from "node:crypto";
import { sessionStorage } from "./session.server";

export const CSRF_SESSION_KEY = "csrfToken";
export const CSRF_COOKIE_NAME = "interchat_csrf";

const CSRF_COOKIE_MAX_AGE = 43_200;

export function newCsrfToken(): string {
  return crypto.randomUUID();
}

// The token is stored raw in the cookie: browser JavaScript echoes it verbatim
// into the X-CSRF-Token header, and requireCsrf compares it against the raw
// token in the signed session. Encoding it (createCookie base64) would make
// the two values permanently unequal. A UUID needs no cookie encoding.
export function serializeCsrfCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${CSRF_COOKIE_NAME}=${token}; Max-Age=${CSRF_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function clearCsrfCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${CSRF_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

function equalConstantTime(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  if (leftBytes.length !== rightBytes.length) return false;
  return timingSafeEqual(leftBytes, rightBytes);
}

/**
 * Authenticate a browser mutation before ORPC dispatch. The token is copied
 * into a readable cookie solely so browser JavaScript can echo it in the
 * header; the signed HttpOnly session remains the authority.
 */
export async function requireCsrf(request: Request, expectedToken: unknown): Promise<void> {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new Response("Cross-origin request denied", { status: 403 });
  }

  const provided = request.headers.get("X-CSRF-Token") || "";
  if (typeof expectedToken !== "string" || !expectedToken || !equalConstantTime(provided, expectedToken)) {
    throw new Response("CSRF validation failed", { status: 403 });
  }
}

/**
 * Synchronize and auto-heal the CSRF token between the signed session and the
 * browser-accessible CSRF cookie.
 */
export async function ensureCsrfSession(request: Request): Promise<{
  csrfToken: string;
  headers: Headers;
}> {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  let csrfToken = session.get(CSRF_SESSION_KEY);
  const headers = new Headers();
  let sessionModified = false;

  if (typeof csrfToken !== "string" || !csrfToken) {
    csrfToken = newCsrfToken();
    session.set(CSRF_SESSION_KEY, csrfToken);
    sessionModified = true;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const hasValidCookie = cookieHeader
    .split(";")
    .some((c) => c.trim() === `${CSRF_COOKIE_NAME}=${csrfToken}`);

  if (sessionModified) {
    headers.append("Set-Cookie", await sessionStorage.commitSession(session));
  }

  if (!hasValidCookie || sessionModified) {
    headers.append("Set-Cookie", serializeCsrfCookie(csrfToken));
  }

  return { csrfToken, headers };
}

