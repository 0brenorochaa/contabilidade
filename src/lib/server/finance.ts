import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { PeriodId } from "@/lib/constants";
import { budgetAlertLevel, budgetAlertMessage } from "@/lib/finance/budget";
import { previousRange, resolvePeriod, type DateRange } from "@/lib/finance/period";
import { netBalance } from "@/lib/finance/money";
import { buildInsights } from "@/lib/finance/insights";
import { newId, toNumber } from "@/lib/utils";
import { addNotification } from "./helpers";

type TxType = "income" | "expense";

function rangeFrom(input: { period: PeriodId; from?: string; to?: string }): DateRange {
  return resolvePeriod(input.period, { from: input.from, to: input.to });
}

export type TransactionDTO = {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  occurredOn: string;
  place: string | null;
  categoryId: string | null;
  categoryName: string | null;
  accountId: string | null;
  accountName: string | null;
  incomeSource: string | null;
  createdAt: string;
};

function mapTx(row: {
  id: string;
  type: TxType;
  amount: string | number;
  description: string;
  occurred_on: string;
  place: string | null;
  category_id: string | null;
  category_name: string | null;
  account_id: string | null;
  account_name: string | null;
  income_source: string | null;
  created_at: string;
}): TransactionDTO {
  return {
    id: row.id,
    type: row.type,
    amount: toNumber(row.amount),
    description: row.description,
    occurredOn: row.occurred_on,
    place: row.place,
    categoryId: row.category_id,
    categoryName: row.category_name,
    accountId: row.account_id,
    accountName: row.account_name,
    incomeSource: row.income_source,
    createdAt: String(row.created_at),
  };
}

const txSelect = `
  t.id, t.type, t.amount, t.description, t.occurred_on, t.place,
  t.category_id, c.name as category_name, t.account_id, a.name as account_name,
  t.income_source, t.created_at
`;

export const listTransactions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    period: PeriodId;
    from?: string;
    to?: string;
    type?: "all" | TxType;
    query?: string;
    categoryId?: string;
    place?: string;
    sort?: "date" | "amount_desc" | "amount_asc";
  }) => data)
  .handler(async ({ context, data }) => {
    const range = rangeFrom(data);
    const sql = await getSql();
    const type = data.type && data.type !== "all" ? data.type : null;
    const query = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
    const categoryId = data.categoryId || null;
    const place = data.place?.trim() ? `%${data.place.trim().toLowerCase()}%` : null;
    const sort = data.sort ?? "date";
    const order =
      sort === "amount_desc"
        ? "t.amount desc, t.occurred_on desc"
        : sort === "amount_asc"
          ? "t.amount asc, t.occurred_on desc"
          : "t.occurred_on desc, t.created_at desc";

    const rows = await sql.query<Parameters<typeof mapTx>[0]>(
      `select ${txSelect}
       from transactions t
       left join categories c on c.id = t.category_id and c.user_id = t.user_id
       left join accounts a on a.id = t.account_id and a.user_id = t.user_id
       where t.user_id = $1
         and t.occurred_on >= $2::date
         and t.occurred_on <= $3::date
         and ($4::text is null or t.type = $4)
         and (
           $5::text is null
           or lower(t.description) like $5
           or lower(coalesce(t.place, '')) like $5
           or replace(t.amount::text, '.', ',') like replace($5, '%', '')
         )
         and ($6::text is null or t.category_id = $6)
         and ($7::text is null or lower(coalesce(t.place, '')) like $7)
       order by ${order}
       limit 300`,
      [context.userId, range.from, range.to, type, query, categoryId, place],
    );
    return { range, items: rows.map(mapTx) };
  });

