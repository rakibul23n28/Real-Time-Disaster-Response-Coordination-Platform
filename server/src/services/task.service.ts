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
            `SELECT t.*, l.name AS location_name, l.district,
              ta.status AS assignment_status, ta.decline_reason
       FROM tasks t
      JOIN task_assignments ta ON ta.task_id = t.id AND ta.status != 'declined'
       LEFT JOIN locations l ON l.id = t.location_id
       ${where}
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM tasks t JOIN task_assignments ta ON ta.task_id = t.id AND ta.status != 'declined' ${where}`,
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

export async function getVolunteers() {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, name, email, is_available FROM users WHERE role = 'volunteer' ORDER BY name`,
  );
  return rows;
}

export async function assignTask(taskId: number, adminId: number, input: AssignTaskInput) {
  // Verify volunteer role
  const [volRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, name FROM users WHERE id = ? AND role = 'volunteer'`,
    [input.volunteer_id]
  );
  if (!volRows[0]) throw Object.assign(new Error("User is not a volunteer"), { status: 400 });

  const [trainingRows] = await pool.execute<RowDataPacket[]>(
    "SELECT id FROM training_enrollments WHERE volunteer_id = ? AND status = 'completed' LIMIT 1",
    [input.volunteer_id],
  );
  if (!trainingRows[0]) throw Object.assign(new Error("Volunteer must complete training before receiving a task"), { status: 400 });

  const [taskRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, title FROM tasks WHERE id = ?`, [taskId]
  );
  if (!taskRows[0]) throw Object.assign(new Error("Task not found"), { status: 404 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [targetRows] = await conn.execute<RowDataPacket[]>(
      `SELECT location_id FROM tasks WHERE id = ?`,
      [taskId],
    );
    const targetLocationId = targetRows[0]?.location_id ?? null;
    const [activeAssignments] = await conn.execute<RowDataPacket[]>(
      `SELECT ta.task_id, t.title, t.location_id, l.name AS location_name
       FROM task_assignments ta
       JOIN tasks t ON t.id = ta.task_id
       LEFT JOIN locations l ON l.id = t.location_id
       WHERE ta.volunteer_id = ?
         AND ta.status IN ('pending', 'accepted')
         AND t.status != 'completed'
         AND ta.task_id != ?
       FOR UPDATE`,
      [input.volunteer_id, taskId],
    );
    const conflictingAssignment = activeAssignments.find((assignment) => assignment.location_id !== targetLocationId);
    if (conflictingAssignment) {
      throw Object.assign(
        new Error(`Volunteer is already assigned to another active disaster area: ${conflictingAssignment.location_name ?? conflictingAssignment.title}`),
        { status: 409 },
      );
    }

    await conn.execute(
      `INSERT INTO task_assignments (task_id, volunteer_id, assigned_by) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE assigned_by = VALUES(assigned_by), status = 'pending', decline_reason = NULL, responded_at = NULL`,
      [taskId, input.volunteer_id, adminId]
    );

    const task = taskRows[0] as { title: string };
    const vol  = volRows[0]  as { name: string };
    await createNotification(conn, {
      userId: input.volunteer_id,
      title: "নতুন টাস্ক নিয়োগ",
      message: `আপনাকে "${task.title}" টাস্কে নিয়োগ করা হয়েছে। কাজটি গ্রহণ বা প্রত্যাখ্যান করুন।`,
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

export async function respondToAssignment(taskId: number, volunteerId: number, status: "accepted" | "declined", reason?: string) {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE task_assignments SET status = ?, decline_reason = ?, responded_at = CURRENT_TIMESTAMP
     WHERE task_id = ? AND volunteer_id = ?`,
    [status, status === "declined" ? reason ?? null : null, taskId, volunteerId],
  );
  if (!result.affectedRows) throw Object.assign(new Error("Assignment not found"), { status: 404 });
  if (status === "declined") {
    await notifyAdmins(null, { title: "স্বেচ্ছাসেবক কাজ প্রত্যাখ্যান করেছেন", message: `টাস্ক ${taskId} প্রত্যাখ্যানের কারণ: ${reason}`, type: "warning", referenceType: "task", referenceId: taskId });
  }
  return getTaskById(taskId);
}

export async function updateVolunteerLocation(taskId: number, volunteerId: number, input: { latitude: number; longitude: number; is_sharing: boolean }) {
  const [assignment] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM task_assignments WHERE task_id = ? AND volunteer_id = ? AND status = 'accepted'`,
    [taskId, volunteerId],
  );
  if (!assignment[0]) throw Object.assign(new Error("Accept the assignment before sharing location"), { status: 403 });
  await pool.execute(
    `INSERT INTO volunteer_locations (volunteer_id, task_id, latitude, longitude, is_sharing)
     VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude), is_sharing = VALUES(is_sharing)`,
    [volunteerId, taskId, input.latitude, input.longitude, input.is_sharing ? 1 : 0],
  );
  return { task_id: taskId, ...input };
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
      `SELECT id FROM task_assignments WHERE task_id = ? AND volunteer_id = ? AND status = 'accepted'`,
      [taskId, volunteerId]
    );
    if (!rows[0]) throw Object.assign(new Error("You are not assigned to this task"), { status: 403 });
  }

  const updates: Record<string, string | number> = { status: input.status };
  if (input.progress !== undefined) updates.progress = input.progress;
  if (input.status === "completed")  updates.progress = 100;

  const sets = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
  const updateValues: (string | number)[] = [...Object.values(updates), taskId];
  await pool.execute<ResultSetHeader>(`UPDATE tasks SET ${sets} WHERE id = ?`, updateValues);

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
