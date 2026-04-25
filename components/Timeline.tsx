"use client";

import {
  Evidence,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
} from "@/lib/types";
import { FORM_COLORS } from "@/lib/constants";
import { formatTime, getPodoLevel, PodoLevel } from "@/lib/utils";
import ClickableTag from "./ClickableTag";

interface TimelineProps {
  items: Evidence[];
  onTagClick: (name: string) => void;
}

function getPodoTimelineStyles(level: PodoLevel) {
  if (level === "direct") {
    return {
      border: "border-yellow-500",
      dot: "bg-yellow-500 border-yellow-400",
      ring: "ring-2 ring-yellow-500/50",
      badge: (
        <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-yellow-500 text-black rounded font-semibold">
          PODO
        </span>
      ),
    };
  }
  if (level === "mentioned") {
    return {
      border: "border-yellow-500/40",
      dot: "bg-yellow-500/40 border-yellow-500/60",
      ring: "ring-1 ring-yellow-500/30",
      badge: (
        <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
          bahsedildi
        </span>
      ),
    };
  }
  return {
    border: "border-zinc-700",
    dot: "bg-zinc-800 border-zinc-600",
    ring: "",
    badge: null,
  };
}

function TimelineItem({
  item,
  onTagClick,
}: {
  item: Evidence;
  onTagClick: (name: string) => void;
}) {
  const podoLevel = getPodoLevel(item);
  const styles = getPodoTimelineStyles(podoLevel);

  const baseClasses = `relative pl-8 pb-8 border-l-2 ${styles.border}`;
  const dotClasses = `absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${styles.dot}`;
  const cardClasses = `border rounded-xl p-4 shadow-lg backdrop-blur-sm ${FORM_COLORS[item.formType]} ${styles.ring}`;

  const renderContent = () => {
    switch (item.formType) {
      case "checkins": {
        const checkin = item as Checkin;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ClickableTag name={checkin.fullname} onTagClick={onTagClick} />
              <span className="text-zinc-600">•</span>
              <span className="text-sm text-zinc-400">{checkin.location}</span>
            </div>
            <p className="text-sm text-zinc-300">{checkin.note}</p>
          </>
        );
      }

      case "messages": {
        const message = item as Message;
        return (
          <>
            <div className="flex items-center gap-1 mb-1">
              <ClickableTag name={message.from} onTagClick={onTagClick} />
              <span className="text-zinc-600">→</span>
              <ClickableTag name={message.to} onTagClick={onTagClick} />
            </div>
            <p className="text-sm text-zinc-300">{message.message}</p>
          </>
        );
      }

      case "sightings": {
        const sighting = item as Sighting;
        return (
          <>
            <div className="flex items-center gap-1 mb-1">
              <ClickableTag name={sighting.personName} onTagClick={onTagClick} />
              {sighting.seenWith && (
                <>
                  <span className="text-zinc-600">ile</span>
                  <ClickableTag name={sighting.seenWith} onTagClick={onTagClick} />
                </>
              )}
              <span className="text-zinc-600">•</span>
              <span className="text-sm text-zinc-400">{sighting.location}</span>
            </div>
            <p className="text-sm text-zinc-300">{sighting.note}</p>
          </>
        );
      }

      case "personalNotes": {
        const note = item as PersonalNote;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ClickableTag name={note.fullname} onTagClick={onTagClick} />
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-lg">Not</span>
            </div>
            <p className="text-sm text-zinc-300">{note.note}</p>
          </>
        );
      }

      case "anonymousTips": {
        const tip = item as AnonymousTip;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-zinc-500">Şüpheli:</span>
              <ClickableTag name={tip.suspectName} onTagClick={onTagClick} />
              <span className="text-zinc-600">•</span>
              <span className="text-sm text-zinc-400">{tip.location}</span>
            </div>
            <p className="text-sm text-zinc-300">{tip.tip}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-lg">
              Güven: {tip.confidence}
            </span>
          </>
        );
      }
    }
  };

  return (
    <div className={baseClasses}>
      <div className={dotClasses} />
      <div className="mb-1">
        <span className="text-lg font-semibold text-zinc-100">
          {formatTime(item.timestamp)}
        </span>
        {styles.badge}
      </div>
      <div className={cardClasses}>{renderContent()}</div>
    </div>
  );
}

export default function Timeline({ items, onTagClick }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">
          İpucu bulunamadı
        </h3>
        <p className="text-zinc-500">
          Farklı bir arama terimi dene veya filtreleri değiştir.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-zinc-800" />
      {items.map((item) => (
        <TimelineItem key={item.id} item={item} onTagClick={onTagClick} />
      ))}
    </div>
  );
}
