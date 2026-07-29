export default function AdminNavbar() {
  return (
    <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <a
          href="/admin"
          className="text-3xl font-black"
        >
          ClickTicketCo Admin
        </a>

        {/* Admin Links */}
        <div className="flex items-center gap-4">

          <a
            href="/admin"
            className="text-zinc-400 hover:text-white"
          >
            Dashboard
          </a>

          <a
            href="/admin/create-event"
            className="bg-white text-black px-5 py-3 rounded-2xl font-bold"
          >
            Crear Evento
          </a>

        </div>

      </div>

    </header>
  );
}