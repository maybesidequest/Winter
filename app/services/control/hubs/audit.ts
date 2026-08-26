import type { HubAuditEntry } from "./types";
import type { HubAuditResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubAuditResponse";
import type { ListHubAuditRequest } from "~/generated/control/v1/interchat/control/v1/ListHubAuditRequest";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toEntry(value: HubAuditResponse__Output["entries"][number]): HubAuditEntry {
  return {
    id: value.id,
    hubId: value.hubId,
    eventType: value.eventType,
    summary: value.summary,
    actorId: value.actorId || undefined,
    source: value.source || undefined,
    requestId: value.requestId || undefined,
    traceId: value.traceId || undefined,
    createdAt: timestamp(value.createdAt),
  };
}

export const hubAuditService = {
  async listAudit(input: { hubId: string; actorId: string; limit?: number; offset?: number }): Promise<{ entries: HubAuditEntry[]; hasMore: boolean }> {
    const clients = getServiceClients();
    const response = await invokeUnary<ListHubAuditRequest, HubAuditResponse__Output>(clients.hubClient.ListAudit.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId),
      hubId: input.hubId,
      limit: input.limit || 50,
      offset: input.offset || 0,
    });
    return { entries: response.entries.map(toEntry), hasMore: response.hasMore };
  },
};
