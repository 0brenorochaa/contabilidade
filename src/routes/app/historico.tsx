import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PeriodFilter } from "@/components/period-filter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateBR, formatMoney, incomeSourceLabel } from "@/lib/format";
import { deleteTransaction, listCategories, listTransactions } from "@/lib/server/finance";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/historico")({ component: Historico });

function Historico() {
  const period = useAppStore((s) => s.period);
  const from = useAppStore((s) => s.customFrom);
  const to = useAppStore((s) => s.customTo);
  const openAdd = useAppStore((s) => s.openAdd);
  const openEdit = useAppStore((s) => s.openEdit);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [categoryId, setCategoryId] = useState("");
  const [place, setPlace] = useState("");
  const [sort, setSort] = useState<"date" | "amount_desc" | "amount_asc">("date");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const qc = useQueryClient();

  const cats = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const list = useQuery({
    queryKey: ["transactions", period, from, to, query, type, categoryId, place, sort],
    queryFn: () =>
      listTransactions({
        data: { period, from, to, query, type, categoryId: categoryId || undefined, place, sort },
      }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTransaction({ data: { id } }),
    onSuccess: async () => {
      toast.success("Movimentação excluída.");
      setPendingDelete(null);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["transactions"] }),
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["budget"] }),
      ]);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = list.data?.items ?? [];
  const empty = useMemo(() => !list.isPending && items.length === 0, [list.isPending, items.length]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Histórico</h1>
        <p className="text-sm text-muted-foreground">Pesquise e combine filtros. A exclusão pede confirmação.</p>
      </header>
      <PeriodFilter />
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        <Input
          placeholder="Pesquisar descrição, loja ou valor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Pesquisar"
        />
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger aria-label="Tipo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryId || "all"} onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}>
          <SelectTrigger aria-label="Categoria">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {(cats.data ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Filtrar por loja" value={place} onChange={(e) => setPlace(e.target.value)} />
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger aria-label="Ordenar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Mais recente</SelectItem>
            <SelectItem value="amount_desc">Maior valor</SelectItem>
            <SelectItem value="amount_asc">Menor valor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {list.isPending ? <p className="text-sm text-muted-foreground">Carregando…</p> : null}
      {empty ? (
        <EmptyState
          title="Nenhuma movimentação neste filtro"
          description="Ajuste a pesquisa ou registre uma nova movimentação."
          action={{ label: "Adicionar", onClick: () => openAdd() }}
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {items.map((tx) => (
            <li key={tx.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div
                className={
                  tx.type === "income"
                    ? "grid size-10 place-items-center rounded-md bg-accent text-income"
                    : "grid size-10 place-items-center rounded-md bg-destructive/10 text-expense"
                }
                aria-hidden
              >
                {tx.type === "income" ? "+" : "−"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.place || (tx.incomeSource ? incomeSourceLabel(tx.incomeSource) : "—")} · {formatDateBR(tx.occurredOn)}
                </p>
              </div>
              {tx.categoryName ? <Badge variant="outline">{tx.categoryName}</Badge> : null}
              <p className={tx.type === "income" ? "font-semibold text-income tabular" : "font-semibold text-expense tabular"}>
                {formatMoney(tx.amount)}
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(tx)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setPendingDelete(tx.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir movimentação?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDelete && remove.mutate(pendingDelete)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
