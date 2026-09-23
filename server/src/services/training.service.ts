import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";
import type { CreateTrainingEventInput } from "../validations/training.validation.js";

const eventSelect = `SELECT e.id, e.title, e.description, e.location, e.district,
  e.start_date, e.end_date, e.duration_days, e.capacity, e.status,
  e.created_at, COUNT(en.id) AS enrolled_count,
  MAX(CASE WHEN en.volunteer_id = ? THEN en.id END) AS enrollment_id,
  MAX(CASE WHEN en.volunteer_id = ? THEN en.status END) AS enrollment_status,
  MAX(CASE WHEN en.volunteer_id = ? THEN en.completed_days END) AS completed_days
  FROM training_events e LEFT JOIN training_enrollments en ON en.event_id = e.id`;

export async function listEvents(userId: number, role: string) {
  const query = `${eventSelect} ${role === "volunteer" ? "WHERE e.status IN ('open', 'in_progress', 'completed') " : ""}GROUP BY e.id ORDER BY e.start_date ASC, e.created_at DESC`;
  const [rows] = await pool.execute<RowDataPacket[]>(query, [userId, userId, userId]);
  return rows;
}

export async function createEvent(input: CreateTrainingEventInput, adminId: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO training_events (title, description, location, district, start_date, end_date, duration_days, capacity, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [input.title, input.description, input.location, input.district, input.start_date, input.end_date, input.duration_days, input.capacity, adminId],
  );
  const [rows] = await pool.execute<RowDataPacket[]>(`${eventSelect} WHERE e.id = ? GROUP BY e.id`, [adminId, adminId, adminId, result.insertId]);
  return rows[0];
}

export async function enroll(eventId: number, volunteerId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [events] = await connection.execute<RowDataPacket[]>(
      "SELECT id, capacity, status, (SELECT COUNT(*) FROM training_enrollments WHERE event_id = training_events.id) AS enrolled_count FROM training_events WHERE id = ? FOR UPDATE",
      [eventId],
    );
    const event = events[0];
    if (!event || event.status !== "open") throw Object.assign(new Error("Training event is not open"), { status: 400 });
    if (Number(event.enrolled_count) >= Number(event.capacity)) throw Object.assign(new Error("Training event is full"), { status: 400 });
    const [completed] = await connection.execute<RowDataPacket[]>("SELECT id FROM training_enrollments WHERE volunteer_id = ? AND status = 'completed' LIMIT 1", [volunteerId]);
    if (completed[0]) throw Object.assign(new Error("Volunteer training is already completed"), { status: 409 });
    await connection.execute("INSERT INTO training_enrollments (event_id, volunteer_id) VALUES (?, ?)", [eventId, volunteerId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") throw Object.assign(new Error("You are already enrolled in this event"), { status: 409 });
    throw error;
  } finally { connection.release(); }
  const [rows] = await pool.execute<RowDataPacket[]>(`${eventSelect} WHERE e.id = ? GROUP BY e.id`, [volunteerId, volunteerId, volunteerId, eventId]);
  return rows[0];
}

export async function completeNextDay(enrollmentId: number, volunteerId: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE training_enrollments en JOIN training_events e ON e.id = en.event_id
     SET en.completed_days = en.completed_days + 1,
         en.status = CASE WHEN en.status = 'registered' THEN 'in_progress' ELSE en.status END,
         en.started_at = COALESCE(en.started_at, CURRENT_TIMESTAMP)
     WHERE en.id = ? AND en.volunteer_id = ? AND en.status != 'completed' AND en.completed_days < e.duration_days`,
    [enrollmentId, volunteerId],
  );
  if (!result.affectedRows) throw Object.assign(new Error("No more training day can be completed"), { status: 400 });
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT en.id, en.event_id, en.volunteer_id, en.status, en.completed_days, e.duration_days,
      u.name AS volunteer_name, e.title AS event_title, e.location
     FROM training_enrollments en JOIN users u ON u.id = en.volunteer_id JOIN training_events e ON e.id = en.event_id WHERE en.id = ?`,
    [enrollmentId],
  );
  return rows[0];
}

export async function updateEnrollment(enrollmentId: number, status: "registered" | "in_progress" | "completed") {
  const [enrollment] = await pool.execute<RowDataPacket[]>("SELECT en.completed_days, e.duration_days FROM training_enrollments en JOIN training_events e ON e.id = en.event_id WHERE en.id = ?", [enrollmentId]);
  if (!enrollment[0]) throw Object.assign(new Error("Training enrollment not found"), { status: 404 });
  if (status === "completed" && Number(enrollment[0].completed_days) < Number(enrollment[0].duration_days)) {
    throw Object.assign(new Error("All training days must be completed before certification"), { status: 400 });
  }
  const timestamps = status === "in_progress" ? ", started_at = COALESCE(started_at, CURRENT_TIMESTAMP)" : status === "completed" ? ", completed_at = CURRENT_TIMESTAMP" : "";
  const [result] = await pool.execute<ResultSetHeader>(`UPDATE training_enrollments SET status = ?${timestamps} WHERE id = ?`, [status, enrollmentId]);
  if (!result.affectedRows) throw Object.assign(new Error("Training enrollment not found"), { status: 404 });
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT en.id, en.event_id, en.volunteer_id, en.status, en.completed_days, e.duration_days, en.enrolled_at, en.started_at, en.completed_at, u.name AS volunteer_name, e.title AS event_title
     FROM training_enrollments en JOIN users u ON u.id = en.volunteer_id JOIN training_events e ON e.id = en.event_id WHERE en.id = ?`,
    [enrollmentId],
  );
  return rows[0];
}

export async function listEnrollments() {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT en.id, en.event_id, en.volunteer_id, en.status, en.completed_days, e.duration_days, en.enrolled_at, en.started_at, en.completed_at,
      u.name AS volunteer_name, u.email AS volunteer_email, e.title AS event_title, e.location, e.start_date, e.end_date
     FROM training_enrollments en JOIN users u ON u.id = en.volunteer_id JOIN training_events e ON e.id = en.event_id
     ORDER BY en.updated_at DESC`,
  );
  return rows;
}