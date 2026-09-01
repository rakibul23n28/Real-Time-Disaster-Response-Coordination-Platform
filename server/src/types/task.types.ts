export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus   = "assigned" | "en_route" | "in_progress" | "completed";

export interface TaskRow {
  id: number;
  task_code: string;
  report_id: number | null;
  title: string;
  description: string;
  instructions: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  location_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}
