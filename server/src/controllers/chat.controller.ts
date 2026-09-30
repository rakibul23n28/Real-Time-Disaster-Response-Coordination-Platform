import type { Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";
import type { AuthRequest } from "../types/auth.types.js";
import { created, fail, ok } from "../utils/response.js";

export async function getMessages(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT recent.id, recent.sender_id, recent.sender_name, recent.sender_role,
              recent.message, recent.created_at
       FROM (
         SELECT m.id, m.sender_id, u.name AS sender_name, u.role AS sender_role,
                m.message, m.created_at
         FROM chat_messages m
         JOIN users u ON u.id = m.sender_id
         ORDER BY m.id DESC
         LIMIT 100
       ) recent
       ORDER BY recent.id ASC`
    );
    ok(res, rows);
  } catch (err) { next(err); }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    fail(res, "Message cannot be empty");
    return;
  }
  if (message.length > 1000) {
    fail(res, "Message must be 1000 characters or fewer");
    return;
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO chat_messages (sender_id, message) VALUES (?, ?)",
      [req.user!.userId, message]
    );
    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.id, m.sender_id, u.name AS sender_name, u.role AS sender_role,
              m.message, m.created_at
       FROM chat_messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.id = ?`,
      [insertId]
    );
    created(res, rows[0]);
  } catch (err) { next(err); }
}