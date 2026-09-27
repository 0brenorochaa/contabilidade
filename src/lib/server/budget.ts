import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { budgetAlertLevel, budgetRemaining, budgetUsage } from "@/lib/finance/budget";
import { toIsoDate } from "@/lib/utils";
import { toNumber, newId } from "@/lib/utils";

export const getBudget = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const now = new Date();
    const from = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const to = toIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const rows = await sql<{
      id: string;
      monthly_limit: string | number;
      enabled: boolean;
    }>`
      select id, monthly_limit, enabled from budgets where user_id = ${context.userId} limit 1
    `;
    const spentRows = await sql<{ spent: string | number }>`
      select coalesce(sum(amount), 0) as spent
      from transactions
      where user_id = ${context.userId} and type = 'expense'
        and occurred_on >= ${from}::date and occurred_on <= ${to}::date
    `;
    const spent = toNumber(spentRows[0]?.spent);
    const row = rows[0];
    if (!row) {
      return { configured: false as const, spent, from, to };
    }
    const limit = toNumber(row.monthly_limit);
    return {
      configured: true as const,
      id: row.id,
      limit,
      enabled: Boolean(row.enabled),
      spent,
      remaining: budgetRemaining(spent, limit),
      usage: budgetUsage(spent, limit),
      alert: budgetAlertLevel(spent, limit),
      from,
      to,
    };
  });

export const saveBudget = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { monthlyLimit: number; enabled: boolean }) => data)
  .handler(async ({ context, data }) => {
    if (!(data.monthlyLimit > 0)) throw new Error("Informe um limite mensal válido.");
    const sql = await getSql();
    const existing = await sql<{ id: string }>`
      select id from budgets where user_id = ${context.userId} limit 1
    `;
    if (existing[0]) {
      await sql`
        update budgets
        set monthly_limit = ${data.monthlyLimit}, enabled = ${data.enabled}, updated_at = now()
        where user_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into budgets (id, user_id, monthly_limit, enabled)
        values (${newId()}, ${context.userId}, ${data.monthlyLimit}, ${data.enabled})
      `;
    }
    return { ok: true as const };
  });
