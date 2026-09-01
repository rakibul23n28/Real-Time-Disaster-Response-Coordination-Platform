import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useAppState } from "../../hooks/useAppState";

const filters = [
  { key: "all", label: "সব" },
  { key: "assigned", label: "নতুন" },
  { key: "en_route", label: "পথে রয়েছে" },
  { key: "in_progress", label: "চলমান" },
  { key: "completed", label: "সম্পন্ন" },
  { key: "critical", label: "জরুরি" },
];

export default function VolunteerTasks() {
  const { tasks } = useAppState();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = !search || t.title.includes(search) || t.location.name.includes(search) || t.id.includes(search);
      const matchStatus = statusFilter === "all"
        ? true
        : statusFilter === "critical"
        ? t.priority === "critical"
        : t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, statusFilter, search]);

  return (
    <div className="max-w-5xl">
      <PageHeader title="আমার কাজ" subtitle="My Tasks — কাজের তালিকা ও অবস্থা" />

      <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 mb-5 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#66736D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="কাজ খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#DCE6E0] rounded-[9px] focus:border-[#2E7D5B] focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${statusFilter === f.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="কোনো কাজ পাওয়া যায়নি" description="কোনো কাজ নেই বা ফিল্টার পরিবর্তন করুন।" />
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-[#DCE6E0] p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-xs font-mono font-bold text-[#2E7D5B]">{task.id}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <h3 className="font-semibold text-[#17221D]">{task.title}</h3>
                  <p className="text-xs text-[#66736D] mt-1">📍 {task.location.name} · {task.location.district}</p>
                  <p className="text-xs text-[#66736D]">🕐 বরাদ্দ: {task.assignedAt}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-sm text-[#66736D] mb-3 line-clamp-2">{task.description}</p>
              <Link to={`/volunteer/tasks/${task.id}`}>
                <Button size="sm" variant="secondary">বিস্তারিত দেখুন →</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
