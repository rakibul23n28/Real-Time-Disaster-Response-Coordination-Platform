import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import PageHeader from "../../components/common/PageHeader";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { mockIncidents } from "../../data/mockIncidents";
import { useAppState } from "../../hooks/useAppState";

const severityColor = { high: "#DC2626", medium: "#F59E0B", low: "#16A34A" };

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function MapFly({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 10, { duration: 0.8 }); }, [lat, lng]);
  return null;
}

type FilterType = "all" | "disaster" | "tasks" | "camps" | "volunteers";
type SeverityFilter = "all" | "high" | "medium" | "low";

export default function VolunteerMap() {
  const { tasks } = useAppState();
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  const activeIncidents = mockIncidents.filter((i) =>
    severityFilter === "all" || i.severity === severityFilter
  );

  const panelItems = mockIncidents.map((i) => ({
    id: i.id,
    title: `${i.location} ${i.disasterType}`,
    sub: `${i.affectedPeople.toLocaleString()} জন আক্রান্ত`,
    severity: i.severity,
    lat: i.lat,
    lng: i.lng,
  }));

  const typeFilters: { key: FilterType; label: string }[] = [
    { key: "all", label: "সব" },
    { key: "disaster", label: "দুর্যোগ" },
    { key: "tasks", label: "আমার কাজ" },
    { key: "camps", label: "ত্রাণ ক্যাম্প" },
    { key: "volunteers", label: "স্বেচ্ছাসেবক" },
  ];

  const severityFilters: { key: SeverityFilter; label: string }[] = [
    { key: "all", label: "সব" },
    { key: "high", label: "উচ্চ" },
    { key: "medium", label: "মাঝারি" },
    { key: "low", label: "কম" },
  ];

  return (
    <div className="max-w-7xl space-y-5">
      <PageHeader title="দুর্যোগ ও কাজের মানচিত্র" subtitle="আক্রান্ত এলাকা, সক্রিয় ঘটনা ও আপনার কাজের অবস্থান দেখুন।" />

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-[#DCE6E0] p-3 flex flex-wrap gap-3 items-center">
            <div className="flex gap-1.5 flex-wrap">
              {typeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${typeFilter === f.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-[#DCE6E0] hidden sm:block" />
            <div className="flex gap-1.5 flex-wrap">
              {severityFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSeverityFilter(f.key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${severityFilter === f.key ? "bg-[#17221D] text-white border-[#17221D]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#DCE6E0]" style={{ height: "440px" }}>
            <MapContainer center={[23.685, 90.356]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {flyTo && <MapFly lat={flyTo.lat} lng={flyTo.lng} />}

              {(typeFilter === "all" || typeFilter === "disaster") && activeIncidents.map((inc) => (
                <CircleMarker
                  key={inc.id}
                  center={[inc.lat, inc.lng]}
                  radius={inc.severity === "high" ? 14 : inc.severity === "medium" ? 10 : 7}
                  pathOptions={{ color: severityColor[inc.severity], fillColor: severityColor[inc.severity], fillOpacity: 0.6, weight: 2 }}
                >
                  <Popup>
                    <div className="min-w-[160px]">
                      <p className="font-bold text-sm">{inc.location} {inc.disasterType}</p>
                      <p className="text-xs text-[#66736D]">{inc.affectedPeople.toLocaleString()} জন আক্রান্ত</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {(typeFilter === "all" || typeFilter === "tasks") && tasks.filter((t) => t.status !== "completed").map((task) => (
                <Marker key={task.id} position={[task.location.lat, task.location.lng]} icon={greenIcon}>
                  <Popup>
                    <div className="min-w-[160px]">
                      <p className="font-bold text-sm">{task.title}</p>
                      <p className="text-xs text-[#66736D]">{task.location.name}</p>
                      <p className="text-xs text-[#66736D]">অবস্থা: {task.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="flex items-center gap-5 flex-wrap text-xs text-[#66736D]">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#DC2626]" /> উচ্চ ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#F59E0B]" /> মাঝারি ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#16A34A]" /> কম ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#2E7D5B]" /> আমার কাজ</span>
          </div>
        </div>

        {/* Side panel */}
        <div>
          <h3 className="font-semibold text-[#17221D] text-sm mb-3">সক্রিয় কার্যক্রম</h3>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {panelItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setFlyTo({ lat: item.lat, lng: item.lng })}
                className="w-full text-left p-3 bg-white rounded-xl border border-[#DCE6E0] hover:border-[#2E7D5B] transition-colors"
              >
                <p className="text-sm font-semibold text-[#17221D] mb-0.5">{item.title}</p>
                <p className="text-xs text-[#66736D] mb-1.5">{item.sub}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.severity === "high" ? "bg-red-50 text-red-700" :
                  item.severity === "medium" ? "bg-amber-50 text-amber-700" :
                  "bg-green-50 text-green-700"
                }`}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: severityColor[item.severity] }} />
                  {item.severity === "high" ? "অতি জরুরি" : item.severity === "medium" ? "উচ্চ" : "কম ঝুঁকি"}
                </span>
              </button>
            ))}

            {tasks.filter((t) => t.status !== "completed").map((task) => (
              <button
                key={task.id}
                onClick={() => setFlyTo({ lat: task.location.lat, lng: task.location.lng })}
                className="w-full text-left p-3 bg-[#E8F5E9] rounded-xl border border-[#b8ddc5] hover:border-[#2E7D5B] transition-colors"
              >
                <p className="text-xs font-mono text-[#2E7D5B] mb-0.5">{task.id}</p>
                <p className="text-sm font-semibold text-[#17221D]">{task.title}</p>
                <p className="text-xs text-[#66736D]">{task.location.name}</p>
                <div className="mt-1.5"><StatusBadge status={task.status} size="sm" /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
