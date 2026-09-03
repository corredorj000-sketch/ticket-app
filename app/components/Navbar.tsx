"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // El admin tiene su propia navegación.
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="group flex items-center gap-3"
          aria-label="ClickTicketCo - Inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black transition-transform duration-200 group-hover:scale-105">
            C
          </span>

          <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
            ClickTicket<span className="text-zinc-500">Co</span>
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
          >
            Eventos
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-zinc-200 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white sm:px-5"
          >
            <span className="hidden sm:inline">
              Iniciar sesión
            </span>
            <span className="sm:hidden">
              Entrar
            </span>
          </a>

          <a
            href="/register"
            className="group relative overflow-hidden rounded-xl bg-white px-4 py-2.5 text-sm font-black text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/5 sm:px-5"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </header>
  );
}