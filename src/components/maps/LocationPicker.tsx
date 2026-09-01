import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: LatLng;
  onChange: (pos: LatLng) => void;
  height?: string;
}

function ClickHandler({ onChange }: { onChange: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange, height = "240px" }: LocationPickerProps) {
  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-[#DCE6E0]">
      <MapContainer
        center={[value.lat, value.lng]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[value.lat, value.lng]} icon={markerIcon} draggable eventHandlers={{
          dragend(e) {
            const latlng = (e.target as L.Marker).getLatLng();
            onChange({ lat: latlng.lat, lng: latlng.lng });
          },
        }} />
        <ClickHandler onChange={onChange} />
      </MapContainer>
    </div>
  );
}
