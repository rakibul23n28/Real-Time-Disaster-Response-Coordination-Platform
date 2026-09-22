import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { apiClient, type CreateDonationInput, type DonationPlace } from "../../lib/api";

const categories = [
  { value: "food", label: "খাদ্য", icon: "🍚" },
  { value: "water", label: "পানি", icon: "💧" },
  { value: "medical", label: "ওষুধ ও চিকিৎসা", icon: "⚕" },
  { value: "other", label: "অন্যান্য", icon: "📦" },
] as const;

const initialForm: CreateDonationInput = {
  donation_type: "item", category: "food", is_anonymous: false, place_id: 0,
};

export default function DonationPage() {
  const [places, setPlaces] = useState<DonationPlace[]>([]);
  const [form, setForm] = useState<CreateDonationInput>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.getDonationPlaces().then((loadedPlaces) => {
      setPlaces(loadedPlaces);
      if (loadedPlaces[0] && !form.place_id) setForm((current) => ({ ...current, place_id: loadedPlaces[0].id }));
    }).catch(() => setError("সংগ্রহ কেন্দ্রের তথ্য আনা যায়নি"));
  }, []);
  const filteredPlaces = useMemo(() => places.filter((place) => place.categories.includes(form.category)), [places, form.category]);

  const update = (patch: Partial<CreateDonationInput>) => setForm((current) => ({ ...current, ...patch }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    try {
      await apiClient.createDonation(form);
      setSubmitted(true);
      setForm({ ...initialForm, place_id: places[0]?.id ?? 0 });
    } catch (err) { setError(err instanceof Error ? err.message : "অনুদানটি জমা দেওয়া যায়নি"); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="সহায়তা দিন" subtitle="অর্থ, খাদ্য, পানি ও চিকিৎসা সামগ্রী দেশের যেকোনো সংগ্রহ কেন্দ্রে পাঠান" />
      {submitted && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">আপনার অনুদানটি জমা হয়েছে এবং প্রশাসকের নিশ্চিতকরণের অপেক্ষায় আছে। নিশ্চিত হওয়ার পর এটি প্রকাশ্য অনুদান লগে দেখা যাবে।</div>}
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={submit} className="rounded-xl border border-[#DCE6E0] bg-white p-5 shadow-sm space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#17221D] mb-3">কী দিতে চান?</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => update({ donation_type: "item" })} className={`rounded-lg border p-3 text-left text-sm ${form.donation_type === "item" ? "border-[#2E7D5B] bg-[#E8F5E9] text-[#185C43]" : "border-[#DCE6E0]"}`}>📦 সামগ্রী দান</button>
              <button type="button" onClick={() => update({ donation_type: "money" })} className={`rounded-lg border p-3 text-left text-sm ${form.donation_type === "money" ? "border-[#2E7D5B] bg-[#E8F5E9] text-[#185C43]" : "border-[#DCE6E0]"}`}>৳ অর্থ সহায়তা</button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#17221D] mb-3">সহায়তার ধরন</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{categories.map((category) => <button type="button" key={category.value} onClick={() => update({ category: category.value })} className={`rounded-lg border p-3 text-center text-sm ${form.category === category.value ? "border-[#2E7D5B] bg-[#E8F5E9]" : "border-[#DCE6E0]"}`}><span className="block text-xl mb-1">{category.icon}</span>{category.label}</button>)}</div>
          </div>
          {form.donation_type === "money" ? <label className="block text-sm">পরিমাণ (টাকা)<input required type="number" min="1" className="input-base mt-1" value={form.amount ?? ""} onChange={(e) => update({ amount: Number(e.target.value) })} /></label> : <div className="grid grid-cols-2 gap-3"><label className="text-sm">সামগ্রীর নাম<input required className="input-base mt-1" value={form.item_name ?? ""} onChange={(e) => update({ item_name: e.target.value })} placeholder="যেমন: চাল" /></label><label className="text-sm">পরিমাণ<input required type="number" min="1" className="input-base mt-1" value={form.quantity ?? ""} onChange={(e) => update({ quantity: Number(e.target.value) })} /></label><label className="text-sm col-span-2">একক<input required className="input-base mt-1" value={form.unit ?? ""} onChange={(e) => update({ unit: e.target.value })} placeholder="কেজি / প্যাকেট / বোতল" /></label></div>}
          <label className="block text-sm">সংগ্রহ কেন্দ্র<select required className="input-base mt-1" value={form.place_id || ""} onChange={(e) => update({ place_id: Number(e.target.value) })}><option value="" disabled>কেন্দ্র নির্বাচন করুন</option>{filteredPlaces.map((place) => <option key={place.id} value={place.id}>{place.name} — {place.district}</option>)}</select></label>
          <div className="grid sm:grid-cols-2 gap-3"><label className="text-sm">আপনার নাম (ঐচ্ছিক)<input className="input-base mt-1" value={form.donor_name ?? ""} onChange={(e) => update({ donor_name: e.target.value })} /></label><label className="text-sm">মোবাইল / ইমেইল (ঐচ্ছিক)<input className="input-base mt-1" value={form.donor_contact ?? ""} onChange={(e) => update({ donor_contact: e.target.value })} /></label></div>
          <label className="flex items-center gap-2 text-sm text-[#66736D]"><input type="checkbox" checked={form.is_anonymous} onChange={(e) => update({ is_anonymous: e.target.checked })} /> পরিচয় গোপন রেখে দান করতে চাই</label>
          <button className="w-full rounded-lg bg-[#2E7D5B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#185C43]" type="submit">অনুদান নথিভুক্ত করুন</button>
        </form>
        <section className="rounded-xl border border-[#DCE6E0] bg-[#F4FBF6] p-5"><h2 className="text-lg font-bold text-[#17221D]">দেশজুড়ে সংগ্রহ কেন্দ্র</h2><p className="mt-1 text-sm text-[#66736D]">আপনার সুবিধামতো নিকটস্থ কেন্দ্রে সামগ্রী পৌঁছে দিন।</p><div className="mt-5 space-y-3">{filteredPlaces.map((place) => <article key={place.id} className="rounded-lg border border-[#DCE6E0] bg-white p-4"><div className="flex justify-between gap-3"><h3 className="font-semibold text-[#17221D]">{place.name}</h3><span className="text-xs text-[#2E7D5B]">{place.district}</span></div><p className="mt-1 text-sm text-[#66736D]">{place.organization}</p><p className="mt-2 text-xs text-[#66736D]">{place.address} · {place.phone}</p></article>)}{filteredPlaces.length === 0 && <p className="text-sm text-[#66736D]">এই ধরনটির জন্য কোনো কেন্দ্র পাওয়া যায়নি।</p>}</div></section>
      </div>
    </div>
  );
}
