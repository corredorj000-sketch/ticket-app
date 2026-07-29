import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return [];
  }
}

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        ClickTicketCo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <div
            key={event.id}
            className="bg-zinc-900 rounded-2xl overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <h2 className="text-2xl font-bold">
                {event.artist}
              </h2>

              <p className="text-zinc-400 mt-2">
                {event.location}
              </p>

              <a
                href={`/event/${event.id}`}
                className="inline-block mt-5 bg-white text-black px-4 py-2 rounded-xl"
              >
                Comprar
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}