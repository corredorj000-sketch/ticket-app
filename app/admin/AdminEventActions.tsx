"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  eventId: string;
  eventTitle: string;
};

export default function AdminEventActions({
  eventId,
  eventTitle,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${eventTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(
          data?.error ||
            "No se pudo eliminar el evento."
        );
        return;
      }

      alert("Evento eliminado correctamente.");

      router.refresh();
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);

      alert(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`/admin/events/${eventId}`}
        className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition"
      >
        Administrar
      </a>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-600 px-5 py-3 rounded-2xl font-bold hover:bg-red-500 transition disabled:opacity-50"
      >
        {deleting ? "Eliminando..." : "Eliminar"}
      </button>

      <a
        href={`/event/${eventId}`}
        className="bg-zinc-900 px-5 py-3 rounded-2xl font-semibold hover:bg-zinc-800 transition"
      >
        Ver evento
      </a>
    </div>
  );
}