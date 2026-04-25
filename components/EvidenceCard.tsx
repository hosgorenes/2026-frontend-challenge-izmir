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
import { getPodoLevel, PodoLevel } from "@/lib/utils";
import ClickableTag from "./ClickableTag";

interface EvidenceCardProps {
  item: Evidence;
  onTagClick: (name: string) => void;
}

function getPodoStyles(level: PodoLevel): { ring: string; badge: React.ReactNode } {
  if (level === "direct") {
    return {
      ring: "ring-2 ring-yellow-500",
      badge: (
        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500 text-black rounded font-semibold ml-2">
          PODO
        </span>
      ),
    };
  }
  if (level === "mentioned") {
    return {
      ring: "ring-1 ring-yellow-500/40",
      badge: (
        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-medium ml-2">
          bahsedildi
        </span>
      ),
    };
  }
  return { ring: "", badge: null };
}

export default function EvidenceCard({ item, onTagClick }: EvidenceCardProps) {
  const podoLevel = getPodoLevel(item);
  const { ring, badge } = getPodoStyles(podoLevel);

  const baseClasses = `border rounded-xl p-3 shadow-md h-32 flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg ${FORM_COLORS[item.formType]} ${ring}`;

  switch (item.formType) {
    case "checkins": {
      const checkin = item as Checkin;
      return (
        <div className={baseClasses}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <ClickableTag name={checkin.fullname} onTagClick={onTagClick} />
              {badge}
            </div>
            <span className="text-[10px] text-zinc-500">{checkin.timestamp}</span>
          </div>
          <div className="text-xs text-zinc-400 mb-1">{checkin.location}</div>
          <p className="text-xs text-zinc-300 flex-1 overflow-hidden line-clamp-2">{checkin.note}</p>
        </div>
      );
    }

    case "messages": {
      const message = item as Message;
      return (
        <div className={baseClasses}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <ClickableTag name={message.from} onTagClick={onTagClick} />
              <span className="text-zinc-600 mx-1 text-xs">→</span>
              <ClickableTag name={message.to} onTagClick={onTagClick} />
              {badge}
            </div>
            <span className="text-[10px] text-zinc-500">{message.timestamp}</span>
          </div>
          <p className="text-xs text-zinc-300 flex-1 overflow-hidden line-clamp-3">{message.message}</p>
        </div>
      );
    }

    case "sightings": {
      const sighting = item as Sighting;
      return (
        <div className={baseClasses}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center flex-wrap">
              <ClickableTag name={sighting.personName} onTagClick={onTagClick} />
              {sighting.seenWith && (
                <>
                  <span className="text-zinc-500 mx-1 text-xs">ile</span>
                  <ClickableTag name={sighting.seenWith} onTagClick={onTagClick} />
                </>
              )}
              {badge}
            </div>
            <span className="text-[10px] text-zinc-500 shrink-0">{sighting.timestamp}</span>
          </div>
          <div className="text-xs text-zinc-400 mb-1">{sighting.location}</div>
          <p className="text-xs text-zinc-300 flex-1 overflow-hidden line-clamp-2">{sighting.note}</p>
        </div>
      );
    }

    case "personalNotes": {
      const note = item as PersonalNote;
      return (
        <div className={baseClasses}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <ClickableTag name={note.fullname} onTagClick={onTagClick} />
              {badge}
            </div>
            <span className="text-[10px] text-zinc-500">{note.timestamp}</span>
          </div>
          <p className="text-xs text-zinc-300 flex-1 overflow-hidden line-clamp-3">{note.note}</p>
        </div>
      );
    }

    case "anonymousTips": {
      const tip = item as AnonymousTip;
      return (
        <div className={baseClasses}>
          <div className="flex justify-between items-start mb-1 gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-zinc-500 text-xs shrink-0">Şüpheli:</span>
              <ClickableTag name={tip.suspectName} onTagClick={onTagClick} />
              {badge}
            </div>
            <span className="text-[10px] text-zinc-500 shrink-0">{tip.timestamp}</span>
          </div>
          <div className="text-xs text-zinc-400 mb-1">{tip.location}</div>
          <p className="text-xs text-zinc-300 flex-1 overflow-hidden line-clamp-2">{tip.tip}</p>
          <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded w-fit">
            Güven: {tip.confidence}
          </span>
        </div>
      );
    }
  }
}
