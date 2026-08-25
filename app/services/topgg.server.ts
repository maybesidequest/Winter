import { controlUserService } from "~/services/control.server";

export const topGGService = {
  async forwardVote(input: {
    rawPayload: Uint8Array;
    signature: string;
    requestId?: string;
    traceId?: string;
  }) {
    return controlUserService.recordVote({
      provider: "VOTE_PROVIDER_TOPGG",
      rawPayload: input.rawPayload,
      signature: input.signature,
    });
  },
};
