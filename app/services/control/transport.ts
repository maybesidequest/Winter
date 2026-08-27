import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "node:fs";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";

import type { ProtoGrpcType as HubProto } from "~/generated/control/v1/hub_service";
import type { ProtoGrpcType as ServerProto } from "~/generated/control/v1/server_service";
import type { ProtoGrpcType as ConnectionProto } from "~/generated/control/v1/connection_service";
import type { ProtoGrpcType as UserProto } from "~/generated/control/v1/user_service";
import type { ProtoGrpcType as ModerationProto } from "~/generated/control/v1/moderation_service";

import type { HubServiceClient } from "~/generated/control/v1/interchat/control/v1/HubService";
import type { ConnectionServiceClient } from "~/generated/control/v1/interchat/control/v1/ConnectionService";
import type { ServerServiceClient } from "~/generated/control/v1/interchat/control/v1/ServerService";
import type { UserServiceClient } from "~/generated/control/v1/interchat/control/v1/UserService";
import type { ModerationServiceClient } from "~/generated/control/v1/interchat/control/v1/ModerationService";
import type { RequestContext as GeneratedRequestContext } from "~/generated/control/v1/interchat/control/v1/RequestContext";
import type { ActorType as GeneratedActorType } from "~/generated/control/v1/interchat/control/v1/ActorType";

export type ControlGrpcPackage = HubProto["interchat"]["control"]["v1"] &
  ServerProto["interchat"]["control"]["v1"] &
  ConnectionProto["interchat"]["control"]["v1"] &
  UserProto["interchat"]["control"]["v1"] &
  ModerationProto["interchat"]["control"]["v1"];

export type UnaryMethod<TReq, TRes> = (
  request: TReq,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (error: grpc.ServiceError | null, response?: TRes) => void
) => void;

export type RequestContext = GeneratedRequestContext;

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

function loadPackageDefinition(): ControlGrpcPackage {
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
  const root = grpc.loadPackageDefinition(definition) as unknown as {
    interchat?: { control?: { v1?: ControlGrpcPackage } };
  };
  const control = root.interchat?.control?.v1;
  if (!control) throw new Error("Control Plane protobuf package is unavailable.");
  return control;
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

  registry.hubClient = new pkg.HubService(address, creds, options);
  registry.serverClient = new pkg.ServerService(address, creds, options);
  registry.connectionClient = new pkg.ConnectionService(address, creds, options);
  registry.userClient = new pkg.UserService(address, creds, options);
  registry.moderationClient = new pkg.ModerationService(address, creds, options);

  return registry as Required<ServiceRegistry>;
}

export function invokeUnary<TReq, TRes>(
  method: UnaryMethod<TReq, TRes>,
  request: TReq,
): Promise<TRes> {
  return new Promise((resolve, reject) => {
    // The descriptor loaded by proto-loader still serializes using the
    // proto field names (snake_case), even with keepCase=false. Keep the
    // application-facing generated types camelCase, but normalize at the
    // transport boundary so nested RequestContext fields are not silently
    // dropped (which would make every call appear unauthenticated).
    const wireRequest = deepToSnakeCase<TReq>(request);
    method(wireRequest, new grpc.Metadata(), { deadline: new Date(Date.now() + Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000)) }, (error, response) => {
      if (error) return reject(error);
      if (response === undefined) return reject(new Error("Control Plane returned an empty response."));
      resolve(deepToCamelCase<TRes>(response));
    });
  });
}

export async function checkControlPlaneReady(timeoutMs = 2000): Promise<void> {
  const client = getServiceClients().hubClient;
  await new Promise<void>((resolve, reject) => {
    client.waitForReady(new Date(Date.now() + timeoutMs), (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function toSnakeCase(str: string): string {
  if (/^[A-Z0-9_]+$/.test(str)) return str;
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function toCamelCase(str: string): string {
  if (/^[A-Z0-9_]+$/.test(str)) return str;
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

export function deepToSnakeCase<T = unknown>(obj: unknown): T {
  if (obj === null || typeof obj !== "object") return obj as T;
  if (Array.isArray(obj)) return obj.map(deepToSnakeCase) as unknown as T;
  if (obj instanceof Date || obj instanceof Uint8Array || Buffer.isBuffer(obj)) return obj as unknown as T;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = deepToSnakeCase(value);
  }
  return result as T;
}

export function deepToCamelCase<T = unknown>(obj: unknown): T {
  if (obj === null || typeof obj !== "object") return obj as T;
  if (Array.isArray(obj)) return obj.map(deepToCamelCase) as unknown as T;
  if (obj instanceof Date || obj instanceof Uint8Array || Buffer.isBuffer(obj)) return obj as unknown as T;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = deepToCamelCase(value);
    if (camelKey !== key) {
      result[key] = result[camelKey];
    }
  }
  return result as T;
}
export function makeRequestContext(
  actorId: string,
  mutation = false,
  idempotencyKey = "",
  actorType: GeneratedActorType = "ACTOR_TYPE_HUMAN",
): RequestContext {
  if (mutation && !idempotencyKey) {
    throw new Error("Idempotency key is required for mutations.");
  }
  const reqId = crypto.randomUUID();
  const trId = crypto.randomUUID();
  const idemKey = idempotencyKey || (mutation ? crypto.randomUUID() : "");
  return {
    requestId: reqId,
    actorId: actorId,
    servicePrincipal: "interchat-winter",
    actorType,
    idempotencyKey: idemKey,
    traceId: trId,
    source: "WINTER",
  };
}
