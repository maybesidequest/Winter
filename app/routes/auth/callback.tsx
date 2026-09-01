import { redirect } from "react-router";
import type { Route } from "./+types/callback";
import { authenticator } from "../../services/auth.server";
import { sessionStorage } from "../../services/session.server";
import { clearOAuthStateCookie } from "../../services/discordStrategy.server";
import { newCsrfToken, serializeCsrfCookie, CSRF_SESSION_KEY } from "../../services/csrf.server";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Strategy will either redirect to Discord or return the verified User.
    const user = await authenticator.authenticate("discord", request);

    // Re-committing a fresh signed payload rotates the authenticated session
    // after OAuth and binds a new CSRF token to that session.
    const session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.unset("user");
    session.set("user", user);
    const csrfToken = newCsrfToken();
    session.set(CSRF_SESSION_KEY, csrfToken);

    const headers = new Headers();
    headers.append("Set-Cookie", await sessionStorage.commitSession(session));
    headers.append("Set-Cookie", await serializeCsrfCookie(csrfToken));
    headers.append("Set-Cookie", await clearOAuthStateCookie());

    throw redirect("/dashboard", { headers });
  } catch (error) {
    if (error instanceof Response) {
      // The strategy's initial redirect creates the one-time state cookie;
      // clearing it here would make the subsequent callback unverifiable.
      const location = error.headers.get("Location") || "";
      if (location.startsWith("https://discord.com/api/oauth2/authorize")) {
        throw error;
      }
      const headers = new Headers(error.headers);
      headers.append("Set-Cookie", await clearOAuthStateCookie());
      throw new Response(error.body, { status: error.status, statusText: error.statusText, headers });
    }
    throw new Response("OAuth callback failed", {
      status: 502,
      headers: { "Set-Cookie": await clearOAuthStateCookie() },
    });
  }
}
