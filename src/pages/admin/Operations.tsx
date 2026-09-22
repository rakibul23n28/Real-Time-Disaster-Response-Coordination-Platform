import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import Button from "../../components/common/Button";
import { useAdminData } from "../../hooks/useAdminData";
import { issueTypeConfig } from "../../data/issueTypes";
import { useToast } from "../../components/common/Toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { apiClient, type ApiVolunteer, type DonationLogEntry } from "../../lib/api";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const statusProgress: Record<string, number> = {
  assigned: 15,
  en_route: 40,
  in_progress: 65,
  completed: 100,
};

const issueStatusConfig: Record<string, { label: string; color: string }> = {
  reported: { label: "জানানো হয়েছে", color: "text-amber-700 bg-amber-50 border-amber-200" },
  acknowledged: { label: "দেখা হয়েছে", color: "text-blue-700 bg-blue-50 border-blue-200" },
  resolved: { label: "সমাধান হয়েছে", color: "text-green-700 bg-green-50 border-green-200" },
};

const opSteps = [
  "রিপোর্ট পাওয়া গেছে",
  "রিপোর্ট যাচাই",
  "সম্পদ বরাদ্দ",
  "স্বেচ্ছাসেবক পথে",
  "কাজ চলছে",
  "কাজ সম্পন্ন",
];

function taskStepIndex(status: string): number {
  const map: Record<string, number> = { assigned: 3, en_route: 3, in_progress: 4, completed: 5 };
  return map[status] ?? 3;
}

