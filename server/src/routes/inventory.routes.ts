import { Router } from "express";
import * as ctrl from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createInventorySchema, updateInventorySchema } from "../validations/inventory.validation.js";

const router = Router();
router.use(authenticate, requireRole("admin"));

router.get( "/",              ctrl.getInventory);
router.post("/",              validate(createInventorySchema), ctrl.createInventory);
router.patch("/:id",          validate(updateInventorySchema), ctrl.updateInventory);
router.get( "/transactions",  ctrl.getTransactions);

export default router;
