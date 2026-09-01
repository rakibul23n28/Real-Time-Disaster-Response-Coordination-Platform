import { pool } from "../config/database.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface CreateNotifParams {
  userId: number;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "alert";
  referenceType?: string;
  referenceId?: number;
}

export async function createNotification(conn: Awaited<ReturnType<typeof pool.getConnection>> | null, params: CreateNotifParams) {
  const db = conn ?? pool;
  await db.execute(
    `INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [params.userId, params.title, params.message, params.type ?? "info", params.referenceType ?? null, params.referenceId ?? null]
  );
}

export async function getNotifications(userId: number, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?`,
    [userId]
  );
  return { rows, total: (countResult[0] as { total: number }).total };
}

export async function markRead(id: number, userId: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
}

export async function markAllRead(userId: number) {
  await pool.execute(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
}

export async function notifyAdmins(conn: Awaited<ReturnType<typeof pool.getConnection>> | null, params: Omit<CreateNotifParams, "userId">) {
  const db = conn ?? pool;
  const [admins] = await db.execute<RowDataPacket[]>(
    `SELECT id FROM users WHERE role = 'admin'`
  );
  for (const admin of admins) {
    await createNotification(conn, { ...params, userId: (admin as { id: number }).id });
  }
}
