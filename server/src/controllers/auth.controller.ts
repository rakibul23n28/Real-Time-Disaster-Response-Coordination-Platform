import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { ok, created } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    created(res, result, "Registration successful");
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    ok(res, result, "Login successful");
  } catch (err) { next(err); }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    ok(res, user);
  } catch (err) { next(err); }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.updateMe(req.user!.userId, req.body);
    ok(res, user, "Profile updated successfully");
  } catch (err) { next(err); }
}

export function logout(_req: Request, res: Response) {
  ok(res, null, "Logged out successfully");
}
