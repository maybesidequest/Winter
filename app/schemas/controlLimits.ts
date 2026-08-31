import { z } from "zod";

export const CONTROL_ID_MAX = 128;
export const CONTROL_CURSOR_MAX = 1_024;
export const CONTROL_IDEMPOTENCY_KEY_MAX = 128;
export const CONTROL_URL_MAX = 512;

export const controlIdSchema = z.string().trim().min(1).max(CONTROL_ID_MAX);
export const controlCursorSchema = z.string().max(CONTROL_CURSOR_MAX);
export const idempotencyKeySchema = z.string().trim().min(1, "A retry key is required.").max(CONTROL_IDEMPOTENCY_KEY_MAX);

export const optionalHttpUrlSchema = z.string()
  .max(CONTROL_URL_MAX)
  .refine((value) => {
    if (value === "") return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be a valid HTTP or HTTPS URL");
