import type { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    fail(res, "Authentication required", 401);
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role as AuthRequest["user"]["role"] };
    next();
  } catch {
    fail(res, "Invalid or expired token", 401);
  }
}
