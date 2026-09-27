import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapApp } from "@/lib/server/user";

export const Route = createFileRoute("/login")({ component: Login });

function resolveIdentifier(raw: string) {
  const value = raw.trim();
  if (value.includes("@")) return value;
  if (value.toLowerCase() === "admin") return "admin@fintrack.local";
  return value;
}

function Login() {
  const nav = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void bootstrapApp();
  }, []);

  useEffect(() => {
    if (!isPending && user) nav({ to: "/app" });
  }, [isPending, user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await authClient.signIn.email({
        email: resolveIdentifier(email),
        password,
        rememberMe: remember,
      });
      if (err) {
        setError("Não foi possível entrar. Verifique os dados e tente novamente.");
        return;
      }
      nav({ to: "/app" });
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <BrandLink />
      <h1 className="mt-8 text-2xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta FinTrack.</p>
      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">E-mail ou usuário</Label>
          <Input
            id="email"
            className="mt-1.5"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            className="mt-1.5"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 accent-primary"
          />
          Manter sessão
        </label>
        {error ? <p className="text-sm text-expense">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <div className="mt-4 flex flex-col gap-2 text-sm">
        <Link to="/recuperar-senha" className="text-primary hover:underline">
          Recuperar senha
        </Link>
        <p>
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
      {authEnabled ? (
        <div className="mt-8 grid gap-2">
          <p className="text-center text-xs text-muted-foreground">Ou continue com</p>
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="outline"
              onClick={() => signIn(p.providerId, { callbackURL: "/app" })}
            >
              Continuar com {p.label}
            </Button>
          ))}
        </div>
      ) : null}
    </main>
  );
}
