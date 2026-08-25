import type { HubInvite } from "./types";
import type { HubInvite__Output } from "~/generated/control/v1/interchat/control/v1/HubInvite";
import type { HubInvitesResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubInvitesResponse";
import type { ListHubInvitesRequest } from "~/generated/control/v1/interchat/control/v1/ListHubInvitesRequest";
import type { CreateHubInviteRequest } from "~/generated/control/v1/interchat/control/v1/CreateHubInviteRequest";
import type { RevokeHubInviteRequest } from "~/generated/control/v1/interchat/control/v1/RevokeHubInviteRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toInvite(value: HubInvite__Output): HubInvite {
  return {
    id: value.id,
    hubId: value.hubId,
    code: value.code,
    creatorId: value.creatorId,
    uses: value.uses,
    maxUses: value.maxUses,
    expiresAt: timestamp(value.expiresAt),
    createdAt: timestamp(value.createdAt),
  };
}

export const hubInvitesService = {
  async listInvites(hubId: string, actorId: string): Promise<HubInvite[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<ListHubInvitesRequest, HubInvitesResponse__Output>(clients.hubClient.ListInvites.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.invites.map(toInvite);
  },

  async createInvite(input: {
    hubId: string;
    maxUses?: number;
    durationSeconds?: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubInvite> {
    const clients = getServiceClients();
    const response = await invokeUnary<CreateHubInviteRequest, HubInvite__Output>(clients.hubClient.CreateInvite.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      maxUses: input.maxUses || 0,
      durationSeconds: input.durationSeconds || 0,
    });
    return toInvite(response);
  },

  async revokeInvite(input: {
    hubId: string;
    inviteCode: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<RevokeHubInviteRequest, EmptyResponse__Output>(clients.hubClient.RevokeInvite.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      inviteCode: input.inviteCode,
    });
  },
};
