"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  price: number;
  section: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
};

type Event = {
  id: string;
  title: string;
  artist: string;
  image: string;
  location: string;
  description: string;
  date: string;
  venue?: {
    id: string;
    name: string;
    city: string;
    image: string;
  };
  tickets: Ticket[];
};

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [section, setSection] = useState("GENERAL");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadEvent() {
      const { id } = await params;

      const res = await fetch(`/api/events/${id}`);

      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }

      setLoading(false);
    }

    loadEvent();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando evento...
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Evento no encontrado
      </main>
    );
  }

  const availableGeneral = event.tickets.filter(
    (ticket) =>
      ticket.section === "GENERAL" &&
      ticket.status === "AVAILABLE"
  );

  const availableVip = event.tickets.filter(
    (ticket) =>
      ticket.section === "VIP" &&
      ticket.status === "AVAILABLE"
  );

  const available =
    section === "VIP" ? availableVip : availableGeneral;

  const availableCount = available.length;

  const price = available[0]?.price || 0;

  const total = price * quantity;

  const soldOut =
    availableGeneral.length === 0 &&
    availableVip.length === 0;

  function changeSection(value: string) {
    setSection(value);
    setQuantity(1);
  }

  function increase() {
    if (quantity < availableCount) {
      setQuantity(quantity + 1);
    }
  }

  function decrease() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function handleBuy() {
    if (availableCount === 0) return;

    alert(
      `Compra preparada: ${quantity} entrada(s) por $${total.toLocaleString(
        "es-CO"
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="relative h-[500px]">

        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

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

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">

            <h2 className="text-4xl font-black mb-6">
              {event.title}
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              {event.description}
            </p>

            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8">

              <h3 className="text-2xl font-black mb-6">
                Escenario
              </h3>

              <p className="text-xl">
                {event.venue?.name || "Escenario"}
              </p>

              <p className="text-zinc-500 mt-2">
                {event.venue?.city || event.location}
              </p>

            </div>

          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 h-fit sticky top-28">

            <h3 className="text-3xl font-black mb-6">
              Comprar Tickets
            </h3>

            <div className="space-y-4 mb-8">

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Fecha
                </span>

                <span>
                  {new Date(event.date).toLocaleDateString(
                    "es-CO"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Ciudad
                </span>

                <span>
                  {event.location}
                </span>
              </div>

            </div>

            {soldOut ? (

              <div className="rounded-2xl bg-red-950 border border-red-800 p-6 text-center">

                <div className="text-red-500 text-3xl font-black mb-2">
                  SOLD OUT
                </div>

                <p className="text-red-300">
                  No quedan entradas disponibles.
                </p>

              </div>

            ) : (

              <div className="space-y-6">

                <div>
                  <label className="block text-zinc-400 mb-2">
                    Tipo de entrada
                  </label>

                  <select
                    value={section}
                    onChange={(e) =>
                      changeSection(e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                  >
                    {availableGeneral.length > 0 && (
                      <option value="GENERAL">
                        General — $
                        {availableGeneral[0].price.toLocaleString(
                          "es-CO"
                        )}
                      </option>
                    )}

                    {availableVip.length > 0 && (
                      <option value="VIP">
                        VIP — $
                        {availableVip[0].price.toLocaleString(
                          "es-CO"
                        )}
                      </option>
                    )}
                  </select>
                </div>

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-zinc-400">
                      Disponibles
                    </span>

                    <span className="font-bold">
                      {availableCount}
                    </span>

                  </div>

                  <div className="flex items-center justify-between bg-zinc-900 rounded-2xl p-2">

                    <button
                      type="button"
                      onClick={decrease}
                      className="w-12 h-12 rounded-xl bg-zinc-800 text-2xl"
                    >
                      −
                    </button>

                    <span className="text-2xl font-black">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increase}
                      disabled={quantity >= availableCount}
                      className="w-12 h-12 rounded-xl bg-zinc-800 text-2xl disabled:opacity-30"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="border-t border-zinc-800 pt-6">

                  <div className="flex justify-between text-zinc-400">
                    <span>
                      Precio unitario
                    </span>

                    <span>
                      ${price.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="flex justify-between text-2xl font-black mt-3">

                    <span>
                      TOTAL
                    </span>

                    <span>
                      ${total.toLocaleString("es-CO")}
                    </span>

                  </div>

                </div>

                <button
                  onClick={handleBuy}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition"
                >
                  Comprar Ahora
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}