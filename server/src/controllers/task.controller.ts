import type { Response, NextFunction } from "express";
import * as taskService from "../services/task.service.js";
import { ok, created, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.createTask(req.user!.userId, req.body);
    created(res, task, "Task created");
  } catch (err) { next(err); }
}

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const volunteerId = req.user!.role === "volunteer" ? req.user!.userId : undefined;
    const { tasks, total } = await taskService.getTasks(page, limit, volunteerId);
    paginated(res, tasks, total, page, limit);
  } catch (err) { next(err); }
}

export async function getTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    if (!task) { fail(res, "Task not found", 404); return; }
    ok(res, task);
  } catch (err) { next(err); }
}

export async function assignTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.assignTask(Number(req.params.id), req.user!.userId, req.body);
    ok(res, task, "Volunteer assigned to task");
  } catch (err) { next(err); }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    ok(res, task, "Task updated");
  } catch (err) { next(err); }
}

export async function updateTaskStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTaskStatus(
      Number(req.params.id), req.user!.userId, req.user!.role === "admin", req.body
    );
    ok(res, task, "Task status updated");
  } catch (err) { next(err); }
}
