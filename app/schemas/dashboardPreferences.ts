import { z } from "zod";

export type DashboardPreferenceValue = null | boolean | number | string | DashboardPreferenceValue[] | {
  [key: string]: DashboardPreferenceValue;
};
export type DashboardPreference = Record<string, DashboardPreferenceValue>;

const MAX_DEPTH = 5;
const MAX_NODES = 100;
const MAX_ARRAY_ITEMS = 50;
const MAX_STRING_LENGTH = 512;
export const MAX_DASHBOARD_PREFERENCE_BYTES = 8 * 1024;

function validateValue(value: unknown, depth: number, state: { nodes: number }): string | null {
  state.nodes += 1;
  if (state.nodes > MAX_NODES) return `Preferences may contain at most ${MAX_NODES} values.`;
  if (depth > MAX_DEPTH) return `Preferences may be nested at most ${MAX_DEPTH} levels.`;
  if (value === null || typeof value === "boolean") return null;
  if (typeof value === "number") return Number.isFinite(value) ? null : "Preference numbers must be finite.";
  if (typeof value === "string") return value.length <= MAX_STRING_LENGTH ? null : `Preference strings may contain at most ${MAX_STRING_LENGTH} characters.`;
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) return `Preference arrays may contain at most ${MAX_ARRAY_ITEMS} items.`;
    for (const child of value) {
      const error = validateValue(child, depth + 1, state);
      if (error) return error;
    }
    return null;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key.length > 64) return "Preference keys may contain at most 64 characters.";
      const error = validateValue(child, depth + 1, state);
      if (error) return error;
    }
    return null;
  }
  return "Preferences must contain JSON values only.";
}

export const boundedDashboardPreferenceSchema = z.record(z.string().max(64), z.unknown()).superRefine((value, context) => {
  const validationError = validateValue(value, 0, { nodes: 0 });
  if (validationError) context.addIssue({ code: "custom", message: validationError });
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > MAX_DASHBOARD_PREFERENCE_BYTES) {
    context.addIssue({ code: "custom", message: `Preferences may contain at most ${MAX_DASHBOARD_PREFERENCE_BYTES} encoded bytes.` });
  }
}).transform((value) => value as DashboardPreference);
