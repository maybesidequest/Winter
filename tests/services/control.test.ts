import { describe, expect, it } from "bun:test";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";
import { invokeUnary, type UnaryMethod } from "~/services/control/transport";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";

describe("Control Plane Descriptor & Client Setup", () => {
  it("loads the binary descriptor set without errors", () => {
    const buffer = Buffer.from(CONTROL_DESCRIPTOR_BASE64, "base64");
    expect(buffer.length).toBeGreaterThan(0);

    const definition = protoLoader.loadFileDescriptorSetFromBuffer(buffer, {
      keepCase: false,
      longs: Number,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    expect(definition).toBeDefined();
    const loaded = grpc.loadPackageDefinition(definition) as any;
    expect(loaded.interchat.control.v1.HubService).toBeDefined();
    expect(loaded.interchat.control.v1.ServerService).toBeDefined();
    expect(loaded.interchat.control.v1.ConnectionService).toBeDefined();
    expect(loaded.interchat.control.v1.UserService).toBeDefined();
    expect(loaded.interchat.control.v1.UserService.service.GetUserActivity).toBeDefined();
    expect(loaded.interchat.control.v1.UserActivity).toBeDefined();
    expect(loaded.interchat.control.v1.ModerationService).toBeDefined();
  });

  it("normalizes typed unary requests and responses at the wire boundary", async () => {
    let wireRequest: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = (request, _metadata, _options, callback) => {
      wireRequest = request;
      callback(null, { next_cursor: "next-page", total_count: 1 });
    };

    const response = await invokeUnary(method, {
      context: {
        requestId: "request-1",
        actorId: "user-1",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "interchat-winter",
        traceId: "trace-1",
        source: "WINTER",
      },
      limit: 50,
    });

    expect(wireRequest?.context).toMatchObject({
      request_id: "request-1",
      actor_id: "user-1",
      service_principal: "interchat-winter",
      trace_id: "trace-1",
      source: "WINTER",
    });
    expect(response).toMatchObject({ nextCursor: "next-page", totalCount: 1 });
  });
});
