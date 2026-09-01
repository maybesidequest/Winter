import { createCookie } from "react-router";

export const CSRF_SESSION_KEY = "csrfToken";
export const CSRF_COOKIE_NAME = "interchat_csrf";

const csrfCookie = createCookie(CSRF_COOKIE_NAME, {
  path: "/",
  httpOnly: false,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 43_200,
});

export function newCsrfToken(): string {
  return crypto.randomUUID();
}

export function serializeCsrfCookie(token: string): Promise<string> {
  return csrfCookie.serialize(token);
}

export function clearCsrfCookie(): Promise<string> {
  return csrfCookie.serialize("", { maxAge: 0 });
}

function equalConstantTime(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  if (leftBytes.length !== rightBytes.length) return false;
  return crypto.timingSafeEqual(leftBytes, rightBytes);
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
