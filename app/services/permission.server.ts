import { ORPCError } from "@orpc/server";
import {
  ALL_PERMISSIONS,
  getDefaultPermissions,
  type PermissionAction,
} from "../permissions/config";
import { controlHubService } from "./control.server";

export const permissionService = {
  async canPerform(userId: string, hubId: string, action: PermissionAction): Promise<boolean> {
    const hub = await controlHubService.getHub(hubId, userId);
    return hub.metadata.permissions?.[action] === true;
  },

  async assertCanPerform(userId: string, hubId: string, action: PermissionAction): Promise<void> {
    const ok = await this.canPerform(userId, hubId, action);
    if (!ok) {
      throw new ORPCError("FORBIDDEN", {
        message: `You do not have permission to perform ${action} in this hub.`,
      });
    }
  },

  // ------------------------------------------------------------------ //
  //  Full permission record (for UI hydration)                           //
  // ------------------------------------------------------------------ //

  async getPermissionsRecord(userId: string, hubId: string): Promise<Record<PermissionAction, boolean>> {
    const hub = await controlHubService.getHub(hubId, userId);
    return { ...getDefaultPermissions(), ...(hub.metadata.permissions || {}) };
  },


  /**
   * Returns the all-true permissions record for hub owners.
   */
  getOwnerPermissions(): Record<PermissionAction, boolean> {
    return { ...ALL_PERMISSIONS };
  },

  // ------------------------------------------------------------------ //
  //  Staff authorization                                                 //
  // ------------------------------------------------------------------ //

  async checkIsStaff(userId: string): Promise<boolean> {
    const result = await controlHubService.listMyHubs(userId);
    return (result.hubs || []).some((hub) => hub.permissions?.ADMINISTRATOR === true);
  },
};
