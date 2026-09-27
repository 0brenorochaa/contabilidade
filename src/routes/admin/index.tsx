import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { getAdminDashboard, logAdminAuthEvent } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const dash = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => getAdminDashboard() });
  useEffect(() => {
    void logAdminAuthEvent({ data: { action: "admin.login", result: "success" } }).catch(() => {});
  }, []);

  if (dash.isError) return <p className="text-expense">Acesso administrativo não autorizado.</p>;
  if (!dash.data) return <p className="text-sm text-muted-foreground">Carregando métricas…</p>;
  const d = dash.data;

  const cards = [
    ["Usuários", d.users],
    ["Ativos", d.active],
    ["Novos no mês", d.newcomers],
    ["Transações", d.transactions],
    ["Metas", d.goals],
    ["Contas", d.accounts],
    ["Erros (7 dias)", d.errors],
  ] as const;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Painel administrativo</h1>
        <p className="text-sm text-muted-foreground">Métricas agregadas. Sem detalhes financeiros privados dos usuários.</p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular">{value}</p>
          </Card>
        ))}
      </section>
      <Card className="p-5">
        <h2 className="mb-3 font-semibold">Crescimento de usuários (30 dias)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.growth}>
              <XAxis dataKey="day" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#0D7A5F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
