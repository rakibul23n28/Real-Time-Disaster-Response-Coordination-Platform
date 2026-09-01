import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import { useCitizenReports } from "../../hooks/useCitizenReports";

const statusFilters = [
  { key: "all", label: "সব" },
  { key: "pending", label: "অপেক্ষমাণ" },
  { key: "verified", label: "যাচাইকৃত" },
  { key: "rejected", label: "বাতিল" },
  { key: "in_progress", label: "চলমান" },
  { key: "completed", label: "সম্পন্ন" },
];

const disasterTypeOptions = ["বন্যা", "ঘূর্ণিঝড়", "নদীভাঙন", "জলাবদ্ধতা", "ভূমিধস", "অন্যান্য"];

export default function MyReports() {
  const navigate = useNavigate();
  const { reports, loading, error } = useCitizenReports({ autoFetch: true });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch = !search || r.title.includes(search) || r.location.name.includes(search) || String(r.id).includes(search);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchType = typeFilter === "all" || r.disasterType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [reports, search, statusFilter, typeFilter]);

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="আমার রিপোর্ট"
        subtitle="My Reports"
        actions={
          <Link to="/citizen/report">
            <Button size="sm">+ নতুন রিপোর্ট</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 mb-5 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#66736D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="রিপোর্ট খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#DCE6E0] rounded-[9px] focus:border-[#2E7D5B] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${statusFilter === f.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-[#DCE6E0] rounded-lg px-2 py-1.5 text-[#66736D] focus:border-[#2E7D5B] focus:outline-none"
          >
            <option value="all">সব ধরন</option>
            {disasterTypeOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="hidden sm:block bg-white rounded-xl border border-[#DCE6E0] overflow-hidden p-4">
          <div className="space-y-2">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="কোনো রিপোর্ট পাওয়া যায়নি"
          description="বর্তমানে কোনো রিপোর্ট নেই বা ফিল্টার পরিবর্তন করুন।"
          action={{ label: "নতুন রিপোর্ট তৈরি করুন", onClick: () => navigate("/citizen/report") }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4FBF6] border-b border-[#DCE6E0]">
                    {["রিপোর্ট ID", "শিরোনাম", "দুর্যোগের ধরন", "অবস্থান", "তারিখ", "অবস্থা", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#66736D] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE6E0]">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F4FBF6] transition-colors">
                      <td className="px-4 py-3.5 text-xs font-mono text-[#2E7D5B] font-semibold whitespace-nowrap">{r.id}</td>
                      <td className="px-4 py-3.5 text-sm text-[#17221D] max-w-[200px] truncate">{r.title}</td>
                      <td className="px-4 py-3.5 text-sm text-[#66736D] whitespace-nowrap">{r.disasterType}</td>
                      <td className="px-4 py-3.5 text-sm text-[#17221D] whitespace-nowrap">{r.location.name}</td>
                      <td className="px-4 py-3.5 text-xs text-[#66736D] whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("bn-BD")}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={r.status} size="sm" /></td>
                      <td className="px-4 py-3.5">
                        <Link to={`/citizen/reports/${r.id}`} className="text-xs font-medium text-[#2E7D5B] hover:underline whitespace-nowrap">বিস্তারিত →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-[#DCE6E0] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#2E7D5B]">{r.id}</span>
                  <StatusBadge status={r.status} size="sm" />
                </div>
                <p className="text-sm font-semibold text-[#17221D]">{r.title}</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#66736D]">
                  <span>{r.disasterType}</span>
                  <span>·</span>
                  <span>📍 {r.location.name}</span>
                  <span>·</span>
                  <span>{new Date(r.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>
                <Link to={`/citizen/reports/${r.id}`}>
                  <Button size="sm" variant="secondary" fullWidth>বিস্তারিত দেখুন</Button>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
