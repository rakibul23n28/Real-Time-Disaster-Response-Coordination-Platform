import { Router } from "express";
import * as ctrl from "../controllers/training.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createTrainingEventSchema, updateTrainingEnrollmentSchema } from "../validations/training.validation.js";

const router = Router();
router.use(authenticate);
router.get("/events", ctrl.getEvents);
router.post("/events", requireRole("admin"), validate(createTrainingEventSchema), ctrl.createEvent);
router.post("/events/:id/enroll", requireRole("volunteer"), ctrl.enroll);
router.post("/enrollments/:id/day-complete", requireRole("volunteer"), ctrl.completeDay);
router.get("/enrollments", requireRole("admin"), ctrl.getEnrollments);
router.patch("/enrollments/:id/status", requireRole("admin"), validate(updateTrainingEnrollmentSchema), ctrl.updateEnrollment);
export default router;