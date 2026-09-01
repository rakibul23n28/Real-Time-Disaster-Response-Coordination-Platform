import { Router } from "express";
import * as ctrl from "../controllers/resource.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createResourceSchema, updateResourceSchema } from "../validations/resource.validation.js";

const router = Router();
router.use(authenticate);

router.get( "/",     ctrl.getResources);
router.post("/",     requireRole("admin"), validate(createResourceSchema), ctrl.createResource);
router.patch("/:id", requireRole("admin"), validate(updateResourceSchema), ctrl.updateResource);

export default router;
