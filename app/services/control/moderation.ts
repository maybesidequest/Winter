import type { Appeal__Output } from "~/generated/control/v1/interchat/control/v1/Appeal";
import type { Infraction__Output } from "~/generated/control/v1/interchat/control/v1/Infraction";
import type { InfractionsResponse__Output } from "~/generated/control/v1/interchat/control/v1/InfractionsResponse";
import type { ApplySanctionRequest } from "~/generated/control/v1/interchat/control/v1/ApplySanctionRequest";
import type { RevokeSanctionRequest } from "~/generated/control/v1/interchat/control/v1/RevokeSanctionRequest";
import type { GetInfractionsRequest } from "~/generated/control/v1/interchat/control/v1/GetInfractionsRequest";
import type { SubmitAppealRequest } from "~/generated/control/v1/interchat/control/v1/SubmitAppealRequest";
import type { ListMyAppealableInfractionsRequest } from "~/generated/control/v1/interchat/control/v1/ListMyAppealableInfractionsRequest";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

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
  hubName?: string;
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

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toInfraction(value: Infraction__Output): Infraction {
  return {
    id: value.id,
    hubId: value.hubId,
    userId: value.userId,
    type: value.type as Infraction["type"],
    reason: value.reason,
    issuerId: value.issuerId,
    status: value.status as Infraction["status"],
    expiresAt: timestamp(value.expiresAt),
    createdAt: timestamp(value.createdAt),
    hubName: value.hubName || undefined,
  };
}

function toAppeal(value: Appeal__Output): Appeal {
  return {
    id: value.id,
    infractionId: value.infractionId,
    hubId: value.hubId,
    userId: value.userId,
    reason: value.reason,
    status: value.status,
    createdAt: timestamp(value.createdAt),
  };
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
    const response = await invokeUnary<ApplySanctionRequest, Infraction__Output>(clients.moderationClient.ApplySanction.bind(clients.moderationClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      type: input.type,
      reason: input.reason,
      durationSeconds: input.durationSeconds || 0,
    });
    return toInfraction(response);
  },

  async revokeSanction(input: {
    hubId: string;
    infractionId: string;
    reason: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<Infraction> {
    const clients = getServiceClients();
    const response = await invokeUnary<RevokeSanctionRequest, Infraction__Output>(clients.moderationClient.RevokeSanction.bind(clients.moderationClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      infractionId: input.infractionId,
      reason: input.reason,
    });
    return toInfraction(response);
  },

  async getInfractions(params: {
    hubId: string;
    userId?: string;
    actorId: string;
  }): Promise<Infraction[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetInfractionsRequest, InfractionsResponse__Output>(
      clients.moderationClient.GetInfractions.bind(clients.moderationClient),
      {
        context: makeRequestContext(params.actorId),
        hubId: params.hubId,
        userId: params.userId,
      }
    );
    return (res as InfractionsResponse__Output).infractions.map(toInfraction);
  },

  async listMyAppealableInfractions(actorId: string): Promise<Infraction[]> {
    const clients = getServiceClients();
    const response = await invokeUnary<ListMyAppealableInfractionsRequest, InfractionsResponse__Output>(
      clients.moderationClient.ListMyAppealableInfractions.bind(clients.moderationClient),
      { context: makeRequestContext(actorId) },
    );
    return response.infractions.map(toInfraction);
  },

  async submitAppeal(input: {
    hubId: string;
    infractionId: string;
    reason: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<Appeal> {
    const clients = getServiceClients();
    const response = await invokeUnary<SubmitAppealRequest, Appeal__Output>(clients.moderationClient.SubmitAppeal.bind(clients.moderationClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      infractionId: input.infractionId,
      reason: input.reason,
    });
    return toAppeal(response);
  },
};
