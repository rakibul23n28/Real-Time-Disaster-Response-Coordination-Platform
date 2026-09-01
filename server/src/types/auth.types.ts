import type { Request } from "express";

export interface AuthUser {
  userId: number;
  role: "citizen" | "volunteer" | "admin";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
