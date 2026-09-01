export type IssueType = "road_blocked" | "extra_relief" | "medical" | "boat_needed" | "more_volunteers" | "other";

export interface FieldIssue {
  id: string;
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

export const mockIssues: FieldIssue[] = [
  {
    id: "ISSUE-001",
    taskId: "TASK-001",
    type: "road_blocked",
    label: "রাস্তা বন্ধ",
    icon: "🚧",
    location: { name: "সুনামগঞ্জ-সিলেট সড়ক", lat: 24.87, lng: 91.41 },
    description: "ভূমিধসের কারণে সুনামগঞ্জ-সিলেট সংযোগ সড়ক বন্ধ।",
    status: "acknowledged",
    createdAt: "2026-09-01T11:20:00",
    displayTime: "আজ, ১১:২০ AM",
  },
  {
    id: "ISSUE-002",
    taskId: "TASK-001",
    type: "boat_needed",
    label: "নৌকা প্রয়োজন",
    icon: "🚤",
    location: { name: "হাওর এলাকা, সুনামগঞ্জ", lat: 24.9, lng: 91.38 },
    description: "হাওর এলাকায় উদ্ধার কাজের জন্য আরও নৌকা প্রয়োজন।",
    status: "reported",
    createdAt: "2026-09-01T09:45:00",
    displayTime: "আজ, ০৯:৪৫ AM",
  },
  {
    id: "ISSUE-003",
    taskId: "TASK-005",
    type: "medical",
    label: "চিকিৎসা সহায়তা প্রয়োজন",
    icon: "🚑",
    location: { name: "কক্সবাজার আশ্রয়কেন্দ্র", lat: 21.43, lng: 92.01 },
    description: "আশ্রয়কেন্দ্রে ডায়রিয়া ও পানিবাহিত রোগের প্রকোপ বাড়ছে। বিশেষজ্ঞ চিকিৎসক প্রয়োজন।",
    status: "reported",
    createdAt: "2026-09-01T07:30:00",
    displayTime: "আজ, ০৭:৩০ AM",
  },
  {
    id: "ISSUE-004",
    taskId: "TASK-002",
    type: "extra_relief",
    label: "অতিরিক্ত ত্রাণ প্রয়োজন",
    icon: "📦",
    location: { name: "সিলেট শহর, ওয়ার্ড ১২", lat: 24.88, lng: 91.87 },
    description: "বরাদ্দকৃত ত্রাণ শেষ হয়ে গেছে। আরও ৫০০ পরিবারকে সহায়তা দিতে হবে।",
    status: "acknowledged",
    createdAt: "2026-08-31T14:00:00",
    displayTime: "গতকাল, ০২:০০ PM",
  },
  {
    id: "ISSUE-005",
    taskId: "TASK-003",
    type: "more_volunteers",
    label: "অতিরিক্ত স্বেচ্ছাসেবক প্রয়োজন",
    icon: "👥",
    location: { name: "রাঙামাটি-চট্টগ্রাম সড়ক", lat: 22.63, lng: 92.17 },
    description: "রাস্তা পরিষ্কার কাজে আরও কমপক্ষে ১০ জন স্বেচ্ছাসেবক প্রয়োজন।",
    status: "resolved",
    createdAt: "2026-08-31T10:00:00",
    displayTime: "গতকাল, ১০:০০ AM",
  },
];
