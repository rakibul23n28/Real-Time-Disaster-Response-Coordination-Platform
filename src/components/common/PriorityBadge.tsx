interface PriorityBadgeProps {
  priority: "critical" | "high" | "medium" | "low";
}

const config = {
  critical: { label: "অতি জরুরি", className: "bg-red-100 text-red-800 border border-red-300" },
  high: { label: "উচ্চ", className: "bg-orange-50 text-orange-700 border border-orange-200" },
  medium: { label: "মাঝারি", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  low: { label: "কম", className: "bg-slate-50 text-slate-600 border border-slate-200" },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = config[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
