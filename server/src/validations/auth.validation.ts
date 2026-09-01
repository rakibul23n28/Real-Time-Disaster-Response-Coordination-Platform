import { z } from "zod";

export const registerSchema = z.object({
  name:  z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  password: z.string().min(6).max(100),
  role: z.enum(["citizen", "volunteer"]).default("citizen"),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;
