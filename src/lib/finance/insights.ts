import { formatMoney } from "../format.ts";
import { clampProgress } from "./money.ts";

export type InsightInput = {
  periodIncome: number;
  periodExpense: number;
  prevIncome: number;
  prevExpense: number;
  topCategory: string | null;
  topCategoryAmount: number;
  topGoal: { name: string; current: number; target: number } | null;
  hasAnyData: boolean;
};

export type Insight = { id: string; title: string; body: string };

export function buildInsights(input: InsightInput): Insight[] {
  if (!input.hasAnyData) {
    return [
      {
        id: "empty",
        title: "Comece pelo primeiro registro",
        body: "Ainda não há movimentações suficientes. Adicione uma receita ou despesa para ver insights reais.",
      },
    ];
  }

  const items: Insight[] = [];
  const saved = input.periodIncome - input.periodExpense;
  items.push({
    id: "received",
    title: "Receitas no período",
    body: `Você recebeu ${formatMoney(input.periodIncome)} neste período.`,
  });
  items.push({
    id: "saved",
    title: saved >= 0 ? "Economia do período" : "Resultado do período",
    body:
      saved >= 0
        ? `Você economizou ${formatMoney(saved)} neste período.`
        : `As despesas superaram as receitas em ${formatMoney(Math.abs(saved))} neste período.`,
  });

  if (input.prevExpense > 0 || input.periodExpense > 0) {
    if (input.periodExpense < input.prevExpense) {
      items.push({
        id: "spent-less",
        title: "Gastos em queda",
        body: "Você gastou menos neste período do que no período anterior.",
      });
    } else if (input.periodExpense > input.prevExpense && input.prevExpense > 0) {
      items.push({
        id: "spent-more",
        title: "Gastos em alta",
        body: "Você gastou mais neste período do que no período anterior.",
      });
    }
  }

  if (input.topCategory) {
    items.push({
      id: "top-cat",
      title: "Maior despesa",
      body: `Sua maior despesa foi ${input.topCategory} (${formatMoney(input.topCategoryAmount)}).`,
    });
  }

  if (input.topGoal) {
    const pct = Math.round(clampProgress(input.topGoal.current, input.topGoal.target));
    items.push({
      id: "goal",
      title: "Progresso da meta",
      body: `Sua meta “${input.topGoal.name}” está ${pct}% concluída.`,
    });
  }

  return items;
}
