import { useState, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import { categoryConfig, stockStatusConfig, type InventoryCategory, type InventoryItem } from "../../data/mockInventory";

const reduceReasons = ["ত্রাণ বিতরণ", "অন্য কেন্দ্রে স্থানান্তর", "ক্ষতিগ্রস্ত", "অন্যান্য"];
const categories: { key: string; label: string }[] = [
  { key: "all", label: "সব" },
  ...Object.entries(categoryConfig).map(([k, v]) => ({ key: k, label: v.label })),
];

export default function InventoryManagement() {
  const { inventory, adjustInventory, addInventoryItem } = useAppState();
  const { showToast } = useToast();
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState<{ item: InventoryItem; type: "add" | "reduce" } | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [reduceReason, setReduceReason] = useState(reduceReasons[0]);
  const [loading, setLoading] = useState(false);

  // Add form state
  const [newItem, setNewItem] = useState({ nameBn: "", category: "food" as InventoryCategory, quantity: 0, unit: "", depot: "" });

  const filtered = useMemo(() => inventory.filter((item) => {
    const matchCat = catFilter === "all" || item.category === catFilter;
    const matchSearch = !search || item.nameBn.includes(search) || item.depot.includes(search);
    return matchCat && matchSearch;
  }), [inventory, catFilter, search]);

  const totalItems = inventory.length;
  const criticalCount = inventory.filter((i) => i.status === "critical").length;
  const lowCount = inventory.filter((i) => i.status === "low").length;

  const handleAdjust = async () => {
    if (!adjustItem) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const delta = adjustItem.type === "add" ? adjustQty : -adjustQty;
    adjustInventory(adjustItem.item.id, delta);
    setLoading(false);
    setAdjustItem(null);
    setAdjustQty(0);
    showToast(adjustItem.type === "add" ? "মজুত সফলভাবে যোগ করা হয়েছে।" : "মজুত হ্রাস করা হয়েছে।", "success");
  };

  const handleAdd = async () => {
    if (!newItem.nameBn.trim() || !newItem.unit.trim() || newItem.quantity <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const item: InventoryItem = {
      id: `INV-${String(inventory.length + 1).padStart(3, "0")}`,
      nameBn: newItem.nameBn,
      category: newItem.category,
      total: newItem.quantity,
      available: newItem.quantity,
      allocated: 0,
      unit: newItem.unit,
      depot: newItem.depot || "কেন্দ্রীয় গুদাম",
      status: "adequate",
    };
    addInventoryItem(item);
    setLoading(false);
    setAddModal(false);
    setNewItem({ nameBn: "", category: "food", quantity: 0, unit: "", depot: "" });
    showToast("নতুন সামগ্রী মজুতে যোগ করা হয়েছে।", "success");
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
                const sc = stockStatusConfig[item.status];
                const pct = Math.round((item.available / item.total) * 100);
                return (
                  <tr key={item.id} className="hover:bg-[#F4FBF6] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-[#17221D]">{item.nameBn}</p>
                      <div className="w-24 h-1.5 bg-[#F4FBF6] rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${item.status === "adequate" ? "bg-[#2E7D5B]" : item.status === "low" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#66736D]">{cfg.icon} {cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#17221D]">{item.total.toLocaleString()} <span className="text-xs text-[#66736D]">{item.unit}</span></td>
                    <td className="px-4 py-3 text-sm font-bold text-[#2E7D5B]">{item.available.toLocaleString()} <span className="text-xs text-[#66736D] font-normal">{item.unit}</span></td>
                    <td className="px-4 py-3 text-sm text-amber-600 font-medium">{item.allocated.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-[#66736D]">{item.depot}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
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
            <Field label="সামগ্রীর নাম">
              <input value={newItem.nameBn} onChange={(e) => setNewItem((p) => ({ ...p, nameBn: e.target.value }))}
                placeholder="যেমন: বিশুদ্ধ পানি" className="input-base" />
            </Field>
            <Field label="ক্যাটাগরি">
              <select value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as InventoryCategory }))} className="input-base bg-white">
                {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="পরিমাণ">
                <input type="number" min={1} value={newItem.quantity || ""} onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))} placeholder="500" className="input-base" />
              </Field>
              <Field label="ইউনিট">
                <input value={newItem.unit} onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))} placeholder="বোতল, কেজি..." className="input-base" />
              </Field>
            </div>
            <Field label="মজুত কেন্দ্র">
              <input value={newItem.depot} onChange={(e) => setNewItem((p) => ({ ...p, depot: e.target.value }))} placeholder="কেন্দ্রের নাম" className="input-base" />
            </Field>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAdd} loading={loading} disabled={!newItem.nameBn.trim() || !newItem.unit.trim() || newItem.quantity <= 0} className="flex-1">মজুতে যোগ করুন</Button>
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
          <p className="text-sm text-[#66736D] mb-4">{adjustItem.item.nameBn}</p>
          <div className="space-y-4 mb-5">
            <Field label="পরিমাণ">
              <input type="number" min={1} max={adjustItem.type === "reduce" ? adjustItem.item.available : undefined} value={adjustQty || ""} onChange={(e) => setAdjustQty(Number(e.target.value))}
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
