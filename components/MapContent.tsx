"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker } from "@/lib/types";
import { MAP_COLORS, MAP_SETTINGS } from "@/lib/constants";

interface MapContentProps {
  markers: MapMarker[];
  podoPath: [number, number][];
  center: [number, number];
  onTagClick: (name: string) => void;
}

export default function MapContent({
  markers,
  podoPath,
  center,
  onTagClick,
}: MapContentProps) {
  return (
    <MapContainer
      center={center}
      zoom={MAP_SETTINGS.defaultZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {podoPath.length > 1 && (
        <Polyline
          positions={podoPath}
          color={MAP_COLORS.path}
          weight={MAP_SETTINGS.pathWeight}
          dashArray={MAP_SETTINGS.pathDashArray}
        />
      )}

      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={marker.isPodo ? MAP_SETTINGS.podoMarkerRadius : MAP_SETTINGS.defaultMarkerRadius}
          fillColor={marker.isPodo ? MAP_COLORS.podo.fill : MAP_COLORS.default.fill}
          color={marker.isPodo ? MAP_COLORS.podo.stroke : MAP_COLORS.default.stroke}
          weight={2}
          fillOpacity={0.8}
        >
          <Popup>
            <div className="text-sm">
              <button
                onClick={() => onTagClick(marker.name)}
                className="font-semibold text-blue-600 hover:underline"
              >
                {marker.name}
              </button>
              <div className="text-gray-600">{marker.location}</div>
              <div className="text-gray-500 text-xs mt-1">{marker.timestamp}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
