import { redirect } from "react-router";
import { enforceSameOriginRequest } from "../../rpc/requestSecurity";
import { revokeUserSessions, sessionStorage } from "../../services/session.server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }
  const rejected = enforceSameOriginRequest(request);
  if (rejected) return rejected;

  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (user && typeof user === "object" && "id" in user && typeof user.id === "string") {
    try {
      await revokeUserSessions(user.id);
    } catch {
      return new Response("Logout revocation is temporarily unavailable.", {
        status: 503,
        headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
      });
    }
  }
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}
