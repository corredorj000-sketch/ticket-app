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

      alert("Evento actualizado correctamente.");

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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <a
              href="/admin"
              className="mb-4 inline-block text-sm font-semibold text-zinc-500 hover:text-white"
            >
              ← Volver al dashboard
            </a>

            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              Administración de evento
            </p>

            <h1 className="mt-2 text-4xl font-black sm:text-6xl">
              {event.artist}
            </h1>

            <p className="mt-2 text-xl text-zinc-400">
              {event.title}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`/event/${event.id}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-zinc-900 px-5 py-3 font-bold transition hover:bg-zinc-800"
            >
              Ver evento
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-white px-6 py-3 font-black text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "GUARDANDO..."
                : "GUARDAR CAMBIOS"}
            </button>
          </div>

        </div>

        {/* Información */}
        <section className="mb-8 rounded-3xl border border-zinc-900 bg-zinc-950 p-6">

          <div className="mb-6">
            <h2 className="text-2xl font-black">
              Información del evento
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Modifica los datos básicos del evento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-300">
                Título
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-300">
                Artista
              </label>

              <input
                value={artist}
                onChange={(e) =>
                  setArtist(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-300">
                Ubicación
              </label>

              <input
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-300">
                Escenario
              </label>

              <div className="rounded-xl border border-zinc-800 bg-black px-4 py-3">
                <p className="font-bold">
                  {event.venue.name}
                </p>

                <p className="text-sm text-zinc-500">
                  {event.venue.city}
                </p>
              </div>
            </div>

          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-white"
            />
          </div>

        </section>

        {/* Estadísticas */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Zonas configuradas
            </p>

            <p className="mt-2 text-4xl font-black">
              {inventory.length}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Boletas disponibles
            </p>

            <p className="mt-2 text-4xl font-black">
              {totalAvailable}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Fecha
            </p>

            <p className="mt-2 text-xl font-black">
              {new Date(
                event.date
              ).toLocaleDateString("es-CO")}
            </p>
          </div>

        </section>

        {/* Mapa */}
        <section className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950">

          <div className="border-b border-zinc-900 p-6">

            <h2 className="text-3xl font-black">
              Mapa e inventario
            </h2>

            <p className="mt-2 text-zinc-500">
              Selecciona una zona en el mapa para
              configurar cantidad y precio.
            </p>

          </div>

          <StadiumMap
            inventory={inventory}
            onInventoryChange={setInventory}
            adminMode={true}
          />

        </section>

        {/* Inventario */}
        <section className="mt-8 rounded-3xl border border-zinc-900 bg-zinc-950 p-6">

          <div className="mb-5">
            <h2 className="text-2xl font-black">
              Inventario actual
            </h2>

            <p className="text-sm text-zinc-500">
              Estas son las zonas que se guardarán.
            </p>
          </div>

          {inventory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
              No hay zonas configuradas.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {inventory.map((item) => (
                <div
                  key={item.zone}
                  className="rounded-2xl border border-zinc-800 bg-black p-4"
                >
                  <p className="font-black">
                    {item.zone}
                  </p>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Cantidad
                    </span>

                    <span className="font-bold">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Precio
                    </span>

                    <span className="font-bold">
                      $
                      {Number(
                        item.price
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* Botón inferior */}
        <div className="mt-8 flex justify-end">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-white px-8 py-4 font-black text-black transition hover:bg-zinc-200 disabled:opacity-50"
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