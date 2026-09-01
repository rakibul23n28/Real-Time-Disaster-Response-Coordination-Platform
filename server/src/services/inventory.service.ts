import { pool } from "../config/database.js";
import { nextAllocationCode } from "../utils/id.js";
import { createNotification, notifyAdmins } from "./notification.service.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateInventoryInput, UpdateInventoryInput, CreateAllocationInput } from "../validations/inventory.validation.js";

export async function createInventory(input: CreateInventoryInput) {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO inventory (resource_id, quantity, depot_name, location_id) VALUES (?, ?, ?, ?)`,
    [input.resource_id, input.quantity, input.depot_name, input.location_id ?? null]
  );
  const inventoryId = result.insertId;

  // Record initial stock-addition transaction
  await pool.execute(
    `INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, created_by)
     VALUES (?, 'addition', ?, ?)`,
    [inventoryId, input.quantity, 1] // created_by will be overridden in controller
  );

  return getInventoryById(inventoryId);
}

export async function getInventory(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT i.*, r.name AS resource_name, r.category, r.unit, l.name AS location_name
     FROM inventory i
     JOIN resources r ON r.id = i.resource_id
     LEFT JOIN locations l ON l.id = i.location_id
     ORDER BY r.category, r.name LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM inventory`);
  return { inventory: rows, total: (countResult[0] as { total: number }).total };
}

export async function getInventoryById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT i.*, r.name AS resource_name, r.category, r.unit
     FROM inventory i JOIN resources r ON r.id = i.resource_id WHERE i.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateInventory(id: number, input: UpdateInventoryInput, adminId: number) {
  const [existing] = await pool.execute<RowDataPacket[]>(`SELECT * FROM inventory WHERE id = ?`, [id]);
  if (!existing[0]) throw Object.assign(new Error("Inventory item not found"), { status: 404 });

  const current = existing[0] as { quantity: number };
  const sets: string[] = [];
  const params: (string | number | null)[] = [];

  if (input.quantity !== undefined) {
    sets.push("quantity = ?");
    params.push(input.quantity);

    const diff = input.quantity - current.quantity;
    await pool.execute(
      `INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, created_by)
       VALUES (?, 'adjustment', ?, ?)`,
      [id, diff, adminId]
    );
  }
  if (input.depot_name  !== undefined) { sets.push("depot_name = ?");  params.push(input.depot_name); }
  if (input.location_id !== undefined) { sets.push("location_id = ?"); params.push(input.location_id); }

  if (sets.length > 0) {
    params.push(id);
    await pool.execute(`UPDATE inventory SET ${sets.join(", ")} WHERE id = ?`, params);
  }
  return getInventoryById(id);
}

export async function getTransactions(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT it.*, r.name AS resource_name, u.name AS created_by_name
     FROM inventory_transactions it
     JOIN inventory i ON i.id = it.inventory_id
     JOIN resources r ON r.id = i.resource_id
     JOIN users u ON u.id = it.created_by
     ORDER BY it.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM inventory_transactions`);
  return { transactions: rows, total: (countResult[0] as { total: number }).total };
}

export async function allocateResource(adminId: number, input: CreateAllocationInput) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Find inventory for this resource (take first available depot with stock)
    const [invRows] = await conn.execute<RowDataPacket[]>(
      `SELECT id, quantity FROM inventory WHERE resource_id = ? AND quantity >= ? LIMIT 1 FOR UPDATE`,
      [input.resource_id, input.quantity]
    );
    if (!invRows[0]) {
      throw Object.assign(new Error("Insufficient inventory for this resource"), { status: 400 });
    }
    const inv = invRows[0] as { id: number; quantity: number };

    // Deduct inventory
    await conn.execute(
      `UPDATE inventory SET quantity = quantity - ? WHERE id = ?`,
      [input.quantity, inv.id]
    );

    // Create allocation record
    const code = await nextAllocationCode();
    const [allocResult] = await conn.execute<ResultSetHeader>(
      `INSERT INTO resource_allocations (allocation_code, report_id, resource_id, quantity, allocated_by)
       VALUES (?, ?, ?, ?, ?)`,
      [code, input.report_id ?? null, input.resource_id, input.quantity, adminId]
    );
    const allocId = allocResult.insertId;

    // Record transaction
    await conn.execute(
      `INSERT INTO inventory_transactions (inventory_id, transaction_type, quantity, reference_type, reference_id, created_by)
       VALUES (?, 'allocation', ?, 'resource_allocation', ?, ?)`,
      [inv.id, -input.quantity, allocId, adminId]
    );

    // Notify admin team
    const [resRows] = await conn.execute<RowDataPacket[]>(`SELECT name FROM resources WHERE id = ?`, [input.resource_id]);
    const resName = (resRows[0] as { name: string } | undefined)?.name ?? "সম্পদ";
    await notifyAdmins(conn, {
      title: "সম্পদ বরাদ্দ",
      message: `${input.quantity} ${resName} বরাদ্দ করা হয়েছে (${code})`,
      type: "info",
      referenceType: "allocation",
      referenceId: allocId,
    });

    await conn.commit();
    return { id: allocId, allocation_code: code };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getAllocations(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ra.*, r.name AS resource_name, r.unit, u.name AS allocated_by_name
     FROM resource_allocations ra
     JOIN resources r ON r.id = ra.resource_id
     JOIN users u ON u.id = ra.allocated_by
     ORDER BY ra.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM resource_allocations`);
  return { allocations: rows, total: (countResult[0] as { total: number }).total };
}

export async function getAllocationById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ra.*, r.name AS resource_name, r.unit, u.name AS allocated_by_name
     FROM resource_allocations ra
     JOIN resources r ON r.id = ra.resource_id
     JOIN users u ON u.id = ra.allocated_by
     WHERE ra.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}
