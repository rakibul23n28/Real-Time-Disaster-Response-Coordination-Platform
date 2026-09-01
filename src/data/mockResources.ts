export interface ResourceItem {
  id: string;
  name: string;
  category: "food" | "water" | "medicine" | "equipment" | "shelter";
  available: number;
  unit: string;
  location: string;
  lastUpdated: string;
}

export const mockResources: ResourceItem[] = [
  { id: "RES-001", name: "শুকনো খাবার প্যাকেট", category: "food", available: 2400, unit: "প্যাকেট", location: "ঢাকা কেন্দ্রীয় গুদাম", lastUpdated: "আজ" },
  { id: "RES-002", name: "বিশুদ্ধ পানির বোতল", category: "water", available: 8000, unit: "বোতল", location: "ঢাকা কেন্দ্রীয় গুদাম", lastUpdated: "আজ" },
  { id: "RES-003", name: "ওআরএস স্যালাইন", category: "medicine", available: 5000, unit: "প্যাকেট", location: "সিলেট আঞ্চলিক গুদাম", lastUpdated: "গতকাল" },
  { id: "RES-004", name: "তাঁবু / শেল্টার", category: "shelter", available: 320, unit: "টি", location: "চট্টগ্রাম গুদাম", lastUpdated: "গতকাল" },
  { id: "RES-005", name: "কম্বল", category: "shelter", available: 1800, unit: "টি", location: "ঢাকা কেন্দ্রীয় গুদাম", lastUpdated: "আজ" },
  { id: "RES-006", name: "লাইফ জ্যাকেট", category: "equipment", available: 450, unit: "টি", location: "সুনামগঞ্জ ফিল্ড অফিস", lastUpdated: "আজ" },
  { id: "RES-007", name: "নৌকা (রেসকিউ)", category: "equipment", available: 28, unit: "টি", location: "সুনামগঞ্জ ফিল্ড অফিস", lastUpdated: "আজ" },
  { id: "RES-008", name: "প্রাথমিক চিকিৎসা কিট", category: "medicine", available: 890, unit: "টি", location: "রাজশাহী আঞ্চলিক গুদাম", lastUpdated: "২ দিন আগে" },
];
