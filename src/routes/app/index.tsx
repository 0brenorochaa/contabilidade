import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PeriodFilter } from "@/components/period-filter";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateBR, formatMoney, incomeSourceLabel } from "@/lib/format";
import { getDashboard } from "@/lib/server/finance";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const period = useAppStore((s) => s.period);
  const from = useAppStore((s) => s.customFrom);
  const to = useAppStore((s) => s.customTo);
  const openAdd = useAppStore((s) => s.openAdd);
  const dash = useQuery({
    queryKey: ["dashboard", period, from, to],
    queryFn: () => getDashboard({ data: { period, from, to } }),
  });

  if (dash.isPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }
  if (dash.error) {
    return <p className="text-expense">Não foi possível carregar o painel.</p>;
  }
  const d = dash.data;
  if (!d.hasAnyData) {
    return (
      <div className="stagger-in space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Início</h1>
          <p className="text-sm text-muted-foreground">Você ainda não possui movimentações.</p>
        </header>
        <EmptyState
          title="Comece pelo primeiro registro"
          description="O saldo inicia em R$ 0,00. Adicione uma receita ou despesa para ver o painel, os gráficos e o histórico."
          action={{ label: "Adicionar primeira movimentação", onClick: () => openAdd() }}
          icon={<Wallet className="size-8" />}
        />
      </div>
    );
  }

  return (
    <div className="stagger-in space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Início</h1>
          <p className="text-sm text-muted-foreground">Visão do período selecionado, com saldo acumulado à parte.</p>
        </div>
        <PeriodFilter />
      </div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo disponível" value={d.totalBalance} hint="Receitas − despesas (total)" icon={<Wallet className="size-4" />} />
        <StatCard label="Receitas" value={d.periodIncome} tone="income" icon={<ArrowUpRight className="size-4" />} />
        <StatCard label="Despesas" value={d.periodExpense} tone="expense" icon={<ArrowDownRight className="size-4" />} />
        <StatCard label="Economia" value={d.periodNet} hint="Resultado do período" icon={<PiggyBank className="size-4" />} />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Últimas movimentações</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/historico">Ver histórico</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {d.recent.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.place || (tx.incomeSource ? incomeSourceLabel(tx.incomeSource) : "—")} · {formatDateBR(tx.occurredOn)}
                    {tx.categoryName ? ` · ${tx.categoryName}` : ""}
                  </p>
                </div>
                <p className={tx.type === "income" ? "font-semibold text-income tabular" : "font-semibold text-expense tabular"}>
                  {tx.type === "income" ? "+" : "−"} {formatMoney(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Insights</h2>
          <ul className="mt-3 space-y-3">
            {d.insights.map((i) => (
              <li key={i.id}>
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-sm text-muted-foreground">{i.body}</p>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/app/insights">Ver todos</Link>
          </Button>
        </Card>
      </section>
      {d.categories[0] ? (
        <Card className="p-5">
          <h2 className="font-semibold">Gastos por categoria</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {d.categories.slice(0, 6).map((c) => (
              <Badge key={c.name} variant="outline">
                {c.name}: {formatMoney(c.total)}
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
