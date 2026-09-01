import { Router } from "express";
import * as ctrl from "../controllers/map.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.get("/incidents", ctrl.getIncidents);
router.get("/tasks",     ctrl.getTaskLocations);
router.get("/issues",    ctrl.getIssueLocations);

export default router;
