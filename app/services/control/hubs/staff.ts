import type { HubStaffMember } from "./types";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

export const hubStaffService = {
  async listStaff(hubId: string, actorId: string): Promise<HubStaffMember[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ staff?: HubStaffMember[] }>(clients.hubClient, "ListStaff", {
      context: makeRequestContext(actorId),
      hubId,
    });
    return res.staff || [];
  },

  async assignStaffRole(input: {
    hubId: string;
    userId: string;
    role: string;
    permissionsBitmask: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubStaffMember> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "AssignStaffRole", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
      role: input.role,
      permissionsBitmask: input.permissionsBitmask,
    });
  },

  async removeStaffRole(input: {
    hubId: string;
    userId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "RemoveStaffRole", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      userId: input.userId,
    });
  },
};
