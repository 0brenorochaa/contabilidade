import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACCOUNT_TYPES } from "@/lib/constants";
import { accountTypeLabel, formatMoney, parseMoneyInput } from "@/lib/format";
import { createAccount, deleteAccount, listAccounts } from "@/lib/server/finance";

export const Route = createFileRoute("/app/contas")({ component: Contas });

function Contas() {
  const qc = useQueryClient();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => listAccounts() });
  const [name, setName] = useState("");
  const [type, setType] = useState("banco");
  const [initial, setInitial] = useState("0");

  const save = useMutation({
    mutationFn: async () => {
      await createAccount({
        data: { name, type, initialBalance: parseMoneyInput(initial) ?? 0 },
      });
    },
    onSuccess: async () => {
      toast.success("Conta cadastrada.");
      setName("");
      await qc.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteAccount({ data: { id } }),
    onSuccess: async () => {
      toast.success("Conta removida.");
      await qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Contas</h1>
        <p className="text-sm text-muted-foreground">Opcional. Use nas movimentações quando quiser.</p>
      </header>
      <Card className="p-5">
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="md:col-span-2">
            <Label htmlFor="aname">Nome</Label>
            <Input id="aname" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="abal">Saldo inicial</Label>
            <Input id="abal" className="mt-1.5" value={initial} onChange={(e) => setInitial(e.target.value)} />
          </div>
          <Button type="submit" className="md:col-span-4 w-fit">
            Cadastrar conta
          </Button>
        </form>
      </Card>
      {(accounts.data ?? []).length === 0 ? (
        <EmptyState title="Nenhuma conta cadastrada" description="Você pode registrar movimentações mesmo sem contas." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {(accounts.data ?? []).map((a) => (
            <li key={a.id}>
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{accountTypeLabel(a.type)}</p>
                  <p className="mt-1 font-semibold tabular">{formatMoney(a.balance)}</p>
                </div>
                <Button variant="outline" onClick={() => remove.mutate(a.id)}>
                  Excluir
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
