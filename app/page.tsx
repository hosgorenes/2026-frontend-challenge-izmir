import { getAllEvidence } from "@/lib/jotform";
import DetectiveBoard from "@/components/DetectiveBoard";

export default async function Home() {
  const evidence = await getAllEvidence();

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">
            Kayıp Podo
          </h1>
          <p className="text-zinc-500">
            Podo&apos;nun izini sürmek için kanıtları incele
          </p>
        </div>

        <DetectiveBoard initialEvidence={evidence} />
      </div>
    </main>
  );
}
