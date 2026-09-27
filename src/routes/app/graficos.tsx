import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { EmptyState } from "@/components/empty-state";
import { PeriodFilter } from "@/components/period-filter";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { getDashboard } from "@/lib/server/finance";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/graficos")({ component: Graficos });

const COLORS = ["#0D7A5F", "#1E5A8A", "#3D8B74", "#6EA3CC", "#8AA39A", "#C24141", "#2A6F97", "#5C6D66"];

function Graficos() {
  const period = useAppStore((s) => s.period);
  const from = useAppStore((s) => s.customFrom);
  const to = useAppStore((s) => s.customTo);
  const openAdd = useAppStore((s) => s.openAdd);
  const dash = useQuery({
    queryKey: ["dashboard", period, from, to],
    queryFn: () => getDashboard({ data: { period, from, to } }),
  });

  if (dash.isPending) return <p className="text-sm text-muted-foreground">Carregando gráficos…</p>;
  if (!dash.data?.hasAnyData) {
    return (
      <EmptyState
        title="Sem dados suficientes para gráficos"
        description="Registre movimentações para visualizar comparativos reais."
        action={{ label: "Adicionar movimentação", onClick: () => openAdd() }}
      />
    );
  }
  const d = dash.data;
  const compare = [
    { name: "Receitas", valor: d.periodIncome },
    { name: "Despesas", valor: d.periodExpense },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gráficos</h1>
          <p className="text-sm text-muted-foreground">Atualizados automaticamente com as suas movimentações.</p>
        </div>
        <PeriodFilter />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Receitas × despesas</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compare}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                  {compare.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === "Receitas" ? "#0D7A5F" : "#C24141"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Evolução do saldo</h2>
          <div className="h-64">
            {d.evolution.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem pontos neste período.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.evolution}>
                  <XAxis dataKey="day" hide />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                  <Line type="monotone" dataKey="balance" stroke="#0D7A5F" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Gastos por categoria</h2>
          <div className="h-64">
            {d.categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma despesa categorizada neste período.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={d.categories} dataKey="total" nameKey="name" innerRadius={50} outerRadius={80}>
                    {d.categories.map((c, i) => (
                      <Cell key={c.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Receitas por período</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.evolution}>
                <XAxis dataKey="day" hide />
                <YAxis />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Line type="monotone" dataKey="income" stroke="#1E5A8A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
