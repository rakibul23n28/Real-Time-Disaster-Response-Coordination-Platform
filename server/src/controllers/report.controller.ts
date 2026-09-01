import type { Response, NextFunction } from "express";
import * as reportService from "../services/report.service.js";
import { ok, created, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";
import path from "path";

export async function createReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    //cheack image
    console.log("Uploaded files:", files.map(f => f.originalname));
    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    const report = await reportService.createReport(req.user!.userId, req.body, imageUrls);
    created(res, report, "Report submitted successfully");
  } catch (err) { next(err); }
}

export async function getReports(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = req.query as unknown as Parameters<typeof reportService.getReports>[0];
    // Citizens can only see their own reports
    const citizenId = req.user!.role === "citizen" ? req.user!.userId : undefined;
    const { reports, total } = await reportService.getReports(filters, citizenId);
    paginated(res, reports, total, filters.page, filters.limit);
  } catch (err) { next(err); }
}

export async function getReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const report = await reportService.getReportById(Number(req.params.id));
    if (!report) { fail(res, "Report not found", 404); return; }
    if (req.user!.role === "citizen" && (report as unknown as { citizen_id: number }).citizen_id !== req.user!.userId) {
      fail(res, "Forbidden", 403); return;
    }
    ok(res, report);
  } catch (err) { next(err); }
}

export async function updateReportStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const report = await reportService.updateReportStatus(Number(req.params.id), req.body);
    ok(res, report, "Report status updated");
  } catch (err) { next(err); }
}

export async function deleteReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await reportService.deleteReport(Number(req.params.id), req.user!.userId, req.user!.role === "admin");
    ok(res, null, "Report deleted");
  } catch (err) { next(err); }
}
