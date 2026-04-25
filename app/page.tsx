import { getAllEvidence } from "@/lib/jotform";
import DetectiveBoard from "@/components/DetectiveBoard";

export default async function Home() {
  const evidence = await getAllEvidence();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Kayıp Podo</h1>
        <p className="text-gray-600 mb-8">
          Podo&apos;nun izini sürmek için kanıtları incele
        </p>

        <DetectiveBoard initialEvidence={evidence} />
      </div>
    </main>
  );
}
