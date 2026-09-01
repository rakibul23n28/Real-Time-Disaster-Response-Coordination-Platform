import type { Response, NextFunction } from "express";
import * as resourceService from "../services/resource.service.js";
import { ok, created, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function createResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const resource = await resourceService.createResource(req.body);
    created(res, resource, "Resource created");
  } catch (err) { next(err); }
}

export async function getResources(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const { resources, total } = await resourceService.getResources(page, limit);
    paginated(res, resources, total, page, limit);
  } catch (err) { next(err); }
}

export async function updateResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const resource = await resourceService.updateResource(Number(req.params.id), req.body);
    if (!resource) { fail(res, "Resource not found", 404); return; }
    ok(res, resource, "Resource updated");
  } catch (err) { next(err); }
}
