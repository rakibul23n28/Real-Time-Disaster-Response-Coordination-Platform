import type { Response, NextFunction } from "express";
import * as severityService from "../services/severity.service.js";
import { ok, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function createSeverity(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const assessment = await severityService.assessSeverity(Number(req.params.id), req.user!.userId, req.body);
    ok(res, assessment, "Severity assessment saved");
  } catch (err) { next(err); }
}

export async function getSeverity(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const assessment = await severityService.getSeverity(Number(req.params.id));
    if (!assessment) { fail(res, "No severity assessment found for this report", 404); return; }
    ok(res, assessment);
  } catch (err) { next(err); }
}
