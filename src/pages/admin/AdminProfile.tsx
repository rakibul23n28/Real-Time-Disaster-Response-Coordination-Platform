import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function AdminProfile() {
  const { user } = useAuth();
  const { reports, tasks, resetDemoData } = useAppState();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [resetModal, setResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const verifiedCount = reports.filter((r) => r.status === "verified").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const handleSave = () => {
    showToast("প্রোফাইল সংরক্ষিত হয়েছে।", "success");
    setEditing(false);
  };

  const handleReset = async () => {
    setResetting(true);
    await new Promise((r) => setTimeout(r, 800));
    resetDemoData();
    setResetting(false);
    setResetModal(false);
    showToast("ডেমো ডেটা সফলভাবে পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে।", "success");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="প্রোফাইল" subtitle="সমন্বয়কারী তথ্য ও সেটিংস" />

      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="bg-[#F4FBF6] px-6 py-8 flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-[#2E7D5B] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {name[0] ?? "A"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#17221D]">{name}</h2>
            <p className="text-sm text-[#2E7D5B] font-medium">সমন্বয়কারী / প্রশাসক</p>
            <p className="text-xs text-[#66736D] mt-0.5">{user?.email}</p>
          </div>
          <span className="text-xs bg-[#E8F5E9] text-[#2E7D5B] border border-[#b8ddc5] px-2.5 py-1 rounded-full font-semibold">ডেমো মোড</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-[#DCE6E0]">
          {[
            { label: "যাচাই করা রিপোর্ট", value: verifiedCount, color: "text-[#2E7D5B]" },
            { label: "সম্পদ বরাদ্দ", value: 18, color: "text-amber-600" },
            { label: "পর্যবেক্ষিত কার্যক্রম", value: completedTasks + 31, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 border-r last:border-r-0 border-[#DCE6E0]">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#66736D]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">ব্যক্তিগত তথ্য</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#66736D] block mb-1">নাম</label>
                <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} className="input-base" />
              </div>
              <div>
                <label className="text-xs text-[#66736D] block mb-1">ভূমিকা</label>
                <input value="সমন্বয়কারী / প্রশাসক" disabled className="input-base" />
              </div>
              <div>
                <label className="text-xs text-[#66736D] block mb-1">ইমেইল</label>
                <input defaultValue={user?.email} disabled={!editing} className="input-base" />
              </div>
              <div>
                <label className="text-xs text-[#66736D] block mb-1">বিভাগ</label>
                <input defaultValue="ঢাকা" disabled className="input-base" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            {editing ? (
              <>
                <Button onClick={handleSave} className="flex-1">সংরক্ষণ করুন</Button>
                <Button onClick={() => setEditing(false)} variant="outline">বাতিল</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} variant="outline">প্রোফাইল সম্পাদনা করুন</Button>
            )}
          </div>

          {/* Demo reset */}
          <div className="border-t border-[#DCE6E0] pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#17221D]">ডেমো ডেটা রিসেট করুন</p>
                <p className="text-xs text-[#66736D] mt-0.5">সমস্ত পরিবর্তন মুছে প্রাথমিক অবস্থায় ফিরে যান।</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setResetModal(true)} className="!border-red-200 !text-red-600 hover:!bg-red-50">
                রিসেট করুন
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={resetModal}
        title="ডেমো ডেটা রিসেট করবেন?"
        message="ডেমো ডেটা পূর্বাবস্থায় ফিরিয়ে আনলে সমস্ত পরিবর্তন মুছে যাবে। এটি প্রেজেন্টেশনের শুরুতে ব্যবহার করুন।"
        confirmLabel="হ্যাঁ, রিসেট করুন"
        cancelLabel="বাতিল"
        onConfirm={handleReset}
        onCancel={() => setResetModal(false)}
        loading={resetting}
      />
    </div>
  );
}
