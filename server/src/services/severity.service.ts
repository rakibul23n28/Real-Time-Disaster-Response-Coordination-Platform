import { pool } from "../config/database.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateSeverityInput } from "../validations/severity.validation.js";

function calcLevel(total: number): "low" | "medium" | "high" | "critical" {
  if (total <= 30) return "low";
  if (total <= 60) return "medium";
  if (total <= 80) return "high";
  return "critical";
}

export async function assessSeverity(reportId: number, assessedBy: number, input: CreateSeverityInput) {
  const [reportRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM reports WHERE id = ?`, [reportId]
  );
  if (!reportRows[0]) throw Object.assign(new Error("Report not found"), { status: 404 });

  const total = input.affected_people_score + input.damage_score +
    input.medical_emergency_score + input.road_access_score + input.shelter_score;
  const level = calcLevel(total);

  // Upsert
  await pool.execute(
    `INSERT INTO severity_assessments
       (report_id, affected_people_score, damage_score, medical_emergency_score, road_access_score,
        shelter_score, total_score, severity_level, assessed_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       affected_people_score   = VALUES(affected_people_score),
       damage_score            = VALUES(damage_score),
       medical_emergency_score = VALUES(medical_emergency_score),
       road_access_score       = VALUES(road_access_score),
       shelter_score           = VALUES(shelter_score),
       total_score             = VALUES(total_score),
       severity_level          = VALUES(severity_level),
       assessed_by             = VALUES(assessed_by)`,
    [reportId, input.affected_people_score, input.damage_score,
     input.medical_emergency_score, input.road_access_score, input.shelter_score,
     total, level, assessedBy]
  );

  // Update the report's severity fields
  await pool.execute(
    `UPDATE reports SET severity = ?, severity_score = ? WHERE id = ?`,
    [level, total, reportId]
  );

  return getSeverity(reportId);
}

export async function getSeverity(reportId: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT sa.*, u.name AS assessor_name FROM severity_assessments sa
     JOIN users u ON u.id = sa.assessed_by
     WHERE sa.report_id = ?`,
    [reportId]
  );
  return rows[0] ?? null;
}
