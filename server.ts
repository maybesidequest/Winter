import { createRequestHandler } from "react-router";
import { checkControlPlaneReady } from "./app/services/control/transport";
import { validateProductionConfig } from "./app/services/config.server";
import { winterStorage } from "./app/services/winterStorage.server";

const runtimeMode = process.env.NODE_ENV || "production";
// Keep the server's default production mode visible to server-only modules;
// this is intentionally set before the built route module is loaded.
process.env.NODE_ENV ??= runtimeMode;
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
      return new Response("ok", { status: 200, headers: { "content-type": "text/plain" } });
    }
    if (url.pathname === "/readyz") {
      try {
        await Promise.all([winterStorage.checkReady(), checkControlPlaneReady()]);
        return new Response("ok", { status: 200, headers: { "content-type": "text/plain" } });
      } catch (error) {
        console.error("Winter readiness check failed", error);
        return new Response("not ready", { status: 503, headers: { "content-type": "text/plain" } });
      }
    }

    if (url.pathname.startsWith("/.well-known/")) {
      return new Response(null, { status: 404 });
    }

    // 1. Serve static client assets built by Vite
    // We check if the file exists in the build/client folder.
    // (We exclude the root "/" so it properly hits React Router)
    if (url.pathname !== "/") {
      const file = Bun.file(`./build/client${url.pathname}`);
      if (await file.exists()) {
        // You can add caching headers here for production if you'd like
        return new Response(file);
      }
    }

    // 2. Pass all other requests to React Router
    // Your app/routes/api.tsx (or wherever oRPC is) will handle the API calls seamlessly.
    return handleRequest(req);
  },
});

console.log(`🥟 Bun server running on http://localhost:${process.env.PORT || 4000}`);
