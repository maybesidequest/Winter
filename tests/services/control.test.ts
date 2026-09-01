import { describe, expect, it } from "bun:test";
import { invokeUnary, makeRequestContext, type UnaryMethod } from "~/services/control/transport";

describe("Control Plane static transport", () => {
  it("creates an auditable request context with stable correlation fields", () => {
    const context = makeRequestContext("user-1");

    expect(context.actorId).toBe("user-1");
    expect(context.servicePrincipal).toBe("interchat-winter");
    expect(context.source).toBe("WINTER");
    expect(context.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(context.traceId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("requires idempotency keys for mutation contexts", () => {
    expect(() => makeRequestContext("user-1", true)).toThrow("Idempotency key");
    expect(makeRequestContext("user-1", true, "idem-1").idempotencyKey).toBe("idem-1");
  });

  it("invokes generated Promise-based unary methods without key conversion", async () => {
    let received: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, { nextCursor: string }> = async (request) => {
      received = request;
      return { nextCursor: "next-page" };
    };

    const response = await invokeUnary(method, {
      context: { requestId: "request-1", traceId: "trace-1" },
      nextCursor: "caller-shaped",
    });

    expect(received).toEqual({
      context: { requestId: "request-1", traceId: "trace-1" },
      nextCursor: "caller-shaped",
    });
    expect(response.nextCursor).toBe("next-page");
  });
});
