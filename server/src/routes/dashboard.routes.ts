import { Router } from "express";
import * as ctrl from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate);

router.get("/citizen",   requireRole("citizen"),   ctrl.citizenDashboard);
router.get("/volunteer", requireRole("volunteer"),  ctrl.volunteerDashboard);
router.get("/admin",     requireRole("admin"),      ctrl.adminDashboard);

export default router;
