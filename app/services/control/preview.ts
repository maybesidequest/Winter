import type { FieldMask, Struct } from "~/generated/control/v1/static";
import type {
  GetImpactPreviewRequest,
} from "~/generated/control/v1/static";
import type { ImpactPreview } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

export const previewService = {
  async getImpactPreview(input: Omit<GetImpactPreviewRequest, "context" | "proposedChanges" | "updateMask"> & {
    actorId: string;
    proposedChanges?: Struct;
    updateMask?: FieldMask;
  }): Promise<ImpactPreview> {
    const clients = getServiceClients();
    const { actorId, ...request } = input;
    return invokeUnary(clients.previewClient.getImpactPreview.bind(clients.previewClient), {
      ...request,
      proposedChanges: input.proposedChanges?.fields,
      updateMask: input.updateMask?.paths,
      context: makeRequestContext(actorId),
    });
  },
};
