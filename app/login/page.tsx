"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Credenciales incorrectas");
      return;
    }

    // OBTENER SESION
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    // REDIRECCION SEGUN ROLE
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* Left Side */}
      <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-transparent to-cyan-500/20" />

        <div className="relative z-10 max-w-lg px-10">
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl">
              CT
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              ClickTicketCo
            </h1>
          </div>

          <h2 className="text-6xl font-black leading-tight mb-6">
            Vive los conciertos más grandes.
          </h2>

          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Compra entradas verificadas para conciertos, festivales y eventos exclusivos en toda Colombia.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
              <h3 className="font-bold text-2xl mb-2">+10K</h3>
              <p className="text-zinc-400 text-sm">
                Tickets vendidos
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
              <h3 className="font-bold text-2xl mb-2">100%</h3>
              <p className="text-zinc-400 text-sm">
                Entradas verificadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-black">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl">
              CT
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              ClickTicketCo
            </h1>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-3">
                Bienvenido 👋
              </h2>

              <p className="text-zinc-400">
                Inicia sesión para acceder a tus tickets y compras.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-white transition"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-400">
                  <input type="checkbox" />
                  Recordarme
                </label>

                <button
                  type="button"
                  className="text-white hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.99] transition"
              >
                Iniciar sesión
              </button>

            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-zinc-950 px-4 text-zinc-500">
                  o continuar con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 font-medium hover:border-zinc-600 transition">
                Google
              </button>

              <button className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 font-medium hover:border-zinc-600 transition">
                Apple
              </button>
            </div>

            <p className="text-center text-zinc-500 mt-8 text-sm">
              ¿No tienes cuenta?{" "}

              <a
                href="/register"
                className="text-white hover:underline"
              >
                Crear cuenta
              </a>

            </p>
          </div>
        </div>
      </section>
    </main>
  );
}