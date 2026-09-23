import type { NextFunction, Response } from "express";
import * as trainingService from "../services/training.service.js";
import { created, ok } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function getEvents(req: AuthRequest, res: Response, next: NextFunction) {
  try { ok(res, await trainingService.listEvents(req.user.userId, req.user.role)); } catch (error) { next(error); }
}

export async function createEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try { created(res, await trainingService.createEvent(req.body, req.user.userId), "Training event created"); } catch (error) { next(error); }
}

export async function enroll(req: AuthRequest, res: Response, next: NextFunction) {
  try { created(res, await trainingService.enroll(Number(req.params.id), req.user.userId), "You are enrolled in this training event"); } catch (error) { next(error); }
}

export async function completeDay(req: AuthRequest, res: Response, next: NextFunction) {
  try { ok(res, await trainingService.completeNextDay(Number(req.params.id), req.user.userId), "Training day completed"); } catch (error) { next(error); }
}

export async function getEnrollments(_req: AuthRequest, res: Response, next: NextFunction) {
  try { ok(res, await trainingService.listEnrollments()); } catch (error) { next(error); }
}

export async function updateEnrollment(req: AuthRequest, res: Response, next: NextFunction) {
  try { ok(res, await trainingService.updateEnrollment(Number(req.params.id), req.body.status), "Training status updated"); } catch (error) { next(error); }
}