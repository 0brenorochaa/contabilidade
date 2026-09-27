import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
import { formatDateBR, formatMoney } from "@/lib/format";
import { parseMoneyInput } from "@/lib/format";
import { contributeGoal, createGoal, deleteGoal, listGoals, updateGoal, type GoalDTO } from "@/lib/server/goals";

export const Route = createFileRoute("/app/metas")({ component: Metas });

function Metas() {
  const qc = useQueryClient();
  const goals = useQuery({ queryKey: ["goals"], queryFn: () => listGoals() });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GoalDTO | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => deleteGoal({ data: { id } }),
    onSuccess: async () => {
      toast.success("Meta excluída.");
      setPendingDelete(null);
      await qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Metas</h1>
          <p className="text-sm text-muted-foreground">Acompanhe progresso e, se houver prazo, uma sugestão matemática de poupança mensal.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Nova meta
        </Button>
      </div>
      {formOpen ? (
        <GoalForm
          initial={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      ) : null}
      {goals.isPending ? <p className="text-sm text-muted-foreground">Carregando…</p> : null}
      {!goals.isPending && (goals.data ?? []).length === 0 ? (
        <EmptyState
          title="Nenhuma meta ainda"
          description="Crie uma meta com valor desejado. O progresso começa em R$ 0,00."
          action={{ label: "Criar meta", onClick: () => setFormOpen(true) }}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {(goals.data ?? []).map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={() => {
                setEditing(g);
                setFormOpen(true);
              }}
              onDelete={() => setPendingDelete(g.id)}
            />
          ))}
        </div>
      )}
      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
            <AlertDialogDescription>As contribuições desta meta também serão removidas.</AlertDialogDescription>
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

function GoalCard({ goal, onEdit, onDelete }: { goal: GoalDTO; onEdit: () => void; onDelete: () => void }) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const add = useMutation({
    mutationFn: async () => {
      const parsed = parseMoneyInput(amount);
      if (!parsed) throw new Error("Informe um valor válido.");
      await contributeGoal({ data: { id: goal.id, amount: parsed } });
    },
    onSuccess: async () => {
      setAmount("");
      toast.success("Valor adicionado à meta.");
      await qc.invalidateQueries({ queryKey: ["goals"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{goal.name}</h2>
          {goal.description ? <p className="text-sm text-muted-foreground">{goal.description}</p> : null}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            Excluir
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm tabular">
        {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}
      </p>
      <Progress value={goal.progress} className="mt-2" />
      {goal.deadline ? <p className="mt-2 text-xs text-muted-foreground">Prazo: {formatDateBR(goal.deadline)}</p> : null}
      {goal.monthlySuggestion != null ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Para atingir o valor até a data, seria necessário guardar {formatMoney(goal.monthlySuggestion)} por mês. Isso é apenas um cálculo, não uma recomendação de investimento.
        </p>
      ) : null}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <Input
          placeholder="Adicionar valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          aria-label={`Adicionar dinheiro à meta ${goal.name}`}
        />
        <Button type="submit" variant="outline" disabled={add.isPending}>
          Adicionar
        </Button>
      </form>
    </Card>
  );
}

function GoalForm({ initial, onClose }: { initial: GoalDTO | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(initial?.name ?? "");
  const [target, setTarget] = useState(initial ? String(initial.targetAmount).replace(".", ",") : "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const parsed = parseMoneyInput(target);
      if (!parsed) throw new Error("Informe um valor desejado válido.");
      if (initial) {
        await updateGoal({ data: { id: initial.id, name, targetAmount: parsed, deadline: deadline || null, description } });
      } else {
        await createGoal({ data: { name, targetAmount: parsed, deadline: deadline || null, description } });
      }
    },
    onSuccess: async () => {
      toast.success(initial ? "Meta atualizada." : "Meta criada.");
      await qc.invalidateQueries({ queryKey: ["goals"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="p-5">
      <h2 className="font-semibold">{initial ? "Editar meta" : "Nova meta"}</h2>
      <form
        className="mt-3 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div>
          <Label htmlFor="gname">Nome</Label>
          <Input id="gname" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="gtarget">Valor desejado</Label>
          <Input id="gtarget" className="mt-1.5" value={target} onChange={(e) => setTarget(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="gdate">Data limite (opcional)</Label>
          <Input id="gdate" type="date" className="mt-1.5" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="gdesc">Descrição (opcional)</Label>
          <Textarea id="gdesc" className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  );
}
