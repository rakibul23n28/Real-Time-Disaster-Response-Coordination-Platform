export type InventoryCategory = "food" | "water" | "medical" | "other";
export type StockStatus = "adequate" | "low" | "critical";

export interface InventoryItem {
  id: string;
  nameBn: string;
  category: InventoryCategory;
  total: number;
  available: number;
  allocated: number;
  unit: string;
  depot: string;
  status: StockStatus;
}

export const categoryConfig: Record<InventoryCategory, { label: string; icon: string }> = {
  food: { label: "খাদ্য", icon: "🍚" },
  water: { label: "পানি", icon: "💧" },
  medical: { label: "চিকিৎসা", icon: "💊" },
  other: { label: "অন্যান্য", icon: "📦" },
};

export const stockStatusConfig: Record<StockStatus, { label: string; color: string }> = {
  adequate: { label: "পর্যাপ্ত", color: "text-green-700 bg-green-50 border-green-200" },
  low: { label: "কম", color: "text-amber-700 bg-amber-50 border-amber-200" },
  critical: { label: "জরুরি", color: "text-red-700 bg-red-50 border-red-200" },
};

export const mockInventory: InventoryItem[] = [
  { id: "INV-001", nameBn: "বিশুদ্ধ পানি", category: "water", total: 1500, available: 720, allocated: 780, unit: "বোতল", depot: "সুনামগঞ্জ ত্রাণকেন্দ্র", status: "adequate" },
  { id: "INV-002", nameBn: "খাবার প্যাকেট", category: "food", total: 2000, available: 450, allocated: 1550, unit: "প্যাকেট", depot: "ঢাকা কেন্দ্রীয় গুদাম", status: "low" },
  { id: "INV-003", nameBn: "প্রাথমিক ওষুধ কিট", category: "medical", total: 600, available: 120, allocated: 480, unit: "কিট", depot: "চট্টগ্রাম মেডিকেল ডিপো", status: "critical" },
  { id: "INV-004", nameBn: "কম্বল", category: "other", total: 800, available: 340, allocated: 460, unit: "পিস", depot: "সিলেট ত্রাণকেন্দ্র", status: "adequate" },
  { id: "INV-005", nameBn: "চাল", category: "food", total: 5000, available: 1200, allocated: 3800, unit: "কেজি", depot: "ময়মনসিংহ গুদাম", status: "low" },
  { id: "INV-006", nameBn: "ওআরএস স্যালাইন", category: "medical", total: 1000, available: 380, allocated: 620, unit: "প্যাকেট", depot: "কুমিল্লা মেডিকেল ডিপো", status: "adequate" },
  { id: "INV-007", nameBn: "ত্রিপল / শেড", category: "other", total: 400, available: 85, allocated: 315, unit: "পিস", depot: "খুলনা ত্রাণকেন্দ্র", status: "critical" },
  { id: "INV-008", nameBn: "খাওয়ার পানি (ড্রাম)", category: "water", total: 200, available: 150, allocated: 50, unit: "ড্রাম", depot: "বরিশাল ডিপো", status: "adequate" },
];
