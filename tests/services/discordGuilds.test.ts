import { describe, expect, it } from "bun:test";
import {
  DiscordGuildRateLimitError,
  createManageableGuildLoader,
  type DiscordGuild,
} from "~/services/discordGuilds.server";

const guild: DiscordGuild = {
  id: "guild-1",
  name: "Test Guild",
  icon: null,
  permissions: "32",
};

function memoryCache() {
  let value: DiscordGuild[] | undefined;
  return {
    cache: {
      get: async () => value,
      set: async (_userId: string, next: DiscordGuild[]) => {
        value = next;
      },
    },
    get value() {
      return value;
    },
  };
}

describe("Discord manageable guild lookup", () => {
  it("coalesces concurrent Discord requests for one user", async () => {
    const memory = memoryCache();
    let fetchCount = 0;
    let release!: (guilds: DiscordGuild[]) => void;
    const pending = new Promise<DiscordGuild[]>((resolve) => {
      release = resolve;
    });
    const load = createManageableGuildLoader({
      cache: memory.cache,
      fetchGuilds: async () => {
        fetchCount += 1;
        return pending;
      },
    });

    const first = load("user-1");
    const second = load("user-1");
    await Promise.resolve();
    expect(fetchCount).toBe(1);

    release([guild]);
    await expect(Promise.all([first, second])).resolves.toEqual([[guild], [guild]]);
  });

  it("fails closed when a forced refresh is rate-limited", async () => {
    const memory = memoryCache();
    let fetchCount = 0;
    const load = createManageableGuildLoader({
      cache: memory.cache,
      fetchGuilds: async () => {
        fetchCount += 1;
        if (fetchCount === 1) return [guild];
        throw new DiscordGuildRateLimitError(1);
      },
    });

    await expect(load("user-1")).resolves.toEqual([guild]);
    await expect(load("user-1", true)).rejects.toBeInstanceOf(DiscordGuildRateLimitError);
    expect(fetchCount).toBe(2);
    expect(memory.value).toEqual([guild]);
  });
});
