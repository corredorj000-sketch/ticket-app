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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
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

  const [orderError, setOrderError] = useState("");

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
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-zinc-900" />

            <div className="mt-5 h-12 max-w-xl rounded-xl bg-zinc-900" />

            <div className="mt-3 h-5 max-w-md rounded bg-zinc-900" />

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="min-h-[500px] rounded-3xl bg-zinc-900" />

              <div className="h-[450px] rounded-3xl bg-zinc-900" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-2xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Evento no encontrado
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            El evento que buscas no está disponible.
          </p>

          <a
            href="/"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-xs font-black text-black transition hover:bg-zinc-200"
          >
            VOLVER A EVENTOS
          </a>
        </div>
      </main>
    );
  }

  const eventId = event.id;

  const isMovistar =
    event.venue?.id === "lugar-movistar-bogota";

  const totalAvailable = event.zones.reduce(
    (total, zone) => total + Math.max(0, zone.quantity),
    0
  );

  const availableZones = event.zones.filter(
    (zone) => zone.quantity > 0
  );

  const eventSoldOut = totalAvailable === 0;

  const total = selectedZone
    ? selectedZone.price * quantity
    : 0;

  function handleZoneSelect(
    zone: CustomerInventoryItem | null
  ) {
    setOrderError("");
    setSelectedZone(zone);

    if (zone) {
      setQuantity(1);
    }
  }

  function increaseQuantity() {
    if (!selectedZone) return;

    setOrderError("");

    setQuantity((current) =>
      Math.min(
        selectedZone.quantity,
        current + 1
      )
    );
  }

  function decreaseQuantity() {
    setOrderError("");

    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  async function handleContinue() {
    setOrderError("");

    if (!selectedZone) {
      setOrderError("Selecciona una zona primero.");
      return;
    }

    if (quantity < 1) {
      setOrderError("Selecciona una cantidad válida.");
      return;
    }

    if (quantity > selectedZone.quantity) {
      setOrderError(
        "No hay suficientes entradas disponibles."
      );
      return;
    }

    const zoneId = selectedZone.id;
    const currentEventId = eventId;

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
          eventId: currentEventId,
          eventZoneId: zoneId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOrderError(
          data.error ||
            "No fue posible crear la reserva."
        );

        return;
      }

      router.push(`/checkout/${data.orderId}`);
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      setOrderError(
        "Ocurrió un error creando la reserva. Inténtalo nuevamente."
      );
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* =========================
          HERO EVENT
      ========================= */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover opacity-[0.13] blur-2xl"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/90 to-[#050505]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:text-white"
          >
            <span>←</span>
            Volver a eventos
          </a>

          <div className="mt-10 max-w-4xl animate-fade-up">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              {event.artist}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {event.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">
              <span>{event.venue?.name}</span>

              <span className="text-zinc-700">
                •
              </span>

              <span>{event.venue?.city}</span>

              <span className="text-zinc-700">
                •
              </span>

              <span>{formatDate(event.date)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* =========================
              MAP / EVENT
          ========================= */}
          <div className="min-w-0">
            {/* Event image */}
            <section className="mb-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
              <div className="relative aspect-[21/8] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-5 sm:left-7">
                  <span className="rounded-full border border-white/[0.12] bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                    {totalAvailable > 0
                      ? "Entradas disponibles"
                      : "Agotado"}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-sm leading-7 text-zinc-400">
                  {event.description}
                </p>
              </div>
            </section>

            {/* Map */}
            <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
              <div className="border-b border-white/[0.06] px-6 py-6 sm:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                      Selección de entradas
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-tight">
                      Elige tu zona
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Selecciona una zona disponible
                      en el mapa para consultar sus
                      entradas.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                      Disponibilidad
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {totalAvailable} entradas
                    </p>
                  </div>
                </div>
              </div>

              {isMovistar ? (
                <CustomerStadiumMap
                  inventory={event.zones}
                  selectedZone={
                    selectedZone?.zone || ""
                  }
                  onZoneSelect={handleZoneSelect}
                />
              ) : (
                <div className="flex min-h-[400px] items-center justify-center bg-[#101010] px-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-2xl">
                      ◇
                    </div>

                    <p className="mt-5 text-xl font-black">
                      Mapa próximamente
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                      Este escenario todavía no
                      tiene mapa interactivo.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Available zones */}
            <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 sm:p-7">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Disponibilidad
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Zonas disponibles
                </h2>
              </div>

              {availableZones.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {availableZones
                    .slice(0, 8)
                    .map((zone) => {
                      const isSelected =
                        selectedZone?.id ===
                        zone.id;

                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() =>
                            handleZoneSelect(
                              zone
                            )
                          }
                          className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-white bg-white/[0.08]"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-sm font-black">
                              {zone.zone}
                            </span>

                            <span className="shrink-0 text-xs font-bold text-zinc-500">
                              {zone.quantity}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-bold text-zinc-300">
                            {formatPrice(
                              zone.price
                            )}
                          </p>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <p className="mt-5 text-sm text-zinc-600">
                  No hay zonas disponibles.
                </p>
              )}
            </section>
          </div>

          {/* =========================
              PURCHASE PANEL
          ========================= */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c0c] shadow-2xl shadow-black/40">
              <div className="border-b border-white/[0.06] p-6 sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Comprar entradas
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {selectedZone
                    ? selectedZone.zone
                    : "Selecciona una zona"}
                </h2>
              </div>

              <div className="p-6 sm:p-7">
                {/* Event info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-zinc-600">
                      Fecha
                    </span>

                    <span className="max-w-[210px] text-right text-sm font-bold text-zinc-300">
                      {formatDate(event.date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-zinc-600">
                      Ciudad
                    </span>

                    <span className="text-sm font-bold text-zinc-300">
                      {event.venue?.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-zinc-600">
                      Disponibles
                    </span>

                    <span className="text-sm font-bold text-zinc-300">
                      {totalAvailable}
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-white/[0.06]" />

                {selectedZone ? (
                  <>
                    {/* Price */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Precio por entrada
                      </p>

                      <p className="mt-2 text-3xl font-black">
                        {formatPrice(
                          selectedZone.price
                        )}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-zinc-600">
                        {selectedZone.quantity}{" "}
                        disponibles en esta zona
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="mt-7">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Cantidad
                      </p>

                      <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#070707] p-2">
                        <button
                          type="button"
                          onClick={
                            decreaseQuantity
                          }
                          disabled={creatingOrder}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-xl font-black transition hover:bg-white/[0.1] disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="text-xl font-black">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={
                            increaseQuantity
                          }
                          disabled={
                            creatingOrder ||
                            quantity >=
                              selectedZone.quantity
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-xl font-black transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-7 border-t border-white/[0.06] pt-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                            Total
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {quantity}{" "}
                            {quantity === 1
                              ? "entrada"
                              : "entradas"}
                          </p>
                        </div>

                        <span className="text-3xl font-black tracking-tight">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    {/* Reservation error */}
                    {orderError && (
                      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/[0.08] text-xs font-black text-red-400">
                            !
                          </span>

                          <div>
                            <p className="text-xs font-black text-red-300">
                              No pudimos completar la
                              reserva
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-red-400/70">
                              {orderError}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Continue */}
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={
                        creatingOrder ||
                        eventSoldOut
                      }
                      className={`group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-black transition-all duration-200 ${
                        eventSoldOut
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                          : "bg-white text-black hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/[0.08]"
                      } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
                    >
                      {eventSoldOut ? (
                        "EVENTO AGOTADO"
                      ) : creatingOrder ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                          RESERVANDO...
                        </>
                      ) : (
                        <>
                          CONTINUAR
                          <span className="transition-transform duration-200 group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-center text-[11px] leading-5 text-zinc-700">
                      {eventSoldOut
                        ? "No hay entradas disponibles para este evento."
                        : "Al continuar se reservarán las entradas seleccionadas y serás dirigido al checkout."}
                    </p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#070707] p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-500">
                      ↓
                    </div>

                    <p className="mt-4 text-sm font-black text-zinc-300">
                      Selecciona una zona
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Elige una zona en el mapa o
                      utiliza la lista de zonas
                      disponibles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}