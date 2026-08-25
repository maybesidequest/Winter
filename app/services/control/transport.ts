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
    process.env.CONTROL_PLANE_ALLOW_INSECURE === "true" ||
    process.env.NODE_ENV !== "production"
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
    servicePrincipal: "winter",
    idempotencyKey: idempotencyKey || (mutation ? crypto.randomUUID() : ""),
    traceId: crypto.randomUUID(),
    source: "WINTER",
  };
}

