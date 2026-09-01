import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import SingleMarkerMap from "../../components/maps/SingleMarkerMap";
import EmptyState from "../../components/common/EmptyState";

type TimelineStep = {
  label: string;
  sub: string;
  key: string[];
};

const timelineSteps: TimelineStep[] = [
  { label: "জমা হয়েছে", sub: "Submitted", key: ["pending", "verified", "rejected", "in_progress", "completed"] },
  { label: "যাচাই করা হচ্ছে", sub: "Under Review", key: ["verified", "rejected", "in_progress", "completed"] },
  { label: "যাচাইকৃত", sub: "Verified", key: ["verified", "in_progress", "completed"] },
  { label: "সহায়তা বরাদ্দ", sub: "Resource Allocated", key: ["in_progress", "completed"] },
  { label: "কার্যক্রম চলছে", sub: "In Progress", key: ["in_progress", "completed"] },
  { label: "সম্পন্ন", sub: "Completed", key: ["completed"] },
];

export default function ReportDetail() {
  const { id } = useParams();
  const { reports } = useAppState();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="max-w-3xl">
        <EmptyState
          title="রিপোর্ট পাওয়া যায়নি"
          description="এই রিপোর্টটি বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।"
          action={{ label: "আমার রিপোর্টে ফিরুন", onClick: () => navigate("/citizen/reports") }}
        />
      </div>
    );
  }

  const currentStep = (() => {
    if (report.status === "completed") return 5;
    if (report.status === "in_progress") return 4;
    if (report.status === "verified") return 2;
    if (report.status === "pending") return 0;
    if (report.status === "rejected") return 1;
    return 0;
  })();

  const severityLabel = { high: "উচ্চ", medium: "মাঝারি", low: "কম" }[report.severity];
  const severityColor = { high: "text-red-700 bg-red-50 border-red-200", medium: "text-amber-700 bg-amber-50 border-amber-200", low: "text-green-700 bg-green-50 border-green-200" }[report.severity];

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Link to="/citizen/reports" className="text-sm text-[#2E7D5B] hover:underline">← আমার রিপোর্ট</Link>
            <span className="text-[#DCE6E0]">/</span>
            <span className="text-sm font-mono text-[#66736D]">{report.id}</span>
          </div>
          <h1 className="text-xl font-bold text-[#17221D]">রিপোর্টের বিস্তারিত</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#66736D]">Report ID:</span>
          <span className="font-mono font-bold text-[#2E7D5B] text-sm">{report.id}</span>
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: info + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] overflow-hidden">
            <div className="bg-[#F4FBF6] px-5 py-3 border-b border-[#DCE6E0]">
              <h2 className="font-semibold text-[#17221D]">{report.title}</h2>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              {[
                { label: "দুর্যোগের ধরন", value: report.disasterType },
                { label: "অবস্থান", value: `${report.location.name}, বাংলাদেশ` },
                { label: "জেলা", value: report.location.district },
                { label: "আক্রান্ত মানুষ", value: report.affectedPeople ? `${report.affectedPeople.toLocaleString()} জন` : "অজানা" },
                { label: "রিপোর্টের সময়", value: report.displayTime },
                { label: "রিপোর্টকারী", value: report.reporterName },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[#66736D] mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-[#17221D]">{item.value}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs text-[#66736D] mb-0.5">তীব্রতা</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${severityColor}`}>{severityLabel}</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs text-[#66736D] mb-1">বিবরণ</p>
              <p className="text-sm text-[#17221D] leading-relaxed">{report.description}</p>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-3">সংযুক্ত ছবি</h3>
            {report.photos.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {report.photos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(src)}
                    className="relative w-28 h-20 rounded-lg overflow-hidden border border-[#DCE6E0] hover:opacity-90 transition-opacity"
                  >
                    <img src={src} alt={`ছবি ${i + 1}`} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#66736D]">কোনো ছবি সংযুক্ত করা হয়নি।</p>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-3">ঘটনার অবস্থান</h3>
            <SingleMarkerMap
              markers={[{ lat: report.location.lat, lng: report.location.lng, label: report.location.name }]}
              height="220px"
              zoom={11}
            />
            <div className="mt-3 text-xs text-[#66736D] font-mono space-y-0.5">
              <p>📍 {report.location.name}</p>
              <p>Latitude: {report.location.lat.toFixed(4)} · Longitude: {report.location.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Right: timeline */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-5">
            <h3 className="font-semibold text-[#17221D] mb-4">রিপোর্টের অবস্থান</h3>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep;
                const isRejected = report.status === "rejected" && i === 1;

                return (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`size-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isRejected ? "border-red-400 bg-red-50" :
                        isCurrent ? "border-[#2E7D5B] bg-[#2E7D5B]" :
                        isActive ? "border-[#2E7D5B] bg-[#E8F5E9]" :
                        "border-[#DCE6E0] bg-white"
                      }`}>
                        {isRejected ? (
                          <svg className="size-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : isCurrent ? (
                          <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        ) : isActive ? (
                          <svg className="size-3.5 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <span className="size-2 rounded-full bg-[#DCE6E0]" />
                        )}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${isActive ? "bg-[#2E7D5B]" : "bg-[#DCE6E0]"}`} />
                      )}
                    </div>
                    <div className="pb-4 pt-1">
                      <p className={`text-sm font-semibold ${isCurrent ? "text-[#2E7D5B]" : isActive ? "text-[#17221D]" : "text-[#66736D]"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#66736D]">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link to="/citizen/reports">
            <Button variant="outline" fullWidth>← রিপোর্ট তালিকায় ফিরুন</Button>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="ছবি" className="max-w-full max-h-[80vh] rounded-xl shadow-2xl" />
          <button className="absolute top-5 right-5 text-white text-2xl" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
