import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useAppState } from "../../hooks/useAppState";

const disasterTypeBn: Record<string, string> = {
  flood: "বন্যা", cyclone: "ঘূর্ণিঝড়", river_erosion: "নদীভাঙন",
  waterlogging: "জলাবদ্ধতা", landslide: "ভূমিধস",
};

const statusFilters = [
  { key: "all", label: "সব" },
  { key: "pending", label: "অপেক্ষমাণ" },
  { key: "verified", label: "যাচাইকৃত" },
  { key: "rejected", label: "বাতিল" },
  { key: "in_progress", label: "চলমান" },
];
const typeFilters = [
  { key: "all", label: "সব" },
  { key: "বন্যা", label: "বন্যা" },
  { key: "ঘূর্ণিঝড়", label: "ঘূর্ণিঝড়" },
  { key: "নদীভাঙন", label: "নদীভাঙন" },
  { key: "জলাবদ্ধতা", label: "জলাবদ্ধতা" },
  { key: "ভূমিধস", label: "ভূমিধস" },
];
const severityFilters = [
  { key: "all", label: "সব" },
  { key: "high", label: "উচ্চ" },
  { key: "medium", label: "মাঝারি" },
  { key: "low", label: "কম" },
];

export default function ReportVerification() {
  const { reports } = useAppState();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = useMemo(() => reports.filter((r) => {
    const matchSearch = !search || r.id.includes(search) || r.location.name.includes(search) || r.reporterName.includes(search) || r.disasterType.includes(search);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.disasterType === typeFilter;
    const matchSev = severityFilter === "all" || r.severity === severityFilter;
    return matchSearch && matchStatus && matchType && matchSev;
  }), [reports, search, statusFilter, typeFilter, severityFilter]);

  const FilterBar = ({ options, value, onChange }: { options: { key: string; label: string }[]; value: string; onChange: (k: string) => void }) => (
    <div className="flex gap-1 flex-wrap">
      {options.map((o) => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${value === o.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader title="দুর্যোগ রিপোর্ট যাচাই" subtitle="নাগরিকদের পাঠানো রিপোর্ট পর্যালোচনা ও যাচাই করুন।" />

      <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#66736D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="রিপোর্ট খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#DCE6E0] rounded-[9px] focus:border-[#2E7D5B] focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2"><span className="text-[#66736D] font-medium">অবস্থা:</span><FilterBar options={statusFilters} value={statusFilter} onChange={setStatusFilter} /></div>
          <div className="flex items-center gap-2"><span className="text-[#66736D] font-medium">দুর্যোগ:</span><FilterBar options={typeFilters} value={typeFilter} onChange={setTypeFilter} /></div>
          <div className="flex items-center gap-2"><span className="text-[#66736D] font-medium">তীব্রতা:</span><FilterBar options={severityFilters} value={severityFilter} onChange={setSeverityFilter} /></div>
        </div>
        <p className="text-xs text-[#66736D]">{filtered.length}টি রিপোর্ট পাওয়া গেছে</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="কোনো রিপোর্ট পাওয়া যায়নি" description="ফিল্টার পরিবর্তন করুন বা অনুসন্ধান করুন।" />
      ) : (
        <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DCE6E0] bg-[#F4FBF6]">
                  {["রিপোর্ট ID", "দুর্যোগ", "অবস্থান", "রিপোর্টকারী", "আক্রান্ত", "তীব্রতা", "তারিখ", "অবস্থা", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#66736D] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6E0]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F4FBF6] transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-bold text-[#2E7D5B]">{r.id}</td>
                    <td className="px-4 py-3 text-xs text-[#17221D]">{disasterTypeBn[r.disasterType] ?? r.disasterType}</td>
                    <td className="px-4 py-3 text-xs text-[#66736D] whitespace-nowrap">{r.location.name}</td>
                    <td className="px-4 py-3 text-xs text-[#66736D] whitespace-nowrap">{r.reporterName}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#17221D]">{r.affectedPeople.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.severity === "high" ? "bg-red-50 text-red-700" : r.severity === "medium" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                        {r.severity === "high" ? "উচ্চ" : r.severity === "medium" ? "মাঝারি" : "কম"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#66736D] whitespace-nowrap">{r.displayTime}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/reports/${r.id}`}>
                        <Button size="sm" variant="secondary">পর্যালোচনা করুন</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
