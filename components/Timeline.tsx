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
import { formatTime, isPodoRecord } from "@/lib/utils";
import ClickableTag from "./ClickableTag";

interface TimelineProps {
  items: Evidence[];
  onTagClick: (name: string) => void;
}

function TimelineItem({
  item,
  onTagClick,
}: {
  item: Evidence;
  onTagClick: (name: string) => void;
}) {
  const isPodo = isPodoRecord(item);
  const baseClasses = `relative pl-8 pb-8 border-l-2 ${
    isPodo ? "border-yellow-400" : "border-gray-200"
  }`;

  const dotClasses = `absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
    isPodo
      ? "bg-yellow-400 border-yellow-500"
      : "bg-white border-gray-300"
  }`;

  const cardClasses = `border rounded-lg p-4 shadow-sm ${FORM_COLORS[item.formType]} ${
    isPodo ? "ring-2 ring-yellow-400" : ""
  }`;

  const renderContent = () => {
    switch (item.formType) {
      case "checkins": {
        const checkin = item as Checkin;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ClickableTag name={checkin.fullname} onTagClick={onTagClick} />
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{checkin.location}</span>
            </div>
            <p className="text-sm text-gray-700">{checkin.note}</p>
          </>
        );
      }

      case "messages": {
        const message = item as Message;
        return (
          <>
            <div className="flex items-center gap-1 mb-1">
              <ClickableTag name={message.from} onTagClick={onTagClick} />
              <span className="text-gray-400">→</span>
              <ClickableTag name={message.to} onTagClick={onTagClick} />
            </div>
            <p className="text-sm text-gray-700">{message.message}</p>
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
                  <span className="text-gray-400">ile</span>
                  <ClickableTag name={sighting.seenWith} onTagClick={onTagClick} />
                </>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{sighting.location}</span>
            </div>
            <p className="text-sm text-gray-700">{sighting.note}</p>
          </>
        );
      }

      case "personalNotes": {
        const note = item as PersonalNote;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ClickableTag name={note.fullname} onTagClick={onTagClick} />
              <span className="text-xs px-2 py-0.5 bg-yellow-100 rounded">Not</span>
            </div>
            <p className="text-sm text-gray-700">{note.note}</p>
          </>
        );
      }

      case "anonymousTips": {
        const tip = item as AnonymousTip;
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500">Şüpheli:</span>
              <ClickableTag name={tip.suspectName} onTagClick={onTagClick} />
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{tip.location}</span>
            </div>
            <p className="text-sm text-gray-700">{tip.tip}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-red-100 rounded">
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
        <span className="text-lg font-semibold text-gray-800">
          {formatTime(item.timestamp)}
        </span>
        {isPodo && (
          <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
            PODO
          </span>
        )}
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
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          İpucu bulunamadı
        </h3>
        <p className="text-gray-500">
          Farklı bir arama terimi dene veya filtreleri değiştir.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gray-200" />
      {items.map((item) => (
        <TimelineItem key={item.id} item={item} onTagClick={onTagClick} />
      ))}
    </div>
  );
}
