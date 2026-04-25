import { FormType } from "./types";

export const FORM_LABELS: Record<FormType, string> = {
  checkins: "Check-ins",
  messages: "Mesajlar",
  sightings: "Görülmeler",
  personalNotes: "Kişisel Notlar",
  anonymousTips: "Anonim İpuçları",
};

export const FORM_COLORS: Record<FormType, string> = {
  checkins: "bg-white border-gray-200",
  messages: "bg-blue-50 border-blue-200",
  sightings: "bg-green-50 border-green-200",
  personalNotes: "bg-yellow-50 border-yellow-200",
  anonymousTips: "bg-red-50 border-red-200",
};

export const FILTER_COLORS: Record<FormType, { active: string; inactive: string }> = {
  checkins: {
    active: "bg-gray-800 text-white",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
  messages: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  sightings: {
    active: "bg-green-600 text-white",
    inactive: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  personalNotes: {
    active: "bg-yellow-500 text-white",
    inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  },
  anonymousTips: {
    active: "bg-red-600 text-white",
    inactive: "bg-red-100 text-red-700 hover:bg-red-200",
  },
};

export const ALL_FORM_TYPES: FormType[] = [
  "checkins",
  "messages",
  "sightings",
  "personalNotes",
  "anonymousTips",
];

export const MAP_COLORS = {
  podo: {
    fill: "#EAB308",
    stroke: "#CA8A04",
  },
  default: {
    fill: "#3B82F6",
    stroke: "#2563EB",
  },
  path: "#EAB308",
} as const;

export const MAP_SETTINGS = {
  defaultZoom: 13,
  podoMarkerRadius: 12,
  defaultMarkerRadius: 8,
  pathWeight: 3,
  pathDashArray: "5, 10",
} as const;
