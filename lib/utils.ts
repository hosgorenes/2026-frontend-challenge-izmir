import { Evidence } from "./types";

export function parseTimestamp(timestamp: string): Date | null {
  const match = timestamp.match(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/);
  if (!match) return null;
  const [, day, month, year, hour, minute] = match;
  return new Date(+year, +month - 1, +day, +hour, +minute);
}

export function sortByTimestamp(items: Evidence[], ascending = true): Evidence[] {
  return [...items].sort((a, b) => {
    const dateA = parseTimestamp(a.timestamp);
    const dateB = parseTimestamp(b.timestamp);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const diff = dateA.getTime() - dateB.getTime();
    return ascending ? diff : -diff;
  });
}

export function formatTime(timestamp: string): string {
  const date = parseTimestamp(timestamp);
  if (!date) return timestamp;

  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: string): string {
  const date = parseTimestamp(timestamp);
  if (!date) return timestamp;

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isPodoRecord(item: Evidence): boolean {
  if ("fullname" in item && item.fullname.toLowerCase() === "podo") {
    return true;
  }
  if ("personName" in item && item.personName.toLowerCase() === "podo") {
    return true;
  }
  if ("from" in item && item.from.toLowerCase() === "podo") {
    return true;
  }
  return false;
}
