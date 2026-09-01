export type DisasterType = "বন্যা" | "ঘূর্ণিঝড়" | "নদীভাঙন" | "জলাবদ্ধতা" | "ভূমিধস" | "অন্যান্য";
export type ReportStatus = "pending" | "verified" | "rejected" | "in_progress" | "completed";
export type Severity     = "unassessed" | "low" | "medium" | "high" | "critical";

export interface ReportRow {
  id: number;
  report_code: string;
  citizen_id: number;
  disaster_type: DisasterType;
  title: string;
  description: string;
  affected_people: number;
  status: ReportStatus;
  severity: Severity;
  severity_score: number | null;
  latitude: number;
  longitude: number;
  location_name: string;
  created_at: string;
  updated_at: string;
}
