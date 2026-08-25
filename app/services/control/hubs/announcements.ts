import type { HubAnnouncement } from "./types";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

export const hubAnnouncementsService = {
  async listAnnouncements(hubId: string, actorId: string): Promise<HubAnnouncement[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ announcements?: HubAnnouncement[] }>(
      clients.hubClient,
      "ListAnnouncements",
      {
        context: makeRequestContext(actorId),
        hubId,
      }
    );
    return res.announcements || [];
  },

  async createAnnouncement(input: {
    hubId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      content: input.content,
    });
  },

  async updateAnnouncement(input: {
    hubId: string;
    announcementId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "UpdateAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      content: input.content,
    });
  },

  async deleteAnnouncement(input: {
    hubId: string;
    announcementId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteAnnouncement", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
    });
  },
};
