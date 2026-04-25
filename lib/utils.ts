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

export type PodoLevel = "direct" | "mentioned" | "none";

export function getPodoLevel(item: Evidence): PodoLevel {
  const isPodo = (value: string | undefined): boolean =>
    (value ?? "").toLowerCase() === "podo";

  const containsPodo = (value: string | undefined): boolean =>
    (value ?? "").toLowerCase().includes("podo");

  if ("fullname" in item && isPodo(item.fullname)) return "direct";
  if ("personName" in item && isPodo(item.personName)) return "direct";
  if ("from" in item && isPodo(item.from)) return "direct";
  if ("to" in item && isPodo(item.to)) return "direct";

  if ("seenWith" in item && containsPodo(item.seenWith)) return "mentioned";
  if ("suspectName" in item && containsPodo(item.suspectName)) return "mentioned";
  if ("message" in item && containsPodo(item.message)) return "mentioned";
  if ("note" in item && containsPodo(item.note)) return "mentioned";
  if ("tip" in item && containsPodo(item.tip)) return "mentioned";

  return "none";
}

export function isPodoRecord(item: Evidence): boolean {
  return getPodoLevel(item) !== "none";
}

export function isPodoDirect(item: Evidence): boolean {
  return getPodoLevel(item) === "direct";
}

export function isValidEvidence(item: Evidence): boolean {
  if (!item.timestamp || !item.formType) return false;

  const date = parseTimestamp(item.timestamp);
  if (!date || isNaN(date.getTime())) return false;

  const getName = (): string => {
    if ("fullname" in item) return item.fullname || "";
    if ("personName" in item) return item.personName || "";
    if ("from" in item) return item.from || "";
    if ("suspectName" in item) return item.suspectName || "";
    return "";
  };
  if (getName().length < 2) return false;

  const getContent = (): string => {
    if ("message" in item) return item.message || "";
    if ("note" in item) return item.note || "";
    if ("tip" in item) return item.tip || "";
    return "";
  };
  if (getContent().length < 3) return false;

  return true;
}
