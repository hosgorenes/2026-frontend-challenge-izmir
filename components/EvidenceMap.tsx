"use client";

import dynamic from "next/dynamic";
import { Evidence, MapMarker } from "@/lib/types";
import { isPodoRecord } from "@/lib/utils";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Harita yükleniyor...</span>
    </div>
  ),
});

interface EvidenceMapProps {
  items: Evidence[];
  onTagClick: (name: string) => void;
}

function parseCoordinates(coords: string): { lat: number; lng: number } | null {
  const match = coords.match(/([\d.]+),([\d.]+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

function getMarkerName(item: Evidence): string {
  if ("fullname" in item) return item.fullname;
  if ("personName" in item) return item.personName;
  if ("from" in item) return item.from;
  if ("suspectName" in item) return item.suspectName;
  return "Bilinmeyen";
}

function getLocation(item: Evidence): string {
  if ("location" in item) return item.location;
  return "";
}

export default function EvidenceMap({ items, onTagClick }: EvidenceMapProps) {
  const markers: MapMarker[] = items
    .filter((item) => "coordinates" in item && item.coordinates)
    .map((item) => {
      const coords = parseCoordinates((item as any).coordinates);
      if (!coords) return null;
      return {
        id: item.id,
        lat: coords.lat,
        lng: coords.lng,
        name: getMarkerName(item),
        location: getLocation(item),
        timestamp: item.timestamp,
        isPodo: isPodoRecord(item),
      };
    })
    .filter((m): m is MapMarker => m !== null);

  if (markers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Konum verisi bulunamadı
        </h3>
        <p className="text-gray-500">
          Seçili kanıtlarda koordinat bilgisi yok.
        </p>
      </div>
    );
  }

  const podoMarkers = markers.filter((m) => m.isPodo);
  const podoPath = podoMarkers.map((m) => [m.lat, m.lng] as [number, number]);

  const centerLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
  const centerLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <MapContent
        markers={markers}
        podoPath={podoPath}
        center={[centerLat, centerLng]}
        onTagClick={onTagClick}
      />
    </div>
  );
}
