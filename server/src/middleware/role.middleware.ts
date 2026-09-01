import type { Response, NextFunction } from "express";
import { fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      fail(res, "You do not have permission to perform this action", 403);
      return;
    }
    next();
  };
}
