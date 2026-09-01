import { base, protectedBase } from "../context";
import { favoriteInputSchema, savedViewInputSchema, savedViewQuerySchema } from "~/schemas/presentation";
import { winterStorage } from "~/services/winterStorage.server";

export const presentationRouter = base.router({
  listFavorites: protectedBase.handler(({ context }) => winterStorage.listFavorites(context.user.id)),

  addFavorite: protectedBase
    .input(favoriteInputSchema)
    .handler(({ input, context }) => winterStorage.addFavorite(context.user.id, input.resourceType, input.resourceId)),

  removeFavorite: protectedBase
    .input(favoriteInputSchema)
    .handler(async ({ input, context }) => {
      await winterStorage.removeFavorite(context.user.id, input.resourceType, input.resourceId);
      return { success: true };
    }),

  listSavedViews: protectedBase
    .input(savedViewQuerySchema)
    .handler(({ input, context }) => winterStorage.listSavedViews(context.user.id, input.viewType)),

  saveView: protectedBase
    .input(savedViewInputSchema)
    .handler(({ input, context }) => winterStorage.saveView(context.user.id, input.viewType, input.name, input.state)),

  deleteView: protectedBase
    .input(savedViewQuerySchema.extend({ name: savedViewInputSchema.shape.name }))
    .handler(async ({ input, context }) => {
      await winterStorage.deleteView(context.user.id, input.viewType, input.name);
      return { success: true };
    }),
});
