export type DisasterType = "বন্যা" | "ঘূর্ণিঝড়" | "নদীভাঙন" | "জলাবদ্ধতা" | "ভূমিধস" | "অন্যান্য";
export type Severity = "high" | "medium" | "low";
export type ReportStatus = "pending" | "verified" | "rejected" | "in_progress" | "completed";

export interface Report {
  id: string;
  reporterId: string;
  disasterType: DisasterType;
  title: string;
  description: string;
  location: { name: string; district: string; lat: number; lng: number };
  affectedPeople: number;
  photos: string[];
  status: ReportStatus;
  severity: Severity;
  reporterName: string;
  createdAt: string;
  displayTime: string;
}

export const mockReports: Report[] = [
  {
    id: "RPT-001",
    reporterId: "USR-001",
    disasterType: "বন্যা",
    title: "সুনামগঞ্জে আকস্মিক বন্যা",
    description: "সুনামগঞ্জ সদরে হাওর এলাকায় ব্যাপক বন্যা। বাড়িঘর তলিয়ে গেছে, মানুষ ছাদে আশ্রয় নিচ্ছে। এলাকার বেশ কয়েকটি বাড়িতে পানি প্রবেশ করেছে এবং প্রধান সড়কের একটি অংশ পানিতে ডুবে গেছে।",
    location: { name: "সুনামগঞ্জ সদর", district: "সুনামগঞ্জ", lat: 24.8917, lng: 91.3967 },
    affectedPeople: 3200,
    photos: [
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504197832061-98fedba8b900?w=600&h=400&fit=crop&auto=format",
    ],
    status: "verified",
    severity: "high",
    reporterName: "রাকিবুল হাসান",
    createdAt: "2026-09-01T10:30:00",
    displayTime: "আজ, ১০:৩০ AM",
  },
  {
    id: "RPT-002",
    reporterId: "USR-001",
    disasterType: "ঘূর্ণিঝড়",
    title: "কক্সবাজারে ঘূর্ণিঝড়ের প্রভাব",
    description: "ঘূর্ণিঝড়ের প্রভাবে তীব্র ঝড়বৃষ্টি। মৎস্যজীবীরা সাগরে আটকা পড়েছে। উপকূলীয় এলাকায় তীব্র বায়ু প্রবাহ রয়েছে।",
    location: { name: "কক্সবাজার সমুদ্র সৈকত", district: "কক্সবাজার", lat: 21.4272, lng: 92.0058 },
    affectedPeople: 1500,
    photos: [],
    status: "pending",
    severity: "high",
    reporterName: "নাসরিন আক্তার",
    createdAt: "2026-09-01T08:15:00",
    displayTime: "আজ, ০৮:১৫ AM",
  },
  {
    id: "RPT-003",
    reporterId: "USR-001",
    disasterType: "জলাবদ্ধতা",
    title: "সিলেট শহরে জলাবদ্ধতা",
    description: "সিলেট শহরের নিচু এলাকায় জলাবদ্ধতা। রাস্তা ডুবে যানবাহন চলাচল বন্ধ। নিকাশি ব্যবস্থা অকার্যকর।",
    location: { name: "সিলেট শহর", district: "সিলেট", lat: 24.8949, lng: 91.8687 },
    affectedPeople: 850,
    photos: [
      "https://images.unsplash.com/photo-1601745256898-d1d6a7f2a7a2?w=600&h=400&fit=crop&auto=format",
    ],
    status: "in_progress",
    severity: "medium",
    reporterName: "তানভীর আহমেদ",
    createdAt: "2026-08-31T18:45:00",
    displayTime: "গতকাল, ০৬:৪৫ PM",
  },
  {
    id: "RPT-004",
    reporterId: "USR-001",
    disasterType: "ভূমিধস",
    title: "রাঙামাটিতে ভূমিধস",
    description: "পার্বত্য চট্টগ্রামে প্রবল বৃষ্টিতে ভূমিধস। রাস্তা বন্ধ, যোগাযোগ বিচ্ছিন্ন।",
    location: { name: "রাঙামাটি পার্বত্য এলাকা", district: "রাঙামাটি", lat: 22.6353, lng: 92.1673 },
    affectedPeople: 420,
    photos: [],
    status: "verified",
    severity: "high",
    reporterName: "সুমনা চাকমা",
    createdAt: "2026-08-31T14:10:00",
    displayTime: "গতকাল, ০২:১০ PM",
  },
  {
    id: "RPT-005",
    reporterId: "USR-001",
    disasterType: "বন্যা",
    title: "খুলনা উপকূলে বন্যা",
    description: "সুন্দরবন এলাকায় জোয়ারের পানি বৃদ্ধি। উপকূলীয় এলাকায় বন্যার পানি ঢুকছে।",
    location: { name: "খুলনা উপকূল", district: "খুলনা", lat: 22.8456, lng: 89.5403 },
    affectedPeople: 1200,
    photos: [],
    status: "completed",
    severity: "medium",
    reporterName: "করিম মাতব্বর",
    createdAt: "2026-08-30T09:00:00",
    displayTime: "২ দিন আগে",
  },
  {
    id: "RPT-006",
    reporterId: "USR-001",
    disasterType: "নদীভাঙন",
    title: "বরিশালে নদীভাঙন",
    description: "কীর্তনখোলা নদীর ভাঙন তীব্র হয়েছে। বেশ কয়েকটি বাড়ি নদীতে বিলীন।",
    location: { name: "বরিশাল নদী তীর", district: "বরিশাল", lat: 22.701, lng: 90.3535 },
    affectedPeople: 580,
    photos: [],
    status: "pending",
    severity: "medium",
    reporterName: "ফাতেমা বেগম",
    createdAt: "2026-08-29T11:00:00",
    displayTime: "৩ দিন আগে",
  },
  {
    id: "RPT-007",
    reporterId: "USR-001",
    disasterType: "নদীভাঙন",
    title: "ময়মনসিংহে নদীভাঙন — বসতবাড়ি ক্ষতিগ্রস্ত",
    description: "ব্রহ্মপুত্র নদের তীরবর্তী এলাকায় ভাঙন তীব্র হয়েছে। অন্তত ৫০টি পরিবার বাস্তুচ্যুত।",
    location: { name: "ময়মনসিংহ নদী তীর", district: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203 },
    affectedPeople: 350,
    photos: [],
    status: "verified",
    severity: "medium",
    reporterName: "রাকিবুল হাসান",
    createdAt: "2026-08-28T09:30:00",
    displayTime: "৪ দিন আগে",
  },
  {
    id: "RPT-008",
    reporterId: "USR-001",
    disasterType: "জলাবদ্ধতা",
    title: "ঢাকার নিচু এলাকায় দীর্ঘস্থায়ী জলাবদ্ধতা",
    description: "অতিবৃষ্টির কারণে পুরান ঢাকার বেশ কয়েকটি এলাকায় জলাবদ্ধতা। নর্দমার পানি উপচে পড়ছে।",
    location: { name: "পুরান ঢাকা", district: "ঢাকা", lat: 23.7104, lng: 90.4074 },
    affectedPeople: 1800,
    photos: [
      "https://images.unsplash.com/photo-1601745256898-d1d6a7f2a7a2?w=600&h=400&fit=crop&auto=format",
    ],
    status: "pending",
    severity: "medium",
    reporterName: "তানভীর আহমেদ",
    createdAt: "2026-08-27T15:00:00",
    displayTime: "৫ দিন আগে",
  },
  {
    id: "RPT-009",
    reporterId: "USR-001",
    disasterType: "বন্যা",
    title: "কুমিল্লায় হঠাৎ বন্যা — ফসল নষ্ট",
    description: "ভারী বর্ষণে কুমিল্লার নিচু এলাকায় হঠাৎ বন্যা। কৃষিজমি ও বসতবাড়ি ক্ষতিগ্রস্ত।",
    location: { name: "কুমিল্লা সদর", district: "কুমিল্লা", lat: 23.4607, lng: 91.1809 },
    affectedPeople: 780,
    photos: [],
    status: "pending",
    severity: "low",
    reporterName: "রাকিবুল হাসান",
    createdAt: "2026-08-26T12:00:00",
    displayTime: "৬ দিন আগে",
  },
  {
    id: "RPT-010",
    reporterId: "USR-001",
    disasterType: "ঘূর্ণিঝড়",
    title: "যশোরে ঘূর্ণিঝড়ের প্রভাবে ক্ষয়ক্ষতি",
    description: "ঘূর্ণিঝড়ের প্রভাবে যশোর সদরে বহু গাছপালা উপড়ে পড়েছে। বিদ্যুৎ সংযোগ বিচ্ছিন্ন।",
    location: { name: "যশোর সদর", district: "যশোর", lat: 23.1667, lng: 89.2167 },
    affectedPeople: 620,
    photos: [],
    status: "rejected",
    severity: "low",
    reporterName: "করিম মাতব্বর",
    createdAt: "2026-08-25T08:00:00",
    displayTime: "৭ দিন আগে",
  },
];
