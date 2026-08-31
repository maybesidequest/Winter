const API_PREFIX = "/api/v1/";

export const SAFE_QUERY_PROCEDURES = new Set([
  "hub.getBadges",
  "hub.getConnections",
  "hub.getHub",
  "hub.getLogConfig",
  "hub.getUserHubs",
  "hub.listAnnouncements",
  "hub.listAudit",
  "hub.listInvites",
  "hub.listRoles",
  "hub.listRules",
  "hub.listStaff",
  "hubDiscovery.getFeatured",
  "hubDiscovery.getPopularTags",
  "hubDiscovery.search",
  "moderation.getAppeal",
  "moderation.getHubSafetySettings",
  "moderation.getInfraction",
  "moderation.getSafetyAssessment",
  "moderation.getStaff",
  "moderation.listHubAppeals",
  "moderation.listInfractions",
  "moderation.listMyAppealableInfractions",
  "preferences.getUserPreferences",
  "safety.list",
  "server.blocklist",
  "server.bridges",
  "server.channels",
  "server.get",
  "user.get",
  "user.getActivity",
  "user.getInbox",
  "user.getLeaderboard",
  "user.getProfile",
  "user.locales",
]);

export function isSafeQueryProcedure(path: readonly string[] | string): boolean {
  const procedure = typeof path === "string" ? path : path.join(".");
  return SAFE_QUERY_PROCEDURES.has(procedure);
}

export function procedureFromRequestUrl(requestUrl: string): string | null {
  const pathname = new URL(requestUrl).pathname;
  const prefixIndex = pathname.indexOf(API_PREFIX);
  if (prefixIndex < 0) return null;
  const encodedPath = pathname.slice(prefixIndex + API_PREFIX.length);
  if (!encodedPath || encodedPath.includes("//")) return null;
  try {
    return decodeURIComponent(encodedPath).split("/").join(".");
  } catch {
    return null;
  }
}

function methodNotAllowed(): Response {
  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}

function csrfRejected(): Response {
  return new Response("Cross-site request rejected", { status: 403 });
}

export function enforceSameOriginRequest(request: Request): Response | null {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (origin !== null && origin !== requestOrigin) return csrfRejected();
  if (fetchSite !== null && fetchSite !== "same-origin") return csrfRejected();
  if (origin === null && fetchSite === null) return csrfRejected();
  return null;
}

export function enforceRpcRequestSecurity(request: Request): Response | null {
  const procedure = procedureFromRequestUrl(request.url);
  const safeQuery = procedure !== null && isSafeQueryProcedure(procedure);
  const method = request.method.toUpperCase();

  if ((method === "GET" || method === "HEAD") && !safeQuery) {
    return methodNotAllowed();
  }
  if (!safeQuery && method !== "POST") {
    return methodNotAllowed();
  }
  if (safeQuery) return null;
  return enforceSameOriginRequest(request);
}
