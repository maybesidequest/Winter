import type { HubAnnouncement } from "./types";
import type { HubAnnouncement as ProtoHubAnnouncement } from "~/generated/control/v1/static";
import type { HubAnnouncementsResponse } from "~/generated/control/v1/static";
import type { ListHubAnnouncementsRequest } from "~/generated/control/v1/static";
import type { CreateHubAnnouncementRequest } from "~/generated/control/v1/static";
import type { UpdateHubAnnouncementRequest } from "~/generated/control/v1/static";
import type { DeleteHubAnnouncementRequest } from "~/generated/control/v1/static";
import type { HubAnnouncementDesiredState } from "~/generated/control/v1/static";
import { HubAnnouncementDesiredState as DesiredState } from "~/generated/control/v1/static";
import type { TransitionHubAnnouncementStateRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
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

function toAnnouncement(value: ProtoHubAnnouncement): HubAnnouncement {
  const metadata = value.metadata;
  const spec = value.spec;
  const status = value.status;
  if (!metadata || !spec || !status) {
    throw new Error("Control Plane returned an incomplete Hub announcement resource.");
  }
  const version = Number(metadata.version);
  if (!Number.isInteger(version) || version < 1) {
    throw new Error("Control Plane returned an announcement without a canonical version.");
  }
  return {
    id: metadata.id,
    hubId: metadata.hubId,
    authorId: metadata.authorId,
    content: spec.content,
    scheduledFor: timestamp(spec.scheduledFor),
    // Older responses may still populate the deprecated top-level field;
    // keep exposing it to existing Winter callers while reading canonical
    // identity/spec/status fields above.
    sentAt: timestamp(value.sentAt),
    createdAt: timestamp(metadata.createdAt),
    title: spec.title || "Announcement",
    repeatIntervalSeconds: Number(spec.repeatIntervalSeconds || 0),
    timeZone: spec.timeZone || "UTC",
    desiredState: spec.desiredState.replace("HUB_ANNOUNCEMENT_DESIRED_STATE_", "") as HubAnnouncement["desiredState"],
    version,
    nextDelivery: timestamp(status.nextDelivery),
    latestAttempt: timestamp(status.latestAttempt),
    latestSuccess: timestamp(status.latestSuccess),
    deliveryState: status.deliveryState.replace("HUB_ANNOUNCEMENT_DELIVERY_STATE_", "") as HubAnnouncement["deliveryState"],
    lastError: status.lastError || "",
    completed: status.completed === true,
  };
}

export const hubAnnouncementsService = {
  async listAnnouncements(hubId: string, actorId: string): Promise<HubAnnouncement[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<ListHubAnnouncementsRequest, HubAnnouncementsResponse>(
      clients.hubClient.listAnnouncements.bind(clients.hubClient),
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
    const response = await invokeUnary<CreateHubAnnouncementRequest, ProtoHubAnnouncement>(clients.hubClient.createAnnouncement.bind(clients.hubClient), {
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
      expectedVersion: 0,
      operationId: input.idempotencyKey,
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
    const response = await invokeUnary<UpdateHubAnnouncementRequest, ProtoHubAnnouncement>(clients.hubClient.updateAnnouncement.bind(clients.hubClient), {
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
      updateMask: ["title", "content", "scheduled_for", "repeat_interval_seconds", "time_zone", "desired_state"],
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    await invokeUnary<DeleteHubAnnouncementRequest, EmptyResponse>(clients.hubClient.deleteAnnouncement.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      announcementId: input.announcementId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    const response = await invokeUnary<TransitionHubAnnouncementStateRequest, ProtoHubAnnouncement>(
      clients.hubClient.transitionAnnouncementState.bind(clients.hubClient),
      {
        context: makeRequestContext(input.actorId, true, input.idempotencyKey),
        hubId: input.hubId,
        announcementId: input.announcementId,
        desiredState: desiredStateValue(input.desiredState),
        expectedVersion: input.expectedVersion,
        operationId: input.idempotencyKey,
      },
    );
    return toAnnouncement(response);
  },
};
