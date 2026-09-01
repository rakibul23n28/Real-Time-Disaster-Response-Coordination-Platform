import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  color?: "default" | "green";
}

interface SingleMarkerMapProps {
  markers: MarkerData[];
  height?: string;
  zoom?: number;
}

export default function SingleMarkerMap({ markers, height = "220px", zoom = 11 }: SingleMarkerMapProps) {
  const center = markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 23.685, lng: 90.356 };

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-[#DCE6E0]">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={m.color === "green" ? greenIcon : defaultIcon}>
            <Popup>
              <span className="text-sm font-medium">{m.label}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
