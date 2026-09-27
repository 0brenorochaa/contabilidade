import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";
import { isStrongPassword, isValidEmail, isValidPhone, passwordHintText } from "@/lib/finance/password";
import { savePhone } from "@/lib/server/user";

export const Route = createFileRoute("/cadastro")({ component: Cadastro });

function Cadastro() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Informe seu nome.");
    if (!isValidEmail(email)) return setError("Informe um e-mail válido.");
    if (!isValidPhone(phone)) return setError("Informe um telefone válido.");
    if (!isStrongPassword(password)) return setError(passwordHintText(password));
    setLoading(true);
    try {
      const { error: err } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/onboarding",
      });
      if (err) {
        setError("Não foi possível criar a conta. Se o e-mail já estiver em uso, tente entrar.");
        return;
      }
      try {
        await savePhone({ data: { phone } });
      } catch {
        /* phone can be completed in profile */
      }
      nav({ to: "/onboarding" });
    } catch {
      setError("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <BrandLink />
      <h1 className="mt-8 text-2xl font-semibold">Criar conta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Comece sem movimentações fictícias. Seu saldo inicia em R$ 0,00.</p>
      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" className="mt-1.5" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            className="mt-1.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial.
          </p>
        </div>
        {error ? <p className="text-sm text-expense">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Criando…" : "Criar conta"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
