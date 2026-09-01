import { ORPCError } from "@orpc/server";
import { redis } from "~/redis.server";
import { rateLimitPolicyForPath, type RateLimitPolicy } from "./rateLimitPolicy";

async function consume(key: string, policy: RateLimitPolicy): Promise<void> {
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, policy.windowSeconds);
    if (count > policy.limit) {
      throw new ORPCError("TOO_MANY_REQUESTS", {
        message: `Too many ${policy.name} requests. Please try again shortly.`,
      });
    }
  } catch (error) {
    if (error instanceof ORPCError) throw error;
    console.error("Winter rate-limit Redis unavailable", error);
    throw new ORPCError("SERVICE_UNAVAILABLE", {
      message: "Rate limiting is temporarily unavailable. Please try again shortly.",
    });
  }
}

export async function enforceUserRateLimit(userId: string, path: readonly (string | number)[]): Promise<void> {
  const policy = rateLimitPolicyForPath(path);
  await consume(`winter:ratelimit:${policy.name}:user:${userId}`, policy);
}

export async function enforceUserResourceRateLimit(userId: string, resourceId: string): Promise<void> {
  await consume(`winter:ratelimit:resource-mutations:user:${userId}:resource:${resourceId}`, {
    name: "resource mutation",
    limit: 10,
    windowSeconds: 60,
  });
}

export async function enforceIpRateLimit(ip: string): Promise<void> {
  const policy = { name: "sign-in", limit: 10, windowSeconds: 60 } satisfies RateLimitPolicy;
  try {
    const count = await redis.incr(`winter:ratelimit:signin:ip:${ip}`);
    if (count === 1) await redis.expire(`winter:ratelimit:signin:ip:${ip}`, policy.windowSeconds);
    if (count > policy.limit) {
      throw new Response("Too many sign-in attempts. Please try again shortly.", {
        status: 429,
        headers: { "Retry-After": String(policy.windowSeconds) },
      });
    }
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Winter sign-in rate-limit Redis unavailable", error);
    throw new Response("Sign-in is temporarily unavailable. Please try again shortly.", {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }
}
