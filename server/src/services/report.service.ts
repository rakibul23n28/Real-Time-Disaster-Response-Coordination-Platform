import { pool } from "../config/database.js";
import { nextReportCode } from "../utils/id.js";
import { notifyAdmins, createNotification } from "./notification.service.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateReportInput, UpdateReportStatusInput, ReportFilterInput } from "../validations/report.validation.js";

interface ReportRow extends RowDataPacket {
  id: number;
  report_code: string;
  citizen_id: number;
  reporter_name: string;
}

export async function createReport(citizenId: number, input: CreateReportInput, imageUrls: string[]) {
  const code = await nextReportCode();

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO reports
       (report_code, citizen_id, disaster_type, title, description, affected_people,district, latitude, longitude, location_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [code, citizenId, input.disaster_type, input.title, input.description,
     input.affected_people, input.district, input.latitude, input.longitude, input.location_name]
  );
  const reportId = result.insertId;

  for (const url of imageUrls) {
    await pool.execute(`INSERT INTO report_images (report_id, image_url) VALUES (?, ?)`, [reportId, url]);
  }

  // Notify all admins
  await notifyAdmins(null, {
    title: "নতুন রিপোর্ট",
    message: `নতুন দুর্যোগ রিপোর্ট দাখিল হয়েছে: ${input.title}`,
    type: "info",
    referenceType: "report",
    referenceId: reportId,
  });

  return getReportById(reportId);
}

export async function getReports(filters: ReportFilterInput, citizenId?: number) {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (citizenId !== undefined) {
    conditions.push("r.citizen_id = ?");
    params.push(citizenId);
  }
  if (filters.status) {
    conditions.push("r.status = ?");
    params.push(filters.status);
  }
  if (filters.severity) {
    conditions.push("r.severity = ?");
    params.push(filters.severity);
  }
  if (filters.disasterType) {
    conditions.push("r.disaster_type = ?");
    params.push(filters.disasterType);
  }
  if (filters.search) {
    conditions.push("(r.title LIKE ? OR r.description LIKE ? OR r.location_name LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (filters.page - 1) * filters.limit;

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT r.*, u.name AS reporter_name,
            (SELECT GROUP_CONCAT(image_url) FROM report_images WHERE report_id = r.id) AS images
     FROM reports r
     JOIN users u ON u.id = r.citizen_id
     ${where}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, filters.limit, offset]
  );

  const [countResult] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM reports r ${where}`,
    params
  );

  const reports = rows.map((r) => ({
    ...r,
    images: r.images ? (r.images as string).split(",") : [],
  }));

  return { reports, total: (countResult[0] as { total: number }).total };
}

export async function getReportById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT r.*, u.name AS reporter_name, u.email AS reporter_email
     FROM reports r
     JOIN users u ON u.id = r.citizen_id
     WHERE r.id = ?`,
    [id]
  );
  if (!rows[0]) return null;

  const [images] = await pool.execute<RowDataPacket[]>(
    `SELECT id, image_url, created_at FROM report_images WHERE report_id = ?`,
    [id]
  );
  return { ...rows[0], images };
}

export async function updateReportStatus(id: number, input: UpdateReportStatusInput) {
  const [existing] = await pool.execute<ReportRow[]>(
    `SELECT id, citizen_id, title FROM reports WHERE id = ?`, [id]
  );
  if (!existing[0]) throw Object.assign(new Error("Report not found"), { status: 404 });

  await pool.execute(`UPDATE reports SET status = ? WHERE id = ?`, [input.status, id]);

  // Notify the citizen
  if (input.status === "verified" || input.status === "rejected") {
    const msg = input.status === "verified"
      ? `আপনার রিপোর্ট "${existing[0].title}" যাচাই হয়েছে`
      : `আপনার রিপোর্ট "${existing[0].title}" প্রত্যাখ্যাত হয়েছে`;
    await createNotification(null, {
      userId: existing[0].citizen_id,
      title: input.status === "verified" ? "রিপোর্ট যাচাই হয়েছে" : "রিপোর্ট প্রত্যাখ্যাত",
      message: msg,
      type: input.status === "verified" ? "success" : "warning",
      referenceType: "report",
      referenceId: id,
    });
  }

  return getReportById(id);
}

export async function deleteReport(id: number, citizenId: number, isAdmin: boolean) {
  const [rows] = await pool.execute<ReportRow[]>(
    `SELECT id, citizen_id FROM reports WHERE id = ?`, [id]
  );
  if (!rows[0]) throw Object.assign(new Error("Report not found"), { status: 404 });
  if (!isAdmin && rows[0].citizen_id !== citizenId) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
  await pool.execute(`DELETE FROM reports WHERE id = ?`, [id]);
}
