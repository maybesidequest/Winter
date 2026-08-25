import type { HubRule } from "./types";
import type { GetHubRequest } from "~/generated/control/v1/interchat/control/v1/GetHubRequest";
import type { HubRule__Output } from "~/generated/control/v1/interchat/control/v1/HubRule";
import type { HubRulesResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubRulesResponse";
import type { CreateHubRuleRequest } from "~/generated/control/v1/interchat/control/v1/CreateHubRuleRequest";
import type { UpdateHubRuleRequest } from "~/generated/control/v1/interchat/control/v1/UpdateHubRuleRequest";
import type { DeleteHubRuleRequest } from "~/generated/control/v1/interchat/control/v1/DeleteHubRuleRequest";
import type { ReorderHubRulesRequest } from "~/generated/control/v1/interchat/control/v1/ReorderHubRulesRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toRule(value: HubRule__Output): HubRule {
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
    const res = await invokeUnary<GetHubRequest, HubRulesResponse__Output>(clients.hubClient.ListRules.bind(clients.hubClient), {
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
    const response = await invokeUnary<CreateHubRuleRequest, HubRule__Output>(clients.hubClient.CreateRule.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
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
    const response = await invokeUnary<UpdateHubRuleRequest, HubRule__Output>(clients.hubClient.UpdateRule.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleId: input.ruleId,
      title: input.title,
      description: input.description,
      expectedVersion: input.expectedVersion,
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
    await invokeUnary<DeleteHubRuleRequest, EmptyResponse__Output>(clients.hubClient.DeleteRule.bind(clients.hubClient), {
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
    const res = await invokeUnary<ReorderHubRulesRequest, HubRulesResponse__Output>(clients.hubClient.ReorderRules.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      ruleIds: input.ruleIds,
      expectedVersion: input.expectedVersion,
    });
    return res.rules.map(toRule);
  },
};
