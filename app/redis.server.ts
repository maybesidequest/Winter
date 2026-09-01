import Redis from "ioredis";

let redis: Redis;

declare global {
  var __redis: Redis | undefined;
}

const redisUri = process.env.WINTER_REDIS_URI ||
  (process.env.NODE_ENV === "production" ? undefined : "redis://localhost:6379");

if (!redisUri) {
  throw new Error("WINTER_REDIS_URI environment variable is required in production");
}

// Keep one connection during development hot reloads, while requiring the
// dedicated Winter credential in production. This module is not a fallback
// path for Control Plane or shared-management Redis.
if (!global.__redis) {
  global.__redis = new Redis(redisUri);
}
redis = global.__redis;

export async function checkRedisReady(): Promise<void> {
  const result = await redis.ping();
  if (result !== "PONG") throw new Error("Winter Redis readiness check failed");
}

export { redis };
