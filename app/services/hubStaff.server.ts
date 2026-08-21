import { db } from "../db.server";
import { authRole, authUserAssignment, hub } from "../../drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { permissionService } from "./permission.server";

export const hubStaffService = {
  /**
   * Assigns (or updates) a role for a user in a hub.
   *
   * The invoking user must have MANAGE_MODERATORS.
   * Only the Hub Owner can assign the MANAGER role.
   */
  async assignRole(
    invokerUserId: string,
    targetUserId: string,
    hubId: string,
    roleName: string
  ): Promise<{ success: boolean; error?: string }> {
    await permissionService.assertCanPerform(invokerUserId, hubId, "MANAGE_MODERATORS");

    // Fetch Hub owner
    const [hubRecord] = await db
      .select({ ownerId: hub.ownerId })
      .from(hub)
      .where(eq(hub.id, hubId))
      .limit(1);

    if (!hubRecord) {
      return { success: false, error: "Hub not found." };
    }

    if (targetUserId === hubRecord.ownerId) {
      return { success: false, error: "You cannot modify roles for the hub owner." };
    }

    const isAssigningManager = roleName.toUpperCase().includes("MANAGER");
    if (isAssigningManager && invokerUserId !== hubRecord.ownerId) {
      return { success: false, error: "Only the hub owner can assign the Manager role." };
    }

    try {
      // Look up matching authRole row
      const [matchingRole] = await db
        .select()
        .from(authRole)
        .where(and(eq(authRole.hubId, hubId), eq(authRole.name, roleName)))
        .limit(1);

      if (!matchingRole) {
        return { success: false, error: "Role not found in this hub." };
      }

      const [existingAssignment] = await db
        .select({ id: authUserAssignment.id, roleName: authRole.name })
        .from(authUserAssignment)
        .innerJoin(authRole, eq(authRole.id, authUserAssignment.roleId))
        .where(
          and(
            eq(authUserAssignment.userId, targetUserId),
            eq(authRole.hubId, hubId)
          )
        )
        .limit(1);

      // If target is already a manager, only owner can modify
      if (existingAssignment?.roleName?.toUpperCase().includes("MANAGER") && invokerUserId !== hubRecord.ownerId) {
        return { success: false, error: "Only the hub owner can modify managers." };
      }

      const assignmentId = existingAssignment?.id ?? crypto.randomUUID();

      await db
        .insert(authUserAssignment)
        .values({
          id: assignmentId,
          roleId: matchingRole.id,
          userId: targetUserId,
        })
        .onConflictDoUpdate({
          target: authUserAssignment.id,
          set: {
            roleId: matchingRole.id,
          },
        });

      await permissionService.invalidateRole(hubId, targetUserId);
      return { success: true };
    } catch (error: any) {
      if (/foreign key/i.test(error?.message ?? "")) {
        return { success: false, error: "That user hasn't used InterChat yet." };
      }
      console.error("[hubStaffService] assignRole failed:", error);
      return { success: false, error: "Failed to assign role." };
    }
  },

  /**
   * Removes every authUserAssignment row for targetUserId that belongs to a role with authRole.hubId === hubId.
   * Only the Hub Owner can remove managers.
   */
  async removeRole(
    invokerUserId: string,
    targetUserId: string,
    hubId: string
  ): Promise<{ success: boolean; error?: string }> {
    await permissionService.assertCanPerform(invokerUserId, hubId, "MANAGE_MODERATORS");

    const [hubRecord] = await db
      .select({ ownerId: hub.ownerId })
      .from(hub)
      .where(eq(hub.id, hubId))
      .limit(1);

    if (!hubRecord) {
      return { success: false, error: "Hub not found." };
    }

    if (targetUserId === hubRecord.ownerId) {
      return { success: false, error: "You cannot remove the hub owner." };
    }

    // Check if target is a manager
    const existingRoles = await db
      .select({ name: authRole.name })
      .from(authUserAssignment)
      .innerJoin(authRole, eq(authRole.id, authUserAssignment.roleId))
      .where(
        and(
          eq(authUserAssignment.userId, targetUserId),
          eq(authRole.hubId, hubId)
        )
      );

    const isManager = existingRoles.some((r) => r.name.toUpperCase().includes("MANAGER"));
    if (isManager && invokerUserId !== hubRecord.ownerId) {
      return { success: false, error: "Only the hub owner can remove managers." };
    }

    try {
      const result = await db
        .delete(authUserAssignment)
        .where(
          and(
            eq(authUserAssignment.userId, targetUserId),
            inArray(
              authUserAssignment.roleId,
              db
                .select({ id: authRole.id })
                .from(authRole)
                .where(eq(authRole.hubId, hubId))
            )
          )
        );

      if ((result.rowCount ?? 0) === 0) {
        return { success: false, error: "That user is not a moderator in this hub." };
      }

      await permissionService.invalidateRole(hubId, targetUserId);
      return { success: true };
    } catch (error) {
      console.error("[hubStaffService] removeRole failed:", error);
      return { success: false, error: "Failed to remove role." };
    }
  },


  /**
   * Returns all staff members with explicit role mappings inside this hub,
   * including position to allow UI sorting.
   */
  async getStaff(hubId: string, userId: string): Promise<{ userId: string; role: string; position: number }[]> {
    await permissionService.assertCanPerform(userId, hubId, "MANAGE_MODERATORS");
    const rows = await db
      .select({
        userId: authUserAssignment.userId,
        role: authRole.name,
        position: authRole.position,
      })
      .from(authUserAssignment)
      .innerJoin(authRole, eq(authRole.id, authUserAssignment.roleId))
      .where(eq(authRole.hubId, hubId));

    return rows;
  },
};
