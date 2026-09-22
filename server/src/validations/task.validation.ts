import { z } from "zod";

export const createTaskSchema = z.object({
  report_id:    z.number().int().positive().optional(),
  title:        z.string().min(5).max(250),
  description:  z.string().min(5),
  instructions: z.string().optional(),
  priority:     z.enum(["low", "medium", "high", "critical"]).default("medium"),
  location_id:  z.number().int().positive().optional(),
});

export const updateTaskSchema = z.object({
  title:        z.string().min(5).max(250).optional(),
  description:  z.string().min(5).optional(),
  instructions: z.string().optional(),
  priority:     z.enum(["low", "medium", "high", "critical"]).optional(),
  progress:     z.number().int().min(0).max(100).optional(),
});

export const updateTaskStatusSchema = z.object({
  status:   z.enum(["assigned", "en_route", "in_progress", "completed"]),
  progress: z.number().int().min(0).max(100).optional(),
});

export const assignTaskSchema = z.object({
  volunteer_id: z.number().int().positive(),
});

export const declineAssignmentSchema = z.object({
  reason: z.string().min(3).max(500),
});

export const volunteerLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  is_sharing: z.boolean().default(true),
});

export type CreateTaskInput      = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput      = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type AssignTaskInput      = z.infer<typeof assignTaskSchema>;
export type DeclineAssignmentInput = z.infer<typeof declineAssignmentSchema>;
export type VolunteerLocationInput = z.infer<typeof volunteerLocationSchema>;
