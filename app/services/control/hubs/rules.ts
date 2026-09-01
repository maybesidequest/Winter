import type { HubRule } from "./types";
import type { GetHubRequest } from "~/generated/control/v1/static";
import type { HubRule as ProtoHubRule } from "~/generated/control/v1/static";
import type { HubRulesResponse } from "~/generated/control/v1/static";
import type { CreateHubRuleRequest } from "~/generated/control/v1/static";
import type { UpdateHubRuleRequest } from "~/generated/control/v1/static";
import type { DeleteHubRuleRequest } from "~/generated/control/v1/static";
import type { ReorderHubRulesRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toRule(value: ProtoHubRule): HubRule {
  return {
    id: value.id,
    hubId: value.hubId,
    ruleNumber: value.ruleNumber,
    title: value.title,
    description: value.description,
    createdAt: timestamp(value.createdAt),
  };
}

export const hubRulesService = {
  async listRules(hubId: string, actorId: string): Promise<HubRule[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetHubRequest, HubRulesResponse>(clients.hubClient.listRules.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.rules.map(toRule);
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
    const response = await invokeUnary<CreateHubRuleRequest, ProtoHubRule>(clients.hubClient.createRule.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return toRule(response);
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
    const response = await invokeUnary<UpdateHubRuleRequest, ProtoHubRule>(clients.hubClient.updateRule.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return toRule(response);
  },

  async deleteRule(input: {
    hubId: string;
    ruleId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DeleteHubRuleRequest, EmptyResponse>(clients.hubClient.deleteRule.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    const res = await invokeUnary<ReorderHubRulesRequest, HubRulesResponse>(clients.hubClient.reorderRules.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleIds: input.ruleIds,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return res.rules.map(toRule);
  },
};
