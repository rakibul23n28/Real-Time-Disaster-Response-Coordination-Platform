import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login",    validate(loginSchema),    ctrl.login);
router.get( "/me",       authenticate,             ctrl.me);
router.post("/logout",   authenticate,             ctrl.logout);

export default router;
