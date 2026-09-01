import { z } from "zod";

export const createResourceSchema = z.object({
  name:        z.string().min(2).max(120),
  category:    z.enum(["food", "water", "medical", "other"]),
  unit:        z.string().min(1).max(40),
  description: z.string().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
