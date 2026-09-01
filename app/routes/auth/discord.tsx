import type { Route } from "./+types/discord";
import { authenticator } from "../../services/auth.server";
import { enforceIpRateLimit } from "../../services/rateLimit.server";

function requestIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() || "unknown";
}

export async function action({ request }: Route.ActionArgs) {
  await enforceIpRateLimit(requestIp(request));
  return await authenticator.authenticate("discord", request);
}

export async function loader({ request }: Route.LoaderArgs) {
  await enforceIpRateLimit(requestIp(request));
  return await authenticator.authenticate("discord", request);
}
