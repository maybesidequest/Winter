import { db } from "~/db.server";
import { hub, authRole, authUserAssignment } from "../../drizzle/schema";
import { eq, or, and, inArray } from "drizzle-orm";
import type { CreateHubInput, PatchHubConfigInput } from "~/schemas/hub";
import type { HubResource } from "~/resources/hub";
import { permissionService } from "~/services/permission.server";
import { irisClient } from "~/services/iris.server";
import { controlHubService } from "~/services/control.server";
import { hubFeaturesService } from "~/services/hubFeatures.server";
import {
  PERMISSION_ACTIONS,
  PERMISSION_BITMASKS,
  getDefaultPermissions,
  type PermissionAction,
} from "~/permissions/config";

const DEFAULT_HUB_ICON_URL = "https://interchat.tech/images/interchat.png";

function controlErrorMessage(error: unknown, fallback: string): string {
  const rpcError = error as { code?: number; details?: string; message?: string };
  switch (rpcError.code) {
    case 3:
      return rpcError.details || "The submitted values are invalid.";
    case 6:
      return "This idempotency key was already used for a different request.";
    case 7:
    case 16:
      return "You do not have permission to perform this action.";
    case 9:
    case 10:
      return "This item changed while you were editing it. Refresh and try again.";
    case 14:
      return "The control plane is temporarily unavailable. Try again shortly.";
    default:
      return rpcError.details || rpcError.message || fallback;
  }
}

function bitsToRecord(bits: number): Record<PermissionAction, boolean> {
  const record = getDefaultPermissions();
  for (const action of PERMISSION_ACTIONS) {
    const mask = PERMISSION_BITMASKS[action];
    record[action] = (bits & mask) === mask;
  }
  return record;
}

