import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { reports } = useAppState();

  const myReports = reports.filter((r) => r.reporterId === user?.id);
  const stats = {
    total: myReports.length,
    verified: myReports.filter((r) => r.status === "verified").length,
    pending: myReports.filter((r) => r.status === "pending").length,
    completed: myReports.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="নাগরিক ড্যাশবোর্ড"
        subtitle="আপনার রিপোর্ট ও আশেপাশের দুর্যোগ পরিস্থিতি দেখুন।"
      />

      {/* Emergency CTA */}
      <div className="bg-gradient-to-r from-[#2E7D5B] to-[#185C43] rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-white text-lg">আপনার এলাকায় দুর্যোগ দেখেছেন?</h3>
          <p className="text-[#b8e8d0] text-sm mt-0.5">দ্রুত তথ্য প্রদান করুন যাতে সংশ্লিষ্ট কর্তৃপক্ষ ব্যবস্থা নিতে পারে।</p>
        </div>
        <Link to="/citizen/report">
          <button className="flex-shrink-0 px-5 py-2.5 bg-white text-[#2E7D5B] font-bold rounded-[9px] hover:bg-[#f0f9f4] transition-colors shadow-sm text-sm whitespace-nowrap">
            দুর্যোগ রিপোর্ট করুন
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="মোট রিপোর্ট"
          subtitle="Total Reports"
          value={String(stats.total).padStart(2, "0")}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          accent="primary"
        />
        <StatCard
          title="যাচাইকৃত"
          subtitle="Verified"
          value={String(stats.verified).padStart(2, "0")}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          accent="primary"
        />
        <StatCard
          title="অপেক্ষমাণ"
          subtitle="Pending"
          value={String(stats.pending).padStart(2, "0")}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          accent="warning"
        />
        <StatCard
          title="সম্পন্ন"
          subtitle="Completed"
          value={String(stats.completed).padStart(2, "0")}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>}
          accent="primary"
        />
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#17221D]">সাম্প্রতিক রিপোর্ট</h2>
            <p className="text-xs text-[#66736D] mt-0.5">আপনার সর্বশেষ দুর্যোগ রিপোর্টসমূহ</p>
          </div>
          <Link to="/citizen/reports" className="text-sm text-[#2E7D5B] font-medium hover:underline">সব দেখুন →</Link>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4FBF6] border-b border-[#DCE6E0]">
                {["রিপোর্ট ID", "দুর্যোগের ধরন", "অবস্থান", "তারিখ", "অবস্থা", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-[#66736D] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6E0]">
              {myReports.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-[#F4FBF6] transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-[#2E7D5B] font-semibold whitespace-nowrap">{r.id}</td>
                  <td className="px-5 py-3 text-sm text-[#66736D] whitespace-nowrap">{r.disasterType}</td>
                  <td className="px-5 py-3 text-sm text-[#17221D] whitespace-nowrap">{r.location.name}</td>
                  <td className="px-5 py-3 text-xs text-[#66736D] whitespace-nowrap">{r.displayTime}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} size="sm" /></td>
                  <td className="px-5 py-3">
                    <Link to={`/citizen/reports/${r.id}`} className="text-xs font-medium text-[#2E7D5B] hover:underline whitespace-nowrap">দেখুন →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-[#DCE6E0]">
          {myReports.slice(0, 5).map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#2E7D5B]">{r.id}</span>
                <StatusBadge status={r.status} size="sm" />
              </div>
              <p className="text-sm font-semibold text-[#17221D]">{r.title}</p>
              <p className="text-xs text-[#66736D]">{r.disasterType} · {r.location.name} · {r.displayTime}</p>
              <Link to={`/citizen/reports/${r.id}`}>
                <Button size="sm" variant="secondary" fullWidth>বিস্তারিত দেখুন</Button>
              </Link>
            </div>
          ))}
        </div>

        {myReports.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-[#66736D]">কোনো রিপোর্ট পাওয়া যায়নি।</p>
            <Link to="/citizen/report" className="text-sm text-[#2E7D5B] font-medium hover:underline mt-1 block">নতুন রিপোর্ট তৈরি করুন →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
