import { Router } from "express";
import * as ctrl from "../controllers/report.controller.js";
import * as sevCtrl from "../controllers/severity.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { uploadImages } from "../middleware/upload.middleware.js";
import { createReportSchema, updateReportStatusSchema, reportFilterSchema } from "../validations/report.validation.js";
import { createSeveritySchema } from "../validations/severity.validation.js";

const router = Router();
router.use(authenticate);

router.post("/",                  requireRole("citizen"),         uploadImages, validate(createReportSchema), ctrl.createReport);
router.get( "/",                  validate(reportFilterSchema, "query"),        ctrl.getReports);
router.get( "/:id",                                                              ctrl.getReport);
router.patch("/:id",              requireRole("citizen","admin"),               ctrl.updateReportStatus); // citizens patch their own; handled in service
router.delete("/:id",             requireRole("citizen","admin"),               ctrl.deleteReport);
router.patch("/:id/status",       requireRole("admin"),          validate(updateReportStatusSchema), ctrl.updateReportStatus);

// Severity sub-resource
router.post("/:id/severity",      requireRole("admin"),          validate(createSeveritySchema), sevCtrl.createSeverity);
router.get( "/:id/severity",                                                     sevCtrl.getSeverity);

export default router;
