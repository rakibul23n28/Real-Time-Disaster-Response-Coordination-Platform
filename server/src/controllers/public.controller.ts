import type { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { ok } from "../utils/response.js";
import type { RowDataPacket } from "mysql2";

export async function getLandingSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const [reportStats] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalReports,
              SUM(status = 'verified') AS verifiedIncidents,
              COUNT(DISTINCT CASE
                WHEN status IN ('pending', 'verified', 'in_progress') THEN district
              END) AS activeZones
       FROM reports
       WHERE status != 'rejected'`
    );
    const [volunteerStats] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS activeVolunteers FROM users WHERE role = 'volunteer'`
    );

    ok(res, {
      stats: {
        totalReports: Number(reportStats[0]?.totalReports ?? 0),
        verifiedIncidents: Number(reportStats[0]?.verifiedIncidents ?? 0),
        activeVolunteers: Number(volunteerStats[0]?.activeVolunteers ?? 0),
        activeZones: Number(reportStats[0]?.activeZones ?? 0),
      },
    });
  } catch (err) { next(err); }
}