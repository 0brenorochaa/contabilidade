import { toIsoDate } from "../utils.ts";
import type { PeriodId } from "../constants.ts";

export type DateRange = { from: string; to: string };

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addDays(d: Date, days: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

export function resolvePeriod(
  id: PeriodId,
  custom?: { from?: string; to?: string },
  now = new Date(),
): DateRange {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (id === "this_month") {
    return { from: toIsoDate(startOfMonth(today)), to: toIsoDate(endOfMonth(today)) };
  }
  if (id === "last_month") {
    const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return { from: toIsoDate(startOfMonth(prev)), to: toIsoDate(endOfMonth(prev)) };
  }
  if (id === "last_7") {
    return { from: toIsoDate(addDays(today, -6)), to: toIsoDate(today) };
  }
  if (id === "last_30") {
    return { from: toIsoDate(addDays(today, -29)), to: toIsoDate(today) };
  }
  if (id === "last_90") {
    return { from: toIsoDate(addDays(today, -89)), to: toIsoDate(today) };
  }
  const from = custom?.from && /^\d{4}-\d{2}-\d{2}$/.test(custom.from) ? custom.from : toIsoDate(addDays(today, -29));
  const to = custom?.to && /^\d{4}-\d{2}-\d{2}$/.test(custom.to) ? custom.to : toIsoDate(today);
  return from <= to ? { from, to } : { from: to, to: from };
}

export function previousRange(range: DateRange): DateRange {
  const from = new Date(`${range.from}T00:00:00`);
  const to = new Date(`${range.to}T00:00:00`);
  const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
  const prevTo = addDays(from, -1);
  const prevFrom = addDays(prevTo, -(days - 1));
  return { from: toIsoDate(prevFrom), to: toIsoDate(prevTo) };
}

export function monthsUntil(deadlineIso: string, now = new Date()): number {
  const deadline = new Date(`${deadlineIso}T00:00:00`);
  if (Number.isNaN(deadline.getTime()) || deadline <= now) return 0;
  const years = deadline.getFullYear() - now.getFullYear();
  const months = years * 12 + (deadline.getMonth() - now.getMonth());
  const adjust = deadline.getDate() < now.getDate() ? -1 : 0;
  return Math.max(0, months + adjust);
}
