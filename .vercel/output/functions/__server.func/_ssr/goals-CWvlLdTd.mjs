import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as toNumber, n as newId } from "./utils-WuDAn4c5.mjs";
import { t as addNotification } from "./helpers-Cvk6DR2i.mjs";
import { n as monthsUntil, o as suggestedMonthlySaving, t as clampProgress } from "./money-C4yQuJT7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-CWvlLdTd.js
function mapGoal(row) {
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
		monthlySuggestion: row.deadline ? suggestedMonthlySaving(remaining, Math.max(months, 1)) : null
	};
}
var listGoals_createServerFn_handler = createServerRpc({
	id: "370fd8561d295fa628382d08cee9cd3d1b2393f08ba2d43295b0aa616ef6afd5",
	name: "listGoals",
	filename: "src/lib/server/goals.ts"
}, (opts) => listGoals.__executeServer(opts));
var listGoals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listGoals_createServerFn_handler, async ({ context }) => {
	const items = (await (await getSql())`
      select id, name, target_amount, current_amount, deadline, description
      from goals where user_id = ${context.userId}
      order by created_at desc
    `).map(mapGoal);
	for (const g of items) if (g.progress >= 100) await addNotification({
		userId: context.userId,
		title: "Meta concluída",
		body: `A meta “${g.name}” foi concluída.`,
		kind: `goal.done.${g.id}`
	});
	else if (g.deadline) {
		if (monthsUntil(g.deadline) <= 1) await addNotification({
			userId: context.userId,
			title: "Meta próxima do prazo",
			body: `A meta “${g.name}” está próxima da data limite.`,
			kind: `goal.deadline.${g.id}`
		});
	}
	return items;
});
var createGoal_createServerFn_handler = createServerRpc({
	id: "f35c3d9b246ffdca4315130396b0492c3e72757afc8b079e3932db6269be2d86",
	name: "createGoal",
	filename: "src/lib/server/goals.ts"
}, (opts) => createGoal.__executeServer(opts));
var createGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createGoal_createServerFn_handler, async ({ context, data }) => {
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
var updateGoal_createServerFn_handler = createServerRpc({
	id: "b93bc2cf1baa26cafbda25b0b8837a1374197daf200d117d875ed2d4c3e7a40e",
	name: "updateGoal",
	filename: "src/lib/server/goals.ts"
}, (opts) => updateGoal.__executeServer(opts));
var updateGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateGoal_createServerFn_handler, async ({ context, data }) => {
	if (!(await (await getSql())`
      update goals
      set name = ${data.name.trim()},
          target_amount = ${data.targetAmount},
          deadline = ${data.deadline || null},
          description = ${data.description?.trim() || null},
          updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
      returning id
    `)[0]) throw new Error("Meta não encontrada.");
	return { ok: true };
});
var contributeGoal_createServerFn_handler = createServerRpc({
	id: "71b44ced66666ccd2bbbd5d52f8e778d920f44f94c28ccb9707a857763d5101c",
	name: "contributeGoal",
	filename: "src/lib/server/goals.ts"
}, (opts) => contributeGoal.__executeServer(opts));
var contributeGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(contributeGoal_createServerFn_handler, async ({ context, data }) => {
	if (!(data.amount > 0)) throw new Error("Informe um valor válido.");
	const sql = await getSql();
	if (!(await sql`
      select id, current_amount from goals where id = ${data.id} and user_id = ${context.userId} limit 1
    `)[0]) throw new Error("Meta não encontrada.");
	await sql`
      insert into goal_contributions (id, user_id, goal_id, amount)
      values (${newId()}, ${context.userId}, ${data.id}, ${data.amount})
    `;
	await sql`
      update goals
      set current_amount = current_amount + ${data.amount}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var deleteGoal_createServerFn_handler = createServerRpc({
	id: "719fb3e0396bebe483aa7c32c0544c9beae941db77a488030b8d16c9a9861fc1",
	name: "deleteGoal",
	filename: "src/lib/server/goals.ts"
}, (opts) => deleteGoal.__executeServer(opts));
var deleteGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteGoal_createServerFn_handler, async ({ context, data }) => {
	if (!(await (await getSql())`
      delete from goals where id = ${data.id} and user_id = ${context.userId} returning id
    `)[0]) throw new Error("Meta não encontrada.");
	return { ok: true };
});
//#endregion
export { contributeGoal_createServerFn_handler, createGoal_createServerFn_handler, deleteGoal_createServerFn_handler, listGoals_createServerFn_handler, updateGoal_createServerFn_handler };
