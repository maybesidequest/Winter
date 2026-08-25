import { getServiceClients, invokeRpc, makeRequestContext } from "./transport";

export interface Infraction {
  id: string;
  hubId: string;
  userId: string;
  type: "SANCTION_TYPE_WARN" | "SANCTION_TYPE_MUTE" | "SANCTION_TYPE_BAN";
  reason: string;
  issuerId: string;
  status: "INFRACTION_STATUS_ACTIVE" | "INFRACTION_STATUS_EXPIRED" | "INFRACTION_STATUS_REVOKED";
  expiresAt?: string;
  createdAt?: string;
}

export interface Appeal {
  id: string;
  infractionId: string;
  hubId: string;
  userId: string;
  reason: string;
  status: string;
  createdAt?: string;
}

export const moderationService = {
  async applySanction(input: {
    hubId: string;
    userId: string;
    type: "SANCTION_TYPE_WARN" | "SANCTION_TYPE_MUTE" | "SANCTION_TYPE_BAN";
    reason: string;
    durationSeconds?: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<Infraction> {
    const clients = getServiceClients();
    return invokeRpc(clients.moderationClient, "ApplySanction", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      type: input.type,
      reason: input.reason,
      durationSeconds: input.durationSeconds || 0,
    });
  },

  async revokeSanction(input: {
    hubId: string;
    infractionId: string;
    reason: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<Infraction> {
    const clients = getServiceClients();
    return invokeRpc(clients.moderationClient, "RevokeSanction", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      infractionId: input.infractionId,
      reason: input.reason,
    });
  },

  async getInfractions(params: {
    hubId: string;
    userId?: string;
    actorId: string;
  }): Promise<Infraction[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ infractions?: Infraction[] }>(
      clients.moderationClient,
      "GetInfractions",
      {
        context: makeRequestContext(params.actorId),
        hubId: params.hubId,
        userId: params.userId,
      }
    );
    return res.infractions || [];
  },

  async submitAppeal(input: {
    hubId: string;
    infractionId: string;
    reason: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<Appeal> {
    const clients = getServiceClients();
    return invokeRpc(clients.moderationClient, "SubmitAppeal", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      infractionId: input.infractionId,
      reason: input.reason,
    });
  },
};
