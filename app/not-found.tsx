export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xl font-black text-zinc-400">
          404
        </div>

        <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          ClickTicketCo
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Página no encontrada
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
          La página o evento que buscas no existe o ya no
          está disponible.
        </p>

        <a
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200"
        >
          VOLVER A EVENTOS
        </a>
      </div>
    </main>
  );
}