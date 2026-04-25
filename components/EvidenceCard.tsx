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
import { isPodoRecord } from "@/lib/utils";
import ClickableTag from "./ClickableTag";

interface EvidenceCardProps {
  item: Evidence;
  onTagClick: (name: string) => void;
}

export default function EvidenceCard({ item, onTagClick }: EvidenceCardProps) {
  const isPodo = isPodoRecord(item);
  const baseClasses = `border rounded-lg p-4 shadow-sm ${FORM_COLORS[item.formType]} ${
    isPodo ? "ring-2 ring-yellow-400 relative" : ""
  }`;

  const podoBadge = isPodo && (
    <span className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full font-medium">
      PODO
    </span>
  );

  switch (item.formType) {
    case "checkins": {
      const checkin = item as Checkin;
      return (
        <div className={baseClasses}>
          {podoBadge}
          <div className="flex justify-between items-start mb-2">
            <ClickableTag name={checkin.fullname} onTagClick={onTagClick} />
            <span className="text-sm text-gray-500">{checkin.timestamp}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{checkin.location}</div>
          <p className="text-sm">{checkin.note}</p>
        </div>
      );
    }

    case "messages": {
      const message = item as Message;
      return (
        <div className={baseClasses}>
          {podoBadge}
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              <ClickableTag name={message.from} onTagClick={onTagClick} />
              <span className="text-gray-500"> → </span>
              <ClickableTag name={message.to} onTagClick={onTagClick} />
            </span>
            <span className="text-sm text-gray-500">{message.timestamp}</span>
          </div>
          <p className="text-sm">{message.message}</p>
        </div>
      );
    }

    case "sightings": {
      const sighting = item as Sighting;
      return (
        <div className={baseClasses}>
          {podoBadge}
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              <ClickableTag name={sighting.personName} onTagClick={onTagClick} />
              {sighting.seenWith && (
                <>
                  <span className="text-gray-500"> ile </span>
                  <ClickableTag name={sighting.seenWith} onTagClick={onTagClick} />
                </>
              )}
            </span>
            <span className="text-sm text-gray-500">{sighting.timestamp}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{sighting.location}</div>
          <p className="text-sm">{sighting.note}</p>
        </div>
      );
    }

    case "personalNotes": {
      const note = item as PersonalNote;
      return (
        <div className={baseClasses}>
          {podoBadge}
          <div className="flex justify-between items-start mb-2">
            <ClickableTag name={note.fullname} onTagClick={onTagClick} />
            <span className="text-sm text-gray-500">{note.timestamp}</span>
          </div>
          <p className="text-sm">{note.note}</p>
        </div>
      );
    }

    case "anonymousTips": {
      const tip = item as AnonymousTip;
      return (
        <div className={baseClasses}>
          {podoBadge}
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              Şüpheli:{" "}
              <ClickableTag name={tip.suspectName} onTagClick={onTagClick} />
            </span>
            <span className="text-sm text-gray-500">{tip.timestamp}</span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{tip.location}</div>
          <p className="text-sm">{tip.tip}</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-red-100 rounded">
            Güven: {tip.confidence}
          </span>
        </div>
      );
    }
  }
}
