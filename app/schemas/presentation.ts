import { z } from "zod";

const identifier = z.string().trim().min(1).max(128);
const viewStateValue = z.union([z.string().max(1024), z.array(z.string().max(256)).max(100), z.null()]);

export const favoriteInputSchema = z.object({
  resourceType: identifier,
  resourceId: identifier,
});

export const savedViewQuerySchema = z.object({ viewType: identifier });

export const savedViewInputSchema = z.object({
  viewType: identifier,
  name: identifier,
  state: z.record(z.string().regex(/^[A-Za-z][A-Za-z0-9_-]{0,63}$/), viewStateValue),
});
