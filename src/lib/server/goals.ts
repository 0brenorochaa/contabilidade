import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { clampProgress, suggestedMonthlySaving } from "@/lib/finance/money";
import { monthsUntil } from "@/lib/finance/period";
import { newId, toNumber } from "@/lib/utils";
import { addNotification } from "./helpers";

export type GoalDTO = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  description: string | null;
  progress: number;
  monthlySuggestion: number | null;
};

function mapGoal(row: {
  id: string;
  name: string;
  target_amount: string | number;
  current_amount: string | number;
  deadline: string | null;
  description: string | null;
}): GoalDTO {
  const target = toNumber(row.target_amount);
  const current = toNumber(row.current_amount);
  const remaining = Math.max(0, target - current);
  const months = row.deadline ? monthsUntil(row.deadline) : 0;
  return {
    id: row.id,
    name: row.name,
    targetAmount: target,
    currentAmount: current,
    deadline: row.deadline,
    description: row.description,
    progress: clampProgress(current, target),
    monthlySuggestion: row.deadline ? suggestedMonthlySaving(remaining, Math.max(months, 1)) : null,
  };
}

export const listGoals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      target_amount: string | number;
      current_amount: string | number;
      deadline: string | null;
      description: string | null;
    }>`
      select id, name, target_amount, current_amount, deadline, description
      from goals where user_id = ${context.userId}
      order by created_at desc
    `;
    const items = rows.map(mapGoal);
    for (const g of items) {
      if (g.progress >= 100) {
        await addNotification({
          userId: context.userId,
          title: "Meta concluída",
          body: `A meta “${g.name}” foi concluída.`,
          kind: `goal.done.${g.id}`,
        });
      } else if (g.deadline) {
        const months = monthsUntil(g.deadline);
        if (months <= 1) {
          await addNotification({
            userId: context.userId,
            title: "Meta próxima do prazo",
            body: `A meta “${g.name}” está próxima da data limite.`,
            kind: `goal.deadline.${g.id}`,
          });
        }
      }
    }
    return items;
  });

export const createGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; targetAmount: number; deadline?: string | null; description?: string | null }) => data)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (!name) throw new Error("Informe o nome da meta.");
    if (!(data.targetAmount > 0)) throw new Error("Informe um valor desejado válido.");
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into goals (id, user_id, name, target_amount, current_amount, deadline, description)
      values (
        ${id}, ${context.userId}, ${name}, ${data.targetAmount}, 0,
        ${data.deadline || null}, ${data.description?.trim() || null}
      )
    `;
    return { id };
  });

export const updateGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id: string;
    name: string;
    targetAmount: number;
    deadline?: string | null;
    description?: string | null;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const updated = await sql`
      update goals
      set name = ${data.name.trim()},
          target_amount = ${data.targetAmount},
          deadline = ${data.deadline || null},
          description = ${data.description?.trim() || null},
          updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
      returning id
    `;
    if (!updated[0]) throw new Error("Meta não encontrada.");
    return { ok: true as const };
  });

export const contributeGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; amount: number }) => data)
  .handler(async ({ context, data }) => {
    if (!(data.amount > 0)) throw new Error("Informe um valor válido.");
    const sql = await getSql();
    const goal = await sql<{ id: string; current_amount: string | number }>`
      select id, current_amount from goals where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    if (!goal[0]) throw new Error("Meta não encontrada.");
    await sql`
      insert into goal_contributions (id, user_id, goal_id, amount)
      values (${newId()}, ${context.userId}, ${data.id}, ${data.amount})
    `;
    await sql`
      update goals
      set current_amount = current_amount + ${data.amount}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const deleteGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deleted = await sql`
      delete from goals where id = ${data.id} and user_id = ${context.userId} returning id
    `;
    if (!deleted[0]) throw new Error("Meta não encontrada.");
    return { ok: true as const };
  });
