import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import PageHeader from "../../components/common/PageHeader";
import { apiClient, type Incident } from "../../lib/api";

const severityColor = { high: "#DC2626", critical: "#991B1B", medium: "#F59E0B", low: "#16A34A", unassessed: "#64748B" };
const severityLabel = { high: "উচ্চ ঝুঁকি", critical: "গুরুতর ঝুঁকি", medium: "মাঝারি ঝুঁকি", low: "কম ঝুঁকি", unassessed: "মূল্যায়ন হয়নি" };

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 10); }, [lat, lng]);
  return null;
}

const safetyTips = [
  { icon: "🏠", title: "নিরাপদ স্থানে যান", desc: "বন্যা বা ঘূর্ণিঝড়ের সময় ঝুঁকিপূর্ণ এলাকা এড়িয়ে চলুন।" },
  { icon: "📢", title: "জরুরি তথ্য জানান", desc: "ঘটনার সঠিক অবস্থান ও তথ্য প্রদান করুন।" },
  { icon: "📋", title: "স্থানীয় নির্দেশনা অনুসরণ করুন", desc: "প্রশাসন ও উদ্ধারকারী দলের নির্দেশনা অনুসরণ করুন।" },
];

export default function CitizenMap() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getIncidents()
      .then((data) => {
        setIncidents(data);
        setSelected(data[0] ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "ঘটনাসমূহ লোড করা যায়নি।"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl space-y-5">
      <PageHeader title="দুর্যোগ মানচিত্র" subtitle="আপনার আশেপাশের সক্রিয় দুর্যোগ পরিস্থিতি দেখুন।" />

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Map — 3/4 */}
        <div className="lg:col-span-3">
          <div className="rounded-xl overflow-hidden border border-[#DCE6E0]" style={{ height: "480px" }}>
            <MapContainer center={[23.685, 90.356]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {selected && <MapCenter lat={selected.lat} lng={selected.lng} />}
              {incidents.map((inc) => (
                <CircleMarker
                  key={inc.id}
                  center={[inc.lat, inc.lng]}
                  radius={inc.severity === "critical" ? 16 : inc.severity === "high" ? 14 : inc.severity === "medium" ? 10 : 7}
                  pathOptions={{
                    color: severityColor[inc.severity],
                    fillColor: severityColor[inc.severity],
                    fillOpacity: selected?.id === inc.id ? 0.85 : 0.5,
                    weight: selected?.id === inc.id ? 3 : 2,
                  }}
                  eventHandlers={{ click: () => setSelected(inc) }}
                >
                  <Popup>
                    <div className="min-w-[180px] font-['Noto_Sans_Bengali',sans-serif]">
                      <p className="font-bold text-[#17221D] mb-1.5">{inc.location} {inc.disasterType}</p>
                      <div className="space-y-0.5 text-sm text-[#66736D]">
                        <p>তীব্রতা: <span className="font-semibold">{severityLabel[inc.severity]}</span></p>
                        <p>আক্রান্ত: {inc.affectedPeople.toLocaleString()} জন</p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div className="flex items-center gap-5 mt-3 flex-wrap">
            {(["critical", "high", "medium", "low", "unassessed"] as const).map((s) => (
              <span key={s} className="flex items-center gap-2 text-sm text-[#66736D]">
                <span className="size-3.5 rounded-full" style={{ backgroundColor: severityColor[s] }} />
                {severityLabel[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel — 1/4 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#17221D] text-sm">সক্রিয় ঘটনাসমূহ</h3>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelected(inc)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selected?.id === inc.id ? "border-[#2E7D5B] bg-[#E8F5E9]" : "border-[#DCE6E0] bg-white hover:border-[#b0c4b8]"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#17221D]">{inc.location}</p>
                  <span className="size-2.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: severityColor[inc.severity] }} />
                </div>
                <p className="text-xs text-[#66736D]">{inc.disasterType}</p>
                <p className="text-xs text-[#66736D]">👥 {inc.affectedPeople.toLocaleString()} জন</p>
              </button>
            ))}
          </div>
          {loading && <p className="text-sm text-[#66736D]">ঘটনাসমূহ লোড হচ্ছে...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && incidents.length === 0 && <p className="text-sm text-[#66736D]">কোনো সক্রিয় ঘটনা পাওয়া যায়নি।</p>}
        </div>
      </div>

      {/* Safety tips */}
      <div>
        <h3 className="font-semibold text-[#17221D] mb-3">জরুরি পরিস্থিতিতে করণীয়</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {safetyTips.map((tip) => (
            <div key={tip.title} className="bg-white rounded-xl border border-[#DCE6E0] p-4">
              <span className="text-2xl block mb-2">{tip.icon}</span>
              <h4 className="font-semibold text-[#17221D] text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-[#66736D] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
