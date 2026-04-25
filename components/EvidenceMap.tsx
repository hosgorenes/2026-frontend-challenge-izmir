"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Evidence, MapMarker } from "@/lib/types";
import { isPodoDirect, sortByTimestamp, formatTime } from "@/lib/utils";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <span className="text-zinc-500">Harita yükleniyor...</span>
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

export interface GroupedPodoMarker {
  lat: number;
  lng: number;
  location: string;
  timestamps: string[];
}

export default function EvidenceMap({ items, onTagClick }: EvidenceMapProps) {
  const [showRoute, setShowRoute] = useState(false);

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
        isPodo: isPodoDirect(item),
      };
    })
    .filter((m): m is MapMarker => m !== null);

  if (markers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">
          Konum verisi bulunamadı
        </h3>
        <p className="text-zinc-500">
          Seçili kanıtlarda koordinat bilgisi yok.
        </p>
      </div>
    );
  }

  const podoItems = items.filter((item) => isPodoDirect(item) && "coordinates" in item && item.coordinates);
  const sortedPodoItems = sortByTimestamp(podoItems, true);
  
  const groupedPodoMarkers: GroupedPodoMarker[] = [];
  const locationMap = new Map<string, GroupedPodoMarker>();

  sortedPodoItems.forEach((item) => {
    const location = getLocation(item);
    const coords = parseCoordinates((item as any).coordinates);
    if (!coords) return;

    const normalizedLocation = location
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/ı/g, "i")
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");
    
    if (locationMap.has(normalizedLocation)) {
      const existing = locationMap.get(normalizedLocation)!;
      existing.timestamps.push(formatTime(item.timestamp));
      existing.lat = (existing.lat + coords.lat) / 2;
      existing.lng = (existing.lng + coords.lng) / 2;
    } else {
      const marker: GroupedPodoMarker = {
        lat: coords.lat,
        lng: coords.lng,
        location,
        timestamps: [formatTime(item.timestamp)],
      };
      locationMap.set(normalizedLocation, marker);
      groupedPodoMarkers.push(marker);
    }
  });

  const podoPath = groupedPodoMarkers.map((m) => [m.lat, m.lng] as [number, number]);

  const displayMarkers = showRoute ? markers.filter((m) => m.isPodo) : markers;

  const centerLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
  const centerLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setShowRoute(!showRoute)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            showRoute
              ? "bg-yellow-500 text-black"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
          </svg>
          Podo Rotası {showRoute ? "Gizle" : "Göster"}
        </button>
      </div>
      
      <div className="h-[500px] rounded-lg overflow-hidden border border-zinc-700">
        <MapContent
          markers={displayMarkers}
          podoPath={showRoute ? podoPath : []}
          groupedPodoMarkers={showRoute ? groupedPodoMarkers : []}
          center={[centerLat, centerLng]}
          onTagClick={onTagClick}
          showArrows={showRoute}
        />
      </div>
    </div>
  );
}
