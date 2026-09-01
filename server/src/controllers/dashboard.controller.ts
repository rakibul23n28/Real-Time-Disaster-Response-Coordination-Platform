import type { Response, NextFunction } from "express";
import * as dashService from "../services/dashboard.service.js";
import { ok } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function citizenDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await dashService.getCitizenDashboard(req.user!.userId);
    ok(res, data);
  } catch (err) { next(err); }
}

export async function volunteerDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await dashService.getVolunteerDashboard(req.user!.userId);
    ok(res, data);
  } catch (err) { next(err); }
}

export async function adminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await dashService.getAdminDashboard();
    ok(res, data);
  } catch (err) { next(err); }
}
