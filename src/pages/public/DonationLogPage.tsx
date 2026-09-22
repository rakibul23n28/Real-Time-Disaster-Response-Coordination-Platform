import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { apiClient, type DonationLogEntry } from "../../lib/api";

const categories = [
  { value: "", label: "সব অনুদান", icon: "✦" },
  { value: "food", label: "খাদ্য", icon: "🍚" },
  { value: "water", label: "পানি", icon: "💧" },
  { value: "medical", label: "চিকিৎসা", icon: "⚕" },
  { value: "other", label: "অন্যান্য", icon: "📦" },
] as const;

const labels: Record<string, string> = { food: "খাদ্য", water: "পানি", medical: "চিকিৎসা", other: "অন্যান্য" };
const categoryColors: Record<string, string> = {
  food: "bg-amber-50 text-amber-700 border-amber-200",
  water: "bg-sky-50 text-sky-700 border-sky-200",
  medical: "bg-rose-50 text-rose-700 border-rose-200",
  other: "bg-violet-50 text-violet-700 border-violet-200",
};

function donationValue(entry: DonationLogEntry) {
  return entry.donation_type === "money"
    ? `৳${Number(entry.amount ?? 0).toLocaleString("bn-BD")}`
    : `${entry.item_name} · ${entry.quantity} ${entry.unit}`;
}

export default function DonationLogPage() {
  const [entries, setEntries] = useState<DonationLogEntry[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = () => {
      setLoading(true);
      void apiClient.getDonationLog(category as never || undefined)
        .then((data) => { if (active) { setEntries(data); setError(""); } })
        .catch(() => { if (active) setError("অনুদান লগ আনা যায়নি"); })
        .finally(() => { if (active) setLoading(false); });
    };
    load();
    const timer = window.setInterval(load, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, [category]);

  const total = entries.reduce((sum, entry) => sum + (entry.donation_type === "money" ? Number(entry.amount ?? 0) : 0), 0);
  const itemCount = entries.filter((entry) => entry.donation_type === "item").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#17221D] px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8DCEA9]/30 bg-[#2E7D5B]/30 px-3 py-1 text-xs font-medium text-[#C9F0D7]"><span className="size-1.5 animate-pulse rounded-full bg-[#8DCEA9]" /> সরাসরি আপডেট হচ্ছে</div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">মানুষের সহায়তার প্রকাশ্য হিসাব</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">প্রশাসক নিশ্চিত করা প্রতিটি অনুদান এখানে দেখা যায়। কোথায়, কীভাবে এবং কতটা সহায়তা পৌঁছাচ্ছে, সবই এক জায়গায়।</p>
        </div>
        <div className="absolute -right-8 -top-16 size-56 rounded-full border-[24px] border-[#2E7D5B]/20" />
        <div className="absolute -bottom-20 right-24 size-40 rounded-full border-[16px] border-[#8DCEA9]/10" />
      </div>

      <PageHeader title="অনুদান লগ" subtitle="নিশ্চিত হওয়া অর্থ ও সামগ্রিক সহায়তার স্বচ্ছ রেকর্ড" actions={<span className="hidden items-center gap-1.5 text-xs text-[#66736D] sm:flex"><span className="size-2 rounded-full bg-[#2E7D5B]" /> প্রতি ১৫ সেকেন্ডে আপডেট</span>} />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="মোট নিশ্চিত অনুদান" value={entries.length.toLocaleString("bn-BD")} icon="↗" tone="green" />
        <Metric label="অর্থ সহায়তা" value={`৳${total.toLocaleString("bn-BD")}`} icon="৳" tone="dark" />
        <Metric label="সামগ্রী সহায়তা" value={itemCount.toLocaleString("bn-BD")} icon="+" tone="blue" />
        <Metric label="স্বচ্ছতার অবস্থা" value="উন্মুক্ত" icon="✓" tone="amber" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${category === item.value ? "border-[#2E7D5B] bg-[#2E7D5B] text-white shadow-sm" : "border-[#DCE6E0] bg-white text-[#66736D] hover:border-[#2E7D5B] hover:text-[#2E7D5B]"}`}><span>{item.icon}</span>{item.label}</button>)}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-[#17221D]">সাম্প্রতিক সহায়তা</h2><span className="text-xs text-[#66736D]">{entries.length.toLocaleString("bn-BD")}টি রেকর্ড</span></div>
        {loading ? <div className="grid gap-3 md:grid-cols-2"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div> : entries.length === 0 ? <div className="rounded-2xl border border-dashed border-[#DCE6E0] bg-white px-5 py-16 text-center"><p className="text-3xl">◌</p><p className="mt-3 text-sm font-semibold text-[#17221D]">এই বিভাগে এখনও কোনো অনুদান নেই</p><p className="mt-1 text-xs text-[#66736D]">নিশ্চিত হওয়ার পর অনুদান এখানে দেখা যাবে।</p></div> : <div className="grid gap-3 md:grid-cols-2">{entries.map((entry) => <DonationCard key={entry.id} entry={entry} />)}</div>}
      </section>
    </div>
  );
}

function DonationCard({ entry }: { entry: DonationLogEntry }) {
  return <article className="group rounded-2xl border border-[#DCE6E0] bg-white p-4 shadow-[0_2px_10px_rgba(23,34,29,0.03)] transition-all hover:-translate-y-0.5 hover:border-[#8DCEA9] hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl text-xl ${entry.donation_type === "money" ? "bg-[#E8F5E9]" : "bg-[#F4FBF6]"}`}>{entry.donation_type === "money" ? "৳" : "📦"}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-[#17221D]">{entry.donor_name}</p><p className="truncate text-xs text-[#66736D]">{entry.organization}</p></div></div><span className={`flex-shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${categoryColors[entry.category]}`}>{labels[entry.category]}</span></div>
    <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-[11px] text-[#66736D]">সহায়তার পরিমাণ</p><p className="mt-0.5 text-base font-bold text-[#2E7D5B]">{donationValue(entry)}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">✓ নিশ্চিত</span></div>
    <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 border-t border-[#F0F4F1] pt-3 text-xs"><div className="min-w-0"><p className="truncate font-medium text-[#17221D]">{entry.place_name}</p><p className="mt-0.5 truncate text-[#66736D]">{entry.district}, {entry.division}</p></div><time className="text-right text-[#66736D]">{new Date(entry.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "short" })}<br />{new Date(entry.created_at).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}</time></div>
  </article>;
}

function Metric({ label, value, icon, tone }: { label: string; value: string; icon: string; tone: "green" | "dark" | "blue" | "amber" }) {
  const tones = { green: "bg-[#E8F5E9] text-[#2E7D5B]", dark: "bg-[#17221D] text-white", blue: "bg-sky-50 text-sky-700", amber: "bg-amber-50 text-amber-700" };
  return <div className="rounded-2xl border border-[#DCE6E0] bg-white p-4"><div className={`mb-3 flex size-8 items-center justify-center rounded-lg text-sm font-bold ${tones[tone]}`}>{icon}</div><p className="text-xs text-[#66736D]">{label}</p><p className="mt-1 truncate text-lg font-bold text-[#17221D]">{value}</p></div>;
}

function Skeleton() {
  return <div className="h-44 animate-pulse rounded-2xl border border-[#DCE6E0] bg-[#F4FBF6]" />;
}
