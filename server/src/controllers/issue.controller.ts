import type { Response, NextFunction } from "express";
import * as issueService from "../services/issue.service.js";
import { ok, created, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function createIssue(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = (req.file as Express.Multer.File | undefined);
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const issue = await issueService.createIssue(req.user!.userId, req.body, imageUrl);
    created(res, issue, "Field issue reported");
  } catch (err) { next(err); }
}

export async function getIssues(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const reportedBy = req.user!.role === "volunteer" ? req.user!.userId : undefined;
    const { issues, total } = await issueService.getIssues(page, limit, reportedBy);
    paginated(res, issues, total, page, limit);
  } catch (err) { next(err); }
}

export async function getIssue(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const issue = await issueService.getIssueById(Number(req.params.id));
    if (!issue) { fail(res, "Issue not found", 404); return; }
    ok(res, issue);
  } catch (err) { next(err); }
}

export async function updateIssueStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const issue = await issueService.updateIssueStatus(Number(req.params.id), req.body);
    ok(res, issue, "Issue status updated");
  } catch (err) { next(err); }
}
