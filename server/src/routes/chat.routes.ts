import { Router } from "express";
import * as ctrl from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, requireRole("admin", "volunteer"));

router.get("/messages", ctrl.getMessages);
router.post("/messages", ctrl.sendMessage);

export default router;