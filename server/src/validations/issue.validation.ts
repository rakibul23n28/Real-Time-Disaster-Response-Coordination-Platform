import { z } from "zod";

export const createIssueSchema = z.object({
  task_id:       z.number().int().positive().optional(),
  report_id:     z.number().int().positive().optional(),
  issue_type:    z.enum(["road_blocked", "extra_relief", "medical", "boat_needed", "more_volunteers", "other"]),
  description:   z.string().min(5),
  location_name: z.string().max(200).optional(),
  latitude:      z.number().min(-90).max(90).optional(),
  longitude:     z.number().min(-180).max(180).optional(),
});

export const updateIssueStatusSchema = z.object({
  status: z.enum(["reported", "in_progress", "resolved"]),
});

export type CreateIssueInput      = z.infer<typeof createIssueSchema>;
export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusSchema>;
