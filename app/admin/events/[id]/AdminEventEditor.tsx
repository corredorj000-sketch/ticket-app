"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import StadiumMap from "../../../components/StadiumMap";

type InventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

type EventData = {
  id: string;
  title: string;
  artist: string;
  image: string;
  location: string;
  description: string;
  date: string;
  venue: {
    id: string;
    name: string;
    city: string;
    image: string;
  };
  zones: {
    id: string;
    zone: string;
    quantity: number;
    price: number;
  }[];
};

type Props = {
  event: EventData;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function AdminEventEditor({
  event,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(event.title);
  const [artist, setArtist] = useState(event.artist);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(
    event.description
  );

  const [inventory, setInventory] =
    useState<InventoryItem[]>(
      event.zones.map((zone) => ({
        zone: zone.zone,
        quantity: zone.quantity,
        price: zone.price,
      }))
    );

  const [saving, setSaving] = useState(false);

  const totalAvailable = inventory.reduce(
    (total, item) =>
      total + Math.max(0, item.quantity),
    0
  );

  const totalZones = inventory.length;

  const lowestPrice =
    inventory.length > 0
      ? Math.min(
          ...inventory.map((item) => item.price)
        )
      : null;

  async function handleSave() {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/events/${event.id}/inventory`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            artist,
            location,
            description,
            inventory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data?.error ||
            "No se pudo guardar el evento."
        );
        return;
      }

      alert(
        "Evento actualizado correctamente."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "UPDATE ADMIN EVENT ERROR:",
        error
      );

      alert(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* =========================
            HEADER
        ========================= */}
        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <a
                href="/admin"
                className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:text-white"
              >
                <span>←</span>
                Volver al dashboard
              </a>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Administración de evento
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {event.artist}
              </h1>

              <p className="mt-2 text-base text-zinc-500 sm:text-lg">
                {event.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`/event/${event.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-xs font-bold text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
              >
                ↗ VER EVENTO
              </a>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-white px-6 py-3 text-xs font-black text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "GUARDANDO..."
                  : "GUARDAR CAMBIOS"}
              </button>
            </div>
          </div>
        </header>

        {/* =========================
            EVENT SUMMARY
        ========================= */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Evento
            </p>

            <p className="mt-3 truncate text-sm font-bold text-zinc-200">
              {event.title}
            </p>

            <p className="mt-1 truncate text-xs text-zinc-600">
              {event.artist}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Fecha
            </p>

            <p className="mt-3 text-sm font-bold text-zinc-200">
              {formatDate(event.date)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Escenario
            </p>

            <p className="mt-3 truncate text-sm font-bold text-zinc-200">
              {event.venue.name}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              {event.venue.city}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Precio desde
            </p>

            <p className="mt-3 text-lg font-black text-white">
              {lowestPrice !== null
                ? formatPrice(lowestPrice)
                : "Sin precio"}
            </p>
          </div>
        </section>

        {/* =========================
            BASIC INFORMATION
        ========================= */}
        <section className="mb-6 rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.06] px-6 py-6 sm:px-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
              Configuración
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Información del evento
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Modifica los datos que verán los compradores.
            </p>
          </div>

          <div className="p-6 sm:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label
                  htmlFor="event-title"
                  className="mb-2 block text-xs font-bold text-zinc-400"
                >
                  Título
                </label>

                <input
                  id="event-title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="auth-input"
                />
              </div>

              {/* Artist */}
              <div>
                <label
                  htmlFor="event-artist"
                  className="mb-2 block text-xs font-bold text-zinc-400"
                >
                  Artista
                </label>

                <input
                  id="event-artist"
                  value={artist}
                  onChange={(e) =>
                    setArtist(e.target.value)
                  }
                  className="auth-input"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="event-location"
                  className="mb-2 block text-xs font-bold text-zinc-400"
                >
                  Ubicación
                </label>

                <input
                  id="event-location"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="auth-input"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  Escenario
                </label>

                <div className="min-h-[52px] rounded-xl border border-white/[0.07] bg-[#070707] px-4 py-3">
                  <p className="text-sm font-bold text-zinc-200">
                    {event.venue.name}
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-600">
                    {event.venue.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label
                htmlFor="event-description"
                className="mb-2 block text-xs font-bold text-zinc-400"
              >
                Descripción
              </label>

              <textarea
                id="event-description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                className="w-full resize-y rounded-xl border border-white/[0.07] bg-[#070707] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-4 focus:ring-white/[0.04]"
              />
            </div>
          </div>
        </section>

        {/* =========================
            INVENTORY STATS
        ========================= */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:border-white/[0.12]">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Zonas configuradas
            </p>

            <p className="mt-4 text-4xl font-black tracking-tight">
              {totalZones}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Zonas con inventario
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:border-white/[0.12]">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Boletas disponibles
            </p>

            <p className="mt-4 text-4xl font-black tracking-tight">
              {totalAvailable}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Inventario actual
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-200 hover:border-white/[0.12]">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Precio mínimo
            </p>

            <p className="mt-4 text-3xl font-black tracking-tight">
              {lowestPrice !== null
                ? formatPrice(lowestPrice)
                : "—"}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Entre las zonas configuradas
            </p>
          </div>
        </section>

        {/* =========================
            MAP
        ========================= */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.06] px-6 py-6 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Inventario
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  Mapa del escenario
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Selecciona una zona en el mapa para
                  configurar su cantidad y precio.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                  Disponible
                </p>

                <p className="mt-1 text-sm font-black">
                  {totalAvailable} entradas
                </p>
              </div>
            </div>
          </div>

          {/* IMPORTANTE:
              El mapa original se mantiene intacto. */}
          <StadiumMap
            inventory={inventory}
            onInventoryChange={setInventory}
            adminMode={true}
          />
        </section>

        {/* =========================
            INVENTORY TABLE / CARDS
        ========================= */}
        <section className="rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
          <div className="border-b border-white/[0.06] px-6 py-6 sm:px-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
              Resumen
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Inventario actual
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Estas son las zonas que se guardarán al
              actualizar el evento.
            </p>
          </div>

          <div className="p-6 sm:p-7">
            {inventory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-500">
                  —
                </div>

                <p className="mt-4 text-sm font-bold text-zinc-400">
                  No hay zonas configuradas.
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Selecciona una zona en el mapa para
                  comenzar.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inventory.map((item) => (
                  <div
                    key={item.zone}
                    className="group rounded-2xl border border-white/[0.06] bg-[#070707] p-4 transition-all duration-200 hover:border-white/[0.12] hover:bg-[#090909]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-black text-zinc-200">
                        {item.zone}
                      </p>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                          item.quantity > 0
                            ? "bg-white/[0.06] text-zinc-400"
                            : "bg-red-950/40 text-red-400"
                        }`}
                      >
                        {item.quantity > 0
                          ? "Disponible"
                          : "Agotado"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.025] p-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                          Cantidad
                        </p>

                        <p className="mt-1 text-lg font-black">
                          {item.quantity}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.025] p-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                          Precio
                        </p>

                        <p className="mt-1 text-sm font-black">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================
            BOTTOM ACTION
        ========================= */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <a
            href={`/event/${event.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 text-center text-xs font-bold text-zinc-300 transition-all duration-200 hover:bg-white/[0.07] hover:text-white"
          >
            VER EVENTO
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-white px-8 py-4 text-xs font-black text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "GUARDANDO..."
              : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </div>
    </main>
  );
}