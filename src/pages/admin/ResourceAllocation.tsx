import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/common/Toast";

const categoryLabels: Record<string, string> = { food: "খাদ্য", water: "পানি", medical: "চিকিৎসা", other: "অন্যান্য" };

export default function ResourceAllocation() {
  const { inventory, resources, allocations, reports, allocate } = useAdminData();
  const { showToast } = useToast();
  const [resourceId, setResourceId] = useState(0);
  const [reportId, setReportId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedResource = resources.find((resource) => resource.id === resourceId);
  const available = inventory.filter((item) => item.resource_id === resourceId).reduce((sum, item) => sum + item.quantity, 0);
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const pendingReports = reports.filter((report) => report.status === "pending");

  const handleAllocate = async () => {
    if (!resourceId || quantity <= 0 || quantity > available) return;
    setLoading(true);
    try {
      await allocate({ resource_id: resourceId, quantity, report_id: reportId || undefined });
      setResourceId(0);
      setReportId(0);
      setQuantity(0);
      showToast("ত্রাণ সফলভাবে বরাদ্দ করা হয়েছে।", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "ত্রাণ বরাদ্দ করা যায়নি।", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader title="ত্রাণ ও সম্পদ বরাদ্দ" subtitle="সার্ভারের বর্তমান মজুত থেকে দুর্যোগ রিপোর্টে সম্পদ বরাদ্দ করুন।" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Summary label="সম্পদের ধরন" value={resources.length} />
        <Summary label="মজুত কেন্দ্র" value={inventory.length} />
        <Summary label="উপলব্ধ ইউনিট" value={totalUnits.toLocaleString()} />
        <Summary label="বরাদ্দের ইতিহাস" value={allocations.length} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#DCE6E0] p-5">
          <h2 className="font-semibold text-[#17221D] mb-1">নতুন বরাদ্দ</h2>
          <p className="text-xs text-[#66736D] mb-4">লেনদেনটি সার্ভারে সংরক্ষিত হবে এবং মজুত কমবে।</p>
          <div className="space-y-4">
            <Field label="সম্পদ">
              <select value={resourceId} onChange={(event) => setResourceId(Number(event.target.value))} className="input-base bg-white">
                <option value={0}>সম্পদ নির্বাচন করুন</option>
                {resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name} ({categoryLabels[resource.category]})</option>)}
              </select>
            </Field>
            <Field label="সংশ্লিষ্ট রিপোর্ট (ঐচ্ছিক)">
              <select value={reportId} onChange={(event) => setReportId(Number(event.target.value))} className="input-base bg-white">
                <option value={0}>রিপোর্ট নির্বাচন করুন</option>
                {pendingReports.map((report) => <option key={report.id} value={report.id}>{report.id} · {report.title}</option>)}
              </select>
            </Field>
            <Field label={`পরিমাণ${selectedResource ? ` (${selectedResource.unit})` : ""}`}>
              <input type="number" min={1} max={available} value={quantity || ""} onChange={(event) => setQuantity(Number(event.target.value))} className="input-base" />
              <p className="text-xs text-[#66736D] mt-1">উপলব্ধ: {available.toLocaleString()} {selectedResource?.unit ?? "ইউনিট"}</p>
            </Field>
            <Button onClick={handleAllocate} loading={loading} disabled={!resourceId || !quantity || quantity > available} fullWidth>বরাদ্দ নিশ্চিত করুন</Button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DCE6E0]"><h2 className="font-semibold text-[#17221D]">বরাদ্দের ইতিহাস</h2></div>
          {allocations.length === 0 ? <p className="text-sm text-[#66736D] text-center py-10">এখনও কোনো বরাদ্দ নেই।</p> : (
            <div className="divide-y divide-[#DCE6E0]">
              {allocations.map((allocation) => (
                <div key={allocation.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div><p className="text-sm font-semibold text-[#17221D]">{allocation.resource_name}</p><p className="text-xs text-[#66736D]">{allocation.allocation_code} · {new Date(allocation.created_at).toLocaleString("bn-BD")}</p></div>
                  <span className="font-bold text-[#2E7D5B]">{allocation.quantity} {allocation.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number | string }) {
  return <div className="bg-white rounded-xl border border-[#DCE6E0] p-4"><p className="text-xs text-[#66736D] mb-1">{label}</p><p className="text-2xl font-bold text-[#17221D]">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-medium text-[#17221D] block mb-1.5">{label}</span>{children}</label>;
}
