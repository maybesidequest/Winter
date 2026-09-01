import { Metadata, type ClientMiddleware } from "nice-grpc";

/** The request context fields propagated to every Control Plane RPC. */
export interface ControlRequestContext {
  requestId?: string;
  traceId?: string;
}

interface RequestWithContext {
  context?: ControlRequestContext;
}

/**
 * Add a bounded deadline to every call. The AbortSignal is understood by
 * nice-grpc and lets cancellation propagate through the HTTP/2 transport.
 */
export function controlDeadlineMiddleware(
  timeoutMs: number,
): ClientMiddleware {
  const timeout = Math.max(1, timeoutMs);
  return async function* (call, options) {
    if (call.requestStream || call.responseStream) {
      throw new Error("Control Plane only supports unary calls.");
    }
    const controller = new AbortController();
    let expired = false;
    const timer = setTimeout(() => {
      expired = true;
      controller.abort();
    }, timeout);
    try {
      return yield* call.next(call.request, { ...options, signal: controller.signal });
    } catch (error) {
      if (expired) {
        throw new ControlPlaneError({ code: 4, details: `Control Plane deadline exceeded after ${timeout}ms.` });
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };
}

/**
 * Propagate request and trace correlation as gRPC metadata. The protobuf
 * RequestContext remains the authoritative audit payload; metadata lets
 * gateways and proxies correlate a request before decoding its body.
 */
export const controlCorrelationMiddleware: ClientMiddleware = async function* (
  call,
  options,
) {
  if (call.requestStream || call.responseStream) {
    throw new Error("Control Plane only supports unary calls.");
  }
  const request = call.request as RequestWithContext;
  const requestId = request.context?.requestId;
  const traceId = request.context?.traceId;
  const metadata = options.metadata ?? new Metadata();

  if (requestId) metadata.set("x-request-id", requestId);
  if (traceId) {
    metadata.set("x-trace-id", traceId);
    // W3C traceparent is accepted by the gateway. A bare trace ID is not a
    // valid traceparent, so only emit the vendor-neutral correlation header.
  }

  return yield* call.next(call.request, { ...options, metadata });
};

export type ControlErrorCode =
  | "cancelled"
  | "deadline_exceeded"
  | "unauthenticated"
  | "permission_denied"
  | "not_found"
  | "already_exists"
  | "failed_precondition"
  | "aborted"
  | "resource_exhausted"
  | "out_of_range"
  | "unimplemented"
  | "data_loss"
  | "unavailable"
  | "invalid_argument"
  | "internal"
  | "unknown";

interface GrpcFailure {
  code?: number;
  details?: string;
  metadata?: Metadata;
}

const grpcCodeNames: Record<number, ControlErrorCode> = {
  1: "cancelled",
  2: "unknown",
  3: "invalid_argument",
  4: "deadline_exceeded",
  5: "not_found",
  6: "already_exists",
  7: "permission_denied",
  8: "resource_exhausted",
  9: "failed_precondition",
  10: "aborted",
  11: "out_of_range",
  12: "unimplemented",
  13: "internal",
  14: "unavailable",
  15: "data_loss",
  16: "unauthenticated",
};

export class ControlPlaneError extends Error {
  readonly code: ControlErrorCode;
  readonly requestId?: string;
  readonly traceId?: string;
  readonly retryable: boolean;
  readonly grpcCode?: number;

  constructor(failure: GrpcFailure, context: ControlRequestContext = {}) {
    const code = grpcCodeNames[failure.code ?? 2] ?? "unknown";
    super(failure.details || `Control Plane request failed (${code}).`);
    this.name = "ControlPlaneError";
    this.code = code;
    this.grpcCode = failure.code;
    this.requestId = context.requestId || readMetadata(failure.metadata, "x-request-id");
    this.traceId = context.traceId || readMetadata(failure.metadata, "x-trace-id");
    this.retryable = code === "aborted" || code === "unavailable" || code === "resource_exhausted" || code === "deadline_exceeded";
  }
}

function readMetadata(metadata: Metadata | undefined, key: string): string | undefined {
  const value = metadata?.get(key);
  return typeof value === "string" ? value : undefined;
}

/**
 * Numeric gRPC status code for a transport failure. ControlPlaneError carries
 * the numeric code as `grpcCode` and the human-readable name as `code`, so
 * mappers must classify on this value (or on a raw RpcError's numeric
 * `code`), never on `Number(error.code)` — that reads the name string and
 * always yields NaN.
 */
export function grpcCodeOf(error: unknown): number | undefined {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current && typeof current === "object"; depth += 1) {
    const candidate = current as { grpcCode?: unknown; code?: unknown; cause?: unknown };
    if (typeof candidate.grpcCode === "number") return candidate.grpcCode;
    if (typeof candidate.code === "number") return candidate.code;
    current = candidate.cause;
  }
  return undefined;
}

/** Map transport failures once, preserving stable caller-visible semantics. */
export const controlErrorMiddleware: ClientMiddleware = async function* (call, options) {
  if (call.requestStream || call.responseStream) {
    throw new Error("Control Plane only supports unary calls.");
  }
  try {
    return yield* call.next(call.request, options);
  } catch (error) {
    if (error instanceof ControlPlaneError) throw error;
    throw new ControlPlaneError(error as GrpcFailure, (call.request as RequestWithContext).context);
  }
};
