"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

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
    <main className="auth-page">
      <form
        onSubmit={handleRegister}
        className="auth-card max-w-[480px]"
      >
        {/* Header */}
        <div>
          <div className="auth-brand">
            <span className="auth-brand-dot" />
            ClickTicketCo
          </div>

          <h1 className="auth-title">
            Crear cuenta
          </h1>

          <p className="auth-subtitle">
            Regístrate para comprar y
            gestionar tus entradas de
            manera sencilla.
          </p>
        </div>

        {/* Important notice */}
        <div className="auth-notice mt-6">
          <p className="auth-notice-title">
            ⚠️ Importante
          </p>

          <p className="auth-notice-text">
            Regístrate utilizando el mismo
            correo electrónico que tienes
            registrado en TuBoleta,
            Ticketmaster u otra plataforma
            oficial donde recibirás tus
            entradas.
          </p>

          <p className="auth-notice-text">
            Este correo será utilizado para
            realizar el envío o transferencia
            de tu boletería.
          </p>
        </div>

        {/* Form */}
        <div className="auth-form">
          {/* Name */}
          <div className="auth-field">
            <label
              htmlFor="name"
              className="auth-label"
            >
              Nombre completo
            </label>

            <input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              className="auth-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label
              htmlFor="email"
              className="auth-label"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="tucorreo@gmail.com"
              className="auth-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />

            <p className="auth-help">
              Utilizaremos este correo para
              la comunicación y entrega de
              tus entradas.
            </p>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label
              htmlFor="password"
              className="auth-label"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="auth-input"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />

            <p className="auth-help">
              Mínimo 6 caracteres.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading
              ? "CREANDO CUENTA..."
              : "CREAR CUENTA"}
          </button>
        </div>

        {/* Footer */}
        <p className="auth-success-note">
          Al crear tu cuenta recibirás un
          correo de bienvenida.
        </p>

        <div className="mt-5 border-t border-white/[0.06] pt-5 text-center">
          <p className="text-sm text-zinc-500">
            ¿Ya tienes una cuenta?
          </p>

          <a
            href="/login"
            className="mt-2 inline-block text-sm font-bold text-white transition-colors hover:text-zinc-400"
          >
            Iniciar sesión →
          </a>
        </div>
      </form>
    </main>
  );
}