export const getDashboard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { period: PeriodId; from?: string; to?: string }) => data)
  .handler(async ({ context, data }) => {
    const range = rangeFrom(data);
    const prev = previousRange(range);
    const sql = await getSql();

    const agg = await sql<{ income: string | number; expense: string | number }>`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${range.from}::date
        and occurred_on <= ${range.to}::date
    `;
    const all = await sql<{ income: string | number; expense: string | number; n: number }>`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense,
        count(*)::int as n
      from transactions
      where user_id = ${context.userId}
    `;
    const prevAgg = await sql<{ income: string | number; expense: string | number }>`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${prev.from}::date
        and occurred_on <= ${prev.to}::date
    `;
    const byCat = await sql<{ name: string; total: string | number }>`
      select coalesce(c.name, 'Sem categoria') as name, coalesce(sum(t.amount), 0) as total
      from transactions t
      left join categories c on c.id = t.category_id and c.user_id = t.user_id
      where t.user_id = ${context.userId}
        and t.type = 'expense'
        and t.occurred_on >= ${range.from}::date
        and t.occurred_on <= ${range.to}::date
      group by coalesce(c.name, 'Sem categoria')
      order by total desc
    `;
    const byDay = await sql<{ day: string; income: string | number; expense: string | number }>`
      select occurred_on as day,
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${range.from}::date
        and occurred_on <= ${range.to}::date
      group by occurred_on
      order by occurred_on
    `;
    const recent = await sql.query<Parameters<typeof mapTx>[0]>(
      `select ${txSelect}
       from transactions t
       left join categories c on c.id = t.category_id and c.user_id = t.user_id
       left join accounts a on a.id = t.account_id and a.user_id = t.user_id
       where t.user_id = $1
         and t.occurred_on >= $2::date
         and t.occurred_on <= $3::date
       order by t.occurred_on desc, t.created_at desc
       limit 8`,
      [context.userId, range.from, range.to],
    );
    const topGoal = await sql<{ name: string; current_amount: string | number; target_amount: string | number }>`
      select name, current_amount, target_amount
      from goals where user_id = ${context.userId}
      order by current_amount / nullif(target_amount, 0) desc
      limit 1
    `;

    const periodIncome = toNumber(agg[0]?.income);
    const periodExpense = toNumber(agg[0]?.expense);
    const totalIncome = toNumber(all[0]?.income);
    const totalExpense = toNumber(all[0]?.expense);
    const categories = byCat.map((c) => ({ name: c.name, total: toNumber(c.total) }));
    let running = 0;
    const evolution = byDay.map((d) => {
      running += toNumber(d.income) - toNumber(d.expense);
      return {
        day: d.day,
        income: toNumber(d.income),
        expense: toNumber(d.expense),
        balance: Math.round(running * 100) / 100,
      };
    });

    return {
      range,
      periodIncome,
      periodExpense,
      periodNet: netBalance(periodIncome, periodExpense),
      totalBalance: netBalance(totalIncome, totalExpense),
      totalIncome,
      totalExpense,
      hasAnyData: toNumber(all[0]?.n) > 0,
      categories,
      evolution,
      recent: recent.map(mapTx),
      insights: buildInsights({
        periodIncome,
        periodExpense,
        prevIncome: toNumber(prevAgg[0]?.income),
        prevExpense: toNumber(prevAgg[0]?.expense),
        topCategory: categories[0]?.name ?? null,
        topCategoryAmount: categories[0]?.total ?? 0,
        topGoal: topGoal[0]
          ? {
              name: topGoal[0].name,
              current: toNumber(topGoal[0].current_amount),
              target: toNumber(topGoal[0].target_amount),
            }
          : null,
        hasAnyData: toNumber(all[0]?.n) > 0,
      }),
    };
  });

