"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [vipPrice, setVipPrice] = useState("");
  const [vipQuantity, setVipQuantity] = useState("");
  const [generalPrice, setGeneralPrice] = useState("");
  const [generalQuantity, setGeneralQuantity] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

    vipPrice,
    vipQuantity,

    generalPrice,
    generalQuantity,
  }),
});

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      alert("Error creando evento");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-black mb-8">
          Crear Evento
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 text-zinc-400">
              Nombre del evento
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
              placeholder="Bad Bunny World Tour"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Artista
            </label>

            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
              placeholder="Bad Bunny"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Ciudad
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
              placeholder="Bogotá"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Imagen URL
            </label>

            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 h-40"
              placeholder="Descripción del evento"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block mb-2 text-zinc-400">
                 Precio VIP
                  </label>
                   <input
                   type="number"
                   value={vipPrice}
                   onChange={(e) => setVipPrice(e.target.value)}
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                   placeholder="900000"
                   />
                   </div>
                   <div>
                     <label className="block mb-2 text-zinc-400">
                      Cantidad VIP
                      </label>
                      <input
                      type="number"
                      value={vipQuantity}
                      onChange={(e) => setVipQuantity(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                      placeholder="50"
                      />
                      </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-5">
                        
                        <div>
                           <label className="block mb-2 text-zinc-400">
                             Precio General
                             </label>
                             
                             <input
                              type="number"
                              value={generalPrice}
                              onChange={(e) => setGeneralPrice(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                              placeholder="250000"
                              />
                              </div>
                              
                              <div>
                                <label className="block mb-2 text-zinc-400">
                                    Cantidad General
                                    </label>
                                    
                                    <input
                                    type="number"
                                    value={generalQuantity}
                                    onChange={(e) => setGeneralQuantity(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                                    placeholder="200"
                                    />
                                    </div>
                                    </div>
            <div>
                <label className="block mb-2 text-zinc-400">
                    fecha del evento 
                </label>

                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.  value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4"
                />
            </div>

          <button
            type="submit"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition"
          >
            Crear Evento
          </button>

        </form>

      </div>

    </main>
  );
}