import { pool } from "../config/database.js";
import type { RowDataPacket } from "mysql2";

export async function getCitizenDashboard(citizenId: number) {
  const [counts] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'pending')     AS pending,
       SUM(status = 'verified')    AS verified,
       SUM(status = 'in_progress') AS in_progress,
       SUM(status = 'completed')   AS completed,
       SUM(status = 'rejected')    AS rejected
     FROM reports WHERE citizen_id = ?`,
    [citizenId]
  );

  const [recentReports] = await pool.execute<RowDataPacket[]>(
    `SELECT id, report_code, title, status, severity, disaster_type, location_name, created_at
     FROM reports WHERE citizen_id = ?
     ORDER BY created_at DESC LIMIT 5`,
    [citizenId]
  );

  const [unreadNotifs] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`,
    [citizenId]
  );

  return {
    stats: counts[0],
    recent_reports: recentReports,
    unread_notifications: (unreadNotifs[0] as { count: number }).count,
  };
}

export async function getVolunteerDashboard(volunteerId: number) {
  const [taskCounts] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(t.status = 'assigned')    AS assigned,
       SUM(t.status = 'en_route')    AS en_route,
       SUM(t.status = 'in_progress') AS in_progress,
       SUM(t.status = 'completed')   AS completed
     FROM tasks t
     JOIN task_assignments ta ON ta.task_id = t.id
     WHERE ta.volunteer_id = ?`,
    [volunteerId]
  );

  const [activeTasks] = await pool.execute<RowDataPacket[]>(
    `SELECT t.id, t.task_code, t.title, t.priority, t.status, t.progress,
            l.name AS location_name, l.district
     FROM tasks t
     JOIN task_assignments ta ON ta.task_id = t.id
     LEFT JOIN locations l ON l.id = t.location_id
     WHERE ta.volunteer_id = ? AND t.status != 'completed'
     ORDER BY FIELD(t.priority, 'critical','high','medium','low')
     LIMIT 5`,
    [volunteerId]
  );

  const [openIssues] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM field_issues WHERE reported_by = ? AND status != 'resolved'`,
    [volunteerId]
  );

  const [unreadNotifs] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`,
    [volunteerId]
  );

  return {
    task_stats: taskCounts[0],
    active_tasks: activeTasks,
    open_issues: (openIssues[0] as { count: number }).count,
    unread_notifications: (unreadNotifs[0] as { count: number }).count,
  };
}

export async function getAdminDashboard() {
  const [reportStats] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'pending')     AS pending,
       SUM(status = 'verified')    AS verified,
       SUM(status = 'in_progress') AS in_progress,
       SUM(status = 'completed')   AS completed,
       SUM(severity = 'critical')  AS critical,
       SUM(severity = 'high')      AS high
     FROM reports`
  );

  const [taskStats] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'assigned')    AS assigned,
       SUM(status = 'en_route')    AS en_route,
       SUM(status = 'in_progress') AS in_progress,
       SUM(status = 'completed')   AS completed
     FROM tasks`
  );

  const [issueStats] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'reported')    AS reported,
       SUM(status = 'in_progress') AS in_progress,
       SUM(status = 'resolved')    AS resolved
     FROM field_issues`
  );

  const [inventoryAlerts] = await pool.execute<RowDataPacket[]>(
    `SELECT i.id, r.name AS resource_name, r.unit, i.quantity, i.depot_name
     FROM inventory i
     JOIN resources r ON r.id = i.resource_id
     WHERE i.quantity < 100
     ORDER BY i.quantity ASC LIMIT 5`
  );

  const [recentReports] = await pool.execute<RowDataPacket[]>(
    `SELECT r.id, r.report_code, r.title, r.status, r.severity, r.disaster_type,
            r.location_name, r.affected_people, r.created_at, u.name AS reporter_name
     FROM reports r JOIN users u ON u.id = r.citizen_id
     ORDER BY r.created_at DESC LIMIT 8`
  );

  const [affectedSum] = await pool.execute<RowDataPacket[]>(
    `SELECT SUM(affected_people) AS total_affected FROM reports WHERE status != 'rejected'`
  );

  return {
    report_stats:    reportStats[0],
    task_stats:      taskStats[0],
    issue_stats:     issueStats[0],
    inventory_alerts: inventoryAlerts,
    recent_reports:  recentReports,
    total_affected:  (affectedSum[0] as { total_affected: number }).total_affected ?? 0,
  };
}
