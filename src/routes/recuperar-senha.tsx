import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isStrongPassword, passwordHintText } from "@/lib/finance/password";
import { confirmPasswordReset, requestPasswordReset } from "@/lib/server/user";

export const Route = createFileRoute("/recuperar-senha")({ component: Recuperar });

function Recuperar() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function request(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await requestPasswordReset({ data: { email, phone } });
      if (res.token) {
        setToken(res.token);
        setMessage("Dados confirmados. Defina uma nova senha.");
      } else {
        setMessage("Se os dados estiverem corretos, a redefinição será liberada. Confira e-mail e telefone cadastrados.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!isStrongPassword(password)) return setError(passwordHintText(password));
    setLoading(true);
    setError("");
    try {
      await confirmPasswordReset({ data: { token, password } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <BrandLink />
      <h1 className="mt-8 text-2xl font-semibold">Recuperar senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirme o e-mail e o telefone cadastrados. Não revelamos se uma conta existe.
      </p>
      {done ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p>Senha atualizada. Você já pode entrar com a nova senha.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Ir para o login</Link>
          </Button>
        </div>
      ) : token ? (
        <form className="mt-6 grid gap-3" onSubmit={confirm}>
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-expense">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando…" : "Redefinir senha"}
          </Button>
        </form>
      ) : (
        <form className="mt-6 grid gap-3" onSubmit={request}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          {error ? <p className="text-sm text-expense">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Verificando…" : "Continuar"}
          </Button>
        </form>
      )}
      <Link to="/login" className="mt-6 text-sm text-primary hover:underline">
        Voltar ao login
      </Link>
    </main>
  );
}
