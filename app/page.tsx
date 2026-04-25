import { getAllEvidence } from "@/lib/jotform";
import {
  FORM_IDS,
  FormType,
  Evidence,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
} from "@/lib/types";

const FORM_LABELS: Record<FormType, string> = {
  checkins: "Check-ins",
  messages: "Mesajlar",
  sightings: "Görülmeler",
  personalNotes: "Kişisel Notlar",
  anonymousTips: "Anonim İpuçları",
};

function EvidenceCard({ item }: { item: Evidence }) {
  switch (item.formType) {
    case "checkins": {
      const checkin = item as Checkin;
      return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{checkin.fullname}</span>
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
        <div className="border rounded-lg p-4 bg-blue-50 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              {message.from} → {message.to}
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
        <div className="border rounded-lg p-4 bg-green-50 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">
              {sighting.personName}
              {sighting.seenWith && ` ile ${sighting.seenWith}`}
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
        <div className="border rounded-lg p-4 bg-yellow-50 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{note.fullname}</span>
            <span className="text-sm text-gray-500">{note.timestamp}</span>
          </div>
          <p className="text-sm">{note.note}</p>
        </div>
      );
    }

    case "anonymousTips": {
      const tip = item as AnonymousTip;
      return (
        <div className="border rounded-lg p-4 bg-red-50 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">Şüpheli: {tip.suspectName}</span>
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

export default async function Home() {
  const evidence = await getAllEvidence();

  const grouped = evidence.reduce(
    (acc, item) => {
      if (!acc[item.formType]) {
        acc[item.formType] = [];
      }
      acc[item.formType].push(item);
      return acc;
    },
    {} as Record<FormType, Evidence[]>
  );

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Kayıp Podo</h1>
      <p className="text-gray-600 mb-8">
        Toplam {evidence.length} kanıt bulundu
      </p>

      {(Object.keys(FORM_IDS) as FormType[]).map((formType) => (
        <section key={formType} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {FORM_LABELS[formType]} ({grouped[formType]?.length || 0})
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grouped[formType]?.map((item) => (
              <EvidenceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
