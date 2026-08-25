import { ORPCError } from "@orpc/server";
import {
  isCapabilityEnabled,
  type ControlCapability,
} from "~/services/capabilities.server";

/** Fail closed for routes whose end-to-end cutover is not complete. */
export function requireCapability(capability: ControlCapability): void {
  if (!isCapabilityEnabled(capability)) {
    throw new ORPCError("NOT_FOUND", {
      message: "This dashboard capability is not available.",
    });
  }
}
