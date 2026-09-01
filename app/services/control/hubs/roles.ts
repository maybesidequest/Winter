import type { HubRole } from "./types";
import type { HubRole as ProtoHubRole } from "~/generated/control/v1/static";
import type { HubRolesResponse } from "~/generated/control/v1/static";
import type { ListHubRolesRequest } from "~/generated/control/v1/static";
import type { CreateHubRoleRequest } from "~/generated/control/v1/static";
import type { UpdateHubRoleRequest } from "~/generated/control/v1/static";
import type { DeleteHubRoleRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toRole(value: ProtoHubRole): HubRole {
  if (!value.metadata || !value.spec || !value.status) throw new Error("Control Plane returned an incomplete Hub role resource.");
  return {
    metadata: {
      id: value.metadata.id,
      hubId: value.metadata.hubId,
      createdAt: timestamp(value.metadata.createdAt),
      updatedAt: timestamp(value.metadata.updatedAt),
    },
    spec: {
      name: value.spec.name,
      permissionsBitmask: value.spec.permissionsBitmask,
      position: value.spec.position,
    },
    status: { memberCount: value.status.memberCount, protected: value.status.protected },
    version: value.version,
  };
}

export const hubRoleService = {
  async listRoles(hubId: string, actorId: string): Promise<HubRole[]> {
    const clients = getServiceClients();
    const response = await invokeUnary<ListHubRolesRequest, HubRolesResponse>(clients.hubClient.listRoles.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return response.roles.map(toRole);
  },

  async createRole(input: { hubId: string; name: string; permissionsBitmask: number; position: number; actorId: string; idempotencyKey: string }): Promise<HubRole> {
    const clients = getServiceClients();
    const response = await invokeUnary<CreateHubRoleRequest, ProtoHubRole>(clients.hubClient.createRole.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      name: input.name,
      permissionsBitmask: input.permissionsBitmask,
      position: input.position,
      operationId: input.idempotencyKey,
    });
    return toRole(response);
  },

  async updateRole(input: { hubId: string; roleId: string; name: string; permissionsBitmask: number; position: number; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<HubRole> {
    const clients = getServiceClients();
    const response = await invokeUnary<UpdateHubRoleRequest, ProtoHubRole>(clients.hubClient.updateRole.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      roleId: input.roleId,
      name: input.name,
      permissionsBitmask: input.permissionsBitmask,
      position: input.position,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return toRole(response);
  },

  async deleteRole(input: { hubId: string; roleId: string; expectedVersion: number; actorId: string; idempotencyKey: string }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DeleteHubRoleRequest, EmptyResponse>(clients.hubClient.deleteRole.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      roleId: input.roleId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
  },
};
