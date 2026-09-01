import { Router } from "express";
import * as ctrl from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createAllocationSchema } from "../validations/inventory.validation.js";

const router = Router();
router.use(authenticate, requireRole("admin"));

router.post("/",     validate(createAllocationSchema), ctrl.allocate);
router.get( "/",     ctrl.getAllocations);
router.get( "/:id",  ctrl.getAllocation);

export default router;
