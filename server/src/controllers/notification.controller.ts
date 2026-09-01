import type { Response, NextFunction } from "express";
import * as notifService from "../services/notification.service.js";
import { ok, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const { rows, total } = await notifService.getNotifications(req.user!.userId, page, limit);
    paginated(res, rows, total, page, limit);
  } catch (err) { next(err); }
}

export async function markRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const updated = await notifService.markRead(Number(req.params.id), req.user!.userId);
    if (!updated) { fail(res, "Notification not found", 404); return; }
    ok(res, null, "Marked as read");
  } catch (err) { next(err); }
}

export async function markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await notifService.markAllRead(req.user!.userId);
    ok(res, null, "All notifications marked as read");
  } catch (err) { next(err); }
}
