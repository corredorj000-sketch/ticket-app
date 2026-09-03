import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        venue: true,
        zones: {
          select: {
            quantity: true,
            price: true,
          },
        },
      },
    });

    return events;
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function Home() {
  const events = await getEvents();

  const upcomingEvents = events.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* =========================
          HERO
      ========================= */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="max-w-4xl animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.5)]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                Tu próxima experiencia empieza aquí
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
              Vive el evento.
              <br />
              <span className="text-zinc-500">
                Compra tu entrada.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Encuentra conciertos, experiencias y eventos
              inolvidables. Elige tu zona, reserva tus entradas
              y prepárate para vivir el momento.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#eventos"
                className="group relative overflow-hidden rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-2xl hover:shadow-white/[0.08]"
              >
                VER EVENTOS
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="/register"
                className="rounded-2xl border border-white/[0.1] bg-white/[0.03] px-7 py-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                CREAR CUENTA
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-2xl font-black">
                {events.length}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Eventos
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-2xl font-black">
                100%
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Online
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:col-span-1">
              <p className="text-2xl font-black">
                Fácil
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Compra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          EVENTS
      ========================= */}
      <section
        id="eventos"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Descubre
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Próximos eventos
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Elige tu próximo evento y encuentra la zona
              perfecta para disfrutarlo.
            </p>
          </div>

          <span className="text-sm font-semibold text-zinc-600">
            {events.length}{" "}
            {events.length === 1
              ? "evento disponible"
              : "eventos disponibles"}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xl">
              ♪
            </div>

            <h3 className="mt-5 text-xl font-black">
              Aún no hay eventos
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Estamos preparando nuevas experiencias.
              Vuelve pronto para descubrir los próximos
              eventos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => {
              const availableTickets =
                event.zones.reduce(
                  (total, zone) =>
                    total + zone.quantity,
                  0
                );

              const availablePrices =
                event.zones
                  .filter(
                    (zone) => zone.quantity > 0
                  )
                  .map((zone) => zone.price);

              const lowestPrice =
                availablePrices.length > 0
                  ? Math.min(
                      ...availablePrices
                    )
                  : null;

              return (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0c0c0c] transition-all duration-300 hover:-translate-y-2 hover:border-white/[0.14] hover:shadow-2xl hover:shadow-black/50"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Image */}
                  <a
                    href={`/event/${event.id}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-zinc-900"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Image gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Status */}
                    <div className="absolute left-4 top-4">
                      {availableTickets > 0 ? (
                        <span className="rounded-full border border-white/[0.12] bg-black/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                          Disponible
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-500/20 bg-red-950/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300 backdrop-blur-md">
                          Agotado
                        </span>
                      )}
                    </div>

                    {/* Event date */}
                    <div className="absolute bottom-4 left-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </a>

                  {/* Content */}
                  <div className="p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
                      {event.title}
                    </p>

                    <h3 className="text-2xl font-black tracking-tight text-white">
                      {event.artist}
                    </h3>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span className="text-zinc-600">
                          ●
                        </span>

                        <span>
                          {event.venue?.name ||
                            event.location}
                        </span>
                      </div>

                      {event.venue?.city && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <span className="text-zinc-700">
                            ●
                          </span>

                          <span>
                            {event.venue.city}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="my-5 border-t border-white/[0.06]" />

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                          {lowestPrice !== null
                            ? "Desde"
                            : "Entradas"}
                        </p>

                        <p className="mt-1 text-lg font-black">
                          {lowestPrice !== null
                            ? formatPrice(
                                lowestPrice
                              )
                            : "Agotado"}
                        </p>
                      </div>

                      <a
                        href={`/event/${event.id}`}
                        className="rounded-xl bg-white px-5 py-3 text-xs font-black text-black transition-all duration-200 hover:bg-zinc-200"
                      >
                        VER EVENTO
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* More events */}
        {events.length > 3 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-zinc-600">
              Mostrando los eventos más recientes.
            </p>
          </div>
        )}
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}
      <section className="border-y border-white/[0.06] bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Simple
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Compra tus entradas
              <br />
              en pocos pasos.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/[0.06] bg-black/40 p-7 transition-colors hover:border-white/[0.12]">
              <span className="text-4xl font-black text-zinc-700">
                01
              </span>

              <h3 className="mt-8 text-xl font-black">
                Elige tu evento
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Encuentra el concierto o experiencia
                que quieres vivir.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-black/40 p-7 transition-colors hover:border-white/[0.12]">
              <span className="text-4xl font-black text-zinc-700">
                02
              </span>

              <h3 className="mt-8 text-xl font-black">
                Selecciona tu zona
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Explora el mapa y selecciona la zona
                que prefieras.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-black/40 p-7 transition-colors hover:border-white/[0.12]">
              <span className="text-4xl font-black text-zinc-700">
                03
              </span>

              <h3 className="mt-8 text-xl font-black">
                Reserva y paga
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Confirma tus entradas y continúa al
                proceso de pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
            ClickTicketCo
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Tu próximo gran momento
            <br />
            está más cerca.
          </h2>

          <a
            href="#eventos"
            className="mt-8 inline-flex rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-2xl hover:shadow-white/[0.08]"
          >
            EXPLORAR EVENTOS
          </a>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="border-t border-white/[0.06] bg-[#030303]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black">
              ClickTicketCo
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Tu entrada. Tu experiencia.
            </p>
          </div>

          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} ClickTicketCo
          </p>
        </div>
      </footer>
    </main>
  );
}