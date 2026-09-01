import { redirect } from "react-router";
import { sessionStorage } from "../../services/session.server";
import type { Route } from "./+types/logout";
import { clearCsrfCookie, requireCsrf } from "../../services/csrf.server";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }

  // SameSite=Lax protects normal cross-site form posts, while this explicit
  // origin check covers clients that send an Origin header and makes logout a
  // deliberate state-changing request.
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return new Response("Cross-origin request denied", { status: 403 });
  }

  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  await requireCsrf(request, session.get("csrfToken"));
  const csrfCookie = await clearCsrfCookie();
  const sessionCookie = await sessionStorage.destroySession(session);
  const headers = new Headers();
  headers.append("Set-Cookie", sessionCookie);
  headers.append("Set-Cookie", csrfCookie);
  return redirect("/", {
    headers,
  });
}
