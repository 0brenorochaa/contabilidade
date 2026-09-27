import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FINANCIAL_GOALS } from "@/lib/constants";
import { parseMoneyInput } from "@/lib/format";
import { completeOnboarding, getMe } from "@/lib/server/user";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const nav = useNavigate();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe(), enabled: Boolean(user) });
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("organizar");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPending) return <div className="grid min-h-dvh place-items-center">Carregando…</div>;
  if (!user) return <RedirectToSignIn />;
  if (me.data?.onboardingCompleted) {
    nav({ to: "/app" });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseMoneyInput(income);
    if (parsed == null && income.trim() !== "0" && income.trim() !== "0,00") {
      setError("Informe sua renda mensal.");
      return;
    }
    setLoading(true);
    try {
      await completeOnboarding({ data: { monthlyIncome: parsed ?? 0, financialGoal: goal } });
      nav({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <BrandLink />
      <h1 className="mt-8 text-2xl font-semibold">Configuração inicial</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Essas informações ficam no seu perfil e ajudam a organizar o painel. Você pode alterá-las depois.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="income">Qual sua renda mensal?</Label>
          <Input
            id="income"
            className="mt-1.5"
            inputMode="decimal"
            placeholder="0,00"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Qual é seu principal objetivo financeiro?</legend>
          <div className="mt-2 grid gap-2">
            {FINANCIAL_GOALS.map((g) => (
              <label key={g.id} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                <input
                  type="radio"
                  name="goal"
                  value={g.id}
                  checked={goal === g.id}
                  onChange={() => setGoal(g.id)}
                  className="accent-primary"
                />
                {g.label}
              </label>
            ))}
          </div>
        </fieldset>
        {error ? <p className="text-sm text-expense">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando…" : "Ir para o painel"}
        </Button>
      </form>
    </main>
  );
}
