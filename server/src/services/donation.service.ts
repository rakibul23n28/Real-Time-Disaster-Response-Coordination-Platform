import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database.js";
import type { CreateDonationInput } from "../validations/donation.validation.js";

export async function getDonationPlaces(category?: string) {
  const params: string[] = [];
  let query = `SELECT id, name, organization, address, district, division, phone, categories, latitude, longitude
               FROM donation_places WHERE is_active = 1`;
  if (category && ["food", "water", "medical", "other"].includes(category)) {
    query += " AND FIND_IN_SET(?, categories) > 0";
    params.push(category);
  }
  query += " ORDER BY division, district, name";
  const [rows] = await pool.execute<RowDataPacket[]>(query, params);
  return rows;
}

export async function getDonationLog(category?: string) {
  const params: string[] = [];
  let query = `SELECT d.id, d.donation_type, d.category, d.donor_name, d.is_anonymous,
                      d.amount, d.item_name, d.quantity, d.unit, d.note, d.status, d.created_at,
                      p.name AS place_name, p.organization, p.district, p.division
               FROM donations d
               JOIN donation_places p ON p.id = d.place_id
               WHERE d.status = 'confirmed'`;
  if (category && ["food", "water", "medical", "other"].includes(category)) {
    query += " AND d.category = ?";
    params.push(category);
  }
  query += " ORDER BY d.created_at DESC LIMIT 100";
  const [rows] = await pool.execute<RowDataPacket[]>(query, params);
  return rows.map((row) => ({ ...row, donor_name: row.is_anonymous ? "পরিচয় গোপন" : row.donor_name }));
}

export async function createDonation(input: CreateDonationInput) {
  const [placeRows] = await pool.execute<RowDataPacket[]>(
    "SELECT id FROM donation_places WHERE id = ? AND is_active = 1",
    [input.place_id],
  );
  if (!placeRows[0]) throw Object.assign(new Error("Donation place not found"), { status: 404 });

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO donations
      (donation_type, category, donor_name, donor_contact, is_anonymous, amount, item_name, quantity, unit, place_id, note, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      input.donation_type,
      input.category,
      input.is_anonymous ? null : input.donor_name ?? null,
      input.is_anonymous ? null : input.donor_contact ?? null,
      input.is_anonymous ? 1 : 0,
      input.amount ?? null,
      input.item_name ?? null,
      input.quantity ?? null,
      input.unit ?? null,
      input.place_id,
      input.note ?? null,
    ],
  );
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT d.id, d.donation_type, d.category, d.donor_name, d.is_anonymous,
            d.amount, d.item_name, d.quantity, d.unit, d.note, d.status, d.created_at,
            p.name AS place_name, p.organization, p.district, p.division
     FROM donations d JOIN donation_places p ON p.id = d.place_id WHERE d.id = ?`,
    [result.insertId],
  );
  return rows[0];
}

export async function getPendingDonations() {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT d.id, d.donation_type, d.category, d.donor_name, d.is_anonymous,
            d.amount, d.item_name, d.quantity, d.unit, d.note, d.status, d.created_at,
            p.name AS place_name, p.organization, p.district, p.division
     FROM donations d JOIN donation_places p ON p.id = d.place_id
    WHERE d.status IN ('pending', 'received') ORDER BY d.created_at ASC`,
  );
  return rows.map((row) => ({ ...row, donor_name: row.is_anonymous ? "পরিচয় গোপন" : row.donor_name }));
}

export async function confirmDonation(id: number, confirmedBy: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE donations SET status = 'confirmed', confirmed_by = ?, confirmed_at = CURRENT_TIMESTAMP WHERE id = ? AND status IN ('pending', 'received')",
    [confirmedBy, id],
  );
  if (!result.affectedRows) throw Object.assign(new Error("Pending donation not found"), { status: 404 });
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT d.id, d.donation_type, d.category, d.donor_name, d.is_anonymous,
            d.amount, d.item_name, d.quantity, d.unit, d.note, d.status, d.created_at,
            p.name AS place_name, p.organization, p.district, p.division
     FROM donations d JOIN donation_places p ON p.id = d.place_id WHERE d.id = ?`,
    [id],
  );
  return rows[0];
}
