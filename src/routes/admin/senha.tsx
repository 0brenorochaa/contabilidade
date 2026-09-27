import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";
import { isStrongPassword, passwordHintText } from "@/lib/finance/password";
import { markPasswordChanged } from "@/lib/server/user";

export const Route = createFileRoute("/admin/senha")({ component: AdminSenha });

function AdminSenha() {
  const nav = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isStrongPassword(newPassword)) {
      setError(passwordHintText(newPassword));
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (err) {
      setError("Não foi possível alterar a senha inicial.");
      setLoading(false);
      return;
    }
    await markPasswordChanged();
    nav({ to: "/admin" });
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Alterar senha inicial</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No primeiro acesso administrativo a senha inicial precisa ser substituída. Ela deixa de ser válida depois desta alteração.
      </p>
      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="cur">Senha atual</Label>
          <Input id="cur" type="password" className="mt-1.5" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="neu">Nova senha</Label>
          <Input id="neu" type="password" className="mt-1.5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-expense">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