async function maybeBudgetAlerts(userId: string) {
  const sql = await getSql();
  const now = new Date();
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(toDate).padStart(2, "0")}`;
  const budget = await sql<{ monthly_limit: string | number; enabled: boolean }>`
    select monthly_limit, enabled from budgets where user_id = ${userId} limit 1
  `;
  if (!budget[0] || !budget[0].enabled) return;
  const spentRows = await sql<{ spent: string | number }>`
    select coalesce(sum(amount), 0) as spent
    from transactions
    where user_id = ${userId} and type = 'expense'
      and occurred_on >= ${from}::date and occurred_on <= ${to}::date
  `;
  const spent = toNumber(spentRows[0]?.spent);
  const limit = toNumber(budget[0].monthly_limit);
  const level = budgetAlertLevel(spent, limit);
  const message = budgetAlertMessage(level, spent, limit);
  if (message) {
    await addNotification({
      userId,
      title: "Alerta de orçamento",
      body: message,
      kind: `budget.${level}`,
    });
  }
}

export const createTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    type: TxType;
    amount: number;
    description: string;
    occurredOn: string;
    place?: string;
    categoryId?: string | null;
    accountId?: string | null;
    incomeSource?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    if (!(data.amount > 0) || !Number.isFinite(data.amount)) throw new Error("Informe um valor válido.");
    const description = data.description.trim();
    if (!description) throw new Error("Informe uma descrição.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.occurredOn)) throw new Error("Informe uma data válida.");
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into transactions (
        id, user_id, type, amount, description, occurred_on, place, category_id, account_id, income_source
      ) values (
        ${id}, ${context.userId}, ${data.type}, ${data.amount}, ${description}, ${data.occurredOn}::date,
        ${data.place?.trim() || null}, ${data.categoryId || null}, ${data.accountId || null}, ${data.incomeSource || null}
      )
    `;
    if (data.type === "expense") await maybeBudgetAlerts(context.userId);
    if (data.amount >= 5000) {
      await addNotification({
        userId: context.userId,
        title: "Registro importante",
        body: `Uma movimentação de valor elevado foi registrada: ${description}.`,
        kind: "transaction.large",
      });
    }
    return { id };
  });

export const updateTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id: string;
    type: TxType;
    amount: number;
    description: string;
    occurredOn: string;
    place?: string;
    categoryId?: string | null;
    accountId?: string | null;
    incomeSource?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    if (!(data.amount > 0)) throw new Error("Informe um valor válido.");
    const sql = await getSql();
    const updated = await sql`
      update transactions
      set type = ${data.type},
          amount = ${data.amount},
          description = ${data.description.trim()},
          occurred_on = ${data.occurredOn}::date,
          place = ${data.place?.trim() || null},
          category_id = ${data.categoryId || null},
          account_id = ${data.accountId || null},
          income_source = ${data.incomeSource || null},
          updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
      returning id
    `;
    if (!updated[0]) throw new Error("Movimentação não encontrada.");
    return { id: data.id };
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deleted = await sql`
      delete from transactions where id = ${data.id} and user_id = ${context.userId} returning id
    `;
    if (!deleted[0]) throw new Error("Movimentação não encontrada.");
    return { ok: true as const };
  });

export const listCategories = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: string; name: string; kind: string; is_default: boolean }>`
      select id, name, kind, is_default from categories
      where user_id = ${context.userId}
      order by is_default desc, name
    `;
  });

export const createCategory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string }) => data)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (!name) throw new Error("Informe o nome da categoria.");
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into categories (id, user_id, name, kind, is_default)
      values (${id}, ${context.userId}, ${name}, 'expense', false)
    `;
    return { id, name };
  });

export const listAccounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      type: string;
      initial_balance: string | number;
      in_sum: string | number;
      out_sum: string | number;
    }>`
      select a.id, a.name, a.type, a.initial_balance,
        coalesce((select sum(amount) from transactions t where t.account_id = a.id and t.user_id = a.user_id and t.type = 'income'), 0) as in_sum,
        coalesce((select sum(amount) from transactions t where t.account_id = a.id and t.user_id = a.user_id and t.type = 'expense'), 0) as out_sum
      from accounts a
      where a.user_id = ${context.userId}
      order by a.created_at
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      initialBalance: toNumber(r.initial_balance),
      balance: toNumber(r.initial_balance) + toNumber(r.in_sum) - toNumber(r.out_sum),
    }));
  });

export const createAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; type: string; initialBalance: number }) => data)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (!name) throw new Error("Informe o nome da conta.");
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into accounts (id, user_id, name, type, initial_balance)
      values (${id}, ${context.userId}, ${name}, ${data.type}, ${data.initialBalance || 0})
    `;
    return { id };
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`update transactions set account_id = null where account_id = ${data.id} and user_id = ${context.userId}`;
    const deleted = await sql`
      delete from accounts where id = ${data.id} and user_id = ${context.userId} returning id
    `;
    if (!deleted[0]) throw new Error("Conta não encontrada.");
    return { ok: true as const };
  });
