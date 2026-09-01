import { z } from "zod";

const disasterTypes = ["বন্যা", "ঘূর্ণিঝড়", "নদীভাঙন", "জলাবদ্ধতা", "ভূমিধস", "অন্যান্য"] as const;

export const createReportSchema = z.object({
  disaster_type:   z.enum(disasterTypes),
  title:           z.string().min(5).max(250),
  description:     z.string().min(10),
  affected_people: z.coerce.number().int().min(0).default(0),
  district:        z.string().max(100),
  latitude:        z.coerce.number().min(-90).max(90),
  longitude:       z.coerce.number().min(-180).max(180),
  location_name:   z.string().min(2).max(200),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(["pending", "verified", "rejected", "in_progress", "completed"]),
});

export const reportFilterSchema = z.object({
  status:       z.enum(["pending", "verified", "rejected", "in_progress", "completed"]).optional(),
  severity:     z.enum(["unassessed", "low", "medium", "high", "critical"]).optional(),
  disasterType: z.enum(disasterTypes).optional(),
  search:       z.string().optional(),
  page:         z.coerce.number().int().min(1).default(1),
  limit:        z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateReportInput       = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
export type ReportFilterInput       = z.infer<typeof reportFilterSchema>;