export const hubService = {
  ...hubFeaturesService,

  async getUserHubs(userId: string): Promise<HubResource[]> {
    const authorizedHubIds = await irisClient.getAuthorizedHubs(userId);
    const conditions = [eq(hub.ownerId, userId)];
    if (authorizedHubIds.length > 0) {
      conditions.push(inArray(hub.id, authorizedHubIds));
    }

    const rows = await db
      .select({
        hub,
        roleId: authRole.id,
        roleName: authRole.name,
        permissions: authRole.permissions,
        position: authRole.position,
        assignmentId: authUserAssignment.id,
      })
      .from(hub)
      .leftJoin(authRole, eq(authRole.hubId, hub.id))
      .leftJoin(
        authUserAssignment,
        and(
          eq(authUserAssignment.roleId, authRole.id),
          eq(authUserAssignment.userId, userId)
        )
      )
      .where(or(...conditions));

    const hubGroups = new Map<string, {
      hubRecord: typeof hub.$inferSelect;
      assignments: Array<{ roleName: string; permissions: number; position: number }>;
    }>();

    for (const row of rows) {
      const hubId = row.hub.id;
      if (!hubGroups.has(hubId)) {
        hubGroups.set(hubId, { hubRecord: row.hub, assignments: [] });
      }
      if (row.assignmentId && row.roleName !== null && row.permissions !== null) {
        hubGroups.get(hubId)!.assignments.push({
          roleName: row.roleName,
          permissions: row.permissions,
          position: row.position ?? 0,
        });
      }
    }

    return Array.from(hubGroups.values()).map(({ hubRecord, assignments }) => {
      const isOwner = hubRecord.ownerId === userId;
      let effectiveRole: string;
      let permissions: Record<PermissionAction, boolean>;

      if (isOwner) {
        effectiveRole = "OWNER";
        permissions = permissionService.getOwnerPermissions();
      } else if (assignments.length === 0) {
        effectiveRole = "NONE";
        permissions = getDefaultPermissions();
      } else {
        let bits = 0;
        for (const ass of assignments) {
          bits |= ass.permissions;
        }
        permissions = bitsToRecord(bits);
        const sorted = [...assignments].sort((a, b) => b.position - a.position);
        effectiveRole = sorted[0].roleName;
      }

      return {
        metadata: {
          id: hubRecord.id,
          name: hubRecord.name,
          createdAt: hubRecord.createdAt,
          updatedAt: hubRecord.updatedAt,
          effectiveRole,
          permissions,
        },
        spec: {
          description: hubRecord.description,
          shortDescription: hubRecord.shortDescription,
          visibility: hubRecord.visibility,
          language: hubRecord.language,
          region: hubRecord.region,
          welcomeMessage: hubRecord.welcomeMessage,
          iconUrl: hubRecord.iconUrl,
          bannerUrl: hubRecord.bannerUrl,
          locked: hubRecord.locked,
          nsfw: hubRecord.nsfw,
          rules: hubRecord.rules,
          appealCooldownHours: hubRecord.appealCooldownHours,
          settings: hubRecord.settings,
        },
        status: {
          activityLevel: hubRecord.activityLevel,
          verified: hubRecord.verified,
          partnered: hubRecord.partnered,
          featured: hubRecord.featured,
          weeklyMessageCount: hubRecord.weeklyMessageCount,
          averageRating: hubRecord.averageRating,
          connectionCount: hubRecord.connectionCount,
          upvoteCount: hubRecord.upvoteCount,
          reviewCount: hubRecord.reviewCount,
        },
        version: Number(hubRecord.version ?? 1),
      };
    });
  },

  async createHub(userId: string, input: CreateHubInput, idempotencyKey?: string): Promise<{ success: boolean; hubId?: string; error?: string }> {
    try {
      const res = await controlHubService.createHub({
        actorId: userId,
        name: input.name,
        description: input.description || input.shortDescription || input.name,
        shortDescription: input.shortDescription,
        visibility: input.visibility,
        iconUrl: input.iconUrl?.trim() || DEFAULT_HUB_ICON_URL,
        bannerUrl: input.bannerUrl?.trim() || undefined,
        welcomeMessage: input.welcomeMessage || undefined,
        language: input.language,
        region: input.region,
        idempotencyKey: idempotencyKey || crypto.randomUUID(),
      });
      return { success: true, hubId: res.metadata.id };
    } catch (error: unknown) {
      console.error("Failed to create hub via control plane", error);
      return { success: false, error: controlErrorMessage(error, "Failed to create hub.") };
    }
  },

  async updateHubConfig(userId: string, input: PatchHubConfigInput): Promise<{ success: boolean; hub?: HubResource; error?: string }> {
    try {
      const updateMask: string[] = [];
      const spec: any = {};

      if (input.name !== undefined) { spec.name = input.name; updateMask.push("name"); }
      if (input.shortDescription !== undefined) { spec.shortDescription = input.shortDescription; updateMask.push("short_description"); }
      if (input.description !== undefined) { spec.description = input.description; updateMask.push("description"); }
      if (input.iconUrl !== undefined) { spec.iconUrl = input.iconUrl ? input.iconUrl.trim() : ""; updateMask.push("icon_url"); }
      if (input.bannerUrl !== undefined) { spec.bannerUrl = input.bannerUrl ? input.bannerUrl.trim() : ""; updateMask.push("banner_url"); }
      if (input.welcomeMessage !== undefined) { spec.welcomeMessage = input.welcomeMessage ? input.welcomeMessage.trim() : ""; updateMask.push("welcome_message"); }
      if (input.language !== undefined) { spec.language = input.language; updateMask.push("language"); }
      if (input.region !== undefined) { spec.region = input.region; updateMask.push("region"); }
      if (input.visibility !== undefined) { spec.visibility = input.visibility; updateMask.push("visibility"); }
      if (input.nsfw !== undefined) { spec.nsfw = input.nsfw; updateMask.push("nsfw"); }
      if (input.locked !== undefined) { spec.locked = input.locked; updateMask.push("locked"); }
      if (input.appealCooldownHours !== undefined) { spec.appealCooldownHours = input.appealCooldownHours; updateMask.push("appeal_cooldown_hours"); }
      if (input.settings !== undefined) { spec.settings = input.settings; updateMask.push("settings"); }

      if (updateMask.length === 0) return { success: true };

      let expectedVersion = input.version;
      if (!expectedVersion) {
        const current = await controlHubService.getHub(input.hubId, userId);
        expectedVersion = current.version;
      }

      const updated = await controlHubService.patchHub({
        actorId: userId,
        hubId: input.hubId,
        spec,
        updateMask,
        expectedVersion,
        idempotencyKey: input.idempotencyKey,
      });

      return { success: true, hub: updated };
    } catch (error: unknown) {
      console.error("Failed to update hub config via control plane", error);
      return { success: false, error: controlErrorMessage(error, "Failed to update hub configuration.") };
    }
  },

  async deleteHub(userId: string, hubId: string, idempotencyKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const current = await controlHubService.getHub(hubId, userId);
      await controlHubService.deleteHub({
        actorId: userId,
        hubId,
        confirmationName: current.metadata.name,
        expectedVersion: current.version,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to delete hub", error);
      return { success: false, error: controlErrorMessage(error, "Failed to delete hub.") };
    }
  },

  async transferOwnership(userId: string, hubId: string, newOwnerId: string, idempotencyKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const current = await controlHubService.getHub(hubId, userId);
      await controlHubService.transferOwnership({
        actorId: userId,
        hubId,
        newOwnerId,
        expectedVersion: current.version,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to transfer hub ownership", error);
      return { success: false, error: controlErrorMessage(error, "Failed to transfer hub ownership.") };
    }
  },

  async lockdownHub(userId: string, input: { hubId: string; locked: boolean; reason: string; expectedVersion: number; idempotencyKey: string }) {
    return controlHubService.lockdownHub({ ...input, actorId: userId });
  },
};
