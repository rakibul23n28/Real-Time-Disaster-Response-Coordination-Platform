export type TaskStatus = "assigned" | "en_route" | "in_progress" | "completed";
export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface TaskResource {
  name: string;
  quantity: number;
  unit: string;
}

export interface Task {
  id: string;
  backendId?: number;
  reportId: string;
  title: string;
  description: string;
  instructions: string;
  location: { name: string; district: string; lat: number; lng: number };
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  assignedVolunteers: string[];
  assignedAt: string;
  resources: TaskResource[];
  affectedPeople: number;
  assignmentStatus?: "pending" | "accepted" | "declined";
  declineReason?: string;
}
