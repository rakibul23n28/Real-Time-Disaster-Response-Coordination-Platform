interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  pending: { label: "অপেক্ষমাণ", className: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  verified: { label: "যাচাইকৃত", className: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500" },
  rejected: { label: "বাতিল", className: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500" },
  in_progress: { label: "চলমান", className: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  en_route: { label: "পথে রয়েছে", className: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400" },
  completed: { label: "সম্পন্ন", className: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-600" },
  critical: { label: "অতি জরুরি", className: "bg-red-100 text-red-800 border border-red-300", dot: "bg-red-700" },
  assigned: { label: "বরাদ্দকৃত", className: "bg-purple-50 text-purple-700 border border-purple-200", dot: "bg-purple-500" },
  active: { label: "সক্রিয়", className: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500" },
  monitoring: { label: "পর্যবেক্ষণে", className: "bg-yellow-50 text-yellow-700 border border-yellow-200", dot: "bg-yellow-500" },
  resolved: { label: "সমাধান হয়েছে", className: "bg-slate-50 text-slate-600 border border-slate-200", dot: "bg-slate-400" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-slate-50 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  const px = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${px} ${config.className}`}>
      <span className={`size-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
