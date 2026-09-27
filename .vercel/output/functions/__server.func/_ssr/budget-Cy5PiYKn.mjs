import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as toNumber, n as newId, r as toIsoDate } from "./utils-WuDAn4c5.mjs";
import { i as budgetUsage, r as budgetRemaining, t as budgetAlertLevel } from "./budget-dTyrW8yf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/budget-Cy5PiYKn.js
var getBudget_createServerFn_handler = createServerRpc({
	id: "2e25cec93829d5dbb25598311f8499221c175da7d4d945d1633d5619885983dc",
	name: "getBudget",
	filename: "src/lib/server/budget.ts"
}, (opts) => getBudget.__executeServer(opts));
var getBudget = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBudget_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const now = /* @__PURE__ */ new Date();
	const from = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
	const to = toIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
	const rows = await sql`
      select id, monthly_limit, enabled from budgets where user_id = ${context.userId} limit 1
    `;
	const spentRows = await sql`
      select coalesce(sum(amount), 0) as spent
      from transactions
      where user_id = ${context.userId} and type = 'expense'
        and occurred_on >= ${from}::date and occurred_on <= ${to}::date
    `;
	const spent = toNumber(spentRows[0]?.spent);
	const row = rows[0];
	if (!row) return {
		configured: false,
		spent,
		from,
		to
	};
	const limit = toNumber(row.monthly_limit);
	return {
		configured: true,
		id: row.id,
		limit,
		enabled: Boolean(row.enabled),
		spent,
		remaining: budgetRemaining(spent, limit),
		usage: budgetUsage(spent, limit),
		alert: budgetAlertLevel(spent, limit),
		from,
		to
	};
});
var saveBudget_createServerFn_handler = createServerRpc({
	id: "160a70a05b1b42e4524a159cfa2c5608e4f2f83e2b13c5d662780ca2b06d8c36",
	name: "saveBudget",
	filename: "src/lib/server/budget.ts"
}, (opts) => saveBudget.__executeServer(opts));
var saveBudget = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(saveBudget_createServerFn_handler, async ({ context, data }) => {
	if (!(data.monthlyLimit > 0)) throw new Error("Informe um limite mensal válido.");
	const sql = await getSql();
	if ((await sql`
      select id from budgets where user_id = ${context.userId} limit 1
    `)[0]) await sql`
        update budgets
        set monthly_limit = ${data.monthlyLimit}, enabled = ${data.enabled}, updated_at = now()
        where user_id = ${context.userId}
      `;
	else await sql`
        insert into budgets (id, user_id, monthly_limit, enabled)
        values (${newId()}, ${context.userId}, ${data.monthlyLimit}, ${data.enabled})
      `;
	return { ok: true };
});
//#endregion
export { getBudget_createServerFn_handler, saveBudget_createServerFn_handler };
