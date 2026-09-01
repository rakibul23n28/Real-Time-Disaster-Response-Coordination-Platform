import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { useCitizenReports } from "../../hooks/useCitizenReports";
import { useToast } from "../../components/common/Toast";

export default function CitizenProfile() {
  const { user, updateUser } = useAuth();
  const { reports } = useCitizenReports({ autoFetch: true });
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [mobile, setMobile] = useState(user?.phone ?? "");
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setMobile(user.phone ?? "");
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser({ name, email, phone: mobile || undefined });
      showToast("প্রোফাইল তথ্য সংরক্ষিত হয়েছে।", "success");
      setEditing(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "প্রোফাইল তথ্য সংরক্ষণ করা যায়নি।", "error");
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="প্রোফাইল" subtitle="Profile — আপনার তথ্য পরিচালনা করুন" />

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="bg-[#E8F5E9] px-6 py-8 flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-[#2E7D5B] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 select-none">
            {name[0] ?? "?"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#17221D]">{name}</h2>
            <p className="text-sm text-[#2E7D5B] font-medium">নাগরিক / তথ্যদাতা</p>
            <p className="text-xs text-[#66736D] mt-0.5">
              নিবন্ধন: {user?.created_at ? new Date(user.created_at).toLocaleDateString("bn-BD") : "-"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#2E7D5B]">{reports.length}</p>
            <p className="text-xs text-[#66736D]">মোট রিপোর্ট</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border-b border-[#DCE6E0]">
          {[
            { label: "যাচাইকৃত", value: reports.filter((r) => r.status === "verified").length, color: "text-green-600" },
            { label: "অপেক্ষমাণ", value: reports.filter((r) => r.status === "pending").length, color: "text-amber-600" },
            { label: "সম্পন্ন", value: reports.filter((r) => r.status === "completed").length, color: "text-[#2E7D5B]" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 border-r last:border-r-0 border-[#DCE6E0]">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#66736D]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Personal info */}
          <div>
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">ব্যক্তিগত তথ্য</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="পূর্ণ নাম" value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
              <Input label="ভূমিকা" value="নাগরিক" disabled />
            </div>
          </div>

          <div className="border-t border-[#DCE6E0] pt-4">
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">যোগাযোগের তথ্য</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="ইমেইল" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
              <Input label="মোবাইল নম্বর" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={!editing} />
            </div>
          </div>

          <div className="border-t border-[#DCE6E0] pt-4">
            <h3 className="text-sm font-semibold text-[#17221D] mb-3">অ্যাকাউন্ট সেটিংস</h3>
            <div className="flex items-center justify-between p-3 bg-[#F4FBF6] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#17221D]">অ্যাকাউন্টের ধরন</p>
                <p className="text-xs text-[#66736D]">নাগরিক</p>
              </div>
              <span className="text-xs bg-[#E8F5E9] text-[#2E7D5B] border border-[#b8ddc5] rounded-full px-2.5 py-1 font-medium">সক্রিয়</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            {editing ? (
              <>
                <Button onClick={handleSave} className="flex-1">তথ্য সংরক্ষণ করুন</Button>
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
