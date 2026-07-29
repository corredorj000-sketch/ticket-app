"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Ocultar navbar público en admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <a
          href="/"
          className="text-3xl font-black"
        >
          ClickTicketCo
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">

          <a
            href="/"
            className="text-zinc-400 hover:text-white transition"
          >
            Eventos
          </a>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <a
            href="/login"
            className="bg-zinc-900 px-5 py-3 rounded-2xl hover:bg-zinc-800 transition"
          >
            Iniciar Sesión
          </a>

          <a
            href="/register"
            className="bg-white text-black px-5 py-3 rounded-2xl font-bold"
          >
            Crear Cuenta
          </a>

        </div>

      </div>
    </header>
  );
}