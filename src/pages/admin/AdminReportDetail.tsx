import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppState } from "../../hooks/useAppState";
import { useToast } from "../../components/common/Toast";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";

const disasterTypeBn: Record<string, string> = {
  flood: "বন্যা", cyclone: "ঘূর্ণিঝড়", river_erosion: "নদীভাঙন",
  waterlogging: "জলাবদ্ধতা", landslide: "ভূমিধস",
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const rejectReasons = [
  "ভুল তথ্য",
  "ডুপ্লিকেট রিপোর্ট",
  "অপর্যাপ্ত তথ্য",
  "অবস্থান ভুল",
  "অন্যান্য",
];

type ModalType = "verify" | "reject" | "info" | null;

export default function AdminReportDetail() {
  const { id } = useParams();
  const { reports, updateReportStatus, addNotification } = useAppState();
  const { showToast } = useToast();

  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState(rejectReasons[0]);
  const [rejectDetail, setRejectDetail] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="max-w-3xl">
        <EmptyState title="রিপোর্ট পাওয়া যায়নি" description="এই রিপোর্টটি বিদ্যমান নেই।" />
      </div>
    );
  }

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    updateReportStatus(report.id, "verified");
    setLoading(false);
    setModal(null);
    showToast("✓ রিপোর্ট সফলভাবে যাচাই করা হয়েছে", "success");
  };

  const handleReject = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    updateReportStatus(report.id, "rejected");
    setLoading(false);
    setModal(null);
    showToast("রিপোর্ট বাতিল করা হয়েছে।", "info");
  };

  const handleInfoRequest = async () => {
    if (!infoMsg.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    addNotification(`রিপোর্ট ${report.id} সম্পর্কে প্রশাসন আরও তথ্য চেয়েছেন।`, "report");
    setLoading(false);
    setModal(null);
    setInfoMsg("");
    showToast("রিপোর্টকারীকে বার্তা পাঠানো হয়েছে।", "success");
  };

  const demoPhotos = [
    "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=400&fit=crop&auto=format",
  ];
  const photos = report.photos?.length ? report.photos : demoPhotos;

  return (
    <div className="max-w-5xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Link to="/admin/reports" className="text-[#2E7D5B] hover:underline">← রিপোর্ট তালিকা</Link>
        <span className="text-[#DCE6E0]">/</span>
        <span className="font-mono text-[#66736D]">{report.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-lg font-mono font-bold text-[#2E7D5B]">{report.id}</span>
            <StatusBadge status={report.status} />
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${report.severity === "high" ? "bg-red-50 text-red-700" : report.severity === "medium" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
              {report.severity === "high" ? "উচ্চ তীব্রতা" : report.severity === "medium" ? "মাঝারি তীব্রতা" : "কম তীব্রতা"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#17221D]">রিপোর্ট পর্যালোচনা</h1>
        </div>

        {report.status === "pending" && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setModal("verify")}>✓ রিপোর্ট যাচাই করুন</Button>
            <Button variant="outline" onClick={() => setModal("info")}>আরও তথ্য প্রয়োজন</Button>
            <Button variant="ghost" onClick={() => setModal("reject")} className="!text-red-600 hover:!bg-red-50">✕ বাতিল করুন</Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: report info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info grid */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h2 className="font-semibold text-[#17221D] mb-4">রিপোর্টের বিবরণ</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { label: "দুর্যোগের ধরন", value: disasterTypeBn[report.disasterType] ?? report.disasterType },
                { label: "শিরোনাম", value: report.title },
                { label: "অবস্থান", value: `${report.location.name}, ${report.location.district}` },
                { label: "আক্রান্ত মানুষ", value: `${report.affectedPeople.toLocaleString()} জন` },
                { label: "রিপোর্টের সময়", value: report.displayTime },
                { label: "রিপোর্টকারী", value: report.reporterName },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[#66736D] mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-[#17221D]">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-[#66736D] mb-1">রিপোর্টের বিবরণ</p>
              <p className="text-sm text-[#66736D] leading-relaxed bg-[#F4FBF6] rounded-lg p-3">{report.description}</p>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#17221D]">রিপোর্টের ছবি</h2>
              <span className="text-xs text-[#66736D]">{photos.length}টি ছবি</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((src, i) => (
                <button key={i} onClick={() => setLightboxIdx(i)} className="aspect-video rounded-lg overflow-hidden bg-[#F4FBF6] hover:opacity-90 transition-opacity">
                  <img src={src} alt={`ছবি ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#17221D]">রিপোর্টের অবস্থান</h2>
              <div className="text-xs text-[#66736D]">{report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}</div>
            </div>
            <p className="text-sm text-[#66736D] mb-3">📍 {report.location.name}, {report.location.district}</p>
            <div className="rounded-xl overflow-hidden" style={{ height: "240px" }}>
              <MapContainer center={[report.location.lat, report.location.lng]} zoom={10} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.location.lat, report.location.lng]} icon={defaultIcon}>
                  <Popup><b>{report.location.name}</b><br />{disasterTypeBn[report.disasterType]}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right: action panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-4">অ্যাকশন</h3>
            {report.status !== "pending" ? (
              <div className={`rounded-xl p-4 text-center ${report.status === "verified" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <p className="text-2xl mb-1">{report.status === "verified" ? "✅" : "❌"}</p>
                <p className={`font-semibold text-sm ${report.status === "verified" ? "text-green-700" : "text-red-700"}`}>
                  {report.status === "verified" ? "রিপোর্ট যাচাইকৃত" : "রিপোর্ট বাতিল"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button fullWidth onClick={() => setModal("verify")}>✓ রিপোর্ট যাচাই করুন</Button>
                <Button fullWidth variant="outline" onClick={() => setModal("info")}>আরও তথ্য প্রয়োজন</Button>
                <Button fullWidth variant="ghost" onClick={() => setModal("reject")} className="!text-red-600 hover:!bg-red-50">✕ রিপোর্ট বাতিল করুন</Button>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5 space-y-2">
            <h3 className="font-semibold text-[#17221D] mb-3">সংশ্লিষ্ট লিংক</h3>
            <Link to="/admin/severity" className="block text-sm text-[#2E7D5B] hover:underline">→ তীব্রতা বিশ্লেষণ</Link>
            <Link to="/admin/resources" className="block text-sm text-[#2E7D5B] hover:underline">→ ত্রাণ বরাদ্দ করুন</Link>
            <Link to="/admin/map" className="block text-sm text-[#2E7D5B] hover:underline">→ মানচিত্রে দেখুন</Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4" onClick={() => setLightboxIdx(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={photos[lightboxIdx]} alt="ছবি" className="w-full rounded-xl" />
            <div className="absolute top-3 right-3 flex gap-2">
              {lightboxIdx > 0 && <button onClick={() => setLightboxIdx(lightboxIdx - 1)} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70">‹</button>}
              {lightboxIdx < photos.length - 1 && <button onClick={() => setLightboxIdx(lightboxIdx + 1)} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70">›</button>}
              <button onClick={() => setLightboxIdx(null)} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70">✕</button>
            </div>
            <p className="text-white text-center text-sm mt-2">{lightboxIdx + 1} / {photos.length}</p>
          </div>
        </div>
      )}

      {/* Verify modal */}
      {modal === "verify" && (
        <ModalBackdrop onClose={() => setModal(null)}>
          <h3 className="text-lg font-bold text-[#17221D] mb-2">রিপোর্ট যাচাই করবেন?</h3>
          <p className="text-sm text-[#66736D] mb-5">রিপোর্টটি যাচাই করলে এটি সক্রিয় দুর্যোগ হিসেবে সিস্টেমে অন্তর্ভুক্ত হবে।</p>
          <div className="flex gap-3">
            <Button onClick={handleVerify} loading={loading} className="flex-1">হ্যাঁ, যাচাই করুন</Button>
            <Button variant="outline" onClick={() => setModal(null)} disabled={loading}>বাতিল</Button>
          </div>
        </ModalBackdrop>
      )}

      {/* Reject modal */}
      {modal === "reject" && (
        <ModalBackdrop onClose={() => setModal(null)}>
          <h3 className="text-lg font-bold text-[#17221D] mb-4">রিপোর্ট বাতিল করবেন?</h3>
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">বাতিলের কারণ</label>
              <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none bg-white">
                {rejectReasons.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#17221D] block mb-1.5">বিস্তারিত কারণ</label>
              <textarea rows={3} value={rejectDetail} onChange={(e) => setRejectDetail(e.target.value)}
                placeholder="কারণ বিস্তারিত লিখুন..."
                className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleReject} loading={loading} className="flex-1 !bg-red-600 hover:!bg-red-700">রিপোর্ট বাতিল করুন</Button>
            <Button variant="outline" onClick={() => setModal(null)} disabled={loading}>বাতিল</Button>
          </div>
        </ModalBackdrop>
      )}

      {/* Info request modal */}
      {modal === "info" && (
        <ModalBackdrop onClose={() => setModal(null)}>
          <h3 className="text-lg font-bold text-[#17221D] mb-2">আরও তথ্য চাওয়া</h3>
          <p className="text-sm text-[#66736D] mb-4">রিপোর্টকারীর জন্য বার্তা লিখুন।</p>
          <textarea rows={4} value={infoMsg} onChange={(e) => setInfoMsg(e.target.value)}
            placeholder="কী তথ্য প্রয়োজন তা লিখুন..."
            className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm focus:border-[#2E7D5B] focus:outline-none resize-none mb-4" />
          <div className="flex gap-3">
            <Button onClick={handleInfoRequest} loading={loading} disabled={!infoMsg.trim()} className="flex-1">অনুরোধ পাঠান</Button>
            <Button variant="outline" onClick={() => setModal(null)} disabled={loading}>বাতিল</Button>
          </div>
        </ModalBackdrop>
      )}
    </div>
  );
}

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
