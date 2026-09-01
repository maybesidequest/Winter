import { describe, expect, it } from "bun:test";
import { invokeUnary, type UnaryMethod } from "~/services/control/transport";

describe("Winter Hub Staff Control Service", () => {
  it("serializes AssignHubStaffRoleRequest with role_id and expected_version", async () => {
    let wireRequest: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = async (request) => {
      wireRequest = request;
      return {
        staff: [
          {
            userId: "mod-1",
            role: "Moderator",
            roleId: "role-mod-456",
            permissionsBitmask: 128,
            assignedAt: { seconds: 1700000000, nanos: 0 },
          },
        ],
      };
    };

    const response = await invokeUnary(method, {
      context: {
        requestId: "req-staff-1",
        actorId: "owner-1",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "winter",
        traceId: "trace-staff-1",
        source: "WINTER",
      },
      hubId: "hub-999",
      userId: "mod-1",
      role: "Moderator",
      roleId: "role-mod-456",
      permissionsBitmask: 128,
      expectedVersion: 5,
    });

    expect(wireRequest).toBeDefined();
    expect(wireRequest?.hubId).toBe("hub-999");
    expect(wireRequest?.userId).toBe("mod-1");
    expect(wireRequest?.roleId).toBe("role-mod-456");
    expect(wireRequest?.expectedVersion).toBe(5);
    expect(wireRequest?.permissionsBitmask).toBe(128);

    expect(response).toMatchObject({
      staff: [
        {
          userId: "mod-1",
          role: "Moderator",
          roleId: "role-mod-456",
        },
      ],
    });
  });

  it("serializes RemoveHubStaffRoleRequest with role_id and expected_version", async () => {
    let wireRequest: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = async (request) => {
      wireRequest = request;
      return {
        staff: [],
      };
    };

    const response = await invokeUnary(method, {
      context: {
        requestId: "req-staff-2",
        actorId: "owner-1",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "winter",
        traceId: "trace-staff-2",
        source: "WINTER",
      },
      hubId: "hub-999",
      userId: "mod-1",
      roleId: "role-mod-456",
      expectedVersion: 6,
    });

    expect(wireRequest).toBeDefined();
    expect(wireRequest?.hubId).toBe("hub-999");
    expect(wireRequest?.userId).toBe("mod-1");
    expect(wireRequest?.roleId).toBe("role-mod-456");
    expect(wireRequest?.expectedVersion).toBe(6);
    expect(response).toMatchObject({ staff: [] });
  });
});
