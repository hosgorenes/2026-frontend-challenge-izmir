import { FormType } from "./types";

export const FORM_LABELS: Record<FormType, string> = {
  checkins: "Check-ins",
  messages: "Mesajlar",
  sightings: "Görülmeler",
  personalNotes: "Kişisel Notlar",
  anonymousTips: "Anonim İpuçları",
};

export const FORM_COLORS: Record<FormType, string> = {
  checkins: "bg-zinc-800/50 border-zinc-700",
  messages: "bg-blue-950/50 border-blue-800",
  sightings: "bg-emerald-950/50 border-emerald-800",
  personalNotes: "bg-amber-950/50 border-amber-800",
  anonymousTips: "bg-red-950/50 border-red-800",
};

export const FILTER_COLORS: Record<FormType, { active: string; inactive: string }> = {
  checkins: {
    active: "bg-zinc-100 text-zinc-900",
    inactive: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
  },
  messages: {
    active: "bg-blue-500 text-white",
    inactive: "bg-blue-950 text-blue-300 hover:bg-blue-900",
  },
  sightings: {
    active: "bg-emerald-500 text-white",
    inactive: "bg-emerald-950 text-emerald-300 hover:bg-emerald-900",
  },
  personalNotes: {
    active: "bg-amber-500 text-white",
    inactive: "bg-amber-950 text-amber-300 hover:bg-amber-900",
  },
  anonymousTips: {
    active: "bg-red-500 text-white",
    inactive: "bg-red-950 text-red-300 hover:bg-red-900",
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
