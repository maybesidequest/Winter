import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { describe, expect, it } from "bun:test";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";
import { invokeUnary, type UnaryMethod } from "~/services/control/transport";

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

  it("normalizes Hub configuration mutations at the wire boundary", async () => {
    let wireRequest: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = (request, _metadata, _options, callback) => {
      wireRequest = request;
      callback(null, {
        hub: {
          metadata: { id: "hub-123", name: "Updated Hub" },
          spec: { description: "Updated description", settings: 15 },
          version: 2,
        },
      });
    };

    const response = await invokeUnary(method, {
      context: {
        requestId: "req-hub-1",
        actorId: "user-manager",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "interchat-winter",
        traceId: "trace-hub-1",
        idempotencyKey: "idem-hub-1",
      },
      hubId: "hub-123",
      spec: { description: "Updated description", settings: 15 },
      updateMask: { paths: ["description", "settings"] },
      expectedVersion: 1,
    });

    expect(wireRequest?.hub_id).toBe("hub-123");
    expect(wireRequest?.expected_version).toBe(1);
    expect((response as any)?.hub?.metadata?.name).toBe("Updated Hub");
    expect((response as any)?.hub?.version).toBe(2);
  });
});
