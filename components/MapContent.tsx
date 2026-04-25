"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker } from "@/lib/types";
import { MAP_COLORS, MAP_SETTINGS } from "@/lib/constants";
import type { GroupedPodoMarker } from "./EvidenceMap";

function calculateAngle(from: [number, number], to: [number, number]): number {
  const dx = to[1] - from[1];
  const dy = to[0] - from[0];
  const angle = Math.atan2(dx, dy) * (180 / Math.PI);
  return angle;
}

interface MapContentProps {
  markers: MapMarker[];
  podoPath: [number, number][];
  groupedPodoMarkers?: GroupedPodoMarker[];
  center: [number, number];
  onTagClick: (name: string) => void;
  showArrows?: boolean;
}

export default function MapContent({
  markers,
  podoPath,
  groupedPodoMarkers = [],
  center,
  onTagClick,
  showArrows = false,
}: MapContentProps) {
  const arrowPositions: { position: [number, number]; angle: number }[] = [];
  
  if (showArrows && podoPath.length > 1) {
    for (let i = 0; i < podoPath.length - 1; i++) {
      const from = podoPath[i];
      const to = podoPath[i + 1];
      const midLat = (from[0] + to[0]) / 2;
      const midLng = (from[1] + to[1]) / 2;
      const angle = calculateAngle(from, to);
      arrowPositions.push({ position: [midLat, midLng], angle });
    }
  }

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
          weight={4}
          opacity={0.8}
        />
      )}

      {arrowPositions.map((arrow, index) => (
        <Marker
          key={`arrow-${index}`}
          position={arrow.position}
          icon={L.divIcon({
            html: `<div style="color: #EAB308; font-size: 24px; transform: rotate(${arrow.angle - 90}deg); text-shadow: 0 0 3px rgba(0,0,0,0.5);">➤</div>`,
            className: "arrow-marker",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        />
      ))}

      {showArrows && groupedPodoMarkers.map((marker, index) => (
        <CircleMarker
          key={`podo-grouped-${index}`}
          center={[marker.lat, marker.lng]}
          radius={14}
          fillColor={MAP_COLORS.podo.fill}
          color={MAP_COLORS.podo.stroke}
          weight={3}
          fillOpacity={0.9}
        >
          <Popup>
            <div className="text-sm min-w-[120px]">
              <div className="font-semibold text-yellow-600 mb-1">Podo</div>
              <div className="text-gray-600 mb-2">{marker.location}</div>
              <div className="text-xs text-gray-500 border-t pt-1">
                <div className="font-medium mb-1">Zamanlar:</div>
                {marker.timestamps.map((time, i) => (
                  <div key={i} className="text-gray-700">{time}</div>
                ))}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {!showArrows && markers.map((marker) => (
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
