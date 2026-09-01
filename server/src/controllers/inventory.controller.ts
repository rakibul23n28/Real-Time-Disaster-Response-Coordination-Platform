import type { Response, NextFunction } from "express";
import * as inventoryService from "../services/inventory.service.js";
import { ok, created, paginated, fail } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";

export async function createInventory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await inventoryService.createInventory(req.body);
    created(res, item, "Inventory item created");
  } catch (err) { next(err); }
}

export async function getInventory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const { inventory, total } = await inventoryService.getInventory(page, limit);
    paginated(res, inventory, total, page, limit);
  } catch (err) { next(err); }
}

export async function updateInventory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await inventoryService.updateInventory(Number(req.params.id), req.body, req.user!.userId);
    if (!item) { fail(res, "Inventory item not found", 404); return; }
    ok(res, item, "Inventory updated");
  } catch (err) { next(err); }
}

export async function getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const { transactions, total } = await inventoryService.getTransactions(page, limit);
    paginated(res, transactions, total, page, limit);
  } catch (err) { next(err); }
}

export async function allocate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await inventoryService.allocateResource(req.user!.userId, req.body);
    created(res, result, "Resource allocated successfully");
  } catch (err) { next(err); }
}

export async function getAllocations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page  = Number(req.query.page  ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const { allocations, total } = await inventoryService.getAllocations(page, limit);
    paginated(res, allocations, total, page, limit);
  } catch (err) { next(err); }
}

export async function getAllocation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const allocation = await inventoryService.getAllocationById(Number(req.params.id));
    if (!allocation) { fail(res, "Allocation not found", 404); return; }
    ok(res, allocation);
  } catch (err) { next(err); }
}
