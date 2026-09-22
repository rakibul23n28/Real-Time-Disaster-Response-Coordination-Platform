import { Router } from "express";
import * as ctrl from "../controllers/donation.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { createDonationSchema } from "../validations/donation.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/places", ctrl.getPlaces);
router.get("/log", ctrl.getLog);
router.post("/", validate(createDonationSchema), ctrl.create);
router.get("/pending", authenticate, requireRole("admin"), ctrl.getPending);
router.patch("/:id/confirm", authenticate, requireRole("admin"), ctrl.confirm);

export default router;
