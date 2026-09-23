import { z } from "zod";

export const createTrainingEventSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(2000),
  location: z.string().min(2).max(200),
  district: z.string().min(2).max(80),
  start_date: z.string().date(),
  end_date: z.string().date(),
  duration_days: z.number().int().min(1).max(30),
  capacity: z.number().int().min(1).max(1000),
}).superRefine((value, context) => {
  if (value.end_date < value.start_date) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["end_date"], message: "শেষ তারিখ শুরু তারিখের পরে হতে হবে" });
  }
});

export const updateTrainingEnrollmentSchema = z.object({
  status: z.enum(["registered", "in_progress", "completed"]),
});

export type CreateTrainingEventInput = z.infer<typeof createTrainingEventSchema>;