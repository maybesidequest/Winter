import type { HubInvite } from "./types";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

export const hubInvitesService = {
  async listInvites(hubId: string, actorId: string): Promise<HubInvite[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ invites?: HubInvite[] }>(clients.hubClient, "ListInvites", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.invites || [];
  },

  async createInvite(input: {
    hubId: string;
    maxUses?: number;
    durationSeconds?: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubInvite> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateInvite", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      maxUses: input.maxUses || 0,
      durationSeconds: input.durationSeconds || 0,
    });
  },

  async revokeInvite(input: {
    hubId: string;
    inviteCode: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "RevokeInvite", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      inviteCode: input.inviteCode,
    });
  },
};
