import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base, protectedBase } from "~/rpc/context";
import { SelectorType } from "~/generated/control/v1/static";
import { selectorService } from "~/services/control/selector";

const selectorType = z.enum(["SELECTOR_TYPE_CHANNEL", "SELECTOR_TYPE_ROLE", "SELECTOR_TYPE_USER"]);
const searchInput = z.object({
  type: selectorType,
  query: z.string().trim().min(2).max(100),
  parentId: z.string().trim().min(1).max(128),
  limit: z.number().int().min(1).max(50).default(25),
  cursor: z.string().regex(/^\d*$/).default(""),
});

function mapSelectorError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error
    ? Number((error as { code: unknown }).code)
    : undefined;
  if (code === 3) throw new ORPCError("BAD_REQUEST", { message: "The selector query is invalid." });
  if (code === 5) throw new ORPCError("NOT_FOUND", { message: "The parent resource is no longer available." });
  if (code === 7 || code === 16) throw new ORPCError("FORBIDDEN", { message: "You do not have permission to search this resource." });
  throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Selector search is temporarily unavailable." });
}

export const selectorsRouter = base.router({
  search: protectedBase.input(searchInput).handler(async ({ input, context }) => {
    try {
      return await selectorService.searchSelectors({
        actorId: context.user.id,
        type: SelectorType[input.type],
        query: input.query,
        parentId: input.parentId,
        limit: input.limit,
        cursor: input.cursor,
      });
    } catch (error) {
      return mapSelectorError(error);
    }
  }),
});
