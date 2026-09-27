import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme, type ThemeChoice } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authClient, signOut } from "@/lib/auth/client";
import { isStrongPassword, passwordHintText } from "@/lib/finance/password";
import { deleteMyAccount, exportMyData, getMe, markPasswordChanged, revokeAllSessions, updateSettings } from "@/lib/server/user";

export const Route = createFileRoute("/app/configuracoes")({ component: Configuracoes });

function Configuracoes() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const saveTheme = async (next: ThemeChoice) => {
    setTheme(next);
    await updateSettings({ data: { theme: next } });
    await qc.invalidateQueries({ queryKey: ["me"] });
  };

  const toggleNotes = async (value: boolean) => {
    await updateSettings({ data: { notificationsEnabled: value } });
    await qc.invalidateQueries({ queryKey: ["me"] });
  };

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!isStrongPassword(newPassword)) {
      toast.error(passwordHintText(newPassword));
      return;
    }
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error("Não foi possível alterar a senha.");
      return;
    }
    await markPasswordChanged();
    toast.success("Senha alterada. Outras sessões foram encerradas.");
    setCurrentPassword("");
    setNewPassword("");
  }

  const download = useMutation({
    mutationFn: async (format: "csv" | "pdf") => {
      const res = await exportMyData({ data: { format } });
      const blob =
        "encoding" in res && res.encoding === "base64"
          ? new Blob([Uint8Array.from(atob(res.content), (c) => c.charCodeAt(0))], { type: res.mime })
          : new Blob([res.content], { type: res.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error("Não foi possível exportar."),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Configurações</h1>
      </header>
      <Card className="p-5">
        <h2 className="font-semibold">Aparência</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <Button key={t} variant={theme === t ? "default" : "outline"} onClick={() => void saveTheme(t)}>
              {t === "light" ? "Claro" : t === "dark" ? "Escuro" : "Automático"}
            </Button>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Moeda e data</h2>
        <p className="mt-2 text-sm text-muted-foreground">Padrão: BRL — R$ · Datas em DD/MM/AAAA · Idioma: Português do Brasil</p>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Notificações</h2>
        <label className="mt-3 flex items-center gap-3 text-sm">
          <Switch
            checked={me.data?.notificationsEnabled ?? true}
            onCheckedChange={(v) => void toggleNotes(v)}
          />
          Ativar notificações
        </label>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Segurança</h2>
        <form className="mt-3 grid max-w-md gap-3" onSubmit={changePassword}>
          <div>
            <Label htmlFor="cur">Senha atual</Label>
            <Input id="cur" type="password" className="mt-1.5" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="neu">Nova senha</Label>
            <Input id="neu" type="password" className="mt-1.5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-fit">
            Alterar senha
          </Button>
        </form>
        <Button
          variant="outline"
          className="mt-4"
          onClick={async () => {
            await revokeAllSessions();
            toast.success("Sessões encerradas.");
            await signOut("/login");
          }}
        >
          Encerrar todas as sessões
        </Button>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Privacidade</h2>
        <p className="mt-1 text-sm text-muted-foreground">Exporte apenas os seus dados. Nunca os de outra pessoa.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => download.mutate("csv")} disabled={download.isPending}>
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => download.mutate("pdf")} disabled={download.isPending}>
            Exportar PDF
          </Button>
        </div>
        <Button
          variant="destructive"
          className="mt-6"
          onClick={async () => {
            if (!window.confirm("Excluir sua conta e todos os dados? Esta ação não pode ser desfeita.")) return;
            await deleteMyAccount();
            await signOut("/");
          }}
        >
          Excluir conta
        </Button>
      </Card>
    </div>
  );
}
