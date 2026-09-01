export type IssueType   = "road_blocked" | "extra_relief" | "medical" | "boat_needed" | "more_volunteers" | "other";
export type IssueStatus = "reported" | "in_progress" | "resolved";

export interface IssueRow {
  id: number;
  issue_code: string;
  reported_by: number;
  task_id: number | null;
  report_id: number | null;
  issue_type: IssueType;
  description: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  status: IssueStatus;
  created_at: string;
  updated_at: string;
}
