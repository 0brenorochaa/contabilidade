import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { INCOME_SOURCES } from "@/lib/constants";
import { parseMoneyInput } from "@/lib/format";
import { createCategory, createTransaction, listAccounts, listCategories, updateTransaction } from "@/lib/server/finance";
import { useAppStore } from "@/lib/store";
import { todayIso } from "@/lib/utils";

export function TransactionSheet() {
  const open = useAppStore((s) => s.addOpen);
  const mode = useAppStore((s) => s.addMode);
  const editing = useAppStore((s) => s.editing);
  const closeAdd = useAppStore((s) => s.closeAdd);
  const openAdd = useAppStore((s) => s.openAdd);

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? openAdd(mode) : closeAdd())}>
      <SheetContent side="bottom" className="md:mx-auto md:max-w-lg md:rounded-t-xl">
        {!mode ? (
          <>
            <SheetHeader>
              <SheetTitle>Adicionar movimentação</SheetTitle>
              <SheetDescription>Escolha o tipo de registro.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-3">
              <Button size="lg" variant="outline" onClick={() => openAdd("expense")}>
                Nova despesa
              </Button>
              <Button size="lg" onClick={() => openAdd("income")}>
                Nova receita
              </Button>
            </div>
          </>
        ) : (
          <TransactionForm
            type={mode}
            onCancel={closeAdd}
            editingId={editing?.id}
            defaults={
              editing
                ? {
                    amount: String(editing.amount).replace(".", ","),
                    description: editing.description,
                    occurredOn: editing.occurredOn,
                    place: editing.place ?? "",
                    categoryId: editing.categoryId ?? "",
                    accountId: editing.accountId ?? "",
                    incomeSource: editing.incomeSource ?? "salario",
                  }
                : undefined
            }
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function TransactionForm({
  type,
  onCancel,
  editingId,
  defaults,
}: {
  type: "income" | "expense";
  onCancel: () => void;
  editingId?: string;
  defaults?: {
    amount: string;
    description: string;
    occurredOn: string;
    place: string;
    categoryId: string;
    accountId: string;
    incomeSource: string;
  };
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(defaults?.amount ?? "");
  const [description, setDescription] = useState(defaults?.description ?? "");
  const [occurredOn, setOccurredOn] = useState(defaults?.occurredOn ?? todayIso());
  const [place, setPlace] = useState(defaults?.place ?? "");
  const [categoryId, setCategoryId] = useState(defaults?.categoryId ?? "");
  const [accountId, setAccountId] = useState(defaults?.accountId ?? "");
  const [incomeSource, setIncomeSource] = useState(defaults?.incomeSource ?? "salario");
  const [newCat, setNewCat] = useState("");

  const cats = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => listAccounts() });

  useEffect(() => {
    if (defaults) {
      setAmount(defaults.amount);
      setDescription(defaults.description);
      setOccurredOn(defaults.occurredOn);
      setPlace(defaults.place);
      setCategoryId(defaults.categoryId);
      setAccountId(defaults.accountId);
      setIncomeSource(defaults.incomeSource);
    }
  }, [defaults]);

  const save = useMutation({
    mutationFn: async () => {
      const parsed = parseMoneyInput(amount);
      if (!parsed) throw new Error("Informe um valor válido.");
      const payload = {
        type,
        amount: parsed,
        description,
        occurredOn,
        place: place || undefined,
        categoryId: categoryId || null,
        accountId: accountId || null,
        incomeSource: type === "income" ? incomeSource : null,
      };
      if (editingId) await updateTransaction({ data: { id: editingId, ...payload } });
      else await createTransaction({ data: payload });
    },
    onSuccess: async () => {
      toast.success(editingId ? "Movimentação atualizada." : "Movimentação registrada.");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["transactions"] }),
        qc.invalidateQueries({ queryKey: ["budget"] }),
        qc.invalidateQueries({ queryKey: ["insights"] }),
        qc.invalidateQueries({ queryKey: ["accounts"] }),
      ]);
      onCancel();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addCat = useMutation({
    mutationFn: async () => {
      const created = await createCategory({ data: { name: newCat } });
      setCategoryId(created.id);
      setNewCat("");
      await cats.refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isExpense = type === "expense";

  return (
    <>
      <SheetHeader>
        <SheetTitle>{editingId ? "Editar movimentação" : isExpense ? "Nova despesa" : "Nova receita"}</SheetTitle>
        <SheetDescription>
          {isExpense ? "Registre um gasto com data, local e categoria opcional." : "Registre um valor recebido."}
        </SheetDescription>
      </SheetHeader>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            className="mt-1.5"
            inputMode="decimal"
            placeholder="25,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            className="mt-1.5"
            placeholder={isExpense ? "Hambúrguer" : "Salário de setembro"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            className="mt-1.5"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="place">{isExpense ? "Loja / local" : "Origem (detalhe)"}</Label>
          <Input
            id="place"
            className="mt-1.5"
            placeholder={isExpense ? "Restaurante" : "Empresa"}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </div>
        {isExpense ? (
          <div>
            <Label>Categoria (opcional)</Label>
            <Select value={categoryId || "none"} onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}>
              <SelectTrigger className="mt-1.5" aria-label="Categoria">
                <SelectValue placeholder="Sem categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {(cats.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Nova categoria"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                aria-label="Nome da nova categoria"
              />
              <Button type="button" variant="outline" onClick={() => addCat.mutate()} disabled={!newCat.trim()}>
                Criar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Label>Origem</Label>
            <Select value={incomeSource} onValueChange={setIncomeSource}>
              <SelectTrigger className="mt-1.5" aria-label="Origem da receita">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCOME_SOURCES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label>Conta (opcional)</Label>
          <Select value={accountId || "none"} onValueChange={(v) => setAccountId(v === "none" ? "" : v)}>
            <SelectTrigger className="mt-1.5" aria-label="Conta">
              <SelectValue placeholder="Nenhuma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {(accounts.data ?? []).map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={save.isPending}>
            {save.isPending ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>
    </>
  );
}
