"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Ingresa tu nombre.");
      return;
    }

    if (!email.trim()) {
      alert("Ingresa tu correo.");
      return;
    }

    if (password.length < 6) {
      alert(
        "La contraseña debe tener mínimo 6 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email
              .trim()
              .toLowerCase(),
            password,
          }),
        }
      );

      const data =
        await res.json().catch(
          () => null
        );

      if (!res.ok) {
        alert(
          data?.error ||
            "Error creando cuenta"
        );
        return;
      }

      alert(
        "¡Cuenta creada correctamente! Revisa tu correo para ver el mensaje de bienvenida."
      );

      router.push("/login");
    } catch (error) {
      console.error(
        "REGISTER PAGE ERROR:",
        error
      );

      alert(
        "No se pudo crear la cuenta. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-3xl w-full max-w-md space-y-6"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">
            ClickTicketCo
          </p>

          <h1 className="text-4xl font-black">
            Crear Cuenta
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Crea tu cuenta para comprar y
            gestionar tus entradas.
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5">
          <p className="font-black text-yellow-300">
            ⚠️ Importante
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Regístrate utilizando el mismo
            correo electrónico que tienes
            registrado en TuBoleta,
            Ticketmaster u otra plataforma
            oficial donde recibirás tus
            entradas.
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Este correo será utilizado para
            realizar el envío o transferencia
            de tu boletería.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-300">
            Nombre completo
          </label>

          <input
            type="text"
            placeholder="Juan Pérez"
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-300">
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="tucorreo@gmail.com"
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required
          />

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Utilizaremos este correo para
            la comunicación y entrega de tus
            entradas.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-zinc-300">
            Contraseña
          </label>

          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "CREANDO CUENTA..."
            : "CREAR CUENTA"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          Al crear tu cuenta recibirás un
          correo de bienvenida.
        </p>
      </form>
    </main>
  );
}