function requestNonce(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

export function applySecurityHeaders(response: Response, runtimeMode: string, nonce = requestNonce()): Response {
  const headers = response.headers;
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://cdn.discordapp.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://discord.com https://cdn.discordapp.com",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (runtimeMode === "production") headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Return the original response untouched: rebuilding it via
  // new Response(response.body, ...) corrupts Content-Length and Content-Type
  // in Bun, which makes Chrome reject the response with ERR_INVALID_RESPONSE.
  return response;
}
