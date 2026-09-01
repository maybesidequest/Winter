import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { ImpactAction } from "~/generated/control/v1/static";
import { base, protectedBase } from "~/rpc/context";
import { grpcCodeOf } from "~/services/control/middleware";
import { controlPreviewService } from "~/services/control.server";

const previewInput = z.object({
  action: z.enum(["DELETE", "TRANSFER_OWNERSHIP", "LOCKDOWN", "DISCONNECT"]),
  resourceType: z.enum(["HUB", "SERVER"]),
  resourceId: z.string().trim().min(1).max(128),
  expectedVersion: z.number().int().positive(),
});

function mapPreviewError(error: unknown): never {
  const code = grpcCodeOf(error);
  if (code === 3) throw new ORPCError("BAD_REQUEST", { message: "The preview request is invalid." });
  if (code === 6 || code === 9 || code === 10) throw new ORPCError("CONFLICT", { message: "Refresh the resource before reviewing this action." });
  // Preview targets are Hub resources: deny and missing must not differ.
  if (code === 5 || code === 7 || code === 16) {
    throw new ORPCError("NOT_FOUND", { message: "This resource was not found or you do not have access to it." });
  }
  throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Impact preview is temporarily unavailable." });
}

export const previewsRouter = base.router({
  get: protectedBase.input(previewInput).handler(async ({ input, context }) => {
    try {
      return await controlPreviewService.getImpactPreview({
        actorId: context.user.id,
        action: ImpactAction[`IMPACT_ACTION_${input.action}`],
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        expectedVersion: input.expectedVersion,
      });
    } catch (error) {
      return mapPreviewError(error);
    }
  }),
});
