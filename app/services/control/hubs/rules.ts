import type { HubRule } from "./types";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

export const hubRulesService = {
  async listRules(hubId: string, actorId: string): Promise<HubRule[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ rules?: HubRule[] }>(clients.hubClient, "ListRules", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.rules || [];
  },

  async createRule(input: {
    hubId: string;
    title: string;
    description: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
    });
  },

  async updateRule(input: {
    hubId: string;
    ruleId: string;
    title: string;
    description: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "UpdateRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
    });
  },

  async deleteRule(input: {
    hubId: string;
    ruleId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteRule", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      expectedVersion: input.expectedVersion,
    });
  },

  async reorderRules(input: {
    hubId: string;
    ruleIds: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubRule[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ rules?: HubRule[] }>(clients.hubClient, "ReorderRules", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleIds: input.ruleIds,
      expectedVersion: input.expectedVersion,
    });
    return res.rules || [];
  },
};
