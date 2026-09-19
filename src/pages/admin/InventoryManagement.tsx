import { useState, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/common/Toast";
import { categoryConfig, type InventoryCategory } from "../../data/inventoryTypes";
import type { ApiInventory } from "../../lib/api";

const reduceReasons = ["ত্রাণ বিতরণ", "অন্য কেন্দ্রে স্থানান্তর", "ক্ষতিগ্রস্ত", "অন্যান্য"];
const categories: { key: string; label: string }[] = [
  { key: "all", label: "সব" },
  ...Object.entries(categoryConfig).map(([k, v]) => ({ key: k, label: v.label })),
];

export default function InventoryManagement() {
  const { inventory, resources, adjustInventory, addInventory } = useAdminData();
  const { showToast } = useToast();
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState<{ item: ApiInventory; type: "add" | "reduce" } | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [reduceReason, setReduceReason] = useState(reduceReasons[0]);
  const [loading, setLoading] = useState(false);

  // Add form state
  const [newItem, setNewItem] = useState({ category: "food" as InventoryCategory, quantity: 0, depot: "", resourceId: 0 });

  const filtered = useMemo(() => inventory.filter((item) => {
    const matchCat = catFilter === "all" || item.category === catFilter;
    const matchSearch = !search || item.resource_name.includes(search) || item.depot_name.includes(search);
    return matchCat && matchSearch;
  }), [inventory, catFilter, search]);

  const totalItems = inventory.length;
  const criticalCount = inventory.filter((i) => i.quantity < 100).length;
  const lowCount = inventory.filter((i) => i.quantity >= 100 && i.quantity < 300).length;

  const handleAdjust = async () => {
    if (!adjustItem) return;
    setLoading(true);
    const delta = adjustItem.type === "add" ? adjustQty : -adjustQty;
    try {
      await adjustInventory(adjustItem.item, delta);
      setAdjustItem(null);
      setAdjustQty(0);
      showToast(adjustItem.type === "add" ? "মজুত সফলভাবে যোগ করা হয়েছে।" : "মজুত হ্রাস করা হয়েছে।", "success");
    } catch (err) { showToast(err instanceof Error ? err.message : "মজুত আপডেট করা যায়নি।", "error"); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    const resourceId = newItem.resourceId || resources.find((resource) => resource.category === newItem.category)?.id;
    if (!resourceId || newItem.quantity <= 0) return;
    setLoading(true);
    try {
      await addInventory({ resource_id: resourceId, quantity: newItem.quantity, depot_name: newItem.depot || "কেন্দ্রীয় গুদাম" });
      setAddModal(false);
      setNewItem({ category: "food", quantity: 0, depot: "", resourceId: 0 });
      showToast("নতুন সামগ্রী মজুতে যোগ করা হয়েছে।", "success");
    } catch (err) { showToast(err instanceof Error ? err.message : "নতুন মজুত যোগ করা যায়নি।", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="মজুত ব্যবস্থাপনা"
        subtitle="বিভিন্ন ত্রাণকেন্দ্রে খাদ্য, পানি, ওষুধ ও অন্যান্য সামগ্রীর মজুত পর্যবেক্ষণ করুন।"
        actions={<Button onClick={() => setAddModal(true)}>+ নতুন সামগ্রী যোগ করুন</Button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 text-center">
          <p className="text-2xl font-bold text-[#17221D]">{totalItems}</p>
          <p className="text-xs text-[#66736D]">মোট সামগ্রী</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{lowCount}</p>
          <p className="text-xs text-amber-600">কম মজুত</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-xs text-red-600">জরুরি মজুত</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCatFilter(c.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${catFilter === c.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#66736D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="সামগ্রী খুঁজুন..."
            className="w-52 pl-9 pr-3 py-2 text-sm border border-[#DCE6E0] rounded-[9px] focus:border-[#2E7D5B] focus:outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE6E0] bg-[#F4FBF6]">
                {["সামগ্রী", "ক্যাটাগরি", "মোট মজুত", "উপলব্ধ", "বরাদ্দ", "মজুত কেন্দ্র", "অবস্থা", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#66736D] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6E0]">
              {filtered.map((item) => {
                const cfg = categoryConfig[item.category];
                const pct = item.quantity > 0 ? 100 : 0;
                return (
                  <tr key={item.id} className="hover:bg-[#F4FBF6] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#17221D]">{item.resource_name}</p>
                      <div className="w-24 h-1.5 bg-[#F4FBF6] rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${item.quantity >= 300 ? "bg-[#2E7D5B]" : item.quantity >= 100 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#66736D]">{cfg.icon} {cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#17221D]">{item.quantity.toLocaleString()} <span className="text-xs text-[#66736D]">{item.unit}</span></td>
                    <td className="px-4 py-3 text-sm font-bold text-[#2E7D5B]">{item.quantity.toLocaleString()} <span className="text-xs text-[#66736D] font-normal">{item.unit}</span></td>
                    <td className="px-4 py-3 text-sm text-amber-600 font-medium">-</td>
                    <td className="px-4 py-3 text-xs text-[#66736D]">{item.depot_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.quantity < 100 ? "text-red-700 bg-red-50 border-red-200" : item.quantity < 300 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-green-700 bg-green-50 border-green-200"}`}>{item.quantity < 100 ? "জরুরি" : item.quantity < 300 ? "কম" : "পর্যাপ্ত"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setAdjustItem({ item, type: "add" }); setAdjustQty(0); }}
                          className="px-2 py-1 text-xs font-medium text-[#2E7D5B] border border-[#DCE6E0] rounded hover:bg-[#E8F5E9] transition-colors">
                          +
                        </button>
                        <button onClick={() => { setAdjustItem({ item, type: "reduce" }); setAdjustQty(0); }}
                          className="px-2 py-1 text-xs font-medium text-red-600 border border-[#DCE6E0] rounded hover:bg-red-50 transition-colors">
                          −
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {addModal && (
        <ModalWrap onClose={() => setAddModal(false)}>
          <h3 className="text-lg font-bold text-[#17221D] mb-4">নতুন সামগ্রী যোগ করুন</h3>
          <div className="space-y-4 mb-5">
            <Field label="ক্যাটাগরি">
              <select value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as InventoryCategory }))} className="input-base bg-white">
                {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="পরিমাণ">
                <input type="number" min={1} value={newItem.quantity || ""} onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))} placeholder="500" className="input-base" />
              </Field>
              <Field label="সামগ্রী"><select value={newItem.resourceId} onChange={(e) => setNewItem((p) => ({ ...p, resourceId: Number(e.target.value) }))} className="input-base bg-white"><option value={0}>নির্বাচন করুন</option>{resources.filter((resource) => resource.category === newItem.category).map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}</select></Field>
            </div>
            <Field label="মজুত কেন্দ্র">
              <input value={newItem.depot} onChange={(e) => setNewItem((p) => ({ ...p, depot: e.target.value }))} placeholder="কেন্দ্রের নাম" className="input-base" />
            </Field>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAdd} loading={loading} disabled={!newItem.quantity || newItem.quantity <= 0} className="flex-1">মজুতে যোগ করুন</Button>
            <Button variant="outline" onClick={() => setAddModal(false)} disabled={loading}>বাতিল</Button>
          </div>
        </ModalWrap>
      )}

      {/* Adjust modal */}
      {adjustItem && (
        <ModalWrap onClose={() => setAdjustItem(null)}>
          <h3 className="text-lg font-bold text-[#17221D] mb-1">
            {adjustItem.type === "add" ? "মজুত যোগ করুন" : "মজুত কমান"}
          </h3>
          <p className="text-sm text-[#66736D] mb-4">{adjustItem.item.resource_name}</p>
          <div className="space-y-4 mb-5">
            <Field label="পরিমাণ">
              <input type="number" min={1} max={adjustItem.type === "reduce" ? adjustItem.item.quantity : undefined} value={adjustQty || ""} onChange={(e) => setAdjustQty(Number(e.target.value))}
                placeholder="পরিমাণ লিখুন" className="input-base" />
            </Field>
            {adjustItem.type === "reduce" && (
              <Field label="কারণ">
                <select value={reduceReason} onChange={(e) => setReduceReason(e.target.value)} className="input-base bg-white">
                  {reduceReasons.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAdjust} loading={loading} disabled={!adjustQty || adjustQty <= 0} className="flex-1">
              {adjustItem.type === "add" ? "মজুত যোগ করুন" : "মজুত কমান"}
            </Button>
            <Button variant="outline" onClick={() => setAdjustItem(null)} disabled={loading}>বাতিল</Button>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}

function ModalWrap({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-[#17221D] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
