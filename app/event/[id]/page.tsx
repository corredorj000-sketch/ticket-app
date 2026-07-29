import { prisma } from "@/lib/prisma";

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: {
      id,
    },
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const event = await getEvent(id);

  if (!event) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Evento no encontrado
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Banner */}
      <div className="relative h-[500px]">

        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <div className="absolute bottom-10 left-10">

          <p className="text-zinc-300 text-xl mb-3">
            {event.location}
          </p>

          <h1 className="text-7xl font-black max-w-4xl">
            {event.artist}
          </h1>

        </div>

      </div>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info */}
          <div className="lg:col-span-2">

            <h2 className="text-4xl font-black mb-6">
              Información del Evento
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              {event.description}
            </p>

          </div>

          {/* Buy Card */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 h-fit sticky top-28">

            <h3 className="text-3xl font-black mb-6">
              Comprar Tickets
            </h3>

            <div className="space-y-4 mb-8">

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">
                  Fecha
                </span>

                <span>
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">
                  Ciudad
                </span>

                <span>
                  {event.location}
                </span>
              </div>

            </div>

            <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition">
              Comprar Ahora
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}