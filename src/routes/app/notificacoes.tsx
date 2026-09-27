import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTimeBR } from "@/lib/format";
import { listNotifications, markNotificationsRead } from "@/lib/server/user";

export const Route = createFileRoute("/app/notificacoes")({ component: Notificacoes });

function Notificacoes() {
  const qc = useQueryClient();
  const notes = useQuery({ queryKey: ["notifications"], queryFn: () => listNotifications() });
  const read = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notificações</h1>
          <p className="text-sm text-muted-foreground">Alertas de orçamento, metas e registros importantes.</p>
        </div>
        <Button variant="outline" onClick={() => read.mutate()}>
          Marcar como lidas
        </Button>
      </div>
      {(notes.data ?? []).length === 0 ? (
        <EmptyState title="Nenhuma notificação" description="Avisos úteis aparecerão aqui, sem ruído desnecessário." />
      ) : (
        <ul className="grid gap-3">
          {(notes.data ?? []).map((n) => (
            <li key={n.id}>
              <Card className="p-4">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTimeBR(n.created_at)}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
