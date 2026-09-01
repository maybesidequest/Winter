import { os, ORPCError } from "@orpc/server";
import { requireUser } from "../services/auth.server";
import { requireCsrf } from "../services/csrf.server";
import { enforceUserRateLimit, enforceUserResourceRateLimit } from "../services/rateLimit.server";
import { rateLimitPolicyForPath } from "../services/rateLimitPolicy";
import { sessionStorage } from "../services/session.server";

export type ORPCContext = {
  request: Request;
};

export const base = os.$context<ORPCContext>().use(async ({ next, path }) => {
  try {
    return await next({});
  } catch (error) {
    console.error(`[ORPC 500] Error in /${path.join('/')}:`, error);
    throw error;
  }
});

function resourceIdFromInput(input: unknown): string | undefined {
  if (!input || typeof input !== "object") return undefined;
  const record = input as Record<string, unknown>;
  for (const key of [
    "hubId",
    "serverId",
    "connectionId",
    "resourceId",
    "infractionId",
    "appealId",
    "roleId",
    "ruleId",
    "announcementId",
    "inviteCode",
    "blockId",
    "itemId",
  ]) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

export const protectedBase = base.use(async ({ context, next, path }, input: unknown) => {
  try {
    const user = await requireUser(context.request);
    await enforceUserRateLimit(user.id, path);
    const resourceId = resourceIdFromInput(input);
    if (resourceId && rateLimitPolicyForPath(path).name === "mutations") {
      await enforceUserResourceRateLimit(user.id, resourceId);
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(context.request.method.toUpperCase())) {
      const session = await sessionStorage.getSession(context.request.headers.get("cookie"));
      await requireCsrf(context.request, session.get("csrfToken"));
    }
    
    return next({
      context: {
        ...context,
        user,
      },
    });
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 403) {
        throw new ORPCError("FORBIDDEN", { message: await error.text() });
      }
      throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
    }
    throw error;
  }
});
