import type { HubAnnouncement } from "./types";
import type { HubAnnouncement__Output } from "~/generated/control/v1/interchat/control/v1/HubAnnouncement";
import type { HubAnnouncementsResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubAnnouncementsResponse";
import type { ListHubAnnouncementsRequest } from "~/generated/control/v1/interchat/control/v1/ListHubAnnouncementsRequest";
import type { CreateHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/CreateHubAnnouncementRequest";
import type { UpdateHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/UpdateHubAnnouncementRequest";
import type { DeleteHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/DeleteHubAnnouncementRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toAnnouncement(value: HubAnnouncement__Output): HubAnnouncement {
  return {
    id: value.id,
    hubId: value.hubId,
    authorId: value.authorId,
    content: value.content,
    scheduledFor: timestamp(value.scheduledFor),
    sentAt: timestamp(value.sentAt),
    createdAt: timestamp(value.createdAt),
  };
}

export const hubAnnouncementsService = {
  async listAnnouncements(hubId: string, actorId: string): Promise<HubAnnouncement[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<ListHubAnnouncementsRequest, HubAnnouncementsResponse__Output>(
      clients.hubClient.ListAnnouncements.bind(clients.hubClient),
      {
        context: makeRequestContext(actorId),
        hubId,
      }
    );
    return res.announcements.map(toAnnouncement);
  },

  async createAnnouncement(input: {
    hubId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    const response = await invokeUnary<CreateHubAnnouncementRequest, HubAnnouncement__Output>(clients.hubClient.CreateAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      content: input.content,
    });
    return toAnnouncement(response);
  },

  async updateAnnouncement(input: {
    hubId: string;
    announcementId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    const response = await invokeUnary<UpdateHubAnnouncementRequest, HubAnnouncement__Output>(clients.hubClient.UpdateAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      content: input.content,
    });
    return toAnnouncement(response);
  },

  async deleteAnnouncement(input: {
    hubId: string;
    announcementId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DeleteHubAnnouncementRequest, EmptyResponse__Output>(clients.hubClient.DeleteAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
    });
  },
};
