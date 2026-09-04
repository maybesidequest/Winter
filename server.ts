export {};

// NODE_ENV must be set before ANY module is loaded: react and react-dom/server
// pick their dev/prod build from NODE_ENV at require time. Static imports are
// hoisted above this assignment, so all imports below must be dynamic.
process.env.NODE_ENV ??= "production";
const runtimeMode = process.env.NODE_ENV;

const { createRequestHandler } = await import("react-router");
const { checkControlPlaneReady } = await import("./app/services/control/transport");
const { validateProductionConfig } = await import("./app/services/config.server");
const { winterStorage } = await import("./app/services/winterStorage.server");
const { checkRedisReady } = await import("./app/redis.server");
const { applySecurityHeaders } = await import("./app/services/securityHeaders.server");

validateProductionConfig(process.env, runtimeMode);

// @ts-expect-error - This file is generated dynamically by Vite during the build process
const build = (await import('./build/server/index.js')) as ServerBuild;

const handleRequest = createRequestHandler(build, runtimeMode);

Bun.serve({
  hostname: "0.0.0.0",
  port: process.env.PORT || 4000,
  idleTimeout: 30,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/healthz") {
      return applySecurityHeaders(new Response("ok", { status: 200, headers: { "content-type": "text/plain" } }), runtimeMode);
    }
    if (url.pathname === "/readyz") {
      try {
        await Promise.all([winterStorage.checkReady(), checkRedisReady(), checkControlPlaneReady()]);
        return applySecurityHeaders(new Response("ok", { status: 200, headers: { "content-type": "text/plain" } }), runtimeMode);
      } catch (error) {
        console.error("Winter readiness check failed", error);
        return applySecurityHeaders(new Response("not ready", { status: 503, headers: { "content-type": "text/plain" } }), runtimeMode);
      }
    }

    if (url.pathname.startsWith("/.well-known/")) {
      return applySecurityHeaders(new Response(null, { status: 404 }), runtimeMode);
    }

    // 1. Serve static client assets built by Vite
    // We check if the file exists in the build/client folder.
    // (We exclude the root "/" so it properly hits React Router)
    if (url.pathname !== "/") {
      const file = Bun.file(`./build/client${url.pathname}`);
      if (await file.exists()) {
        // You can add caching headers here for production if you'd like
        return applySecurityHeaders(new Response(file), runtimeMode);
      }
    }

    // 2. Pass all other requests to React Router
    // Your app/routes/api.tsx (or wherever oRPC is) will handle the API calls seamlessly.
    // A per-request nonce is shared with entry.server.tsx (via request header) so
    // React Router's inline hydration scripts pass the CSP check.
    const nonce = crypto.randomUUID().replaceAll("-", "");
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-csp-nonce", nonce);
    const request = new Request(req, { headers: requestHeaders });
    return applySecurityHeaders(await handleRequest(request), runtimeMode, nonce);
  },
});

console.log(`🥟 Bun server running on http://localhost:${process.env.PORT || 4000}`);
