import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "node:fs";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";

import type { HubServiceClient } from "~/generated/control/v1/interchat/control/v1/HubService";
import type { ConnectionServiceClient } from "~/generated/control/v1/interchat/control/v1/ConnectionService";
import type { ServerServiceClient } from "~/generated/control/v1/interchat/control/v1/ServerService";
import type { UserServiceClient } from "~/generated/control/v1/interchat/control/v1/UserService";
import type { ModerationServiceClient } from "~/generated/control/v1/interchat/control/v1/ModerationService";

export type UnaryMethod<TReq, TRes> = (
  request: TReq,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (error: grpc.ServiceError | null, response?: TRes) => void
) => void;

export type ServiceClient = grpc.Client | unknown;

export interface ServiceRegistry {
  hubClient?: HubServiceClient;
  serverClient?: ServerServiceClient;
  connectionClient?: ConnectionServiceClient;
  userClient?: UserServiceClient;
  moderationClient?: ModerationServiceClient;
}

const registry: ServiceRegistry = {};

function credentials(): grpc.ChannelCredentials {
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

function loadPackageDefinition(): Record<string, any> {
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
  const root = grpc.loadPackageDefinition(definition) as any;
  return root.interchat.control.v1;
}

export function getServiceClients(): Required<ServiceRegistry> {
  if (registry.hubClient) return registry as Required<ServiceRegistry>;

  const pkg = loadPackageDefinition();
  const address =
    process.env.CONTROL_PLANE_GRPC_ADDRESS ||
    process.env.CONTROL_PLANE_ADDRESS ||
    (process.env.CONTROL_PLANE_HOST
      ? `${process.env.CONTROL_PLANE_HOST}:${process.env.CONTROL_PLANE_PORT || "50051"}`
      : (process.env.NODE_ENV === "production" ? "control-plane:50051" : "127.0.0.1:50051"));
  const creds = credentials();
  const domain =
    process.env.CONTROL_PLANE_TLS_DOMAIN ||
    process.env.CONTROL_PLANE_SERVER_NAME ||
    "control-plane";
  const options = {
    "grpc.ssl_target_name_override": domain,
    "grpc.default_authority": domain,
  };

  registry.hubClient = new pkg.HubService(address, creds, options) as HubServiceClient;
  registry.serverClient = new pkg.ServerService(address, creds, options) as ServerServiceClient;
  registry.connectionClient = new pkg.ConnectionService(address, creds, options) as ConnectionServiceClient;
  registry.userClient = new pkg.UserService(address, creds, options) as UserServiceClient;
  registry.moderationClient = new pkg.ModerationService(address, creds, options) as ModerationServiceClient;

  return registry as Required<ServiceRegistry>;
}

export function invokeRpc<TRes, TReq = unknown>(
  client: ServiceClient,
  method: string,
  request: TReq
): Promise<TRes> {
  return new Promise((resolve, reject) => {
    if (!client) {
      return reject(new Error("Control Plane client is unavailable."));
    }
    const timeoutMs = Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000);
    const deadline = new Date(Date.now() + timeoutMs);
    const rec = client as Record<string, Function>;
    const rpc = rec[method] || rec[method.charAt(0).toLowerCase() + method.slice(1)];
    if (typeof rpc !== "function") {
      return reject(new Error(`Control Plane method ${method} is unavailable.`));
    }
    rpc.call(
      client,
      request,
      new grpc.Metadata(),
      { deadline },
      (error: grpc.ServiceError | null, response?: unknown) =>
        error ? reject(error) : resolve(response as TRes)
    );
  });
}

export interface RequestContext {
  requestId?: string;
  actorId: string;
  actorType?: string;
  servicePrincipal: string;
  idempotencyKey?: string;
  traceId?: string;
  source: string;
}

export function makeRequestContext(
  actorId: string,
  mutation = false,
  idempotencyKey = ""
): RequestContext {
  if (mutation && !idempotencyKey) {
    throw new Error("Idempotency key is required for mutations.");
  }
  return {
    requestId: crypto.randomUUID(),
    actorId,
    actorType: "ACTOR_TYPE_HUMAN",
    servicePrincipal: "interchat-winter",
    idempotencyKey: idempotencyKey || (mutation ? crypto.randomUUID() : ""),
    traceId: crypto.randomUUID(),
    source: "WINTER",
  };
}

