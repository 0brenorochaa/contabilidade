export function netBalance(income: number, expense: number): number {
  return roundMoney(income - expense);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function clampProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, (current / target) * 100));
}

export function suggestedMonthlySaving(remaining: number, months: number): number | null {
  if (months <= 0 || remaining <= 0) return null;
  return roundMoney(remaining / months);
}
