import { Router } from "express";
import * as ctrl from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema,
} from "../validations/task.validation.js";

const router = Router();
router.use(authenticate);

router.post("/",                requireRole("admin"),               validate(createTaskSchema),       ctrl.createTask);
router.get( "/",                requireRole("admin","volunteer"),                                     ctrl.getTasks);
router.get( "/:id",             requireRole("admin","volunteer"),                                     ctrl.getTask);
router.post("/:id/assign",      requireRole("admin"),               validate(assignTaskSchema),       ctrl.assignTask);
router.patch("/:id",            requireRole("admin"),               validate(updateTaskSchema),       ctrl.updateTask);
router.patch("/:id/status",     requireRole("admin","volunteer"),   validate(updateTaskStatusSchema), ctrl.updateTaskStatus);

export default router;
