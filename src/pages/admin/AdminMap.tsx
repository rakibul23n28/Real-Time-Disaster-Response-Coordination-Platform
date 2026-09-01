import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import { mockIncidents } from "../../data/mockIncidents";
import { useAppState } from "../../hooks/useAppState";

const severityColor: Record<string, string> = { high: "#DC2626", medium: "#F59E0B", low: "#16A34A" };

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function MapFly({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 10, { duration: 0.8 }); }, [lat, lng]);
  return null;
}

type LayerKey = "disasters" | "reports" | "camps" | "tasks" | "volunteers";

const layers: { key: LayerKey; label: string }[] = [
  { key: "disasters", label: "দুর্যোগ" },
  { key: "reports", label: "রিপোর্ট" },
  { key: "tasks", label: "কাজ" },
  { key: "camps", label: "ত্রাণ ক্যাম্প" },
  { key: "volunteers", label: "স্বেচ্ছাসেবক" },
];

const severityFilters = [
  { key: "all", label: "সব" },
  { key: "high", label: "উচ্চ" },
  { key: "medium", label: "মাঝারি" },
  { key: "low", label: "কম" },
];

const disasterTypeBn: Record<string, string> = {
  flood: "বন্যা", cyclone: "ঘূর্ণিঝড়", river_erosion: "নদীভাঙন",
  waterlogging: "জলাবদ্ধতা", landslide: "ভূমিধস",
};

// Demo relief camps
const reliefCamps = [
  { id: "C1", name: "সুনামগঞ্জ ত্রাণ শিবির", lat: 25.1, lng: 91.45, capacity: 500, current: 380 },
  { id: "C2", name: "কক্সবাজার আশ্রয়কেন্দ্র", lat: 21.5, lng: 92.0, capacity: 800, current: 620 },
  { id: "C3", name: "খুলনা ত্রাণ কেন্দ্র", lat: 22.6, lng: 89.5, capacity: 300, current: 140 },
];

