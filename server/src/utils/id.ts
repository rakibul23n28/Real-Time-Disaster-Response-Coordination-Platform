import { pool } from "../config/database.js";
import type { RowDataPacket } from "mysql2";

async function nextCode(table: string, column: string, prefix: string): Promise<string> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT MAX(CAST(SUBSTRING(${column}, ?) AS UNSIGNED)) AS max_num FROM ${table}`,
    [prefix.length + 1]
  );
  const max = (rows[0]?.max_num as number | null) ?? 0;
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export const nextReportCode     = () => nextCode("reports",              "report_code",     "RPT-");
export const nextTaskCode       = () => nextCode("tasks",                "task_code",       "TASK-");
export const nextIssueCode      = () => nextCode("field_issues",         "issue_code",      "ISSUE-");
export const nextAllocationCode = () => nextCode("resource_allocations", "allocation_code", "ALLOC-");
