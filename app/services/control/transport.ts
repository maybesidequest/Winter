import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "node:fs";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";

export type UnaryMethod<TReq, TRes> = (
  request: TReq,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (error: grpc.ServiceError | null, response?: TRes) => void
) => void;

export type ServiceClient = Record<string, UnaryMethod<unknown, unknown>>;

export interface ServiceRegistry {
  hubClient?: ServiceClient;
  serverClient?: ServiceClient;
  connectionClient?: ServiceClient;
  userClient?: ServiceClient;
  moderationClient?: ServiceClient;
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
    process.env.CONTROL_PLANE_ALLOW_INSECURE === "true"
  ) {
    return grpc.credentials.createInsecure();
  }

  throw new Error("Control Plane mTLS credentials are not configured.");
}

function loadPackageDefinition(): Record<string, new (address: string, creds: grpc.ChannelCredentials, options: grpc.ClientOptions) => ServiceClient> {
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
  const root = grpc.loadPackageDefinition(definition) as unknown as Record<string, Record<string, Record<string, Record<string, new (address: string, creds: grpc.ChannelCredentials, options: grpc.ClientOptions) => ServiceClient>>>>;
  return root.interchat.control.v1;
}

export function getServiceClients(): Required<ServiceRegistry> {
  if (registry.hubClient) return registry as Required<ServiceRegistry>;

  const pkg = loadPackageDefinition();
  const address = process.env.CONTROL_PLANE_GRPC_ADDRESS || "localhost:50052";
  const creds = credentials();
  const options = {
    "grpc.ssl_target_name_override": process.env.CONTROL_PLANE_TLS_DOMAIN,
    "grpc.default_authority": process.env.CONTROL_PLANE_TLS_DOMAIN,
  };

  registry.hubClient = new pkg.HubService(address, creds, options);
  registry.serverClient = new pkg.ServerService(address, creds, options);
  registry.connectionClient = new pkg.ConnectionService(address, creds, options);
  registry.userClient = new pkg.UserService(address, creds, options);
  registry.moderationClient = new pkg.ModerationService(address, creds, options);

  return registry as Required<ServiceRegistry>;
}

export function invokeRpc<TRes, TReq = unknown>(
  client: ServiceClient,
  method: string,
  request: TReq
): Promise<TRes> {
  return new Promise((resolve, reject) => {
    const timeoutMs = Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000);
    const deadline = new Date(Date.now() + timeoutMs);
    const rpc = client[method];
    if (!rpc) {
      return reject(new ControlPlaneRpcError(`Control Plane method ${method} is unavailable.`));
    }
    rpc.call(
      client,
      request,
      new grpc.Metadata(),
      { deadline },
      (error: grpc.ServiceError | null, response?: unknown) =>
        error ? reject(toControlPlaneError(error)) : resolve(response as TRes)
    );
  });
}

export class ControlPlaneRpcError extends Error {
  readonly code: grpc.status;
  readonly errorCode: string;
  fieldName?: string;

  constructor(message: string, code = grpc.status.UNKNOWN, errorCode = "") {
    super(message);
    this.name = "ControlPlaneRpcError";
    this.code = code;
    this.errorCode = errorCode || grpc.status[code] || "UNKNOWN";
  }
}

function toControlPlaneError(error: grpc.ServiceError): ControlPlaneRpcError {
  // The Python service emits google.rpc.Status in trailing metadata. Keep the
  // transport error typed even when a client cannot decode the detail payload;
  // UI code should branch on code/errorCode, never on message text.
  const errorCode = String(error.metadata?.get("interchat-error-code")[0] || "");
  const fieldName = String(error.metadata?.get("interchat-field-name")[0] || "") || undefined;
  const typed = new ControlPlaneRpcError(error.details || "Control Plane request failed", error.code, errorCode);
  typed.fieldName = fieldName;
  return typed;
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