export default function AdminMap() {
  const { tasks, reports } = useAppState();
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set(["disasters", "tasks"]));
  const [severityFilter, setSeverityFilter] = useState("all");
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedInc, setSelectedInc] = useState<typeof mockIncidents[0] | null>(null);

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visibleIncidents = mockIncidents.filter((i) => severityFilter === "all" || i.severity === severityFilter);
  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div className="max-w-7xl space-y-4">
      <PageHeader title="দুর্যোগ পরিস্থিতির মানচিত্র" subtitle="সমগ্র পরিস্থিতি পর্যবেক্ষণ — ঘটনা, কাজ, ত্রাণ শিবির ও স্বেচ্ছাসেবক" />

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#DCE6E0] p-3 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 flex-wrap">
          {layers.map((l) => (
            <button key={l.key} onClick={() => toggleLayer(l.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${activeLayers.has(l.key) ? "bg-[#17221D] text-white border-[#17221D]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-[#DCE6E0] hidden sm:block" />
        <div className="flex gap-1.5 flex-wrap">
          {severityFilters.map((f) => (
            <button key={f.key} onClick={() => setSeverityFilter(f.key)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${severityFilter === f.key ? "bg-[#2E7D5B] text-white border-[#2E7D5B]" : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-xl overflow-hidden border border-[#DCE6E0]" style={{ height: "480px" }}>
            <MapContainer center={[23.685, 90.356]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {flyTo && <MapFly lat={flyTo.lat} lng={flyTo.lng} />}

              {/* Disaster circles */}
              {activeLayers.has("disasters") && visibleIncidents.map((inc) => (
                <CircleMarker key={inc.id} center={[inc.lat, inc.lng]}
                  radius={inc.severity === "high" ? 14 : inc.severity === "medium" ? 10 : 7}
                  pathOptions={{ color: severityColor[inc.severity], fillColor: severityColor[inc.severity], fillOpacity: 0.6, weight: 2 }}
                  eventHandlers={{ click: () => { setSelectedInc(inc); setFlyTo({ lat: inc.lat, lng: inc.lng }); } }}>
                  <Popup>
                    <p className="font-bold text-sm">{inc.location}</p>
                    <p className="text-xs text-gray-500">{inc.disasterType} · {inc.affectedPeople.toLocaleString()} জন</p>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Pending reports */}
              {activeLayers.has("reports") && pendingReports.map((r) => (
                <CircleMarker key={r.id} center={[r.location.lat, r.location.lng]}
                  radius={6}
                  pathOptions={{ color: "#7C3AED", fillColor: "#7C3AED", fillOpacity: 0.7, weight: 2 }}>
                  <Popup>
                    <p className="font-bold text-sm">{r.location.name}</p>
                    <p className="text-xs text-gray-500">{disasterTypeBn[r.disasterType]} · {r.id}</p>
                    <p className="text-xs text-amber-600 font-medium">অপেক্ষমাণ</p>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Active tasks */}
              {activeLayers.has("tasks") && activeTasks.map((task) => (
                <Marker key={task.id} position={[task.location.lat, task.location.lng]} icon={greenIcon}>
                  <Popup>
                    <p className="font-bold text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.location.name}</p>
                    <p className="text-xs text-green-600 font-medium">{task.status}</p>
                  </Popup>
                </Marker>
              ))}

              {/* Relief camps */}
              {activeLayers.has("camps") && reliefCamps.map((camp) => (
                <Marker key={camp.id} position={[camp.lat, camp.lng]} icon={blueIcon}>
                  <Popup>
                    <p className="font-bold text-sm">{camp.name}</p>
                    <p className="text-xs text-gray-500">ধারণক্ষমতা: {camp.capacity} · বর্তমান: {camp.current}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 flex-wrap text-xs text-[#66736D]">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#DC2626]" /> উচ্চ ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#F59E0B]" /> মাঝারি ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#16A34A]" /> কম ঝুঁকি</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#7C3AED]" /> অপেক্ষমাণ রিপোর্ট</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#2E7D5B]" /> সক্রিয় কাজ</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#2563EB]" /> ত্রাণ ক্যাম্প</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {selectedInc && (
            <div className="bg-[#F4FBF6] rounded-xl border border-[#DCE6E0] p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold text-[#17221D]">{selectedInc.location}</p>
                  <p className="text-xs text-[#66736D]">{selectedInc.disasterType}</p>
                </div>
                <span className={`size-2.5 rounded-full flex-shrink-0 mt-1.5 ${selectedInc.severity === "high" ? "bg-red-500 animate-pulse" : selectedInc.severity === "medium" ? "bg-amber-500" : "bg-green-500"}`} />
              </div>
              <div className="space-y-1.5 text-xs mb-3">
                <div className="flex justify-between"><span className="text-[#66736D]">তীব্রতা</span><span className="font-semibold">{selectedInc.severity === "high" ? "উচ্চ" : selectedInc.severity === "medium" ? "মাঝারি" : "কম"}</span></div>
                <div className="flex justify-between"><span className="text-[#66736D]">আক্রান্ত</span><span className="font-semibold">{selectedInc.affectedPeople.toLocaleString()} জন</span></div>
                <div className="flex justify-between"><span className="text-[#66736D]">স্বেচ্ছাসেবক</span><span className="font-semibold">{selectedInc.activeVolunteers} জন</span></div>
              </div>
              <div className="flex gap-2">
                <a href="/admin/severity" className="flex-1 text-center text-xs bg-[#2E7D5B] text-white py-1.5 rounded-lg font-medium hover:bg-[#185C43] transition-colors">বিস্তারিত</a>
                <a href="/admin/resources" className="flex-1 text-center text-xs border border-[#DCE6E0] text-[#17221D] py-1.5 rounded-lg font-medium hover:bg-[#F4FBF6] transition-colors">ত্রাণ বরাদ্দ</a>
              </div>
            </div>
          )}

          <h3 className="font-semibold text-[#17221D] text-sm">সব ঘটনা</h3>
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
            {mockIncidents.map((inc) => (
              <button key={inc.id} onClick={() => { setSelectedInc(inc); setFlyTo({ lat: inc.lat, lng: inc.lng }); }}
                className={`w-full text-left p-3 bg-white rounded-xl border transition-all ${selectedInc?.id === inc.id ? "border-[#2E7D5B]" : "border-[#DCE6E0] hover:border-[#b0c4b8]"}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#17221D]">{inc.location}</p>
                  <span className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: severityColor[inc.severity] }} />
                </div>
                <p className="text-xs text-[#66736D]">{inc.disasterType} · {inc.affectedPeople.toLocaleString()} জন</p>
              </button>
            ))}
            {activeTasks.map((task) => (
              <button key={task.id} onClick={() => setFlyTo({ lat: task.location.lat, lng: task.location.lng })}
                className="w-full text-left p-3 bg-[#E8F5E9] rounded-xl border border-[#b8ddc5] hover:border-[#2E7D5B] transition-colors">
                <p className="text-xs font-mono text-[#2E7D5B] mb-0.5">{task.id}</p>
                <p className="text-sm font-semibold text-[#17221D]">{task.title}</p>
                <div className="mt-1"><StatusBadge status={task.status} size="sm" /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
