import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";
import StatCard from "../../components/common/StatCard";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { tasks, issues } = useAppState();

  const myTasks = tasks;
  const active = myTasks.filter((t) => t.status !== "completed");
  const done = myTasks.filter((t) => t.status === "completed");
  const critical = myTasks.filter((t) => t.priority === "critical" && t.status !== "completed");
  const topTask = critical[0] ?? active[0];

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="স্বেচ্ছাসেবক ড্যাশবোর্ড"
        subtitle="আপনার দায়িত্ব, দুর্যোগ এলাকা এবং মাঠপর্যায়ের কার্যক্রম দেখুন।"
        actions={
          <Link to="/volunteer/map">
            <Button variant="outline" size="sm">মানচিত্র দেখুন</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="সক্রিয় কাজ" subtitle="Active Tasks" value={String(active.length).padStart(2, "0")} icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} accent="primary" />
        <StatCard title="সম্পন্ন কাজ" subtitle="Completed" value={String(done.length).padStart(2, "0")} icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} accent="primary" />
        <StatCard title="জরুরি কাজ" subtitle="Critical" value={String(critical.length).padStart(2, "0")} icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} accent="danger" />
        <StatCard title="রিপোর্ট করা সমস্যা" subtitle="Field Issues" value={String(issues.length).padStart(2, "0")} icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H9.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>} accent="warning" />
      </div>

      {/* Active task highlight */}
      {topTask && (
        <div className={`rounded-xl border-2 p-5 ${topTask.priority === "critical" ? "border-red-200 bg-red-50/50" : "border-[#DCE6E0] bg-white"}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-xs font-mono text-[#66736D]">{topTask.id}</p>
                {topTask.priority === "critical" && <PriorityBadge priority="critical" />}
              </div>
              <h3 className="font-bold text-[#17221D] text-base mb-2">{topTask.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-[#66736D]">
                <span>📍 {topTask.location.name}</span>
                <span>👥 {topTask.affectedPeople.toLocaleString()} জন আক্রান্ত</span>
                <span>🕐 {topTask.assignedAt}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={topTask.status} />
              <Link to={`/volunteer/tasks/${topTask.id}`}>
                <Button size="sm">কাজটি দেখুন</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* All active tasks */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#17221D]">সক্রিয় কাজসমূহ</h2>
            <p className="text-xs text-[#66736D] mt-0.5">আপনার বর্তমান কাজের তালিকা</p>
          </div>
          <Link to="/volunteer/tasks" className="text-sm text-[#2E7D5B] font-medium hover:underline">সব দেখুন →</Link>
        </div>
        <div className="divide-y divide-[#DCE6E0]">
          {active.slice(0, 4).map((task) => (
            <div key={task.id} className="px-5 py-4 hover:bg-[#F4FBF6] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-[#17221D]">{task.title}</p>
                    <span className="text-xs font-mono text-[#66736D]">{task.id}</span>
                  </div>
                  <p className="text-xs text-[#66736D]">📍 {task.location.name} · {task.assignedAt}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
