import { pool } from "../config/database.js";
import { nextTaskCode } from "../utils/id.js";
import { createNotification, notifyAdmins } from "./notification.service.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, AssignTaskInput } from "../validations/task.validation.js";

export async function createTask(adminId: number, input: CreateTaskInput) {
  const code = await nextTaskCode();
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tasks (task_code, report_id, title, description, instructions, priority, location_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [code, input.report_id ?? null, input.title, input.description,
     input.instructions ?? null, input.priority, input.location_id ?? null, adminId]
  );
  return getTaskById(result.insertId);
}

export async function getTasks(page: number, limit: number, volunteerId?: number) {
  const offset = (page - 1) * limit;
  let where = "";
  const params: (number | string)[] = [];

  if (volunteerId !== undefined) {
    where = `WHERE ta.volunteer_id = ?`;
    params.push(volunteerId);

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*, l.name AS location_name, l.district
       FROM tasks t
       JOIN task_assignments ta ON ta.task_id = t.id
       LEFT JOIN locations l ON l.id = t.location_id
       ${where}
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM tasks t JOIN task_assignments ta ON ta.task_id = t.id ${where}`,
      params
    );
    return { tasks: rows, total: (countResult[0] as { total: number }).total };
  }

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.*, l.name AS location_name, l.district
     FROM tasks t
     LEFT JOIN locations l ON l.id = t.location_id
     ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM tasks`);
  return { tasks: rows, total: (countResult[0] as { total: number }).total };
}

export async function getTaskById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT t.*, l.name AS location_name, l.district, l.latitude AS loc_lat, l.longitude AS loc_lng
     FROM tasks t
     LEFT JOIN locations l ON l.id = t.location_id
     WHERE t.id = ?`,
    [id]
  );
  if (!rows[0]) return null;

  const [assignments] = await pool.execute<RowDataPacket[]>(
    `SELECT ta.*, u.name AS volunteer_name, u.email AS volunteer_email
     FROM task_assignments ta
     JOIN users u ON u.id = ta.volunteer_id
     WHERE ta.task_id = ?`,
    [id]
  );
  return { ...rows[0], assignments };
}

export async function assignTask(taskId: number, adminId: number, input: AssignTaskInput) {
  // Verify volunteer role
  const [volRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, name FROM users WHERE id = ? AND role = 'volunteer'`,
    [input.volunteer_id]
  );
  if (!volRows[0]) throw Object.assign(new Error("User is not a volunteer"), { status: 400 });

  const [taskRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, title FROM tasks WHERE id = ?`, [taskId]
  );
  if (!taskRows[0]) throw Object.assign(new Error("Task not found"), { status: 404 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `INSERT IGNORE INTO task_assignments (task_id, volunteer_id, assigned_by) VALUES (?, ?, ?)`,
      [taskId, input.volunteer_id, adminId]
    );

    const task = taskRows[0] as { title: string };
    const vol  = volRows[0]  as { name: string };
    await createNotification(conn, {
      userId: input.volunteer_id,
      title: "নতুন টাস্ক নিয়োগ",
      message: `আপনাকে "${task.title}" টাস্কে নিয়োগ করা হয়েছে`,
      type: "success",
      referenceType: "task",
      referenceId: taskId,
    });

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  return getTaskById(taskId);
}

export async function updateTask(id: number, input: UpdateTaskInput) {
  const sets: string[] = [];
  const params: (string | number)[] = [];

  if (input.title        !== undefined) { sets.push("title = ?");        params.push(input.title); }
  if (input.description  !== undefined) { sets.push("description = ?");  params.push(input.description); }
  if (input.instructions !== undefined) { sets.push("instructions = ?"); params.push(input.instructions); }
  if (input.priority     !== undefined) { sets.push("priority = ?");     params.push(input.priority); }
  if (input.progress     !== undefined) { sets.push("progress = ?");     params.push(input.progress); }

  if (sets.length === 0) throw Object.assign(new Error("No fields to update"), { status: 400 });

  params.push(id);
  await pool.execute(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`, params);
  return getTaskById(id);
}

export async function updateTaskStatus(taskId: number, volunteerId: number, isAdmin: boolean, input: UpdateTaskStatusInput) {
  if (!isAdmin) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM task_assignments WHERE task_id = ? AND volunteer_id = ?`,
      [taskId, volunteerId]
    );
    if (!rows[0]) throw Object.assign(new Error("You are not assigned to this task"), { status: 403 });
  }

  const updates: Record<string, unknown> = { status: input.status };
  if (input.progress !== undefined) updates.progress = input.progress;
  if (input.status === "completed")  updates.progress = 100;

  const sets = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
  await pool.execute(`UPDATE tasks SET ${sets} WHERE id = ?`, [...Object.values(updates), taskId]);

  if (input.status === "completed") {
    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT title FROM tasks WHERE id = ?`, [taskId]);
    const task = rows[0] as { title: string } | undefined;
    if (task) {
      await notifyAdmins(null, {
        title: "টাস্ক সম্পন্ন",
        message: `"${task.title}" টাস্ক সম্পন্ন হয়েছে`,
        type: "success",
        referenceType: "task",
        referenceId: taskId,
      });
    }
  }

  return getTaskById(taskId);
}
