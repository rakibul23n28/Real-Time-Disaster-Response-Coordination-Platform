import { z } from "zod";

const score = z.number().int().min(0).max(20);

export const createSeveritySchema = z.object({
  affected_people_score:   score,
  damage_score:            score,
  medical_emergency_score: score,
  road_access_score:       score,
  shelter_score:           score,
});

export type CreateSeverityInput = z.infer<typeof createSeveritySchema>;
