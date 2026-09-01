import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";
import { mockIncidents } from "../../data/mockIncidents";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

const disasterTypeBn: Record<string, string> = {
  flood: "বন্যা",
  cyclone: "ঘূর্ণিঝড়",
  river_erosion: "নদীভাঙন",
  waterlogging: "জলাবদ্ধতা",
  landslide: "ভূমিধস",
};

const severityColor: Record<string, string> = { high: "#DC2626", medium: "#F59E0B", low: "#16A34A" };

const QuickActionCard = ({
  title, count, countLabel, to, accent,
}: { title: string; count: number; countLabel: string; to: string; accent: string }) => (
  <Link to={to} className="bg-white rounded-xl border border-[#DCE6E0] p-4 hover:shadow-sm hover:border-[#b0c4b8] transition-all group block">
    <p className="text-sm font-semibold text-[#17221D] mb-1 group-hover:text-[#2E7D5B] transition-colors">{title}</p>
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold ${accent}`}>{count}</span>
      <span className="text-xs text-[#66736D]">{countLabel}</span>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const { reports, tasks, issues, inventory } = useAppState();

  const pending = reports.filter((r) => r.status === "pending").length;
  const highSeverity = mockIncidents.filter((i) => i.severity === "high");
  const activeTasks = tasks.filter((t) => t.status !== "completed").length;
  const criticalInventory = inventory.filter((i) => i.status === "critical").length;
  const pendingRequests = 5;

  // Critical alert
  const criticalReport = reports.find((r) => r.severity === "high" && r.status === "pending");

  // Chart data — disaster type distribution
  const typeCount = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.disasterType] = (acc[r.disasterType] ?? 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(typeCount).map(([k, v]) => ({ name: disasterTypeBn[k] ?? k, value: v }));

  // Status donut
  const verified = reports.filter((r) => r.status === "verified").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;
  const ongoing = reports.filter((r) => r.status === "in_progress").length;
  const donutData = [
    { name: "যাচাইকৃত", value: verified, fill: "#2E7D5B" },
    { name: "অপেক্ষমাণ", value: pending, fill: "#F59E0B" },
    { name: "বাতিল", value: rejected, fill: "#DC2626" },
    { name: "চলমান", value: ongoing, fill: "#2563EB" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#17221D]">সমন্বয়কারী ড্যাশবোর্ড</h1>
          <p className="text-sm text-[#66736D] mt-0.5">হ্যালো, {user?.name?.split(" ")[0]} — দুর্যোগ পরিস্থিতি, রিপোর্ট ও কার্যক্রম এক নজরে পর্যবেক্ষণ করুন।</p>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 flex-shrink-0">
          <span className="size-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-700">{highSeverity.length}টি উচ্চ ঝুঁকি</span>
        </div>
      </div>

      {/* Emergency stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "সক্রিয় দুর্যোগ", value: mockIncidents.length, sub: "Active disasters", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500 animate-pulse" },
          { label: "উচ্চ ঝুঁকির এলাকা", value: highSeverity.length, sub: "High-risk zones", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
          { label: "যাচাইয়ের অপেক্ষায়", value: pending, sub: "Pending review", color: "text-[#2E7D5B]", bg: "bg-[#F4FBF6]", dot: "bg-[#2E7D5B]" },
          { label: "চলমান কার্যক্রম", value: activeTasks, sub: "Active operations", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-[#DCE6E0] p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`size-2 rounded-full ${s.dot}`} />
              <p className="text-xs font-medium text-[#66736D]">{s.label}</p>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value.toString().padStart(2, "0")}</p>
            <p className="text-[10px] text-[#66736D] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {criticalReport && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4">
          <div className="size-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="size-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800 mb-0.5">অতি জরুরি পরিস্থিতি</p>
            <p className="text-sm text-red-700">
              {criticalReport.location.name} অঞ্চলে {criticalReport.affectedPeople.toLocaleString()} জন মানুষ {disasterTypeBn[criticalReport.disasterType] ?? criticalReport.disasterType} আক্রান্ত। জরুরি ত্রাণ প্রয়োজন।
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to={`/admin/reports/${criticalReport.id}`}>
              <Button size="sm" variant="outline">বিস্তারিত</Button>
            </Link>
            <Link to="/admin/resources">
              <Button size="sm">ত্রাণ বরাদ্দ</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions + Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-[#17221D] text-sm">দ্রুত কার্যক্রম</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard title="রিপোর্ট যাচাই" count={pending} countLabel="অপেক্ষমাণ" to="/admin/reports" accent="text-[#2E7D5B]" />
            <QuickActionCard title="তীব্রতা বিশ্লেষণ" count={highSeverity.length} countLabel="উচ্চ ঝুঁকি" to="/admin/severity" accent="text-red-600" />
            <QuickActionCard title="ত্রাণ বরাদ্দ" count={pendingRequests} countLabel="অনুরোধ" to="/admin/resources" accent="text-amber-600" />
            <QuickActionCard title="মজুত ব্যবস্থাপনা" count={criticalInventory} countLabel="কম মজুত" to="/admin/inventory" accent="text-red-600" />
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-xl border border-[#DCE6E0] p-4">
          <h3 className="font-semibold text-[#17221D] text-sm mb-3">রিপোর্টের অবস্থা</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-[#66736D]">{d.name}</span>
                  <span className="font-bold text-[#17221D] ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-[#DCE6E0] p-4">
          <h3 className="font-semibold text-[#17221D] text-sm mb-3">দুর্যোগের ধরন অনুযায়ী</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11, fill: "#66736D" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #DCE6E0" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#2E7D5B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map preview */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#17221D]">বর্তমান দুর্যোগ পরিস্থিতি</h2>
            <p className="text-xs text-[#66736D] mt-0.5">আক্রান্ত এলাকা, মার্কার ও সক্রিয় কার্যক্রম</p>
          </div>
          <Link to="/admin/map" className="text-sm text-[#2E7D5B] font-medium hover:underline">বিস্তারিত মানচিত্র →</Link>
        </div>
        <div style={{ height: "280px" }}>
          <MapContainer center={[23.685, 90.356]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false} zoomControl={false}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {mockIncidents.map((inc) => (
              <CircleMarker
                key={inc.id}
                center={[inc.lat, inc.lng]}
                radius={inc.severity === "high" ? 12 : inc.severity === "medium" ? 8 : 6}
                pathOptions={{ color: severityColor[inc.severity], fillColor: severityColor[inc.severity], fillOpacity: 0.65, weight: 2 }}
              >
                <Popup>
                  <p className="font-bold text-sm">{inc.location}</p>
                  <p className="text-xs text-gray-500">{inc.disasterType} · {inc.affectedPeople.toLocaleString()} জন</p>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <div className="px-5 py-2.5 border-t border-[#DCE6E0] flex items-center gap-5 text-xs text-[#66736D]">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#DC2626]" /> উচ্চ ঝুঁকি</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#F59E0B]" /> মাঝারি ঝুঁকি</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#16A34A]" /> কম ঝুঁকি</span>
        </div>
      </div>

      {/* Bottom grid: recent reports + resource status */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent reports */}
        <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
            <h2 className="font-semibold text-[#17221D]">সাম্প্রতিক রিপোর্ট</h2>
            <Link to="/admin/reports" className="text-sm text-[#2E7D5B] font-medium hover:underline">সব রিপোর্ট →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DCE6E0] bg-[#F4FBF6]">
                  {["ID", "দুর্যোগ", "অবস্থান", "তীব্রতা", "সময়", "অবস্থা", ""].map((h) => (
                    <th key={h} className="text-left px-3.5 py-2 text-[10px] font-semibold text-[#66736D] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6E0]">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-[#F4FBF6] transition-colors">
                    <td className="px-3.5 py-2.5 text-xs font-mono font-bold text-[#2E7D5B]">{r.id}</td>
                    <td className="px-3.5 py-2.5 text-xs text-[#17221D]">{disasterTypeBn[r.disasterType] ?? r.disasterType}</td>
                    <td className="px-3.5 py-2.5 text-xs text-[#66736D] whitespace-nowrap">{r.location.name}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${r.severity === "high" ? "bg-red-50 text-red-700" : r.severity === "medium" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                        {r.severity === "high" ? "উচ্চ" : r.severity === "medium" ? "মাঝারি" : "কম"}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-[10px] text-[#66736D] whitespace-nowrap">{r.displayTime}</td>
                    <td className="px-3.5 py-2.5"><StatusBadge status={r.status} size="sm" /></td>
                    <td className="px-3.5 py-2.5">
                      <Link to={`/admin/reports/${r.id}`} className="text-xs text-[#2E7D5B] font-medium hover:underline whitespace-nowrap">দেখুন</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource status */}
        <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
            <h2 className="font-semibold text-[#17221D]">সম্পদের অবস্থান</h2>
            <Link to="/admin/inventory" className="text-sm text-[#2E7D5B] font-medium hover:underline">মজুত →</Link>
          </div>
          <div className="divide-y divide-[#DCE6E0]">
            {inventory.slice(0, 5).map((item) => {
              const pct = Math.round((item.available / item.total) * 100);
              return (
                <div key={item.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-[#17221D]">{item.nameBn}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#17221D]">{item.available.toLocaleString()}</span>
                      <span className="text-[10px] text-[#66736D]">{item.unit}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                        item.status === "adequate" ? "bg-green-50 text-green-700 border-green-200" :
                        item.status === "low" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {item.status === "adequate" ? "পর্যাপ্ত" : item.status === "low" ? "কম" : "জরুরি"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#F4FBF6] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${item.status === "adequate" ? "bg-[#2E7D5B]" : item.status === "low" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-[#66736D] mt-0.5">{pct}% উপলব্ধ</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operations overview */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
          <h2 className="font-semibold text-[#17221D]">অপারেশন সারসংক্ষেপ</h2>
          <Link to="/admin/operations" className="text-sm text-[#2E7D5B] font-medium hover:underline">বিস্তারিত →</Link>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: "সক্রিয় কার্যক্রম", value: activeTasks, color: "text-blue-600" },
              { label: "মাঠের সমস্যা", value: issues.filter((i) => i.status === "reported").length, color: "text-amber-600" },
              { label: "সম্পন্ন", value: tasks.filter((t) => t.status === "completed").length, color: "text-green-600" },
              { label: "মোট রিপোর্ট", value: reports.length, color: "text-[#17221D]" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[#66736D]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {tasks.filter((t) => t.status !== "completed").slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 bg-[#F4FBF6] rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#2E7D5B]">{task.id}</span>
                    <p className="text-sm font-semibold text-[#17221D] truncate">{task.title}</p>
                  </div>
                  <p className="text-xs text-[#66736D]">📍 {task.location.name} · {task.assignedVolunteers.length} জন স্বেচ্ছাসেবক</p>
                </div>
                <StatusBadge status={task.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
