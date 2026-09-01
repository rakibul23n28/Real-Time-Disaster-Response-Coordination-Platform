import { z } from "zod";

export const createInventorySchema = z.object({
  resource_id: z.number().int().positive(),
  quantity:    z.number().int().min(0),
  depot_name:  z.string().min(2).max(200),
  location_id: z.number().int().positive().optional(),
});

export const updateInventorySchema = z.object({
  quantity:    z.number().int().min(0).optional(),
  depot_name:  z.string().min(2).max(200).optional(),
  location_id: z.number().int().positive().nullable().optional(),
});

export const createAllocationSchema = z.object({
  report_id:   z.number().int().positive().optional(),
  resource_id: z.number().int().positive(),
  quantity:    z.number().int().min(1),
});

export type CreateInventoryInput  = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput  = z.infer<typeof updateInventorySchema>;
export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;
