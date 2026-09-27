import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTimeBR } from "@/lib/format";
import { listUsersAdmin, updateUserAdmin } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/usuarios")({ component: Usuarios });

function Usuarios() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const users = useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => listUsersAdmin({ data: { query } }),
  });
  const update = useMutation({
    mutationFn: (data: { userId: string; isActive?: boolean; role?: "user" | "admin" }) => updateUserAdmin({ data }),
    onSuccess: async () => {
      toast.success("Usuário atualizado.");
      await qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-sm text-muted-foreground">Sem senhas, tokens ou dados financeiros privados.</p>
      </header>
      <Input placeholder="Pesquisar nome ou e-mail" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Nome</th>
              <th className="px-3 py-2 font-medium">E-mail</th>
              <th className="px-3 py-2 font-medium">Função</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Cadastro</th>
              <th className="px-3 py-2 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(users.data ?? []).map((u) => (
              <tr key={u.user_id} className="border-t border-border">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2">{u.is_active ? "Ativa" : "Desativada"}</td>
                <td className="px-3 py-2">{formatDateTimeBR(u.created_at)}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update.mutate({ userId: u.user_id, isActive: !u.is_active })}
                    >
                      {u.is_active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        update.mutate({ userId: u.user_id, role: u.role === "admin" ? "user" : "admin" })
                      }
                    >
                      {u.role === "admin" ? "Tornar user" : "Tornar admin"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
