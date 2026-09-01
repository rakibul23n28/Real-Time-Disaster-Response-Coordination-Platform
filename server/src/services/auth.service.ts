import { pool } from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { RegisterInput, LoginInput, UpdateMeInput } from "../validations/auth.validation.js";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: string;
  profile_image: string | null;
}

export async function register(input: RegisterInput) {
  const [existing] = await pool.execute<UserRow[]>(
    `SELECT id FROM users WHERE email = ?`, [input.email]
  );
  if (existing.length > 0) throw Object.assign(new Error("Email already registered"), { status: 409 });

  const hash = await hashPassword(input.password);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [input.name, input.email, input.phone ?? null, hash, input.role]
  );

  const [rows] = await pool.execute<UserRow[]>(
    `SELECT id, name, email, phone, role, profile_image, created_at FROM users WHERE id = ?`,
    [result.insertId]
  );
  const user = rows[0];
  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function login(input: LoginInput) {
  const [rows] = await pool.execute<UserRow[]>(
    `SELECT * FROM users WHERE email = ?`, [input.email]
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error("Invalid email or password"), { status: 401 });

  const valid = await comparePassword(input.password, user.password_hash);
  if (!valid) throw Object.assign(new Error("Invalid email or password"), { status: 401 });

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ userId: user.id, role: user.role });
  return { user: safeUser, token };
}

export async function getMe(userId: number) {
  const [rows] = await pool.execute<UserRow[]>(
    `SELECT id, name, email, phone, role, profile_image, created_at FROM users WHERE id = ?`,
    [userId]
  );
  if (!rows[0]) throw Object.assign(new Error("User not found"), { status: 404 });
  return rows[0];
}

export async function updateMe(userId: number, input: UpdateMeInput) {
  const [existing] = await pool.execute<UserRow[]>(
    `SELECT id FROM users WHERE email = ? AND id != ?`, [input.email, userId]
  );
  if (existing.length > 0) throw Object.assign(new Error("Email already registered"), { status: 409 });

  await pool.execute(
    `UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?`,
    [input.name, input.email, input.phone ?? null, userId]
  );
  return getMe(userId);
}
