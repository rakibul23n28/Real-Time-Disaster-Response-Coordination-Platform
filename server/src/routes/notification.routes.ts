import { Router } from "express";
import * as ctrl from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.get( "/",             ctrl.getNotifications);
router.patch("/read-all",    ctrl.markAllRead);
router.patch("/:id/read",    ctrl.markRead);

export default router;
