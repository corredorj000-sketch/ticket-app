"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import { signIn } from "next-auth/react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl =
    searchParams.get("callbackUrl");

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false,
        }
      );

      if (result?.error) {
        setError(
          "Correo o contraseña incorrectos."
        );
        setLoading(false);
        return;
      }

      if (
        callbackUrl &&
        callbackUrl.startsWith("/")
      ) {
        router.push(callbackUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        "No se pudo iniciar sesión. Inténtalo nuevamente."
      );

      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div>
          <div className="auth-brand">
            <span className="auth-brand-dot" />
            ClickTicketCo
          </div>

          <h1 className="auth-title">
            Bienvenido
          </h1>

          <p className="auth-subtitle">
            Inicia sesión para continuar
            con tus compras y gestionar tus
            entradas.
          </p>
        </div>

        {/* Compra */}
        {callbackUrl && (
          <div className="auth-notice mt-6">
            <p className="auth-notice-title">
              Compra en proceso
            </p>

            <p className="auth-notice-text">
              Inicia sesión para continuar
              con tu compra.
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
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
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              autoComplete="email"
              placeholder="tucorreo@gmail.com"
              className="auth-input"
            />
          </div>

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
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="current-password"
              placeholder="Tu contraseña"
              className="auth-input"
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading
              ? "INGRESANDO..."
              : "INICIAR SESIÓN"}
          </button>
        </form>

        {/* Register */}
        <div className="mt-7 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-sm text-zinc-500">
            ¿Todavía no tienes una cuenta?
          </p>

          <a
            href="/register"
            className="mt-2 inline-block text-sm font-bold text-white transition-colors hover:text-zinc-400"
          >
            Crear cuenta →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <div className="auth-card">
            <p className="text-center text-sm text-zinc-500">
              Cargando...
            </p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}