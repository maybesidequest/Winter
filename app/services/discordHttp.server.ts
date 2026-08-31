const configuredTimeout = Number(process.env.DISCORD_API_TIMEOUT_MS || 5_000);
export const DISCORD_API_TIMEOUT_MS = Number.isFinite(configuredTimeout) && configuredTimeout >= 500 && configuredTimeout <= 15_000
  ? configuredTimeout
  : 5_000;

export async function fetchDiscord(urlOrPath: string, init: RequestInit = {}): Promise<Response> {
  const url = urlOrPath.startsWith("https://") ? urlOrPath : `https://discord.com/api/v10${urlOrPath}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DISCORD_API_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Discord request timed out.", { cause: error });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
