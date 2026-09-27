import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FINANCIAL_GOALS } from "@/lib/constants";
import { parseMoneyInput } from "@/lib/format";
import { getMe, updateProfile } from "@/lib/server/user";

export const Route = createFileRoute("/app/perfil")({ component: Perfil });

function Perfil() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("organizar");

  useEffect(() => {
    if (!me.data) return;
    setName(me.data.name);
    setPhone(me.data.phone ?? "");
    setIncome(me.data.monthlyIncome != null ? String(me.data.monthlyIncome).replace(".", ",") : "");
    setGoal(me.data.financialGoal ?? "organizar");
  }, [me.data]);

  const save = useMutation({
    mutationFn: async () => {
      await updateProfile({
        data: {
          name,
          phone,
          monthlyIncome: parseMoneyInput(income) ?? 0,
          financialGoal: goal,
        },
      });
    },
    onSuccess: async () => {
      toast.success("Perfil atualizado.");
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Perfil</h1>
        <p className="text-sm text-muted-foreground">Seus dados pessoais e objetivo financeiro.</p>
      </header>
      <Card className="p-5">
        <form
          className="grid max-w-lg gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" className="mt-1.5" value={me.data?.email ?? ""} readOnly />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="income">Renda mensal</Label>
            <Input id="income" className="mt-1.5" value={income} onChange={(e) => setIncome(e.target.value)} />
          </div>
          <div>
            <Label>Objetivo financeiro</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FINANCIAL_GOALS.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-fit" disabled={save.isPending}>
            Salvar
          </Button>
        </form>
      </Card>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/app/configuracoes" className="text-primary hover:underline">
          Configurações
        </Link>
        <Link to="/app/contas" className="text-primary hover:underline">
          Contas
        </Link>
        <Link to="/app/notificacoes" className="text-primary hover:underline">
          Notificações
        </Link>
      </div>
    </div>
  );
}
