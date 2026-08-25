import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "node:fs";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";
import type { HubResource, HubSpec } from "~/resources/hub";

type UnaryClient = Record<
  string,
  (
    request: unknown,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error: grpc.ServiceError | null, response?: any) => void
  ) => void
>;

let client: UnaryClient | undefined;

function credentials() {
  const caPath = process.env.CONTROL_PLANE_TLS_CA;
  const certPath = process.env.CONTROL_PLANE_TLS_CERT;
  const keyPath = process.env.CONTROL_PLANE_TLS_KEY;
  if (caPath && certPath && keyPath) {
    return grpc.credentials.createSsl(
      readFileSync(caPath),
      readFileSync(keyPath),
      readFileSync(certPath)
    );
  }
  if (
    process.env.CONTROL_PLANE_ALLOW_INSECURE === "true" ||
    process.env.NODE_ENV !== "production"
  ) {
    return grpc.credentials.createInsecure();
  }
  throw new Error("Control Plane mTLS credentials are not configured.");
}

function getClient() {
  if (client) return client;
  const definition = protoLoader.loadFileDescriptorSetFromBuffer(
    Buffer.from(CONTROL_DESCRIPTOR_BASE64, "base64"),
    {
      keepCase: false,
      longs: Number,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
  const loaded = grpc.loadPackageDefinition(definition) as any;
  const Service = loaded.interchat.control.v1.HubService;
  const address = process.env.CONTROL_PLANE_GRPC_ADDRESS || "localhost:50052";
  client = new Service(address, credentials(), {
    "grpc.ssl_target_name_override": process.env.CONTROL_PLANE_TLS_DOMAIN,
    "grpc.default_authority": process.env.CONTROL_PLANE_TLS_DOMAIN,
  }) as UnaryClient;
  return client;
}

function call<T>(method: string, request: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutMs = Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000);
    const deadline = new Date(Date.now() + timeoutMs);
    const rpc = getClient()[method];
    if (!rpc) {
      return reject(new Error(`Control Plane method ${method} is unavailable.`));
    }
    rpc.call(
      getClient(),
      request,
      new grpc.Metadata(),
      { deadline },
      (error, response) => (error ? reject(error) : resolve(response as T))
    );
  });
}

function requestContext(actorId: string, mutation = false) {
  return {
    requestId: crypto.randomUUID(),
    actorId,
    actorType: "ACTOR_TYPE_HUMAN",
    servicePrincipal: process.env.CONTROL_PLANE_SERVICE_PRINCIPAL || "interchat-winter",
    idempotencyKey: mutation ? crypto.randomUUID() : "",
    traceId: "",
  };
}

function mapProtoToHubResource(protoHub: any): HubResource {
  const meta = protoHub.metadata || {};
  const spec = protoHub.spec || {};
  const status = protoHub.status || {};

  let visibility: "PUBLIC" | "PRIVATE" | "UNLISTED" = "PUBLIC";
  if (spec.visibility === "HUB_VISIBILITY_PRIVATE" || spec.visibility === "PRIVATE") {
    visibility = "PRIVATE";
  } else if (spec.visibility === "HUB_VISIBILITY_UNLISTED" || spec.visibility === "UNLISTED") {
    visibility = "UNLISTED";
  }

  let activityLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (status.activityLevel === "HUB_ACTIVITY_LEVEL_MEDIUM" || status.activityLevel === "MEDIUM") {
    activityLevel = "MEDIUM";
  } else if (status.activityLevel === "HUB_ACTIVITY_LEVEL_HIGH" || status.activityLevel === "HIGH") {
    activityLevel = "HIGH";
  }

  return {
    metadata: {
      id: meta.id || "",
      name: meta.name || spec.name || "",
      createdAt: meta.createdAt ? new Date(Number(meta.createdAt.seconds || 0) * 1000).toISOString() : new Date().toISOString(),
      updatedAt: meta.updatedAt ? new Date(Number(meta.updatedAt.seconds || 0) * 1000).toISOString() : null,
      effectiveRole: meta.effectiveRole || "NONE",
      permissions: meta.permissions || {},
    },
    spec: {
      description: spec.description || "",
      shortDescription: spec.shortDescription || null,
      visibility,
      language: spec.language || null,
      region: spec.region || null,
      welcomeMessage: spec.welcomeMessage || null,
      iconUrl: spec.iconUrl || null,
      bannerUrl: spec.bannerUrl || null,
      locked: Boolean(spec.locked),
      nsfw: Boolean(spec.nsfw),
      rules: Array.isArray(spec.rules) ? spec.rules : [],
      appealCooldownHours: Number(spec.appealCooldownHours || 168),
      settings: Number(spec.settings || 0),
    },
    status: {
      activityLevel,
      verified: Boolean(status.verified),
      partnered: Boolean(status.partnered),
      featured: Boolean(status.featured),
      weeklyMessageCount: Number(status.weeklyMessageCount || 0),
      averageRating: status.averageRating != null ? Number(status.averageRating) : null,
      connectionCount: Number(status.connectionCount || 0),
      upvoteCount: Number(status.upvoteCount || 0),
      reviewCount: Number(status.reviewCount || 0),
    },
    version: Number(protoHub.version || 1),
  };
}

export const controlClient = {
  async getHub(actorId: string, hubId: string): Promise<HubResource> {
    const resp = await call<any>("getHub", {
      context: requestContext(actorId),
      hubId,
    });
    return mapProtoToHubResource(resp);
  },

  async patchHub(
    actorId: string,
    hubId: string,
    spec: Partial<HubSpec> & { name?: string },
    updateMask: string[],
    expectedVersion: number
  ): Promise<HubResource> {
    let protoVisibility = "HUB_VISIBILITY_PUBLIC";
    if (spec.visibility === "PRIVATE") protoVisibility = "HUB_VISIBILITY_PRIVATE";
    if (spec.visibility === "UNLISTED") protoVisibility = "HUB_VISIBILITY_UNLISTED";

    const protoSpec: any = {
      name: spec.name || "",
      shortDescription: spec.shortDescription || "",
      description: spec.description || "",
      iconUrl: spec.iconUrl || "",
      bannerUrl: spec.bannerUrl || "",
      welcomeMessage: spec.welcomeMessage || "",
      language: spec.language || "",
      region: spec.region || "",
      visibility: protoVisibility,
      locked: Boolean(spec.locked),
      nsfw: Boolean(spec.nsfw),
      rules: spec.rules || [],
      appealCooldownHours: spec.appealCooldownHours ?? 168,
      settings: spec.settings ?? 0,
    };

    const resp = await call<any>("patchHub", {
      context: requestContext(actorId, true),
      hubId,
      spec: protoSpec,
      updateMask: { paths: updateMask },
      expectedVersion,
    });
    return mapProtoToHubResource(resp);
  },
};
