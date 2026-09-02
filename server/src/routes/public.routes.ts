import { Router } from "express";
import * as ctrl from "../controllers/public.controller.js";
import * as mapCtrl from "../controllers/map.controller.js";

const router = Router();

router.get("/landing", ctrl.getLandingSummary);
router.get("/incidents", mapCtrl.getPublicIncidents);

export default router;