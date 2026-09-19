export type InventoryCategory = "food" | "water" | "medical" | "other";

export const categoryConfig: Record<InventoryCategory, { label: string; icon: string }> = {
  food: { label: "খাদ্য", icon: "🍚" },
  water: { label: "পানি", icon: "💧" },
  medical: { label: "চিকিৎসা", icon: "💊" },
  other: { label: "অন্যান্য", icon: "📦" },
};

export const stockStatusConfig = {
  adequate: { label: "পর্যাপ্ত", color: "text-green-700 bg-green-50 border-green-200" },
  low: { label: "কম", color: "text-amber-700 bg-amber-50 border-amber-200" },
  critical: { label: "জরুরি", color: "text-red-700 bg-red-50 border-red-200" },
};
