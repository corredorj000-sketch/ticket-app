import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminEventActions from "./AdminEventActions";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [events, users] = await Promise.all([
    prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
      include: {
        venue: true,
        tickets: {
          select: {
            id: true,
            status: true,
          },
        },
        zones: {
          select: {
            id: true,
            zone: true,
            quantity: true,
            price: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  return {
    events,
    users,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
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

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const { events, users } =
    await getDashboardData();

  const ticketsSold = events.reduce(
    (total, event) =>
      total +
      event.tickets.filter(
        (ticket) => ticket.status === "SOLD"
      ).length,
    0
  );

  const availableTickets = events.reduce(
    (total, event) =>
      total +
      event.zones.reduce(
        (zoneTotal, zone) =>
          zoneTotal + zone.quantity,
        0
      ),
    0
  );

  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.date).getTime() >=
      Date.now()
  ).length;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        {/* =========================
            SIDEBAR
        ========================= */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/[0.06] bg-[#080808] lg:flex lg:flex-col">
          <div className="border-b border-white/[0.06] p-7">
            <a
              href="/admin"
              className="group flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black transition-transform duration-200 group-hover:scale-105">
                C
              </span>

              <div>
                <p className="text-lg font-black tracking-tight">
                  ClickTicket
                  <span className="text-zinc-500">
                    Co
                  </span>
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                  Admin Panel
                </p>
              </div>
            </a>
          </div>

          <nav className="flex-1 p-5">
            <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
              Administración
            </p>

            <div className="space-y-1.5">
              <a
                href="/admin"
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-black transition-all duration-200"
              >
                <span className="text-base">
                  ▦
                </span>

                Dashboard
              </a>

              <a
                href="/admin/create-event"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                <span className="text-base">
                  +
                </span>

                Crear evento
              </a>
            </div>

            <p className="mb-3 mt-9 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
              Navegación
            </p>

            <a
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
            >
              <span className="text-base">
                ↗
              </span>

              Página principal
            </a>
          </nav>

          {/* Admin user */}
          <div className="border-t border-white/[0.06] p-5">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600">
                Sesión actual
              </p>

              <p className="mt-2 truncate text-sm font-bold text-zinc-200">
                {session.user.name ||
                  session.user.email}
              </p>

              <p className="mt-1 truncate text-xs text-zinc-600">
                {session.user.email}
              </p>
            </div>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <section className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#080808] px-5 py-4 lg:hidden">
            <a
              href="/admin"
              className="text-lg font-black"
            >
              ClickTicket
              <span className="text-zinc-500">
                Co
              </span>
            </a>

            <a
              href="/admin/create-event"
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black"
            >
              + Evento
            </a>
          </div>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
            {/* Header */}
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="animate-fade-up">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Administración
                </p>

                <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Dashboard
                </h1>

                <p className="mt-3 text-sm text-zinc-500">
                  Gestiona tus eventos, inventario y
                  ventas desde un solo lugar.
                </p>
              </div>

              <a
                href="/admin/create-event"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/[0.06]"
              >
                + CREAR EVENTO
              </a>
            </div>

            {/* =========================
                STATS
            ========================= */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="group rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.12]">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Eventos totales
                  </p>

                  <span className="text-zinc-700">
                    ◇
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight">
                  {events.length}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Eventos registrados
                </p>
              </div>

              <div className="group rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.12]">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Próximos
                  </p>

                  <span className="text-zinc-700">
                    ◷
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight">
                  {upcomingEvents}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Eventos pendientes
                </p>
              </div>

              <div className="group rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.12]">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Tickets vendidos
                  </p>

                  <span className="text-zinc-700">
                    ▣
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight">
                  {ticketsSold}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Ventas confirmadas
                </p>
              </div>

              <div className="group rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.12]">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Usuarios
                  </p>

                  <span className="text-zinc-700">
                    ●
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight">
                  {users}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Cuentas registradas
                </p>
              </div>
            </div>

            {/* Inventory summary */}
            <div className="mt-5 rounded-3xl border border-white/[0.07] bg-[#0b0b0b] px-6 py-5 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    Inventario disponible
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Entradas actualmente disponibles
                    en todas las zonas.
                  </p>
                </div>

                <p className="text-2xl font-black">
                  {availableTickets}
                  <span className="ml-2 text-xs font-semibold text-zinc-600">
                    entradas
                  </span>
                </p>
              </div>
            </div>

            {/* =========================
                EVENTS HEADER
            ========================= */}
            <div className="mb-6 mt-14 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Gestión
                </p>

                <h2 className="text-2xl font-black tracking-tight">
                  Tus eventos
                </h2>
              </div>

              <p className="text-xs font-semibold text-zinc-600">
                {events.length}{" "}
                {events.length === 1
                  ? "evento"
                  : "eventos"}
              </p>
            </div>

            {/* =========================
                EVENTS
            ========================= */}
            {events.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xl">
                  +
                </div>

                <h3 className="mt-5 text-xl font-black">
                  No tienes eventos todavía
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  Crea tu primer evento para comenzar
                  a administrar entradas e inventario.
                </p>

                <a
                  href="/admin/create-event"
                  className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-xs font-black text-black transition hover:bg-zinc-200"
                >
                  CREAR PRIMER EVENTO
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {events.map((event, index) => {
                  const available =
                    event.zones.reduce(
                      (total, zone) =>
                        total + zone.quantity,
                      0
                    );

                  const prices =
                    event.zones.map(
                      (zone) => zone.price
                    );

                  const lowestPrice =
                    prices.length > 0
                      ? Math.min(...prices)
                      : null;

                  const isPast =
                    new Date(event.date).getTime() <
                    Date.now();

                  return (
                    <article
                      key={event.id}
                      className="group overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-2xl hover:shadow-black/40"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/8] overflow-hidden bg-zinc-900">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Status */}
                        <div className="absolute left-4 top-4">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                              isPast
                                ? "border-zinc-700 bg-black/70 text-zinc-500"
                                : available > 0
                                  ? "border-white/[0.12] bg-black/70 text-white"
                                  : "border-red-500/20 bg-red-950/70 text-red-300"
                            }`}
                          >
                            {isPast
                              ? "Finalizado"
                              : available > 0
                                ? "Activo"
                                : "Agotado"}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              {formatDate(event.date)}
                            </p>

                            <h3 className="mt-1 text-2xl font-black tracking-tight">
                              {event.artist}
                            </h3>
                          </div>

                          {available > 0 && (
                            <div className="hidden rounded-xl border border-white/[0.08] bg-black/60 px-3 py-2 text-right backdrop-blur-md sm:block">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                                Disponibles
                              </p>

                              <p className="text-sm font-black">
                                {available}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-bold text-zinc-300">
                            {event.title}
                          </p>

                          <p className="text-sm text-zinc-500">
                            {event.venue?.name ||
                              event.location}
                          </p>

                          {event.venue?.city && (
                            <p className="text-xs text-zinc-600">
                              {event.venue.city}
                            </p>
                          )}
                        </div>

                        <div className="my-5 border-t border-white/[0.06]" />

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                              Precio desde
                            </p>

                            <p className="mt-1 text-lg font-black">
                              {lowestPrice !== null
                                ? formatPrice(
                                    lowestPrice
                                  )
                                : "Sin precio"}
                            </p>
                          </div>

                          <AdminEventActions
                            eventId={event.id}
                            eventTitle={event.title}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}