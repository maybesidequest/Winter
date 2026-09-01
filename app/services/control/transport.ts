import * as grpc from "@grpc/grpc-js";
import { createChannel, waitForChannelReady, type CallOptions, type Channel } from "nice-grpc";
import { readFileSync } from "node:fs";

import {
  ActorType as GeneratedActorType,
  type RequestContext as GeneratedRequestContext,
} from "~/generated/control/v1/static";
import { createStaticControlClients, type StaticControlClients } from "./static-client";
import {
  controlCorrelationMiddleware,
  controlDeadlineMiddleware,
  controlErrorMiddleware,
  type ControlPlaneError,
} from "./middleware";

export type RequestContext = GeneratedRequestContext;
export type ControlError = ControlPlaneError;

/** The generated clients are Promise-based and never expose a dynamic package. */
export type UnaryMethod<TReq, TRes> = (
  request: Partial<TReq>,
  options?: CallOptions,
) => Promise<TRes>;

export interface ServiceRegistry extends StaticControlClients {}

const registry: Partial<ServiceRegistry> = {};
let channel: Channel | undefined;

function credentials(): grpc.ChannelCredentials {
  const caPath = process.env.CONTROL_PLANE_TLS_CA;
  const certPath = process.env.CONTROL_PLANE_TLS_CERT;
  const keyPath = process.env.CONTROL_PLANE_TLS_KEY;

  if (caPath && certPath && keyPath) {
    return grpc.credentials.createSsl(
      readFileSync(caPath),
      readFileSync(keyPath),
      readFileSync(certPath),
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

function controlAddress(): string {
  return (
    process.env.CONTROL_PLANE_GRPC_ADDRESS ||
    process.env.CONTROL_PLANE_ADDRESS ||
    (process.env.CONTROL_PLANE_HOST
      ? `${process.env.CONTROL_PLANE_HOST}:${process.env.CONTROL_PLANE_PORT || "50051"}`
      : process.env.NODE_ENV === "production"
        ? "control-plane:50051"
        : "127.0.0.1:50051")
  );
}

function timeoutMs(): number {
  const value = Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000);
  return Number.isFinite(value) && value > 0 ? value : 5000;
}

export function getServiceClients(): ServiceRegistry {
  if (registry.hubClient) return registry as ServiceRegistry;

  const domain =
    process.env.CONTROL_PLANE_TLS_DOMAIN ||
    process.env.CONTROL_PLANE_SERVER_NAME ||
    "control-plane";
  channel = createChannel(controlAddress(), credentials(), {
    "grpc.ssl_target_name_override": domain,
    "grpc.default_authority": domain,
  });

  const clients = createStaticControlClients(channel, [
    controlErrorMiddleware,
    controlCorrelationMiddleware,
    controlDeadlineMiddleware(timeoutMs()),
  ]);
  Object.assign(registry, clients);
  return clients;
}

/** Invoke one generated unary method; deadline middleware bounds every call. */
export function invokeUnary<TReq, TRes>(
  method: UnaryMethod<TReq, TRes>,
  request: Partial<TReq>,
  options: CallOptions = {},
): Promise<TRes> {
  return method(request, options);
}

export async function checkControlPlaneReady(timeout = 2000): Promise<void> {
  getServiceClients();
  const activeChannel = channel;
  if (!activeChannel) throw new Error("Control Plane channel was not initialized.");
  await waitForChannelReady(activeChannel, new Date(Date.now() + timeout));
}

export function makeRequestContext(
  actorId: string,
  mutation = false,
  idempotencyKey = "",
  actorType: GeneratedActorType = GeneratedActorType.ACTOR_TYPE_HUMAN,
): RequestContext {
  if (mutation && !idempotencyKey) {
    throw new Error("Idempotency key is required for mutations.");
  }
  const requestId = crypto.randomUUID();
  const traceId = crypto.randomUUID();
  return {
    requestId,
    actorId,
    servicePrincipal: "interchat-winter",
    actorType,
    idempotencyKey: idempotencyKey || (mutation ? crypto.randomUUID() : ""),
    traceId,
    source: "WINTER",
    // Mutating requests carry the same stable correlation as their
    // idempotency key.  Individual request messages also expose this field,
    // so retries can be followed without inventing a second identifier.
    operationId: mutation ? idempotencyKey : "",
  };
}
