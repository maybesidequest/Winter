import { controlHubService } from "./control.server";

export const hubStaffService = {
  async assignRole(
    invokerUserId: string,
    targetUserId: string,
    hubId: string,
    roleName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await controlHubService.assignStaffRole({
        hubId,
        userId: targetUserId,
        role: roleName,
        permissionsBitmask: 0,
        actorId: invokerUserId,
        idempotencyKey: crypto.randomUUID(),
      });
      return { success: true };
    } catch (error: any) {
      console.error("[hubStaffService] assignRole failed:", error);
      return { success: false, error: error?.message || "Failed to assign role." };
    }
  },

  async removeRole(
    invokerUserId: string,
    targetUserId: string,
    hubId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await controlHubService.removeStaffRole({
        hubId,
        userId: targetUserId,
        actorId: invokerUserId,
        idempotencyKey: crypto.randomUUID(),
      });
      return { success: true };
    } catch (error: any) {
      console.error("[hubStaffService] removeRole failed:", error);
      return { success: false, error: error?.message || "Failed to remove role." };
    }
  },

  async getStaff(hubId: string, userId: string): Promise<{ userId: string; role: string; position: number }[]> {
    const staff = await controlHubService.listStaff(hubId, userId);
    return staff.map((s, idx) => ({
      userId: s.metadata?.userId || "",
      role: s.spec?.role || "MODERATOR",
      position: idx,
    }));
  },
};

