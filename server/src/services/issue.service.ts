import { pool } from "../config/database.js";
import { nextIssueCode } from "../utils/id.js";
import { notifyAdmins } from "./notification.service.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateIssueInput, UpdateIssueStatusInput } from "../validations/issue.validation.js";

export async function createIssue(reportedBy: number, input: CreateIssueInput, imageUrl?: string) {
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

export async function getIssues(page: number, limit: number, reportedBy?: number) {
  const offset = (page - 1) * limit;
  const where  = reportedBy !== undefined ? "WHERE fi.reported_by = ?" : "";
  const params = reportedBy !== undefined ? [reportedBy, limit, offset] : [limit, offset];

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT fi.*, u.name AS reporter_name
     FROM field_issues fi
     JOIN users u ON u.id = fi.reported_by
     ${where}
     ORDER BY fi.created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  const countParams = reportedBy !== undefined ? [reportedBy] : [];
  const [countResult] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM field_issues fi ${where}`,
    countParams
  );

  return { issues: rows, total: (countResult[0] as { total: number }).total };
}

export async function getIssueById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT fi.*, u.name AS reporter_name
     FROM field_issues fi
     JOIN users u ON u.id = fi.reported_by
     WHERE fi.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateIssueStatus(id: number, input: UpdateIssueStatusInput) {
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT id FROM field_issues WHERE id = ?`, [id]);
  if (!rows[0]) throw Object.assign(new Error("Issue not found"), { status: 404 });

  await pool.execute(`UPDATE field_issues SET status = ? WHERE id = ?`, [input.status, id]);
  return getIssueById(id);
}
