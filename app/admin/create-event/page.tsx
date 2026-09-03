"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StadiumMap from "../../components/StadiumMap";
import CloudinaryImageUpload from "../../components/CloudinaryImageUpload";

type Venue = {
  id: string;
  name: string;
  city: string;
  image: string;
};

type InventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueId, setVenueId] = useState("");

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [loadingVenues, setLoadingVenues] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await fetch("/api/venues");

        if (!res.ok) {
          throw new Error("No se pudieron cargar los escenarios");
        }

        const data: Venue[] = await res.json();

        setVenues(data);

        const movistar = data.find(
          (venue) => venue.id === "lugar-movistar-bogota"
        );

        if (movistar) {
          setVenueId(movistar.id);
          setLocation(movistar.city);
        } else if (data.length > 0) {
          setVenueId(data[0].id);
          setLocation(data[0].city);
        }
      } catch (error) {
        console.error("LOAD VENUES ERROR:", error);
      } finally {
        setLoadingVenues(false);
      }
    }

    loadVenues();
  }, []);

  function handleVenueChange(value: string) {
    setVenueId(value);

    const selectedVenue = venues.find(
      (venue) => venue.id === value
    );

    if (selectedVenue) {
      setLocation(selectedVenue.city);
    }

    // Limpiamos el inventario si se cambia de escenario.
    setInventory([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!venueId) {
      alert("Debes seleccionar un escenario.");
      return;
    }

    if (!title || !artist || !date) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const selectedVenue = venues.find(
      (venue) => venue.id === venueId
    );

    const isMovistar =
      selectedVenue?.id === "lugar-movistar-bogota";

    if (isMovistar && inventory.length === 0) {
      alert(
        "Debes configurar al menos una zona del mapa con cantidad y precio."
      );
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          artist,
          image,
          location,
          description,
          date,
          venueId,
          inventory,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("CREATE EVENT RESPONSE:", data);

        alert(
          data?.detail ||
            data?.error ||
            `Error creando evento (${res.status})`
        );

        return;
      }

      alert("Evento creado correctamente.");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);

      alert("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  const selectedVenue = venues.find(
    (venue) => venue.id === venueId
  );

  const isMovistar =
    selectedVenue?.id === "lugar-movistar-bogota";

  const totalInventory = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-black mb-3">
          Crear Evento
        </h1>

        <p className="text-zinc-500 mb-10">
          Configura el evento, escenario y disponibilidad de entradas.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NOMBRE */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Nombre del evento
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white"
              placeholder="Bad Bunny World Tour"
              required
            />
          </div>

          {/* ARTISTA */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Artista
            </label>

            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white"
              placeholder="Bad Bunny"
              required
            />
          </div>

          {/* ESCENARIO */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Escenario
            </label>

            {loadingVenues ? (
              <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-zinc-500">
                Cargando escenarios...
              </div>
            ) : (
              <select
                value={venueId}
                onChange={(e) =>
                  handleVenueChange(e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white"
                required
              >
                <option value="">
                  Selecciona un escenario
                </option>

                {venues.map((venue) => (
                  <option
                    key={venue.id}
                    value={venue.id}
                  >
                    {venue.name} — {venue.city}
                    {venue.image
                      ? " — Mapa disponible"
                      : " — Mapa próximamente"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* MAPA */}
          {selectedVenue && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">
                    {selectedVenue.name}
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    {selectedVenue.city}
                  </p>
                </div>

                {isMovistar ? (
                  <span className="px-4 py-2 rounded-full bg-green-950 border border-green-800 text-green-400 text-sm font-bold">
                    MAPA DISPONIBLE
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm font-bold">
                    MAPA PRÓXIMAMENTE
                  </span>
                )}
              </div>

              {isMovistar ? (
                <>
                  <div className="rounded-3xl border border-zinc-800 overflow-hidden">
                    <StadiumMap
                      adminMode
                      inventory={inventory}
                      onInventoryChange={setInventory}
                    />
                  </div>

                  <div className="mt-5 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm">
                          Zonas configuradas
                        </p>

                        <p className="text-2xl font-black mt-1">
                          {inventory.length}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-zinc-400 text-sm">
                          Entradas disponibles
                        </p>

                        <p className="text-2xl font-black mt-1">
                          {totalInventory}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="min-h-[180px] rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">
                      🗺️
                    </div>

                    <p className="font-bold text-lg">
                      Mapa próximamente
                    </p>

                    <p className="text-zinc-500 mt-2">
                      Este escenario ya está habilitado para eventos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CIUDAD */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Ciudad
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white"
              placeholder="Bogotá"
              required
            />
          </div>

          {/* IMAGEN */}
{/* IMAGEN */}
<div>
  <CloudinaryImageUpload
    value={image}
    onChange={setImage}
  />
</div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 h-40 outline-none focus:border-white"
              placeholder="Descripción del evento"
            />
          </div>

          {/* FECHA */}
          <div>
            <label className="block mb-2 text-zinc-400">
              Fecha del evento
            </label>

            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white"
              required
            />
          </div>

          {/* RESUMEN INVENTARIO */}
          {isMovistar && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-black mb-4">
                Inventario del evento
              </h2>

              {inventory.length === 0 ? (
                <p className="text-zinc-500">
                  Selecciona una zona en el mapa para configurar
                  cantidad y precio.
                </p>
              ) : (
                <div className="space-y-3">
                  {inventory.map((item) => (
                    <div
                      key={item.zone}
                      className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                    >
                      <div>
                        <p className="font-bold">
                          {item.zone}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {item.quantity} entradas
                        </p>
                      </div>

                      <p className="font-black">
                        ${item.price.toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={saving || loadingVenues}
            className="w-full bg-white text-black px-8 py-5 rounded-2xl font-black text-lg hover:scale-[1.01] transition disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving
              ? "Creando evento..."
              : "Crear Evento"}
          </button>

        </form>
      </div>
    </main>
  );
}