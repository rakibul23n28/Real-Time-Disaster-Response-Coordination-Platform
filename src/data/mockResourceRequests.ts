export type RequestPriority = "critical" | "high" | "medium";
export type RequestStatus = "pending" | "allocated" | "fulfilled";

export interface RequestItem {
  nameBn: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface ResourceRequest {
  id: string;
  area: string;
  district: string;
  priority: RequestPriority;
  reportId: string;
  items: RequestItem[];
  status: RequestStatus;
  lat: number;
  lng: number;
  requestedAt: string;
  affectedPeople: number;
}

export const mockResourceRequests: ResourceRequest[] = [
  {
    id: "RR-001",
    area: "দক্ষিণ সুনামগঞ্জ",
    district: "সুনামগঞ্জ",
    priority: "critical",
    reportId: "RPT-001",
    items: [
      { nameBn: "বিশুদ্ধ পানি", category: "water", quantity: 500, unit: "বোতল" },
      { nameBn: "খাবার প্যাকেট", category: "food", quantity: 300, unit: "প্যাকেট" },
      { nameBn: "প্রাথমিক ওষুধ কিট", category: "medical", quantity: 100, unit: "কিট" },
    ],
    status: "pending",
    lat: 25.0658,
    lng: 91.395,
    requestedAt: "আজ, ১০:৩০ AM",
    affectedPeople: 320,
  },
  {
    id: "RR-002",
    area: "কক্সবাজার সদর",
    district: "কক্সবাজার",
    priority: "high",
    reportId: "RPT-002",
    items: [
      { nameBn: "খাবার প্যাকেট", category: "food", quantity: 450, unit: "প্যাকেট" },
      { nameBn: "ওআরএস স্যালাইন", category: "medical", quantity: 200, unit: "প্যাকেট" },
      { nameBn: "ত্রিপল / শেড", category: "other", quantity: 60, unit: "পিস" },
    ],
    status: "pending",
    lat: 21.4272,
    lng: 92.0058,
    requestedAt: "আজ, ০৯:১৫ AM",
    affectedPeople: 540,
  },
  {
    id: "RR-003",
    area: "পাইকগাছা, খুলনা",
    district: "খুলনা",
    priority: "medium",
    reportId: "RPT-003",
    items: [
      { nameBn: "বিশুদ্ধ পানি", category: "water", quantity: 200, unit: "বোতল" },
      { nameBn: "কম্বল", category: "other", quantity: 80, unit: "পিস" },
    ],
    status: "allocated",
    lat: 22.5974,
    lng: 89.379,
    requestedAt: "গতকাল, ০৪:০০ PM",
    affectedPeople: 180,
  },
  {
    id: "RR-004",
    area: "নেত্রকোনা সদর",
    district: "নেত্রকোনা",
    priority: "high",
    reportId: "RPT-004",
    items: [
      { nameBn: "চাল", category: "food", quantity: 500, unit: "কেজি" },
      { nameBn: "প্রাথমিক ওষুধ কিট", category: "medical", quantity: 50, unit: "কিট" },
    ],
    status: "pending",
    lat: 24.87,
    lng: 90.73,
    requestedAt: "আজ, ০৭:৪৫ AM",
    affectedPeople: 210,
  },
  {
    id: "RR-005",
    area: "মুন্সিগঞ্জ সদর",
    district: "মুন্সিগঞ্জ",
    priority: "medium",
    reportId: "RPT-005",
    items: [
      { nameBn: "খাবার প্যাকেট", category: "food", quantity: 150, unit: "প্যাকেট" },
    ],
    status: "fulfilled",
    lat: 23.542,
    lng: 90.53,
    requestedAt: "গতকাল, ১১:০০ AM",
    affectedPeople: 90,
  },
];
