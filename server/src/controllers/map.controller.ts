import type { Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { ok } from "../utils/response.js";
import type { AuthRequest } from "../types/auth.types.js";
import type { RowDataPacket } from "mysql2";

export async function getIncidents(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, report_code AS code, latitude, longitude, severity, status,
              location_name AS locationName, disaster_type AS disasterType, affected_people
       FROM reports
       WHERE status != 'rejected' AND latitude IS NOT NULL`
    );
    ok(res, rows);
  } catch (err) { next(err); }
}

export async function getPublicIncidents(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT r.id, r.report_code AS code, r.latitude, r.longitude, r.severity, r.status,
              r.location_name AS locationName, r.disaster_type AS disasterType,
              r.affected_people, COUNT(DISTINCT ta.volunteer_id) AS activeVolunteers
       FROM reports r
       LEFT JOIN tasks t ON t.report_id = r.id AND t.status != 'completed'
      LEFT JOIN task_assignments ta ON ta.task_id = t.id AND ta.status = 'accepted'
       WHERE r.status != 'rejected' AND r.latitude IS NOT NULL
       GROUP BY r.id, r.report_code, r.latitude, r.longitude, r.severity, r.status,
                r.location_name, r.disaster_type, r.affected_people`
    );
    ok(res, rows);
  } catch (err) { next(err); }
}

export async function getPublicVolunteerLocations(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT vl.volunteer_id, vl.task_id, vl.latitude, vl.longitude, vl.updated_at,
              u.name AS volunteer_name, l.name AS area_name, l.district
       FROM volunteer_locations vl
       JOIN users u ON u.id = vl.volunteer_id
       JOIN tasks t ON t.id = vl.task_id AND t.status != 'completed'
       LEFT JOIN locations l ON l.id = t.location_id
       JOIN task_assignments ta ON ta.task_id = vl.task_id AND ta.volunteer_id = vl.volunteer_id AND ta.status = 'accepted'
       WHERE vl.is_sharing = 1 AND vl.updated_at >= UTC_TIMESTAMP() - INTERVAL 15 MINUTE`,
    );
    ok(res, rows);
  } catch (err) { next(err); }
}

export async function getTaskLocations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.id, t.task_code AS code, l.latitude, l.longitude,
              t.status, t.priority, l.name AS locationName, l.district
       FROM tasks t
       JOIN locations l ON l.id = t.location_id
       WHERE t.location_id IS NOT NULL`
    );
    ok(res, rows);
  } catch (err) { next(err); }
}

export async function getIssueLocations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, issue_code AS code, latitude, longitude,
              status, issue_type AS issueType, location_name AS locationName
       FROM field_issues
       WHERE latitude IS NOT NULL AND status != 'resolved'`
    );
    ok(res, rows);
  } catch (err) { next(err); }
}
