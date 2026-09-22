import { pool } from "../config/database.js";
import { nextIssueCode } from "../utils/id.js";
import { notifyAdmins } from "./notification.service.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateIssueInput, UpdateIssueStatusInput } from "../validations/issue.validation.js";

export async function createIssue(reportedBy: number, input: CreateIssueInput, imageUrl?: string) {
  if (!input.task_id) throw Object.assign(new Error("কাজের এলাকা নির্বাচন করুন"), { status: 400 });
  const [assignment] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM task_assignments WHERE task_id = ? AND volunteer_id = ? AND status = 'accepted'`,
    [input.task_id, reportedBy],
  );
  if (!assignment[0]) throw Object.assign(new Error("শুধু গ্রহণ করা কাজের এলাকায় সমস্যা জানানো যাবে"), { status: 403 });
  const code = await nextIssueCode();

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO field_issues
       (issue_code, reported_by, task_id, report_id, issue_type, description, location_name, latitude, longitude, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [code, reportedBy, input.task_id ?? null, input.report_id ?? null, input.issue_type,
     input.description, input.location_name ?? null, input.latitude ?? null,
     input.longitude ?? null, imageUrl ?? null]
  );
  const issueId = result.insertId;

  await notifyAdmins(null, {
    title: "মাঠ সমস্যা রিপোর্ট",
    message: `নতুন মাঠ সমস্যা: ${input.issue_type} — ${input.description.slice(0, 80)}`,
    type: "alert",
    referenceType: "issue",
    referenceId: issueId,
  });

  return getIssueById(issueId);
}

export async function getIssues(page: number, limit: number, volunteerId?: number) {
  const offset = (page - 1) * limit;
  const where = volunteerId !== undefined
    ? "WHERE ta.volunteer_id = ? AND ta.status = 'accepted' AND t.status != 'completed'"
    : "";
  const params = volunteerId !== undefined ? [volunteerId, limit, offset] : [limit, offset];

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT fi.*, u.name AS reporter_name, t.title AS task_title, l.name AS area_name
     FROM field_issues fi
     JOIN users u ON u.id = fi.reported_by
     LEFT JOIN tasks t ON t.id = fi.task_id
     LEFT JOIN locations l ON l.id = t.location_id
     ${volunteerId !== undefined ? "JOIN task_assignments ta ON ta.task_id = fi.task_id" : ""}
     ${where}
     ORDER BY fi.created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  const countParams = volunteerId !== undefined ? [volunteerId] : [];
  const [countResult] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM field_issues fi
     ${volunteerId !== undefined ? "JOIN tasks t ON t.id = fi.task_id JOIN task_assignments ta ON ta.task_id = fi.task_id" : ""}
     ${where}`,
    countParams
  );

  return { issues: rows, total: (countResult[0] as { total: number }).total };
}

export async function getIssueById(id: number, volunteerId?: number) {
  const accessJoin = volunteerId !== undefined
    ? "JOIN task_assignments ta ON ta.task_id = fi.task_id AND ta.volunteer_id = ? AND ta.status = 'accepted' JOIN tasks access_task ON access_task.id = fi.task_id AND access_task.status != 'completed'"
    : "";
  const params = volunteerId !== undefined ? [volunteerId, id] : [id];
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT fi.*, u.name AS reporter_name, t.title AS task_title, l.name AS area_name
     FROM field_issues fi
     JOIN users u ON u.id = fi.reported_by
     LEFT JOIN tasks t ON t.id = fi.task_id
     LEFT JOIN locations l ON l.id = t.location_id
     ${accessJoin}
     WHERE fi.id = ?`,
    params
  );
  return rows[0] ?? null;
}

export async function updateIssueStatus(id: number, userId: number, isAdmin: boolean, input: UpdateIssueStatusInput) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT fi.id FROM field_issues fi
     ${isAdmin ? "" : "JOIN task_assignments ta ON ta.task_id = fi.task_id AND ta.volunteer_id = ? AND ta.status = 'accepted'"}
     WHERE fi.id = ? ${isAdmin ? "" : "AND EXISTS (SELECT 1 FROM tasks t WHERE t.id = fi.task_id AND t.status != 'completed')"}`,
    isAdmin ? [id] : [userId, id],
  );
  if (!rows[0]) throw Object.assign(new Error("Issue not found"), { status: 404 });

  await pool.execute(`UPDATE field_issues SET status = ? WHERE id = ?`, [input.status, id]);
  return getIssueById(id);
}
