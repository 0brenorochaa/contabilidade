import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PeriodFilter } from "@/components/period-filter";
import { Card } from "@/components/ui/card";
import { getDashboard } from "@/lib/server/finance";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/insights")({ component: Insights });

function Insights() {
  const period = useAppStore((s) => s.period);
  const from = useAppStore((s) => s.customFrom);
  const to = useAppStore((s) => s.customTo);
  const dash = useQuery({
    queryKey: ["dashboard", period, from, to],
    queryFn: () => getDashboard({ data: { period, from, to } }),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Insights</h1>
          <p className="text-sm text-muted-foreground">Observações informativas com base nos seus dados. Sem recomendações de investimento.</p>
        </div>
        <PeriodFilter />
      </div>
      <div className="grid gap-3">
        {(dash.data?.insights ?? []).map((i) => (
          <Card key={i.id} className="p-5">
            <h2 className="font-semibold">{i.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
