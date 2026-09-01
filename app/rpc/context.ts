import { os, ORPCError } from "@orpc/server";
import { requireUser } from "../services/auth.server";
import { requireCsrf } from "../services/csrf.server";
import { enforceUserRateLimit } from "../services/rateLimit.server";
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

export const protectedBase = base.use(async ({ context, next, path }) => {
  try {
    const user = await requireUser(context.request);
    await enforceUserRateLimit(user.id, path);
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
