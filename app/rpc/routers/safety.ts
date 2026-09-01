import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base, protectedBase } from "../context";
import { grpcCodeOf } from "~/services/control/middleware";
import { SafetyCollectionUnavailableError, safetyService } from "~/services/safety.server";

const safetyType = z.enum(["review", "report", "appeal", "infraction", "restriction"]);

function mapError(error: unknown): never {
  if (error instanceof SafetyCollectionUnavailableError) {
    throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Safety data is not available through the Control Plane yet." });
  }
  const code = grpcCodeOf(error);
  if (code === 9 || code === 10) throw new ORPCError("CONFLICT", { message: "This item changed while you were reviewing it. Refresh and try again." });
  // Safety records are Hub-scoped: deny and missing must not differ.
  if (code === 5 || code === 7 || code === 16) {
    throw new ORPCError("NOT_FOUND", { message: "Safety record not found or access denied." });
  }
  if (code === 4 || code === 14) throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Safety data is temporarily unavailable." });
  throw error;
}

export const safetyRouter = base.router({
  list: protectedBase.input(z.object({ hubId: z.string(), type: safetyType, cursor: z.string().optional() })).handler(async ({ input, context }) => {
    try { return await safetyService.list(context.user.id, input); } catch (error) { return mapError(error); }
  }),
  adjudicateHeld: protectedBase.input(z.object({ hubId: z.string(), reviewItemId: z.string(), resolution: z.enum(["APPROVE", "REJECT", "EXPIRE"]), reason: z.string().trim().min(3).max(1000), expectedVersion: z.number().int().nonnegative() })).handler(async ({ input, context }) => {
    const { hubId, ...command } = input;
    try { return await safetyService.adjudicate(context.user.id, hubId, command); } catch (error) { return mapError(error); }
  }),
});
