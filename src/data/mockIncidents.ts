export interface Incident {
  id: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  severity: "high" | "medium" | "low";
  disasterType: string;
  affectedPeople: number;
  activeVolunteers: number;
  status: "active" | "monitoring" | "resolved";
}

export const mockIncidents: Incident[] = [
  { id: "INC-001", location: "সুনামগঞ্জ", district: "সুনামগঞ্জ", lat: 24.8917, lng: 91.3967, severity: "high", disasterType: "বন্যা", affectedPeople: 3200, activeVolunteers: 24, status: "active" },
  { id: "INC-002", location: "কক্সবাজার", district: "কক্সবাজার", lat: 21.4272, lng: 92.0058, severity: "high", disasterType: "ঘূর্ণিঝড়", affectedPeople: 1500, activeVolunteers: 18, status: "active" },
  { id: "INC-003", location: "সিলেট", district: "সিলেট", lat: 24.8949, lng: 91.8687, severity: "medium", disasterType: "জলাবদ্ধতা", affectedPeople: 850, activeVolunteers: 12, status: "active" },
  { id: "INC-004", location: "রাঙামাটি", district: "রাঙামাটি", lat: 22.6353, lng: 92.1673, severity: "high", disasterType: "ভূমিধস", affectedPeople: 420, activeVolunteers: 8, status: "active" },
  { id: "INC-005", location: "খুলনা", district: "খুলনা", lat: 22.8456, lng: 89.5403, severity: "medium", disasterType: "বন্যা", affectedPeople: 1200, activeVolunteers: 15, status: "monitoring" },
  { id: "INC-006", location: "বরিশাল", district: "বরিশাল", lat: 22.701, lng: 90.3535, severity: "medium", disasterType: "নদীভাঙন", affectedPeople: 580, activeVolunteers: 7, status: "monitoring" },
  { id: "INC-007", location: "ময়মনসিংহ", district: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203, severity: "low", disasterType: "বন্যা", affectedPeople: 290, activeVolunteers: 5, status: "monitoring" },
];

export const mockNotifications = [
  { id: "N001", message: "নতুন কাজ বরাদ্দ হয়েছে — সুনামগঞ্জ উদ্ধার অভিযান", time: "১০ মিনিট আগে", read: false, type: "task" },
  { id: "N002", message: "RPT-001 যাচাইকৃত হয়েছে — সুনামগঞ্জ বন্যা", time: "৩০ মিনিট আগে", read: false, type: "report" },
  { id: "N003", message: "কক্সবাজারে নতুন ঘূর্ণিঝড় সতর্কতা", time: "১ ঘণ্টা আগে", read: true, type: "alert" },
  { id: "N004", message: "ত্রাণ বরাদ্দ আপডেট — সিলেট অঞ্চল", time: "২ ঘণ্টা আগে", read: true, type: "resource" },
];
