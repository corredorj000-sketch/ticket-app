"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

import CustomerStadiumMap, {
  CustomerInventoryItem,
} from "../../components/CustomerStadiumMap";

type Venue = {
  id: string;
  name: string;
  city: string;
  image: string;
};

type EventData = {
  id: string;
  title: string;
  artist: string;
  image: string;
  location: string;
  description: string;
  date: string;
  venue: Venue;
  zones: CustomerInventoryItem[];
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedZone, setSelectedZone] =
    useState<CustomerInventoryItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar el evento");
        }

        const data = await res.json();

        setEvent(data);
      } catch (error) {
        console.error("LOAD EVENT ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-500">
            Cargando evento...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-black">
            Evento no encontrado
          </h1>
        </div>
      </main>
    );
  }

  const eventId = event.id;

  const isMovistar =
    event.venue?.id === "lugar-movistar-bogota";

  const totalAvailable = event.zones.reduce(
    (total, zone) =>
      total + Math.max(0, zone.quantity),
    0
  );

  const total = selectedZone
    ? selectedZone.price * quantity
    : 0;

  function handleZoneSelect(
    zone: CustomerInventoryItem | null
  ) {
    setSelectedZone(zone);

    if (zone) {
      setQuantity(1);
    }
  }

  function increaseQuantity() {
    if (!selectedZone) return;

    setQuantity((current) =>
      Math.min(
        selectedZone.quantity,
        current + 1
      )
    );
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  async function handleContinue() {
  if (!selectedZone) {
    alert("Selecciona una zona primero.");
    return;
  }

  if (quantity < 1) {
    alert("Selecciona una cantidad válida.");
    return;
  }

  if (quantity > selectedZone.quantity) {
    alert("No hay suficientes entradas disponibles.");
    return;
  }

  const zoneId = selectedZone.id;
  const eventId = id;

  setCreatingOrder(true);

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      const callbackUrl = `/event/${id}`;

      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          callbackUrl
        )}`
      );

      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId,
        eventZoneId: zoneId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.error ||
          "No fue posible crear la reserva."
      );

      return;
    }

    router.push(`/checkout/${data.orderId}`);
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    alert(
      "Ocurrió un error creando la reserva."
    );
  } finally {
    setCreatingOrder(false);
  }
}

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
            {event.artist}
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>
              📍 {event.venue?.name}
            </span>

            <span>
              · {event.venue?.city}
            </span>

            <span>
              ·{" "}
              {new Date(
                event.date
              ).toLocaleDateString("es-CO")}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b]">

            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-2xl font-black">
                Selecciona tu zona
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Haz clic sobre una zona disponible
                para ver sus entradas.
              </p>
            </div>

            {isMovistar ? (
              <CustomerStadiumMap
                inventory={event.zones}
                selectedZone={
                  selectedZone?.zone || ""
                }
                onZoneSelect={
                  handleZoneSelect
                }
              />
            ) : (
              <div className="flex min-h-[400px] items-center justify-center bg-[#101010]">
                <div className="text-center">

                  <div className="mb-4 text-5xl">
                    🗺️
                  </div>

                  <p className="text-xl font-black">
                    Mapa próximamente
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Este escenario todavía no
                    tiene mapa interactivo.
                  </p>

                </div>
              </div>
            )}

          </section>

          <aside className="h-fit rounded-[28px] border border-white/10 bg-[#111] p-6 lg:sticky lg:top-6">

            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Comprar Tickets
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {selectedZone
                ? selectedZone.zone
                : "Selecciona una zona"}
            </h2>

            <div className="my-6 space-y-4 border-y border-white/10 py-6">

              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  Fecha
                </span>

                <span className="font-bold">
                  {new Date(
                    event.date
                  ).toLocaleDateString("es-CO")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  Ciudad
                </span>

                <span className="font-bold">
                  {event.venue?.city}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  Disponibilidad
                </span>

                <span className="font-bold text-green-400">
                  {totalAvailable} boletas
                </span>
              </div>

            </div>

            {selectedZone ? (
              <>

                <div>
                  <p className="text-sm text-zinc-500">
                    Precio por boleta
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    $
                    {selectedZone.price.toLocaleString(
                      "es-CO"
                    )}
                  </p>

                  <p className="mt-1 text-sm text-green-400">
                    {selectedZone.quantity} disponibles
                  </p>
                </div>

                <div className="mt-6">

                  <p className="mb-3 text-sm font-bold text-zinc-400">
                    Cantidad
                  </p>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black p-2">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={creatingOrder}
                      className="h-12 w-12 rounded-xl bg-white/10 text-xl font-black hover:bg-white/20 disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="text-xl font-black">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        creatingOrder ||
                        quantity >=
                          selectedZone.quantity
                      }
                      className="h-12 w-12 rounded-xl bg-white/10 text-xl font-black hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>

                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">

                  <span className="text-zinc-500">
                    Total
                  </span>

                  <span className="text-3xl font-black">
                    $
                    {total.toLocaleString(
                      "es-CO"
                    )}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={creatingOrder}
                  className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-lg font-black text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingOrder
                    ? "RESERVANDO..."
                    : "CONTINUAR"}
                </button>

              </>
            ) : (

              <div className="rounded-2xl border border-dashed border-white/10 bg-black p-5 text-center">

                <p className="font-bold text-white">
                  Selecciona una zona en el mapa
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Allí podrás ver precio,
                  disponibilidad y cantidad.
                </p>

              </div>

            )}

          </aside>

        </div>
      </div>
    </main>
  );
}