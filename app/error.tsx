"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP ERROR:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] text-xl text-red-400">
          !
        </div>

        <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          ClickTicketCo
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Algo salió mal
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
          No pudimos completar esta solicitud. Intenta
          nuevamente y, si el problema continúa, vuelve
          al inicio.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200"
          >
            INTENTAR DE NUEVO
          </button>

          <a
            href="/"
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.07]"
          >
            VOLVER AL INICIO
          </a>
        </div>
      </div>
    </main>
  );
}