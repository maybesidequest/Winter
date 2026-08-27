import type { LoaderFunctionArgs } from "react-router";
import { SignJWT } from "jose";
import { requireUser } from "../../../services/auth.server";
import { permissionService } from "../../../services/permission.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const hubId = url.searchParams.get("hubId");

  if (!hubId) {
    return new Response("Missing hubId", { status: 400 });
  }

  const user = await requireUser(request);

  // Check if the user has access to this hub. 
  // We'll require VIEW_LOGS permissions to check if they have dashboard access to view messages.
  try {
    await permissionService.assertCanPerform(user.id, hubId, "VIEW_LOGS");
  } catch (err) {
    return new Response("Forbidden", { status: 403 });
  }

  const secretString = process.env.JWT_SECRET;
  if (!secretString && process.env.NODE_ENV === "production") {
    // Never mint bearer tokens with a public fallback secret.  A deployment
    // missing JWT_SECRET must fail closed instead of making every SSE token
    // forgeable.
    return new Response("SSE authentication is temporarily unavailable.", { status: 503 });
  }
  const secret = new TextEncoder().encode(secretString || "dev_only_local_sse_secret_key_32_bytes!");

  // Mint a short-lived token (e.g., 5 minutes)
  const jwt = await new SignJWT({ userId: user.id, hubId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);

  return new Response(JSON.stringify({ token: jwt }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
