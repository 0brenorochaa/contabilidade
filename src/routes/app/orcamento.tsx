import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { formatMoney, parseMoneyInput } from "@/lib/format";
import { getBudget, saveBudget } from "@/lib/server/budget";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/orcamento")({ component: Orcamento });

function Orcamento() {
  const qc = useQueryClient();
  const budget = useQuery({ queryKey: ["budget"], queryFn: () => getBudget() });
  const [limit, setLimit] = useState("");
  const [enabled, setEnabled] = useState(true);

  const save = useMutation({
    mutationFn: async () => {
      const parsed = parseMoneyInput(limit) ?? (budget.data && budget.data.configured ? budget.data.limit : null);
      if (!parsed) throw new Error("Informe um limite mensal.");
      await saveBudget({ data: { monthlyLimit: parsed, enabled } });
    },
    onSuccess: async () => {
      toast.success("Orçamento salvo.");
      await qc.invalidateQueries({ queryKey: ["budget"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const data = budget.data;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Orçamento</h1>
        <p className="text-sm text-muted-foreground">Defina um limite mensal de gastos e acompanhe o restante.</p>
      </header>
      <Card className="p-5">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div>
            <Label htmlFor="limit">Limite mensal</Label>
            <Input
              id="limit"
              className="mt-1.5 max-w-xs"
              placeholder={data && data.configured ? String(data.limit).replace(".", ",") : "1000,00"}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            Ativar alertas de orçamento
          </label>
          <Button type="submit" className="w-fit" disabled={save.isPending}>
            Salvar
          </Button>
        </form>
      </Card>
      {data && data.configured ? (
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Este mês</p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt>Orçamento</dt>
              <dd className="tabular font-medium">{formatMoney(data.limit)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Gasto</dt>
              <dd className="tabular font-medium">{formatMoney(data.spent)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Restante</dt>
              <dd className={cn("tabular font-medium", data.remaining < 0 && "text-expense")}>{formatMoney(data.remaining)}</dd>
            </div>
          </dl>
          <Progress
            value={Math.min(100, data.usage)}
            className="mt-4"
            indicatorClassName={data.alert === "over" || data.alert === "limit" ? "bg-expense" : undefined}
          />
          {data.alert === "warn" ? <p className="mt-3 text-sm">Você atingiu 80% do orçamento mensal.</p> : null}
          {data.alert === "limit" ? <p className="mt-3 text-sm">Você atingiu 100% do orçamento mensal.</p> : null}
          {data.alert === "over" ? <p className="mt-3 text-sm text-expense">Você ultrapassou o limite do orçamento mensal.</p> : null}
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">O orçamento ainda não foi configurado.</p>
      )}
    </div>
  );
}
