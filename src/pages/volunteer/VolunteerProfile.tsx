import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";

export default function VolunteerProfile() {
  const { user } = useAuth();
  const { tasks } = useAppState();
  const { showToast } = useToast();
  const [available, setAvailable] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");

  const done = tasks.filter((t) => t.status === "completed").length;
  const active = tasks.filter((t) => t.status !== "completed").length;
  const total = tasks.length;

  const handleSave = () => {
    showToast("প্রোফাইল সংরক্ষিত হয়েছে।");
    setEditing(false);
  };

  const toggleAvailability = () => {
    setAvailable((p) => !p);
    showToast(available ? "আপনি এখন অনুপলব্ধ হিসেবে চিহ্নিত।" : "আপনি এখন জরুরি কাজে উপলব্ধ।", available ? "info" : "success");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="প্রোফাইল" subtitle="Profile — স্বেচ্ছাসেবক তথ্য ও সেটিংস" />

      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="bg-blue-50 px-6 py-8 flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {name[0] ?? "?"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#17221D]">{name}</h2>
            <p className="text-sm text-blue-700 font-medium">স্বেচ্ছাসেবক / মাঠকর্মী</p>
            <p className="text-xs text-[#66736D] mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-[#DCE6E0]">
          {[
            { label: "মোট কাজ", value: total, color: "text-[#17221D]" },
            { label: "সম্পন্ন", value: done, color: "text-green-600" },
            { label: "সক্রিয়", value: active, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 border-r last:border-r-0 border-[#DCE6E0]">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#66736D]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Availability toggle */}
          <div className="flex items-center justify-between p-4 bg-[#F4FBF6] rounded-xl border border-[#DCE6E0]">
            <div>
              <p className="text-sm font-semibold text-[#17221D]">জরুরি কাজে উপলব্ধ</p>
              <p className="text-xs text-[#66736D]">{available ? "আপনি নতুন কাজ পাবেন" : "আপনি এখন অনুপলব্ধ"}</p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${available ? "bg-[#2E7D5B]" : "bg-[#DCE6E0]"}`}
            >
              <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${available ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Info fields */}
          <div>
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">ব্যক্তিগত তথ্য</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="নাম" value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
              <Input label="এলাকা" defaultValue={user?.district} disabled={!editing} />
            </div>
          </div>
          <div className="border-t border-[#DCE6E0] pt-4">
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">যোগাযোগের তথ্য</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="ইমেইল" type="email" defaultValue={user?.email} disabled={!editing} />
              <Input label="মোবাইল নম্বর" defaultValue={user?.mobile} disabled={!editing} />
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
        </div>
      </div>
    </div>
  );
}
