import type { HubAnnouncement } from "./types";
import type { HubAnnouncement__Output } from "~/generated/control/v1/interchat/control/v1/HubAnnouncement";
import type { HubAnnouncementsResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubAnnouncementsResponse";
import type { ListHubAnnouncementsRequest } from "~/generated/control/v1/interchat/control/v1/ListHubAnnouncementsRequest";
import type { CreateHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/CreateHubAnnouncementRequest";
import type { UpdateHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/UpdateHubAnnouncementRequest";
import type { DeleteHubAnnouncementRequest } from "~/generated/control/v1/interchat/control/v1/DeleteHubAnnouncementRequest";
import type { HubAnnouncementDesiredState } from "~/generated/control/v1/interchat/control/v1/HubAnnouncementDesiredState";
import { HubAnnouncementDesiredState as DesiredState } from "~/generated/control/v1/interchat/control/v1/HubAnnouncementDesiredState";
import type { TransitionHubAnnouncementStateRequest } from "~/generated/control/v1/interchat/control/v1/TransitionHubAnnouncementStateRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function timestampValue(value: string | undefined): { seconds: number; nanos: number } | undefined {
  if (!value) return undefined;
  const milliseconds = new Date(value).getTime();
  if (!Number.isFinite(milliseconds)) throw new Error("Invalid announcement schedule timestamp.");
  return { seconds: Math.floor(milliseconds / 1000), nanos: (milliseconds % 1000) * 1_000_000 };
}

function desiredStateValue(value: HubAnnouncement["desiredState"]): HubAnnouncementDesiredState {
  return DesiredState[`HUB_ANNOUNCEMENT_DESIRED_STATE_${value}` as keyof typeof DesiredState];
}

function toAnnouncement(value: HubAnnouncement__Output): HubAnnouncement {
  const spec = value.spec;
  const status = value.status;
  return {
    id: value.id,
    hubId: value.hubId,
    authorId: value.authorId,
    content: value.content,
    scheduledFor: timestamp(value.scheduledFor),
    sentAt: timestamp(value.sentAt),
    createdAt: timestamp(value.createdAt),
    title: spec?.title || "Announcement",
    repeatIntervalSeconds: Number(spec?.repeatIntervalSeconds || 0),
    timeZone: spec?.timeZone || "UTC",
    desiredState: (spec?.desiredState || "HUB_ANNOUNCEMENT_DESIRED_STATE_DRAFT").replace("HUB_ANNOUNCEMENT_DESIRED_STATE_", "") as HubAnnouncement["desiredState"],
    version: Number(value.metadata?.version || 1),
    nextDelivery: timestamp(status?.nextDelivery),
    latestAttempt: timestamp(status?.latestAttempt),
    latestSuccess: timestamp(status?.latestSuccess),
    deliveryState: (status?.deliveryState || "HUB_ANNOUNCEMENT_DELIVERY_STATE_PENDING").replace("HUB_ANNOUNCEMENT_DELIVERY_STATE_", "") as HubAnnouncement["deliveryState"],
    lastError: status?.lastError || "",
    completed: status?.completed === true,
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
    title?: string;
    scheduledFor?: string;
    repeatIntervalSeconds?: number;
    timeZone?: string;
    desiredState?: HubAnnouncement["desiredState"];
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    const response = await invokeUnary<CreateHubAnnouncementRequest, HubAnnouncement__Output>(clients.hubClient.CreateAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      content: input.content,
      spec: {
        title: input.title || "Announcement",
        content: input.content,
        scheduledFor: timestampValue(input.scheduledFor),
        repeatIntervalSeconds: input.repeatIntervalSeconds || 0,
        timeZone: input.timeZone || "UTC",
        desiredState: desiredStateValue(input.desiredState || "DRAFT"),
      },
    });
    return toAnnouncement(response);
  },

  async updateAnnouncement(input: {
    hubId: string;
    announcementId: string;
    content: string;
    actorId: string;
    idempotencyKey: string;
    expectedVersion: number;
    title?: string;
    scheduledFor?: string;
    repeatIntervalSeconds?: number;
    timeZone?: string;
    desiredState?: HubAnnouncement["desiredState"];
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    const response = await invokeUnary<UpdateHubAnnouncementRequest, HubAnnouncement__Output>(clients.hubClient.UpdateAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      content: input.content,
      spec: {
        title: input.title || "Announcement",
        content: input.content,
        scheduledFor: timestampValue(input.scheduledFor),
        repeatIntervalSeconds: input.repeatIntervalSeconds || 0,
        timeZone: input.timeZone || "UTC",
        desiredState: desiredStateValue(input.desiredState || "DRAFT"),
      },
      updateMask: { paths: ["title", "content", "scheduled_for", "repeat_interval_seconds", "time_zone", "desired_state"] },
      expectedVersion: input.expectedVersion,
    });
    return toAnnouncement(response);
  },

  async deleteAnnouncement(input: {
    hubId: string;
    announcementId: string;
    actorId: string;
    idempotencyKey: string;
    expectedVersion: number;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DeleteHubAnnouncementRequest, EmptyResponse__Output>(clients.hubClient.DeleteAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      expectedVersion: input.expectedVersion,
    });
  },

  async transitionAnnouncement(input: {
    hubId: string;
    announcementId: string;
    desiredState: HubAnnouncement["desiredState"];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubAnnouncement> {
    const clients = getServiceClients();
    const response = await invokeUnary<TransitionHubAnnouncementStateRequest, HubAnnouncement__Output>(
      clients.hubClient.TransitionAnnouncementState.bind(clients.hubClient),
      {
        context: makeRequestContext(input.actorId, true, input.idempotencyKey),
        hubId: input.hubId,
        announcementId: input.announcementId,
        desiredState: desiredStateValue(input.desiredState),
        expectedVersion: input.expectedVersion,
      },
    );
    return toAnnouncement(response);
  },
};
