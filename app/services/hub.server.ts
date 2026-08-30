import {
  PERMISSION_ACTIONS,
  PERMISSION_BITMASKS,
  getDefaultPermissions,
  type PermissionAction,
} from "~/permissions/config";
import type { HubResource } from "~/resources/hub";
import type {
  CreateHubInput,
  DeleteHubInput,
  LockdownHubInput,
  PatchHubConfigInput,
  TransferHubOwnershipInput,
} from "~/schemas/hub";
import { isCapabilityEnabled } from "~/services/capabilities.server";
import { controlHubService } from "~/services/control.server";
import { hubFeaturesService } from "~/services/hubFeatures.server";

const DEFAULT_HUB_ICON_URL = "https://interchat.tech/images/interchat.png";

function controlErrorMessage(error: unknown, fallback: string): string {
  const rpcError = error as { code?: number; details?: string; message?: string };
  switch (rpcError.code) {
    case 5:
      // The Hub may have been deleted or may be private to this actor.  Do not
      // relay Control Plane details here: they can contain the internal Hub ID.
      return "This Hub is no longer available.";
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
      // Do not expose raw gRPC details: they may contain SQL, endpoint, or
      // internal resource identifiers. Keep diagnostics server-side only.
      return fallback;
  }
}

export type HubUpdateErrorCode = "BAD_REQUEST" | "FORBIDDEN" | "CONFLICT" | "SERVICE_UNAVAILABLE" | "NOT_FOUND";

function controlErrorCode(error: unknown): HubUpdateErrorCode {
  const code = (error as { code?: number }).code;
  if (code === 7 || code === 16) return "FORBIDDEN";
  if (code === 9 || code === 10 || code === 6) return "CONFLICT";
  if (code === 4 || code === 14) return "SERVICE_UNAVAILABLE";
  if (code === 5) return "NOT_FOUND";
  return "BAD_REQUEST";
}

function bitsToRecord(bits: number): Record<PermissionAction, boolean> {
  const record = getDefaultPermissions();
  for (const action of PERMISSION_ACTIONS) {
    const mask = PERMISSION_BITMASKS[action];
    record[action] = (bits & mask) === mask;
  }
  return record;
}

type LifecycleControlService = Pick<
  typeof controlHubService,
  "deleteHub" | "lockdownHub" | "transferOwnership"
>;

export function createHubLifecycleService(control: LifecycleControlService = controlHubService) {
  return {
    async deleteHub(
      userId: string,
      input: DeleteHubInput,
    ): Promise<{ success: boolean; error?: string; errorCode?: HubUpdateErrorCode }> {
      try {
        await control.deleteHub({ ...input, actorId: userId });
        return { success: true };
      } catch (error: unknown) {
        console.error("Failed to delete hub", error);
        return {
          success: false,
          error: controlErrorMessage(error, "Failed to delete hub."),
          errorCode: controlErrorCode(error),
        };
      }
    },

    async transferOwnership(
      userId: string,
      input: TransferHubOwnershipInput,
    ): Promise<{ success: boolean; error?: string; errorCode?: HubUpdateErrorCode }> {
      try {
        await control.transferOwnership({ ...input, actorId: userId });
        return { success: true };
      } catch (error: unknown) {
        console.error("Failed to transfer hub ownership", error);
        return {
          success: false,
          error: controlErrorMessage(error, "Failed to transfer hub ownership."),
          errorCode: controlErrorCode(error),
        };
      }
    },

    async lockdownHub(userId: string, input: LockdownHubInput) {
      return control.lockdownHub({ ...input, actorId: userId });
    },
  };
}

const hubLifecycleService = createHubLifecycleService();

export const hubService = {
  ...hubFeaturesService,
  ...hubLifecycleService,

  async getUserHubs(userId: string): Promise<HubResource[]> {
    const res = await controlHubService.listMyHubs(userId);
    const hubs = await Promise.all(
      (res.hubs || []).map((summary) => {
        if (!summary.id) throw new Error("Control Plane returned a Hub summary without an ID.");
        return controlHubService.getHub(summary.id, userId);
      }),
    );
    return hubs;
  },




  async getHub(hubId: string, userId: string): Promise<HubResource> {
    return controlHubService.getHub(hubId, userId);
  },

  async createHub(userId: string, input: CreateHubInput, idempotencyKey: string): Promise<{ success: boolean; hubId?: string; error?: string; errorCode?: HubUpdateErrorCode }> {

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
        idempotencyKey,
      });
      return { success: true, hubId: res.metadata.id };
    } catch (error: unknown) {
      console.error("Failed to create hub via control plane", error);
      return { success: false, error: controlErrorMessage(error, "Failed to create hub."), errorCode: controlErrorCode(error) };
    }
  },

  async updateHubConfig(userId: string, input: PatchHubConfigInput): Promise<{ success: boolean; hub?: HubResource; error?: string; errorCode?: HubUpdateErrorCode }> {
    try {
      const supportedFields = new Set([
        "name",
        "shortDescription",
        "description",
        "iconUrl",
        "bannerUrl",
        "welcomeMessage",
        "visibility",
        "language",
        "region",
        "nsfw",
        "appealCooldownHours",
        "settings",
        "hubId",
        "idempotencyKey",
        "version",
      ]);
      const unsupportedFields = Object.keys(input).filter((field) => {
        if (field === "settings") return !isCapabilityEnabled("HUB_CONFIG");
        return !supportedFields.has(field);
      });
      if (unsupportedFields.length > 0) {
        return {
          success: false,
          error: `These Hub settings are not available yet: ${unsupportedFields.join(", ")}`,
        };
      }

      const updateMask: string[] = [];
      const spec: Record<string, unknown> = {};

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

      const updated = await controlHubService.patchHub({
        actorId: userId,
        hubId: input.hubId,
        spec,
        updateMask,
        expectedVersion: input.version,
        idempotencyKey: input.idempotencyKey,
      });

      return { success: true, hub: updated };
    } catch (error: unknown) {
      console.error("Failed to update hub config via control plane", error);
      return {
        success: false,
        error: controlErrorMessage(error, "Failed to update hub configuration."),
        errorCode: controlErrorCode(error),
      };
    }
  },

  async listRules(userId: string, hubId: string) {
    return controlHubService.listRules(hubId, userId);
  },

  async createRule(userId: string, input: {
    hubId: string;
    title: string;
    description: string;
    expectedVersion: number;
    idempotencyKey: string;
  }) {
    return controlHubService.createRule({
      ...input,
      actorId: userId,
    });
  },

  async updateRule(userId: string, input: {
    hubId: string;
    ruleId: string;
    title: string;
    description: string;
    expectedVersion: number;
    idempotencyKey: string;
  }) {
    return controlHubService.updateRule({
      ...input,
      actorId: userId,
    });
  },

  async deleteRule(userId: string, input: {
    hubId: string;
    ruleId: string;
    expectedVersion: number;
    idempotencyKey: string;
  }) {
    return controlHubService.deleteRule({
      ...input,
      actorId: userId,
    });
  },

  async reorderRules(userId: string, input: {
    hubId: string;
    ruleIds: string[];
    expectedVersion: number;
    idempotencyKey: string;
  }) {
    return controlHubService.reorderRules({
      ...input,
      actorId: userId,
    });
  },
};
