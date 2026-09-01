import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import Button from "../../components/common/Button";
import ConfirmModal from "../../components/common/ConfirmModal";
import SingleMarkerMap from "../../components/maps/SingleMarkerMap";
import EmptyState from "../../components/common/EmptyState";
import { type TaskStatus } from "../../data/mockTasks";

const DEMO_VOLUNTEER_LOC = { lat: 24.83, lng: 91.37, label: "আপনার অবস্থান" };

const nextActions: Record<TaskStatus, { label: string; next: TaskStatus; confirmMsg: string } | null> = {
  assigned: { label: "পথে রয়েছি", next: "en_route", confirmMsg: "আপনি কি নিশ্চিত যে আপনি এখন কাজের জন্য রওনা দিয়েছেন?" },
  en_route: { label: "কাজ শুরু করেছি", next: "in_progress", confirmMsg: "আপনি কি নিশ্চিত যে আপনি কাজ শুরু করেছেন?" },
  in_progress: { label: "কাজ সম্পন্ন করুন", next: "completed", confirmMsg: "আপনি কি নিশ্চিত যে কাজটি সম্পন্ন হয়েছে?" },
  completed: null,
};

const statusFlow: TaskStatus[] = ["assigned", "en_route", "in_progress", "completed"];
const statusLabels: Record<TaskStatus, string> = { assigned: "নতুন", en_route: "পথে রয়েছে", in_progress: "চলমান", completed: "সম্পন্ন" };

export default function TaskDetail() {
  const { id } = useParams();
  const { tasks, updateTaskStatus } = useAppState();
  const { showToast } = useToast();
  const [confirm, setConfirm] = useState<{ open: boolean; action: typeof nextActions[TaskStatus] }>({ open: false, action: null });
  const [updating, setUpdating] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="max-w-3xl">
        <EmptyState title="কাজ পাওয়া যায়নি" description="এই কাজটি বিদ্যমান নেই।" />
      </div>
    );
  }

  const action = nextActions[task.status];
  const currentStepIndex = statusFlow.indexOf(task.status);

  const handleUpdate = async () => {
    if (!confirm.action) return;
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 700));
    updateTaskStatus(task.id, confirm.action.next);
    setUpdating(false);
    setConfirm({ open: false, action: null });
    showToast("কাজের অবস্থা সফলভাবে আপডেট হয়েছে।");
  };

  return (
    <div className="max-w-5xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Link to="/volunteer/tasks" className="text-[#2E7D5B] hover:underline">← আমার কাজ</Link>
        <span className="text-[#DCE6E0]">/</span>
        <span className="font-mono text-[#66736D]">{task.id}</span>
      </div>

      <h1 className="text-xl font-bold text-[#17221D]">কাজের বিস্তারিত</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Task info */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
            <div className="bg-[#F4FBF6] px-5 py-3 border-b border-[#DCE6E0] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#66736D]">{task.id}</span>
                <h2 className="font-semibold text-[#17221D]">{task.title}</h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              {[
                { label: "কাজ", value: task.title },
                { label: "এলাকা", value: task.location.name },
                { label: "জেলা", value: task.location.district },
                { label: "আক্রান্ত মানুষ", value: `${task.affectedPeople.toLocaleString()} জন` },
                { label: "বরাদ্দকৃত স্বেচ্ছাসেবক", value: `${task.assignedVolunteers.length} জন` },
                { label: "বরাদ্দের সময়", value: task.assignedAt },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[#66736D] mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-[#17221D]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions + resources */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-[#17221D] mb-2">কাজের নির্দেশনা</h3>
              <p className="text-sm text-[#66736D] leading-relaxed">{task.instructions}</p>
            </div>
            <div className="border-t border-[#DCE6E0] pt-4">
              <h3 className="font-semibold text-[#17221D] mb-3">প্রয়োজনীয় সামগ্রী</h3>
              <div className="space-y-2">
                {task.resources.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#17221D]">{r.name}</span>
                    <span className="font-semibold text-[#2E7D5B]">{r.quantity} {r.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-3">কাজের মানচিত্র</h3>
            <SingleMarkerMap
              markers={[
                { lat: task.location.lat, lng: task.location.lng, label: `কাজের অবস্থান — ${task.location.name}` },
                { lat: DEMO_VOLUNTEER_LOC.lat, lng: DEMO_VOLUNTEER_LOC.lng, label: DEMO_VOLUNTEER_LOC.label, color: "green" },
              ]}
              height="260px"
              zoom={9}
            />
            <div className="flex gap-5 mt-3 text-xs text-[#66736D]">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#2563EB]" /> কাজের অবস্থান
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#16A34A]" /> আপনার অবস্থান (ডেমো)
              </span>
            </div>
          </div>
        </div>

        {/* Right: status update */}
        <div className="space-y-4">
          {/* Status timeline */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-4">অবস্থার অগ্রগতি</h3>
            <div className="space-y-0">
              {statusFlow.map((s, i) => {
                const isPast = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`size-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isCurrent ? "border-[#2E7D5B] bg-[#2E7D5B]" :
                        isPast ? "border-[#2E7D5B] bg-[#E8F5E9]" :
                        "border-[#DCE6E0] bg-white"
                      }`}>
                        {(isCurrent || isPast) ? (
                          <svg className={`size-3 ${isCurrent ? "text-white" : "text-[#2E7D5B]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="size-2 rounded-full bg-[#DCE6E0]" />
                        )}
                      </div>
                      {i < statusFlow.length - 1 && <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${isPast ? "bg-[#2E7D5B]" : "bg-[#DCE6E0]"}`} />}
                    </div>
                    <div className="pb-4 pt-1">
                      <p className={`text-sm font-semibold ${isCurrent ? "text-[#2E7D5B]" : isPast ? "text-[#17221D]" : "text-[#66736D]"}`}>
                        {statusLabels[s]}
                      </p>
                      <p className="text-[10px] text-[#66736D] capitalize">{s.replace("_", " ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          {action && (
            <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
              <h3 className="font-semibold text-[#17221D] mb-1">কাজের অবস্থা আপডেট করুন</h3>
              <p className="text-xs text-[#66736D] mb-4">পরবর্তী ধাপে অগ্রসর হতে নিচের বাটন চাপুন।</p>
              <Button
                fullWidth
                variant={action.next === "completed" ? "primary" : "primary"}
                onClick={() => setConfirm({ open: true, action })}
              >
                {action.label}
              </Button>
            </div>
          )}

          {task.status === "completed" && (
            <div className="bg-[#E8F5E9] rounded-xl border border-[#b8ddc5] p-4 text-center">
              <p className="text-2xl mb-1">✅</p>
              <p className="font-semibold text-[#2E7D5B]">কাজ সম্পন্ন হয়েছে</p>
            </div>
          )}

          <Link to="/volunteer/issues">
            <Button variant="outline" fullWidth size="sm">🚩 সমস্যা জানান</Button>
          </Link>
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title="অবস্থা আপডেট করবেন?"
        message={confirm.action?.confirmMsg ?? ""}
        confirmLabel="হ্যাঁ, আপডেট করুন"
        cancelLabel="বাতিল"
        onConfirm={handleUpdate}
        onCancel={() => setConfirm({ open: false, action: null })}
        loading={updating}
      />
    </div>
  );
}
