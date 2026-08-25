import { irisClient } from "./iris.server";
import { ORPCError } from "@orpc/server";
import {
  PERMISSION_ACTIONS,
  PERMISSION_BITMASKS,
  ALL_PERMISSIONS,
  getDefaultPermissions,
  type PermissionAction,
  type HubRole,
} from "../permissions/config";

function bitsToRecord(bits: number): Record<PermissionAction, boolean> {
  const record = getDefaultPermissions();
  for (const action of PERMISSION_ACTIONS) {
    const mask = PERMISSION_BITMASKS[action];
    record[action] = (bits & mask) === mask;
  }
  return record;
}

export const permissionService = {
  // ------------------------------------------------------------------ //
  //  Permission checks. Iris is authoritative and enforces its           //
  //  authorization-version barrier. Do not read Iris's Redis cache here. //
  // ------------------------------------------------------------------ //

  async canPerform(userId: string, hubId: string, action: PermissionAction): Promise<boolean> {
    const mask = PERMISSION_BITMASKS[action];

    const bits = await irisClient.getEffectivePermissions(userId, hubId);
    return !!(bits & mask);
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
    const bits = await irisClient.getEffectivePermissions(userId, hubId);
    return bitsToRecord(bits);
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
    // Staff = user has ADMINISTRATOR bit. Call Iris without a hub context.
    const bits = await irisClient.getEffectivePermissions(userId);
    return !!(bits & PERMISSION_BITMASKS.ADMINISTRATOR);
  },

  // ------------------------------------------------------------------ //
  //  Cache invalidation (delegates to Iris)                              //
  // ------------------------------------------------------------------ //

  async invalidateRole(hubId: string, userId: string): Promise<void> {
    await irisClient.invalidateUserPermissions(hubId, userId);
  },

  async invalidateHub(hubId: string): Promise<void> {
    await irisClient.invalidateHubPermissions(hubId);
  },
};
