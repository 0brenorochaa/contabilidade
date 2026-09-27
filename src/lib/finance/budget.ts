export type BudgetAlertLevel = "none" | "warn" | "limit" | "over";

export function budgetUsage(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return (spent / limit) * 100;
}

export function budgetAlertLevel(spent: number, limit: number): BudgetAlertLevel {
  if (limit <= 0) return "none";
  if (spent > limit) return "over";
  if (spent >= limit) return "limit";
  if (spent >= limit * 0.8) return "warn";
  return "none";
}

export function budgetRemaining(spent: number, limit: number): number {
  return Math.round((limit - spent) * 100) / 100;
}

export function budgetAlertMessage(level: BudgetAlertLevel, spent: number, limit: number): string | null {
  if (level === "warn") {
    return "Você atingiu 80% do orçamento mensal.";
  }
  if (level === "limit") {
    return "Você atingiu 100% do orçamento mensal.";
  }
  if (level === "over") {
    return "Você ultrapassou o limite do orçamento mensal.";
  }
  void spent;
  void limit;
  return null;
}
