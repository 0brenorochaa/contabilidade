import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { formatDateTimeBR } from "@/lib/format";
import { listAuditLogs, listSystemErrors } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/auditoria")({ component: Auditoria });

function Auditoria() {
  const logs = useQuery({ queryKey: ["audit"], queryFn: () => listAuditLogs() });
  const errors = useQuery({ queryKey: ["syserr"], queryFn: () => listSystemErrors() });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Auditoria</h1>
        <p className="text-sm text-muted-foreground">Ações administrativas e erros do sistema. Senhas e tokens nunca são registrados.</p>
      </header>
      <section>
        <h2 className="mb-3 font-semibold">Logs</h2>
        <ul className="grid gap-2">
          {(logs.data ?? []).map((l) => (
            <li key={l.id}>
              <Card className="p-4 text-sm">
                <p className="font-medium">{l.action}</p>
                <p className="text-muted-foreground">
                  {l.actor_email ?? "sistema"} · {l.result} · {formatDateTimeBR(l.created_at)}
                </p>
                {l.details ? <p className="mt-1 text-muted-foreground">{l.details}</p> : null}
              </Card>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 font-semibold">Erros do sistema</h2>
        {(errors.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum erro recente.</p>
        ) : (
          <ul className="grid gap-2">
            {(errors.data ?? []).map((e) => (
              <li key={e.id} className="rounded-md border border-border bg-card p-3 text-sm">
                {e.message}
                <span className="block text-xs text-muted-foreground">{formatDateTimeBR(e.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
