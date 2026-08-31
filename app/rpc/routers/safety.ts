import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base, protectedBase } from "../context";
import { safetyService } from "~/services/safety.server";
import { controlCursorSchema, controlIdSchema } from "~/schemas/controlLimits";

const safetyType = z.enum(["review", "report", "appeal", "infraction", "restriction"]);

function mapError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error ? Number((error as { code: unknown }).code) : undefined;
  if (code === 7) throw new ORPCError("FORBIDDEN", { message: "Polarizer denied this safety operation." });
  if (code === 10 || code === 9 || code === 5) throw new ORPCError("CONFLICT", { message: "This item changed while you were reviewing it. Refresh and try again." });
  if (code === 4 || code === 14) throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Safety data is temporarily unavailable." });
  throw error;
}

export const safetyRouter = base.router({
  list: protectedBase.input(z.object({ hubId: controlIdSchema, type: safetyType, cursor: controlCursorSchema.optional() })).handler(async ({ input, context }) => {
    try { return await safetyService.list(context.user.id, input); } catch (error) { return mapError(error); }
  }),
  adjudicateHeld: protectedBase.input(z.object({ hubId: controlIdSchema, reviewItemId: controlIdSchema, resolution: z.enum(["APPROVE", "REJECT", "EXPIRE"]), reason: z.string().trim().min(3).max(1000), expectedVersion: z.number().int().nonnegative() })).handler(async ({ input, context }) => {
    const { hubId, ...command } = input;
    try { return await safetyService.adjudicate(context.user.id, hubId, command); } catch (error) { return mapError(error); }
  }),
});