export default function Operations() {
  const { tasks, issues, updateIssueStatus } = useAdminData();
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [pendingDonations, setPendingDonations] = useState<DonationLogEntry[]>([]);
  const [confirmingDonation, setConfirmingDonation] = useState<number | null>(null);
  const [volunteers, setVolunteers] = useState<ApiVolunteer[]>([]);
  const [assignmentTaskId, setAssignmentTaskId] = useState(0);
  const [assignmentVolunteerId, setAssignmentVolunteerId] = useState(0);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    void apiClient.getPendingDonations().then(setPendingDonations).catch(() => setPendingDonations([]));
    void apiClient.getVolunteers().then(setVolunteers).catch(() => setVolunteers([]));
  }, []);

  const assignVolunteer = async () => {
    if (!assignmentTaskId || !assignmentVolunteerId) return;
    setAssigning(true);
    try {
      await apiClient.assignTask(assignmentTaskId, assignmentVolunteerId);
      showToast("নির্দিষ্ট দুর্যোগ এলাকার কাজে স্বেচ্ছাসেবক নিয়োগ হয়েছে।", "success");
      setAssignmentTaskId(0); setAssignmentVolunteerId(0);
    } catch (error) { showToast(error instanceof Error ? error.message : "স্বেচ্ছাসেবক নিয়োগ করা যায়নি।", "error"); }
    finally { setAssigning(false); }
  };

  const confirmDonation = async (id: number) => {
    setConfirmingDonation(id);
    try {
      await apiClient.confirmDonation(id);
      setPendingDonations((current) => current.filter((donation) => donation.id !== id));
      showToast("অনুদানটি নিশ্চিত হয়েছে এবং এখন public log-এ দেখা যাবে।", "success");
    } catch {
      showToast("অনুদানটি নিশ্চিত করা যায়নি।", "error");
    } finally { setConfirmingDonation(null); }
  };

  const activeCount = tasks.filter((t) => t.status !== "completed").length;
  const enRoute = tasks.filter((t) => t.status === "en_route").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const openIssues = issues.filter((i) => i.status === "reported").length;

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="অপারেশন পর্যবেক্ষণ" subtitle="বর্তমান দুর্যোগ মোকাবিলার কার্যক্রম এক নজরে পর্যবেক্ষণ করুন।" />

      <section className="rounded-xl border border-[#DCE6E0] bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#DCE6E0]">
          <div><h2 className="font-semibold text-[#17221D]">অনুদান নিশ্চিতকরণ</h2><p className="text-xs text-[#66736D] mt-0.5">প্রাপ্ত অনুদান যাচাই করে public log-এ প্রকাশ করুন।</p></div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">অপেক্ষমাণ {pendingDonations.length}</span>
        </div>
        {pendingDonations.length === 0 ? <p className="px-5 py-6 text-sm text-[#66736D]">নিশ্চিত করার জন্য কোনো নতুন অনুদান নেই।</p> : <div className="divide-y divide-[#DCE6E0]">{pendingDonations.map((donation) => <div key={donation.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#17221D]">{donation.donor_name} · {donation.category === "food" ? "খাদ্য" : donation.category === "water" ? "পানি" : donation.category === "medical" ? "চিকিৎসা" : "অন্যান্য"}</p><p className="text-xs text-[#66736D]">{donation.donation_type === "money" ? `৳${Number(donation.amount).toLocaleString("bn-BD")}` : `${donation.item_name} · ${donation.quantity} ${donation.unit}`} · {donation.place_name}</p><p className="text-[11px] text-[#66736D]">জমা: {new Date(donation.created_at).toLocaleString("bn-BD")}</p></div><Button size="sm" onClick={() => void confirmDonation(donation.id)} disabled={confirmingDonation === donation.id}>{confirmingDonation === donation.id ? "নিশ্চিত করা হচ্ছে..." : "নিশ্চিত করুন"}</Button></div>)}</div>}
      </section>

      <section className="rounded-xl border border-[#DCE6E0] bg-white p-5">
        <div className="mb-4"><h2 className="font-semibold text-[#17221D]">এলাকাভিত্তিক স্বেচ্ছাসেবক নিয়োগ</h2><p className="text-xs text-[#66736D] mt-0.5">দুর্যোগ এলাকার কাজ নির্বাচন করে একজন স্বেচ্ছাসেবককে পাঠান।</p></div>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="text-sm">কাজ ও এলাকা<select className="input-base mt-1" value={assignmentTaskId} onChange={(event) => setAssignmentTaskId(Number(event.target.value))}><option value={0}>কাজ নির্বাচন করুন</option>{tasks.filter((task) => task.status !== "completed").map((task) => <option key={task.id} value={task.id}>{task.task_code} · {task.title} · {task.location_name ?? "অজানা এলাকা"}</option>)}</select></label>
          <label className="text-sm">স্বেচ্ছাসেবক<select className="input-base mt-1" value={assignmentVolunteerId} onChange={(event) => setAssignmentVolunteerId(Number(event.target.value))}><option value={0}>স্বেচ্ছাসেবক নির্বাচন করুন</option>{volunteers.map((volunteer) => <option key={volunteer.id} value={volunteer.id}>{volunteer.name}{volunteer.is_available ? " · উপলব্ধ" : " · বর্তমানে ব্যস্ত"}</option>)}</select></label>
          <Button size="sm" onClick={() => void assignVolunteer()} disabled={!assignmentTaskId || !assignmentVolunteerId} loading={assigning}>নিয়োগ করুন</Button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "সক্রিয় কার্যক্রম", value: activeCount, color: "text-blue-600" },
          { label: "পথে রয়েছে", value: enRoute, color: "text-amber-600" },
          { label: "চলমান", value: inProgress, color: "text-[#2E7D5B]" },
          { label: "সম্পন্ন", value: completed, color: "text-[#17221D]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#DCE6E0] p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value.toString().padStart(2, "0")}</p>
            <p className="text-xs text-[#66736D] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Operations table */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-semibold text-[#17221D]">সক্রিয় কার্যক্রম</h3>
          {tasks.map((task) => {
            const progress = statusProgress[task.status] ?? 0;
            const isSelected = selectedTask?.id === task.id;
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(isSelected ? null : task)}
                className={`w-full text-left bg-white rounded-xl border transition-all p-4 ${isSelected ? "border-[#2E7D5B] shadow-sm" : "border-[#DCE6E0] hover:border-[#b0c4b8]"}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-[#2E7D5B]">{task.id}</span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-sm font-semibold text-[#17221D]">{task.title}</p>
                    <p className="text-xs text-[#66736D]">📍 {task.location_name ?? "অজানা স্থান"} · 👤 {task.assignments?.length ?? 0} জন</p>
                  </div>
                  <StatusBadge status={task.status} size="sm" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-[#66736D] mb-1">
                    <span>অগ্রগতি</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4FBF6] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#2E7D5B] transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Task detail / issue panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTask ? (
            <>
              <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#17221D]">কাজের বিস্তারিত</h3>
                  <Link to={`/volunteer/tasks/${selectedTask.id}`} className="text-xs text-[#2E7D5B] hover:underline">মাঠ ভিউ →</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div><p className="text-xs text-[#66736D]">কাজ</p><p className="font-semibold text-[#17221D] text-xs">{selectedTask.title}</p></div>
                  <div><p className="text-xs text-[#66736D]">এলাকা</p><p className="font-semibold text-[#17221D] text-xs">{selectedTask.location_name ?? "অজানা স্থান"}</p></div>
                  <div><p className="text-xs text-[#66736D]">স্বেচ্ছাসেবক</p><p className="font-semibold text-[#17221D] text-xs">{selectedTask.assignments?.length ?? 0} জন</p></div>
                  <div><p className="text-xs text-[#66736D]">অগ্রগতি</p><p className="font-semibold text-[#17221D] text-xs">{selectedTask.progress ?? statusProgress[selectedTask.status] ?? 0}%</p></div>
                </div>
                <div className="rounded-xl overflow-hidden mb-3" style={{ height: "160px" }}>
                  <MapContainer center={[Number(selectedTask.loc_lat ?? 23.685), Number(selectedTask.loc_lng ?? 90.356)]} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false} zoomControl={false}>
                    <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[Number(selectedTask.loc_lat ?? 23.685), Number(selectedTask.loc_lng ?? 90.356)]} icon={defaultIcon}>
                      <Popup>{selectedTask.location_name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                {/* Op steps timeline */}
                <h4 className="text-xs font-semibold text-[#17221D] mb-2">কাজের অগ্রগতি</h4>
                <div className="space-y-1">
                  {opSteps.map((step, i) => {
                    const stepIdx = taskStepIndex(selectedTask.status);
                    const isDone = i < stepIdx;
                    const isCurrent = i === stepIdx;
                    return (
                      <div key={step} className="flex items-center gap-2.5">
                        <span className={`size-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${isDone ? "border-[#2E7D5B] bg-[#2E7D5B] text-white" : isCurrent ? "border-[#2E7D5B] bg-white text-[#2E7D5B]" : "border-[#DCE6E0] bg-white"}`}>
                          {isDone ? "✓" : isCurrent ? "●" : ""}
                        </span>
                        <span className={`text-xs ${isDone ? "text-[#17221D] font-medium" : isCurrent ? "text-[#2E7D5B] font-semibold" : "text-[#66736D]"}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-[#DCE6E0] p-6 text-center">
              <p className="text-sm text-[#66736D]">কোনো কাজ নির্বাচন করুন বিস্তারিত দেখতে</p>
            </div>
          )}

          {/* Field issues */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#DCE6E0] flex items-center justify-between">
              <h3 className="font-semibold text-[#17221D] text-sm">মাঠপর্যায়ের সমস্যা</h3>
              {openIssues > 0 && <span className="size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{openIssues}</span>}
            </div>
            <div className="divide-y divide-[#DCE6E0]">
              {issues.length === 0 ? (
                <p className="text-xs text-[#66736D] text-center py-6">কোনো সমস্যা নেই।</p>
              ) : (
                issues.slice(0, 5).map((issue) => {
                  const uiStatus = issue.status === "in_progress" ? "acknowledged" : issue.status;
                  const sc = issueStatusConfig[uiStatus];
                  return (
                    <div key={issue.id} className="px-4 py-3 hover:bg-[#F4FBF6] transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{issueTypeConfig[issue.issue_type].icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-[#17221D]">{issueTypeConfig[issue.issue_type].label}</p>
                            <p className="text-[10px] text-[#66736D]">📍 {issue.location_name ?? issue.area_name ?? "অজানা স্থান"} · {issue.reporter_name ?? "স্বেচ্ছাসেবক"}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${sc.color}`}>{sc.label}</span>
                      </div>
                      <p className="text-[10px] text-[#66736D] mb-1">{issue.task_title ? `কাজ: ${issue.task_title}` : "এলাকাভিত্তিক সমস্যা"} · {new Date(issue.created_at).toLocaleString("bn-BD")}</p>
                      {issue.status === "reported" && (
                        <button
                          onClick={() => {
                            void updateIssueStatus(issue.id, "in_progress");
                            showToast("সমস্যাটি দেখা হয়েছে হিসেবে চিহ্নিত করা হয়েছে।", "success");
                          }}
                          className="text-[10px] text-blue-600 font-medium hover:underline mr-2"
                        >
                          দেখা হয়েছে →
                        </button>
                      )}
                      {issue.status !== "resolved" && (
                        <button
                          onClick={() => {
                            updateIssueStatus(issue.id, "resolved");
                            showToast("সমস্যাটি সমাধান হিসেবে চিহ্নিত করা হয়েছে।", "success");
                          }}
                          className="text-[10px] text-[#2E7D5B] font-medium hover:underline"
                        >
                          সমাধান হয়েছে →
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
