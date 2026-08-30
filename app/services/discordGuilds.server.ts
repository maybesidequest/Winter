export type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions: string;
};

export class DiscordGuildRateLimitError extends Error {
  readonly retryAfterSeconds?: number;

  constructor(retryAfterSeconds?: number) {
    super("Discord temporarily rate-limited guild access.");
    this.name = "DiscordGuildRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export interface ManageableGuildCache {
  get(userId: string): Promise<DiscordGuild[] | undefined>;
  set(userId: string, guilds: DiscordGuild[], ttlSeconds: number): Promise<void>;
}

interface ManageableGuildLoaderOptions {
  cache: ManageableGuildCache;
  fetchGuilds: (userId: string) => Promise<DiscordGuild[]>;
  cacheTtlSeconds?: number;
}

/**
 * Coalesces and short-caches the Discord guild projection used by a single
 * dashboard request flow. A fresh request still fails closed when Discord
 * rejects it; cached data is never an outage or rate-limit fallback.
 */
export function createManageableGuildLoader({
  cache,
  fetchGuilds,
  cacheTtlSeconds = 60,
}: ManageableGuildLoaderOptions) {
  const inFlight = new Map<string, Promise<DiscordGuild[]>>();

  return async function manageableGuilds(userId: string, forceRefresh = false): Promise<DiscordGuild[]> {
    if (!forceRefresh) {
      const cached = await cache.get(userId);
      if (cached !== undefined) return cached;
    }

    const existing = inFlight.get(userId);
    if (existing) return existing;

    const pending = (async () => {
      const guilds = await fetchGuilds(userId);
      await cache.set(userId, guilds, cacheTtlSeconds).catch(() => undefined);
      return guilds;
    })();

    inFlight.set(userId, pending);
    void pending.finally(() => {
      if (inFlight.get(userId) === pending) inFlight.delete(userId);
    }).catch(() => undefined);
    return pending;
  };
}
