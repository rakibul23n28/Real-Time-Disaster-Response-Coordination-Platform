import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import type { ResourceRequest } from "../../data/mockResourceRequests";

const priorityConfig = {
  critical: { label: "অতি জরুরি", color: "text-red-700 bg-red-50 border-red-200" },
  high: { label: "উচ্চ", color: "text-amber-700 bg-amber-50 border-amber-200" },
  medium: { label: "মাঝারি", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

const statusConfig = {
  pending: { label: "অপেক্ষমাণ", color: "text-amber-700 bg-amber-50" },
  allocated: { label: "বরাদ্দকৃত", color: "text-green-700 bg-green-50" },
  fulfilled: { label: "সম্পন্ন", color: "text-[#2E7D5B] bg-[#E8F5E9]" },
};

const categoryInventoryKey: Record<string, string[]> = {
  water: ["INV-001", "INV-008"],
  food: ["INV-002", "INV-005"],
  medical: ["INV-003", "INV-006"],
  other: ["INV-004", "INV-007"],
};

export default function ResourceAllocation() {
  const { resourceRequests, inventory, allocateResources } = useAppState();
  const { showToast } = useToast();
  const [modal, setModal] = useState<ResourceRequest | null>(null);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");

  const totalUnits = inventory.reduce((s, i) => s + i.total, 0);
  const allocatedUnits = inventory.reduce((s, i) => s + i.allocated, 0);
  const availableUnits = inventory.reduce((s, i) => s + i.available, 0);
  const pendingCount = resourceRequests.filter((r) => r.status === "pending").length;

  const openModal = (req: ResourceRequest) => {
    const initial: Record<string, number> = {};
    req.items.forEach((item) => { initial[item.category] = item.quantity; });
    setAllocations(initial);
    setModal(req);
    setStep("form");
  };

  const getAvailableForCategory = (category: string) => {
    const keys = categoryInventoryKey[category] ?? [];
    return inventory.filter((i) => keys.includes(i.id)).reduce((s, i) => s + i.available, 0);
  };

  const hasInsufficientStock = modal ? modal.items.some((item) => {
    const avail = getAvailableForCategory(item.category);
    return (allocations[item.category] ?? 0) > avail;
  }) : false;

  const handleAllocate = async () => {
    if (!modal) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const allocationData = modal.items.map((item) => ({ category: item.category, quantity: allocations[item.category] ?? 0 }));
    allocateResources(modal.id, allocationData);
    setLoading(false);
    setModal(null);
    showToast("✓ ত্রাণ সফলভাবে বরাদ্দ করা হয়েছে।", "success");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="ত্রাণ ও সম্পদ বরাদ্দ" subtitle="অগ্রাধিকারপ্রাপ্ত এলাকায় উপলব্ধ সম্পদ কার্যকরভাবে বরাদ্দ করুন।" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "মোট ত্রাণ", value: totalUnits.toLocaleString(), sub: "ইউনিট", color: "text-[#17221D]" },
          { label: "বরাদ্দ করা", value: allocatedUnits.toLocaleString(), sub: "ইউনিট", color: "text-amber-600" },
          { label: "অবশিষ্ট", value: availableUnits.toLocaleString(), sub: "ইউনিট", color: "text-[#2E7D5B]" },
          { label: "জরুরি অনুরোধ", value: pendingCount.toString().padStart(2, "0"), sub: "অপেক্ষমাণ", color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#DCE6E0] p-4">
            <p className="text-xs text-[#66736D] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-[#66736D]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Resource requests */}
      <div>
        <h3 className="font-semibold text-[#17221D] mb-3">ত্রাণ অনুরোধসমূহ</h3>
        <div className="space-y-4">
          {resourceRequests.map((req) => {
            const pc = priorityConfig[req.priority];
            const sc = statusConfig[req.status];
            return (
              <div key={req.id} className="bg-white rounded-xl border border-[#DCE6E0] p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#17221D]">{req.area}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pc.color}`}>{pc.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                    </div>
                    <p className="text-xs text-[#66736D]">📍 {req.district} · 👥 {req.affectedPeople.toLocaleString()} জন আক্রান্ত · 🕐 {req.requestedAt}</p>
                  </div>
                  <Button size="sm" variant={req.status === "pending" ? "primary" : "secondary"} disabled={req.status !== "pending"} onClick={() => openModal(req)}>
                    {req.status === "pending" ? "বরাদ্দ করুন" : req.status === "allocated" ? "✓ বরাদ্দকৃত" : "✓ সম্পন্ন"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {req.items.map((item) => (
                    <div key={item.nameBn} className="bg-[#F4FBF6] rounded-lg px-3 py-2 text-xs">
                      <p className="text-[#66736D]">{item.nameBn}</p>
                      <p className="font-bold text-[#17221D]">{item.quantity} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {step === "form" ? (
              <>
                <h3 className="text-lg font-bold text-[#17221D] mb-1">ত্রাণ বরাদ্দ করুন</h3>
                <p className="text-sm text-[#66736D] mb-4">এলাকা: <strong className="text-[#17221D]">{modal.area}</strong></p>
                <div className="space-y-4 mb-5">
                  {modal.items.map((item) => {
                    const avail = getAvailableForCategory(item.category);
                    const qty = allocations[item.category] ?? item.quantity;
                    const insufficient = qty > avail;
                    return (
                      <div key={item.nameBn}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-sm font-medium text-[#17221D]">{item.nameBn}</label>
                          <span className={`text-xs ${insufficient ? "text-red-600 font-semibold" : "text-[#66736D]"}`}>
                            উপলব্ধ: {avail.toLocaleString()} {item.unit}
                          </span>
                        </div>
                        <input type="number" min={0} max={avail} value={qty}
                          onChange={(e) => setAllocations((p) => ({ ...p, [item.category]: Number(e.target.value) }))}
                          className={`w-full border rounded-[9px] px-3 py-2 text-sm focus:outline-none ${insufficient ? "border-red-400 bg-red-50 focus:border-red-500" : "border-[#DCE6E0] focus:border-[#2E7D5B]"}`} />
                        {insufficient && <p className="text-xs text-red-600 mt-1">পর্যাপ্ত মজুত নেই।</p>}
                        {!insufficient && <p className="text-xs text-green-600 mt-1">বরাদ্দের জন্য প্রস্তুত।</p>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setStep("confirm")} disabled={hasInsufficientStock} className="flex-1">পরবর্তী →</Button>
                  <Button variant="outline" onClick={() => setModal(null)}>বাতিল</Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#17221D] mb-2">ত্রাণ বরাদ্দ নিশ্চিত করবেন?</h3>
                <p className="text-sm text-[#66736D] mb-4">এলাকা: <strong className="text-[#17221D]">{modal.area}</strong></p>
                <div className="bg-[#F4FBF6] rounded-xl p-4 mb-5 space-y-2">
                  {modal.items.map((item) => (
                    <div key={item.nameBn} className="flex justify-between text-sm">
                      <span className="text-[#66736D]">{item.nameBn}</span>
                      <span className="font-bold text-[#17221D]">{allocations[item.category] ?? item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAllocate} loading={loading} className="flex-1">বরাদ্দ নিশ্চিত করুন</Button>
                  <Button variant="outline" onClick={() => setStep("form")} disabled={loading}>পরিবর্তন করুন</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
