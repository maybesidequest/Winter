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
    if (authorizedHubIds.length === 0) {
      return [];
    }

    try {
      return await controlHubService.listUserHubs(authorizedHubIds, userId);
    } catch (err) {
      console.warn("Failed to batch list user hubs from control plane", err);
      return [];
    }
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
