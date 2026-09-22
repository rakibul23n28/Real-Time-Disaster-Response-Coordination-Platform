export type IssueType = "road_blocked" | "extra_relief" | "medical" | "boat_needed" | "more_volunteers" | "other";

export interface FieldIssue {
  id: string;
  backendId?: number;
  taskId: string;
  type: IssueType;
  label: string;
  icon: string;
  location: { name: string; lat: number; lng: number };
  description: string;
  status: "reported" | "acknowledged" | "resolved";
  createdAt: string;
  displayTime: string;
}

export const issueTypeConfig: Record<IssueType, { label: string; icon: string }> = {
  road_blocked: { label: "রাস্তা বন্ধ", icon: "🚧" },
  extra_relief: { label: "অতিরিক্ত ত্রাণ প্রয়োজন", icon: "📦" },
  medical: { label: "চিকিৎসা সহায়তা প্রয়োজন", icon: "🚑" },
  boat_needed: { label: "নৌকা প্রয়োজন", icon: "🚤" },
  more_volunteers: { label: "অতিরিক্ত স্বেচ্ছাসেবক প্রয়োজন", icon: "👥" },
  other: { label: "অন্যান্য জরুরি সমস্যা", icon: "⚠️" },
};
