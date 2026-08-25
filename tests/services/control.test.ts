import { describe, expect, it } from "bun:test";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";
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
  });
});
