import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { OperationState } from "~/generated/control/v1/static";
import { base, protectedBase } from "~/rpc/context";
import { grpcCodeOf } from "~/services/control/middleware";
import { controlOperationService } from "~/services/control.server";

const operationState = z.enum([
  "OPERATION_STATE_PENDING",
  "OPERATION_STATE_RUNNING",
  "OPERATION_STATE_SUCCEEDED",
  "OPERATION_STATE_FAILED",
  "OPERATION_STATE_CANCELED",
  "OPERATION_STATE_CANCELLED",
  "OPERATION_STATE_NEEDS_ATTENTION",
  "OPERATION_STATE_PARTIAL",
]);

function mapOperationError(error: unknown): never {
  const code = grpcCodeOf(error);
  if (code === 3) throw new ORPCError("BAD_REQUEST", { message: "The operation request is invalid." });
  if (code === 6 || code === 9 || code === 10) throw new ORPCError("CONFLICT", { message: "The operation changed. Refresh and try again." });
  if (code === 12) throw new ORPCError("BAD_REQUEST", { message: "This operation transition is not supported." });
  // Operations are actor-scoped; a foreign operation ID must be
  // indistinguishable whether missing or permission-denied.
  if (code === 5 || code === 7 || code === 16) {
    throw new ORPCError("NOT_FOUND", { message: "This operation was not found or you do not have access to it." });
  }
  throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Operation status is temporarily unavailable." });
}

async function withOperationErrors<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return mapOperationError(error);
  }
}

export const operationsRouter = base.router({
  get: protectedBase
    .input(z.object({ operationId: z.string().trim().min(1).max(128) }))
    .handler(({ input, context }) => withOperationErrors(() => controlOperationService.getOperation({ ...input, actorId: context.user.id }))),

  list: protectedBase
    .input(z.object({
      resourceType: z.string().trim().max(128).optional(),
      resourceId: z.string().trim().max(128).optional(),
      state: operationState.optional(),
      limit: z.number().int().positive().max(100).optional(),
      cursor: z.string().trim().max(128).optional(),
    }))
    .handler(({ input, context }) => withOperationErrors(() => controlOperationService.listOperations({
      resourceType: input.resourceType ?? "",
      resourceId: input.resourceId ?? "",
      limit: input.limit ?? 50,
      cursor: input.cursor ?? "",
      state: input.state ? OperationState[input.state] : OperationState.OPERATION_STATE_UNSPECIFIED,
      actorId: context.user.id,
    }))),

  cancel: protectedBase
    .input(z.object({
      operationId: z.string().trim().min(1).max(128),
      reason: z.string().trim().max(2_000).optional(),
      expectedVersion: z.number().int().positive(),
      idempotencyKey: z.string().trim().min(1).max(128),
    }))
    .handler(({ input, context }) => withOperationErrors(() => controlOperationService.cancelOperation({ ...input, reason: input.reason ?? "Cancelled by caller", actorId: context.user.id }))),

  retry: protectedBase
    .input(z.object({
      operationId: z.string().trim().min(1).max(128),
      expectedVersion: z.number().int().positive(),
      idempotencyKey: z.string().trim().min(1).max(128),
    }))
    .handler(({ input, context }) => withOperationErrors(() => controlOperationService.retryOperation({ ...input, actorId: context.user.id }))),
});
