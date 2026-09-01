import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { mockIncidents } from "../../data/mockIncidents";

const severityColor = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#16A34A",
};

export default function DisasterMap({ height = "400px" }: { height?: string }) {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-[#DCE6E0]">
      <MapContainer
        center={[23.6850, 90.3563]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mockIncidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={[incident.lat, incident.lng]}
            radius={incident.severity === "high" ? 14 : incident.severity === "medium" ? 10 : 7}
            pathOptions={{
              color: severityColor[incident.severity],
              fillColor: severityColor[incident.severity],
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm font-['Noto_Sans_Bengali',sans-serif] min-w-[160px]">
                <p className="font-bold text-[#17221D] mb-1">{incident.location}</p>
                <p className="text-[#66736D]">ঘটনার ধরন: {incident.disasterType}</p>
                <p className="text-[#66736D]">ক্ষতিগ্রস্ত: {incident.affectedPeople.toLocaleString()} জন</p>
                <p className="text-[#66736D]">স্বেচ্ছাসেবক: {incident.activeVolunteers} জন</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
