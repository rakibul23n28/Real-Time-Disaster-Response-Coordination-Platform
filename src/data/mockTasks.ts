export type TaskStatus = "assigned" | "en_route" | "in_progress" | "completed";
export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface TaskResource {
  name: string;
  quantity: number;
  unit: string;
}

export interface Task {
  id: string;
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
}

export const mockTasks: Task[] = [
  {
    id: "TASK-001",
    reportId: "RPT-001",
    title: "জরুরি উদ্ধার অভিযান — সুনামগঞ্জ",
    description: "সুনামগঞ্জ সদরে আটকে পড়া পরিবারগুলোকে নৌকায় উদ্ধার করে আশ্রয়কেন্দ্রে নিয়ে যেতে হবে।",
    instructions: "সুনামগঞ্জের নির্ধারিত এলাকায় আটকে পড়া পরিবারগুলো উদ্ধার করুন। নৌকা ব্যবহার করুন এবং লাইফ জ্যাকেট পরিধান নিশ্চিত করুন। উদ্ধারের পর নিকটস্থ আশ্রয়কেন্দ্রে পৌঁছে দিন।",
    location: { name: "সুনামগঞ্জ সদর", district: "সুনামগঞ্জ", lat: 24.8917, lng: 91.3967 },
    priority: "critical",
    status: "assigned",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-001", "VOL-002", "VOL-003", "VOL-004"],
    assignedAt: "আজ, ০৯:০০ AM",
    affectedPeople: 320,
    resources: [
      { name: "পানি", quantity: 200, unit: "বোতল" },
      { name: "খাবার প্যাকেট", quantity: 150, unit: "টি" },
      { name: "ওষুধ", quantity: 20, unit: "প্যাকেট" },
      { name: "লাইফ জ্যাকেট", quantity: 10, unit: "টি" },
    ],
  },
  {
    id: "TASK-002",
    reportId: "RPT-003",
    title: "ত্রাণ বিতরণ — সিলেট",
    description: "সিলেট শহরের জলাবদ্ধ এলাকায় শুকনো খাবার ও বিশুদ্ধ পানি বিতরণ করতে হবে।",
    instructions: "সিলেট শহরের নির্ধারিত ওয়ার্ডে বাড়ি বাড়ি গিয়ে ত্রাণ বিতরণ করুন। প্রবীণ ও শিশুদের অগ্রাধিকার দিন।",
    location: { name: "সিলেট শহর", district: "সিলেট", lat: 24.8949, lng: 91.8687 },
    priority: "high",
    status: "en_route",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-001", "VOL-005"],
    assignedAt: "আজ, ১০:৩০ AM",
    affectedPeople: 180,
    resources: [
      { name: "শুকনো খাবার", quantity: 100, unit: "প্যাকেট" },
      { name: "বিশুদ্ধ পানি", quantity: 150, unit: "বোতল" },
      { name: "ওষুধ", quantity: 15, unit: "প্যাকেট" },
    ],
  },
  {
    id: "TASK-003",
    reportId: "RPT-004",
    title: "রাস্তা পরিষ্কার — রাঙামাটি",
    description: "ভূমিধসের কারণে বন্ধ রাস্তা পরিষ্কার করে যোগাযোগ পুনরুদ্ধার করতে হবে।",
    instructions: "রাঙামাটি-চট্টগ্রাম সড়কের ভূমিধস পরিষ্কার করুন। ভারী যন্ত্রপাতি ব্যবহার করুন। সড়ক নিরাপদ না হওয়া পর্যন্ত এলাকা বন্ধ রাখুন।",
    location: { name: "রাঙামাটি-চট্টগ্রাম সড়ক", district: "রাঙামাটি", lat: 22.6353, lng: 92.1673 },
    priority: "high",
    status: "in_progress",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-001"],
    assignedAt: "আজ, ১১:০০ AM",
    affectedPeople: 420,
    resources: [
      { name: "যন্ত্রপাতি", quantity: 2, unit: "টি" },
    ],
  },
  {
    id: "TASK-004",
    reportId: "RPT-005",
    title: "আশ্রয়কেন্দ্র পরিচালনা — খুলনা",
    description: "উপকূলীয় এলাকায় আশ্রয়কেন্দ্র পরিচালনা করে বাস্তুচ্যুত মানুষদের সহায়তা।",
    instructions: "আশ্রয়কেন্দ্রে নিবন্ধন, খাবার ও থাকার ব্যবস্থা নিশ্চিত করুন।",
    location: { name: "খুলনা উপকূল", district: "খুলনা", lat: 22.8456, lng: 89.5403 },
    priority: "medium",
    status: "completed",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-001", "VOL-006"],
    assignedAt: "২ দিন আগে",
    affectedPeople: 540,
    resources: [
      { name: "তাঁবু", quantity: 20, unit: "টি" },
      { name: "কম্বল", quantity: 100, unit: "টি" },
    ],
  },
  {
    id: "TASK-005",
    reportId: "RPT-002",
    title: "জরুরি চিকিৎসা সহায়তা — কক্সবাজার",
    description: "ঘূর্ণিঝড়ে আহতদের জরুরি চিকিৎসা সহায়তা প্রদান করতে হবে।",
    instructions: "কক্সবাজারের আশ্রয়কেন্দ্রে চিকিৎসা সেবা নিশ্চিত করুন। আহতদের তালিকা করুন ও হাসপাতালে পাঠানোর ব্যবস্থা করুন।",
    location: { name: "কক্সবাজার সদর", district: "কক্সবাজার", lat: 21.4272, lng: 92.0058 },
    priority: "critical",
    status: "assigned",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-002", "VOL-003"],
    assignedAt: "আজ, ০৮:০০ AM",
    affectedPeople: 280,
    resources: [
      { name: "প্রাথমিক চিকিৎসা কিট", quantity: 30, unit: "টি" },
      { name: "ওষুধ", quantity: 50, unit: "প্যাকেট" },
      { name: "স্ট্রেচার", quantity: 5, unit: "টি" },
    ],
  },
  {
    id: "TASK-006",
    reportId: "RPT-006",
    title: "জরুরি ত্রাণ বিতরণ — বরিশাল",
    description: "নদীভাঙন ক্ষতিগ্রস্তদের মধ্যে জরুরি ত্রাণ বিতরণ।",
    instructions: "বরিশাল নদী তীরবর্তী ক্ষতিগ্রস্ত পরিবারগুলোর মধ্যে খাবার ও পানি বিতরণ করুন।",
    location: { name: "বরিশাল নদী তীর", district: "বরিশাল", lat: 22.701, lng: 90.3535 },
    priority: "high",
    status: "en_route",
    assignedTo: "তানজিলা খানম",
    assignedVolunteers: ["VOL-001", "VOL-004"],
    assignedAt: "আজ, ০৯:৩০ AM",
    affectedPeople: 200,
    resources: [
      { name: "খাবার প্যাকেট", quantity: 80, unit: "টি" },
      { name: "পানি", quantity: 120, unit: "বোতল" },
    ],
  },
];
