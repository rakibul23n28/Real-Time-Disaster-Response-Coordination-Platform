import { Router } from "express";
import * as ctrl from "../controllers/issue.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import multer from "multer";
import path from "path";
import { createIssueSchema, updateIssueStatusSchema } from "../validations/issue.validation.js";
import { env } from "../config/env.js";

const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: { fileSize: env.maxFileSize },
}).single("image");

const router = Router();
router.use(authenticate);

router.post("/",           requireRole("volunteer"),          upload, validate(createIssueSchema),       ctrl.createIssue);
router.get( "/",           requireRole("admin","volunteer"),                                              ctrl.getIssues);
router.get( "/:id",        requireRole("admin","volunteer"),                                              ctrl.getIssue);
router.patch("/:id/status",requireRole("admin"),              validate(updateIssueStatusSchema),          ctrl.updateIssueStatus);

export default router;
