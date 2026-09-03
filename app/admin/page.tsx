import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminEventActions from "./AdminEventActions";

async function getEvents() {
  return prisma.event.findMany({
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
  });
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

  const events = await getEvents();

  const ticketsSold = events.reduce(
    (total, event) =>
      total +
      event.tickets.filter(
        (ticket) => ticket.status === "SOLD"
      ).length,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-900 bg-zinc-950 p-8 hidden lg:block">
        <h1 className="text-3xl font-black mb-10">
          TicketCo
        </h1>

        <div className="space-y-3">

          <a
            href="/admin"
            className="block bg-white text-black px-5 py-4 rounded-2xl font-semibold"
          >
            Dashboard
          </a>

          <a
            href="/admin/create-event"
            className="block bg-zinc-900 px-5 py-4 rounded-2xl hover:bg-zinc-800 transition"
          >
            Crear Evento
          </a>

          <a
            href="/"
            className="block bg-zinc-900 px-5 py-4 rounded-2xl hover:bg-zinc-800 transition"
          >
            Página Principal
          </a>

        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 p-10">

        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-5xl font-black mb-3">
              Dashboard
            </h2>

            <p className="text-zinc-500">
              Administra todos tus eventos.
            </p>
          </div>

          <a
            href="/admin/create-event"
            className="bg-white text-black px-6 py-4 rounded-2xl font-bold"
          >
            + Crear Evento
          </a>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
            <p className="text-zinc-500 mb-3">
              Eventos Totales
            </p>

            <h3 className="text-5xl font-black">
              {events.length}
            </h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
            <p className="text-zinc-500 mb-3">
              Tickets Vendidos
            </p>

            <h3 className="text-5xl font-black">
              {ticketsSold}
            </h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
            <p className="text-zinc-500 mb-3">
              Usuarios
            </p>

            <h3 className="text-5xl font-black">
              0
            </h3>
          </div>

        </div>

        {/* Events */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {events.map((event) => (

            <div
              key={event.id}
              className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden"
            >

              <img
                src={event.image}
                alt={event.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-6">

                <h3 className="text-3xl font-black mb-3">
                  {event.artist}
                </h3>

                <p className="text-zinc-500 mb-2">
                  {event.title}
                </p>

                <p className="text-zinc-500 mb-5">
                  {event.location}
                </p>

                <AdminEventActions
                  eventId={event.id}
                  eventTitle={event.title}
                />

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}