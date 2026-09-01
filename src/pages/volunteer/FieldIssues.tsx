import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import { issueTypeConfig, type IssueType, type FieldIssue } from "../../data/mockIssues";

const issueList = Object.entries(issueTypeConfig) as [IssueType, { label: string; icon: string }][];

const statusLabel: Record<string, string> = {
  reported: "জানানো হয়েছে",
  acknowledged: "দেখা হয়েছে",
  resolved: "সমাধান হয়েছে",
};
const statusColor: Record<string, string> = {
  reported: "text-amber-700 bg-amber-50 border-amber-200",
  acknowledged: "text-blue-700 bg-blue-50 border-blue-200",
  resolved: "text-green-700 bg-green-50 border-green-200",
};

export default function FieldIssues() {
  const { issues, addIssue } = useAppState();
  const { showToast } = useToast();

  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<FieldIssue | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) { setError("সমস্যার ধরন নির্বাচন করুন।"); return; }
    if (!locationName.trim()) { setError("অবস্থানের নাম লিখুন।"); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const cfg = issueTypeConfig[selectedType];
    const newIssue: FieldIssue = {
      id: `ISSUE-${String(issues.length + 1).padStart(3, "0")}`,
      taskId: "TASK-001",
      type: selectedType,
      label: cfg.label,
      icon: cfg.icon,
      location: { name: locationName, lat: 24.8917, lng: 91.3967 },
      description,
      status: "reported",
      createdAt: new Date().toISOString(),
      displayTime: "এইমাত্র",
    };

    addIssue(newIssue);
    setLoading(false);
    setSuccess(newIssue);
  };

  if (success) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-[#DCE6E0] p-8 text-center shadow-sm">
          <div className="size-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
            <svg className="size-7 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#17221D] mb-1">সমস্যা সফলভাবে জানানো হয়েছে</h2>
          <div className="bg-[#F4FBF6] rounded-xl p-4 my-4 text-left space-y-2 text-sm">
            <div><p className="text-xs text-[#66736D]">সমস্যার ধরন</p><p className="font-semibold text-[#17221D]">{success.icon} {success.label}</p></div>
            <div><p className="text-xs text-[#66736D]">অবস্থা</p><p className="font-semibold text-amber-600">প্রশাসনের কাছে পাঠানো হয়েছে</p></div>
          </div>
          <Button onClick={() => { setSuccess(null); setSelectedType(null); setLocationName(""); setDescription(""); }} fullWidth>ঠিক আছে</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="মাঠপর্যায়ের সমস্যা" subtitle="কাজের সময় কোনো সমস্যা হলে দ্রুত জানিয়ে দিন।" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Report form */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-4">নতুন সমস্যা জানান</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            {/* Issue type buttons */}
            <div className="mb-4">
              <p className="text-sm font-medium text-[#17221D] mb-2">সমস্যার ধরন নির্বাচন করুন</p>
              <div className="grid grid-cols-2 gap-2">
                {issueList.map(([type, cfg]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setSelectedType(type); setError(""); }}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left touch-manipulation ${
                      selectedType === type
                        ? "border-[#2E7D5B] bg-[#E8F5E9]"
                        : "border-[#DCE6E0] hover:border-[#b0c4b8]"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                    <span className={`text-sm font-medium ${selectedType === type ? "text-[#2E7D5B]" : "text-[#17221D]"}`}>
                      {cfg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#17221D] block mb-1.5">
                  সমস্যার অবস্থান <span className="text-red-500">*</span>
                </label>
                <input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="নির্দিষ্ট স্থানের নাম বা রাস্তার নাম লিখুন"
                  className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2.5 text-sm text-[#17221D] bg-white hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#17221D] block mb-1.5">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="পরিস্থিতির বিস্তারিত জানান..."
                  className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:outline-none resize-none"
                />
              </div>
              <div className="border-2 border-dashed border-[#DCE6E0] rounded-xl p-4 text-center">
                <p className="text-sm text-[#66736D]">📷 ছবি যোগ করুন (ঐচ্ছিক)</p>
              </div>
              <Button type="submit" loading={loading} disabled={!selectedType} fullWidth>
                সমস্যাটি জানান
              </Button>
            </form>
          </div>
        </div>

        {/* Issue history */}
        <div>
          <h3 className="font-semibold text-[#17221D] mb-3">পাঠানো সমস্যাসমূহ</h3>
          {issues.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#DCE6E0] p-8 text-center">
              <p className="text-sm text-[#66736D]">এখনও কোনো সমস্যা জানানো হয়নি।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white rounded-xl border border-[#DCE6E0] p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{issue.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#17221D]">{issue.label}</p>
                        <p className="text-xs text-[#66736D]">📍 {issue.location.name}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${statusColor[issue.status]}`}>
                      {statusLabel[issue.status]}
                    </span>
                  </div>
                  {issue.description && <p className="text-xs text-[#66736D]">{issue.description}</p>}
                  <p className="text-xs text-[#66736D] mt-1">{issue.displayTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
