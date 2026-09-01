import { pool } from "../config/database.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { CreateResourceInput, UpdateResourceInput } from "../validations/resource.validation.js";

export async function createResource(input: CreateResourceInput) {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO resources (name, category, unit, description) VALUES (?, ?, ?, ?)`,
    [input.name, input.category, input.unit, input.description ?? null]
  );
  return getResourceById(result.insertId);
}

export async function getResources(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM resources ORDER BY category, name LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countResult] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM resources`);
  return { resources: rows, total: (countResult[0] as { total: number }).total };
}

export async function getResourceById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM resources WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

export async function updateResource(id: number, input: UpdateResourceInput) {
  const sets: string[] = [];
  const params: (string | number)[] = [];

  if (input.name        !== undefined) { sets.push("name = ?");        params.push(input.name); }
  if (input.category    !== undefined) { sets.push("category = ?");    params.push(input.category); }
  if (input.unit        !== undefined) { sets.push("unit = ?");        params.push(input.unit); }
  if (input.description !== undefined) { sets.push("description = ?"); params.push(input.description); }

  if (sets.length === 0) throw Object.assign(new Error("No fields to update"), { status: 400 });
  params.push(id);
  await pool.execute(`UPDATE resources SET ${sets.join(", ")} WHERE id = ?`, params);
  return getResourceById(id);
}
