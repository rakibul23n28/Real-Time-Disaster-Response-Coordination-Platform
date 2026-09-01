interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: "primary" | "danger" | "warning" | "info";
}

const accentColors = {
  primary: "text-[#2E7D5B] bg-[#E8F5E9]",
  danger: "text-[#DC2626] bg-red-50",
  warning: "text-[#F59E0B] bg-amber-50",
  info: "text-[#2563EB] bg-blue-50",
};

export default function StatCard({ title, subtitle, value, icon, trend, accent = "primary" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#17221D]">{title}</p>
          {subtitle && <p className="text-[11px] text-[#66736D] mt-0.5">{subtitle}</p>}
          <p className="text-2xl font-bold text-[#17221D] mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.up ? "text-green-600" : "text-red-500"}`}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${accentColors[accent]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
