"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json().catch(() => null);

      console.error("REGISTER RESPONSE:", data);

      alert(
        data?.detail ||
          data?.error ||
          `Error creando cuenta (${res.status})`
      );
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md space-y-6"
      >
        <h1 className="text-4xl font-bold">
          Crear Cuenta
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-4 rounded-xl bg-zinc-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-4 rounded-xl bg-zinc-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-4 rounded-xl bg-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-white text-black py-4 rounded-xl font-bold">
          Crear Cuenta
        </button>
      </form>
    </main>
  );
}
