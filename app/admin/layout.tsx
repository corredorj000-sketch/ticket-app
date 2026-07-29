import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-black min-h-screen text-white">
      <AdminNavbar />
      {children}
    </main>
  );
}