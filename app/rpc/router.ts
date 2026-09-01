import { base } from "./context";
import { hubRouter } from "./routers/hub";
import { hubDiscoveryRouter } from "./routers/hubDiscovery";
import { moderationRouter } from "./routers/moderation";
import { preferencesRouter } from "./routers/preferences";
import { previewsRouter } from "./routers/previews";
import { presentationRouter } from "./routers/presentation";
import { serverRouter } from "./routers/server";
import { selectorsRouter } from "./routers/selectors";
import { safetyRouter } from "./routers/safety";
import { userRouter } from "./routers/user";

export const appRouter = base.router({
  hub: hubRouter,
  hubDiscovery: hubDiscoveryRouter,
  moderation: moderationRouter,
  preferences: preferencesRouter,
  previews: previewsRouter,
  presentation: presentationRouter,
  server: serverRouter,
  selectors: selectorsRouter,
  safety: safetyRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
