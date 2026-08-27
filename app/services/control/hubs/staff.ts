import type { HubStaffMember } from "./types";
import type { HubStaffMember__Output } from "~/generated/control/v1/interchat/control/v1/HubStaffMember";
import type { HubStaffResponse__Output } from "~/generated/control/v1/interchat/control/v1/HubStaffResponse";
import type { ListHubStaffRequest } from "~/generated/control/v1/interchat/control/v1/ListHubStaffRequest";
import type { AssignHubStaffRoleRequest } from "~/generated/control/v1/interchat/control/v1/AssignHubStaffRoleRequest";
import type { RemoveHubStaffRoleRequest } from "~/generated/control/v1/interchat/control/v1/RemoveHubStaffRoleRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toStaffMember(value: HubStaffMember__Output): HubStaffMember {
  if (!value.metadata || !value.spec || !value.status) throw new Error("Control Plane returned an incomplete Hub staff resource.");
  return {
    metadata: { userId: value.metadata.userId, hubId: value.metadata.hubId, assignedAt: timestamp(value.metadata.assignedAt) },
    spec: { role: value.spec.role, permissionsBitmask: value.spec.permissionsBitmask, assignedBy: value.spec.assignedBy },
    status: { active: value.status.active, effectivePermissions: value.status.effectivePermissions },
  };
}

export const hubStaffService = {
  async listStaff(hubId: string, actorId: string): Promise<HubStaffMember[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<ListHubStaffRequest, HubStaffResponse__Output>(clients.hubClient.ListStaff.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.staff.map(toStaffMember);
  },

  async assignStaffRole(input: {
    hubId: string;
    userId: string;
    role: string;
    permissionsBitmask: number;
    actorId: string;
    idempotencyKey: string;
    roleId?: string;
    expectedVersion?: number;
  }): Promise<HubStaffMember> {
    const clients = getServiceClients();
    const response = await invokeUnary<AssignHubStaffRoleRequest, HubStaffMember__Output>(clients.hubClient.AssignStaffRole.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      role: input.role,
      permissionsBitmask: input.permissionsBitmask,
      roleId: input.roleId ?? "",
      expectedVersion: input.expectedVersion ?? 0,
    });
    return toStaffMember(response);
  },

  async removeStaffRole(input: {
    hubId: string;
    userId: string;
    actorId: string;
    idempotencyKey: string;
    roleId?: string;
    expectedVersion?: number;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<RemoveHubStaffRoleRequest, EmptyResponse__Output>(clients.hubClient.RemoveStaffRole.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      roleId: input.roleId ?? "",
      expectedVersion: input.expectedVersion ?? 0,
    });
  },
};
