import "./globals.css";
import Navbar from "@/app/components/Navbar";
import AuthProvider from "@/app/components/AuthProvider";

export const metadata = {
  title: "ClickTicketCo",
  description: "Compra y venta de tickets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}