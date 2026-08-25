import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { DiscordStrategy } from "./discordStrategy.server";
import { permissionService } from "./permission.server";
import { saveDiscordTokens } from "./oauthToken.server";

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export const authenticator = new Authenticator<User>();

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
const callbackUrl = process.env.DISCORD_CALLBACK_URL;

if ((!clientId || !clientSecret || !callbackUrl) && process.env.NODE_ENV === "production") {
  throw new Error("Discord OAuth credentials (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CALLBACK_URL) are required in production");
}

authenticator.use(
  new DiscordStrategy(
    {
      clientID: clientId || "dev_mock_client_id",
      clientSecret: clientSecret || "dev_mock_client_secret",
      callbackURL: callbackUrl || "http://localhost:5173/auth/discord/callback",
      scope: ["identify", "guilds"],
    },
    async ({ profile, tokens }) => {
      await saveDiscordTokens(profile.id, tokens);

      return {
        id: profile.id,
        username: profile.global_name || profile.username,
        avatarUrl: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : "https://cdn.discordapp.com/embed/avatars/0.png",
      };
    }
  )
);

export async function requireUser(request: Request): Promise<User> {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");
  if (!user) {
    throw new Response("Unauthorized", { status: 302, headers: { Location: "/" } });
  }
  return user as User;
}

export async function requireStaff(request: Request): Promise<User> {
  const user = await requireUser(request);
  const isStaff = await permissionService.checkIsStaff(user.id);
  if (!isStaff) {
    throw new Response("Unauthorized: Staff Only", { status: 403 });
  }
  return user;
}

