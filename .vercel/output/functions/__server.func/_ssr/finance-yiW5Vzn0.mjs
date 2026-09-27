import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as toNumber, n as newId } from "./utils-WuDAn4c5.mjs";
import { t as addNotification } from "./helpers-Cvk6DR2i.mjs";
import { i as formatMoney } from "./format-ByvtKy4h.mjs";
import { n as budgetAlertMessage, t as budgetAlertLevel } from "./budget-dTyrW8yf.mjs";
import { a as resolvePeriod, i as previousRange, r as netBalance, t as clampProgress } from "./money-C4yQuJT7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-yiW5Vzn0.js
function buildInsights(input) {
	if (!input.hasAnyData) return [{
		id: "empty",
		title: "Comece pelo primeiro registro",
		body: "Ainda não há movimentações suficientes. Adicione uma receita ou despesa para ver insights reais."
	}];
	const items = [];
	const saved = input.periodIncome - input.periodExpense;
	items.push({
		id: "received",
		title: "Receitas no período",
		body: `Você recebeu ${formatMoney(input.periodIncome)} neste período.`
	});
	items.push({
		id: "saved",
		title: saved >= 0 ? "Economia do período" : "Resultado do período",
		body: saved >= 0 ? `Você economizou ${formatMoney(saved)} neste período.` : `As despesas superaram as receitas em ${formatMoney(Math.abs(saved))} neste período.`
	});
	if (input.prevExpense > 0 || input.periodExpense > 0) {
		if (input.periodExpense < input.prevExpense) items.push({
			id: "spent-less",
			title: "Gastos em queda",
			body: "Você gastou menos neste período do que no período anterior."
		});
		else if (input.periodExpense > input.prevExpense && input.prevExpense > 0) items.push({
			id: "spent-more",
			title: "Gastos em alta",
			body: "Você gastou mais neste período do que no período anterior."
		});
	}
	if (input.topCategory) items.push({
		id: "top-cat",
		title: "Maior despesa",
		body: `Sua maior despesa foi ${input.topCategory} (${formatMoney(input.topCategoryAmount)}).`
	});
	if (input.topGoal) {
		const pct = Math.round(clampProgress(input.topGoal.current, input.topGoal.target));
		items.push({
			id: "goal",
			title: "Progresso da meta",
			body: `Sua meta “${input.topGoal.name}” está ${pct}% concluída.`
		});
	}
	return items;
}
function rangeFrom(input) {
	return resolvePeriod(input.period, {
		from: input.from,
		to: input.to
	});
}
function mapTx(row) {
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
		createdAt: String(row.created_at)
	};
}
var txSelect = `
  t.id, t.type, t.amount, t.description, t.occurred_on, t.place,
  t.category_id, c.name as category_name, t.account_id, a.name as account_name,
  t.income_source, t.created_at
`;
var listTransactions_createServerFn_handler = createServerRpc({
	id: "e03546459a130f53aa8fe4aef82ec86cf742ced71ca1395f82de3ec35150c401",
	name: "listTransactions",
	filename: "src/lib/server/finance.ts"
}, (opts) => listTransactions.__executeServer(opts));
var listTransactions = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(listTransactions_createServerFn_handler, async ({ context, data }) => {
	const range = rangeFrom(data);
	const sql = await getSql();
	const type = data.type && data.type !== "all" ? data.type : null;
	const query = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
	const categoryId = data.categoryId || null;
	const place = data.place?.trim() ? `%${data.place.trim().toLowerCase()}%` : null;
	const sort = data.sort ?? "date";
	const order = sort === "amount_desc" ? "t.amount desc, t.occurred_on desc" : sort === "amount_asc" ? "t.amount asc, t.occurred_on desc" : "t.occurred_on desc, t.created_at desc";
	return {
		range,
		items: (await sql.query(`select ${txSelect}
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
       limit 300`, [
			context.userId,
			range.from,
			range.to,
			type,
			query,
			categoryId,
			place
		])).map(mapTx)
	};
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "e444e7f884fcf1f9bfa22af7d4a97a2528b4656f3de05ed9a63eba9aed1103ed",
	name: "getDashboard",
	filename: "src/lib/server/finance.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(getDashboard_createServerFn_handler, async ({ context, data }) => {
	const range = rangeFrom(data);
	const prev = previousRange(range);
	const sql = await getSql();
	const agg = await sql`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${range.from}::date
        and occurred_on <= ${range.to}::date
    `;
	const all = await sql`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense,
        count(*)::int as n
      from transactions
      where user_id = ${context.userId}
    `;
	const prevAgg = await sql`
      select
        coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${prev.from}::date
        and occurred_on <= ${prev.to}::date
    `;
	const byCat = await sql`
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
	const byDay = await sql`
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
	const recent = await sql.query(`select ${txSelect}
       from transactions t
       left join categories c on c.id = t.category_id and c.user_id = t.user_id
       left join accounts a on a.id = t.account_id and a.user_id = t.user_id
       where t.user_id = $1
         and t.occurred_on >= $2::date
         and t.occurred_on <= $3::date
       order by t.occurred_on desc, t.created_at desc
       limit 8`, [
		context.userId,
		range.from,
		range.to
	]);
	const topGoal = await sql`
      select name, current_amount, target_amount
      from goals where user_id = ${context.userId}
      order by current_amount / nullif(target_amount, 0) desc
      limit 1
    `;
	const periodIncome = toNumber(agg[0]?.income);
	const periodExpense = toNumber(agg[0]?.expense);
	const totalIncome = toNumber(all[0]?.income);
	const totalExpense = toNumber(all[0]?.expense);
	const categories = byCat.map((c) => ({
		name: c.name,
		total: toNumber(c.total)
	}));
	let running = 0;
	const evolution = byDay.map((d) => {
		running += toNumber(d.income) - toNumber(d.expense);
		return {
			day: d.day,
			income: toNumber(d.income),
			expense: toNumber(d.expense),
			balance: Math.round(running * 100) / 100
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
			topGoal: topGoal[0] ? {
				name: topGoal[0].name,
				current: toNumber(topGoal[0].current_amount),
				target: toNumber(topGoal[0].target_amount)
			} : null,
			hasAnyData: toNumber(all[0]?.n) > 0
		})
	};
});
async function maybeBudgetAlerts(userId) {
	const sql = await getSql();
	const now = /* @__PURE__ */ new Date();
	const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
	const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(toDate).padStart(2, "0")}`;
	const budget = await sql`
    select monthly_limit, enabled from budgets where user_id = ${userId} limit 1
  `;
	if (!budget[0] || !budget[0].enabled) return;
	const spentRows = await sql`
    select coalesce(sum(amount), 0) as spent
    from transactions
    where user_id = ${userId} and type = 'expense'
      and occurred_on >= ${from}::date and occurred_on <= ${to}::date
  `;
	const spent = toNumber(spentRows[0]?.spent);
	const limit = toNumber(budget[0].monthly_limit);
	const level = budgetAlertLevel(spent, limit);
	const message = budgetAlertMessage(level, spent, limit);
	if (message) await addNotification({
		userId,
		title: "Alerta de orçamento",
		body: message,
		kind: `budget.${level}`
	});
}
var createTransaction_createServerFn_handler = createServerRpc({
	id: "c958703034ee99aaa99769552a2d02c16657c3430140290d615229cf0639491b",
	name: "createTransaction",
	filename: "src/lib/server/finance.ts"
}, (opts) => createTransaction.__executeServer(opts));
var createTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createTransaction_createServerFn_handler, async ({ context, data }) => {
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
	if (data.amount >= 5e3) await addNotification({
		userId: context.userId,
		title: "Registro importante",
		body: `Uma movimentação de valor elevado foi registrada: ${description}.`,
		kind: "transaction.large"
	});
	return { id };
});
var updateTransaction_createServerFn_handler = createServerRpc({
	id: "ce2feeff4a5f353e5b9261a4cfce317a1a4f7d5cab9747dc123efd4542a4e616",
	name: "updateTransaction",
	filename: "src/lib/server/finance.ts"
}, (opts) => updateTransaction.__executeServer(opts));
var updateTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateTransaction_createServerFn_handler, async ({ context, data }) => {
	if (!(data.amount > 0)) throw new Error("Informe um valor válido.");
	if (!(await (await getSql())`
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
    `)[0]) throw new Error("Movimentação não encontrada.");
	return { id: data.id };
});
var deleteTransaction_createServerFn_handler = createServerRpc({
	id: "88ba13589545508c1e6bc130638a70dc42613a84254861d6b86e22e4eb7673c3",
	name: "deleteTransaction",
	filename: "src/lib/server/finance.ts"
}, (opts) => deleteTransaction.__executeServer(opts));
var deleteTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteTransaction_createServerFn_handler, async ({ context, data }) => {
	if (!(await (await getSql())`
      delete from transactions where id = ${data.id} and user_id = ${context.userId} returning id
    `)[0]) throw new Error("Movimentação não encontrada.");
	return { ok: true };
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "2eebafa84d8f72df96e0f03b2b82fdeea1b8e99e2da192f291b0066803edf4cc",
	name: "listCategories",
	filename: "src/lib/server/finance.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCategories_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, name, kind, is_default from categories
      where user_id = ${context.userId}
      order by is_default desc, name
    `;
});
var createCategory_createServerFn_handler = createServerRpc({
	id: "2cdc384dd70d4ccdc1e39637f77018d372657057688c01697b2bb99aebceee08",
	name: "createCategory",
	filename: "src/lib/server/finance.ts"
}, (opts) => createCategory.__executeServer(opts));
var createCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createCategory_createServerFn_handler, async ({ context, data }) => {
	const name = data.name.trim();
	if (!name) throw new Error("Informe o nome da categoria.");
	const sql = await getSql();
	const id = newId();
	await sql`
      insert into categories (id, user_id, name, kind, is_default)
      values (${id}, ${context.userId}, ${name}, 'expense', false)
    `;
	return {
		id,
		name
	};
});
var listAccounts_createServerFn_handler = createServerRpc({
	id: "64b8df86a53ab27f09477ed713502a0b42f16df5a50e50650ece9358bf98a8c3",
	name: "listAccounts",
	filename: "src/lib/server/finance.ts"
}, (opts) => listAccounts.__executeServer(opts));
var listAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAccounts_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select a.id, a.name, a.type, a.initial_balance,
        coalesce((select sum(amount) from transactions t where t.account_id = a.id and t.user_id = a.user_id and t.type = 'income'), 0) as in_sum,
        coalesce((select sum(amount) from transactions t where t.account_id = a.id and t.user_id = a.user_id and t.type = 'expense'), 0) as out_sum
      from accounts a
      where a.user_id = ${context.userId}
      order by a.created_at
    `).map((r) => ({
		id: r.id,
		name: r.name,
		type: r.type,
		initialBalance: toNumber(r.initial_balance),
		balance: toNumber(r.initial_balance) + toNumber(r.in_sum) - toNumber(r.out_sum)
	}));
});
var createAccount_createServerFn_handler = createServerRpc({
	id: "10eb36b9c2c0f27bd16ced5e222e973f56bb94dada7684028f56773baf094688",
	name: "createAccount",
	filename: "src/lib/server/finance.ts"
}, (opts) => createAccount.__executeServer(opts));
var createAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createAccount_createServerFn_handler, async ({ context, data }) => {
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
var deleteAccount_createServerFn_handler = createServerRpc({
	id: "307a43cbbe2c3721ddc1240a6743d39fde8cc8ae82ef221970b83a7b4300d9b4",
	name: "deleteAccount",
	filename: "src/lib/server/finance.ts"
}, (opts) => deleteAccount.__executeServer(opts));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteAccount_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`update transactions set account_id = null where account_id = ${data.id} and user_id = ${context.userId}`;
	if (!(await sql`
      delete from accounts where id = ${data.id} and user_id = ${context.userId} returning id
    `)[0]) throw new Error("Conta não encontrada.");
	return { ok: true };
});
//#endregion
export { createAccount_createServerFn_handler, createCategory_createServerFn_handler, createTransaction_createServerFn_handler, deleteAccount_createServerFn_handler, deleteTransaction_createServerFn_handler, getDashboard_createServerFn_handler, listAccounts_createServerFn_handler, listCategories_createServerFn_handler, listTransactions_createServerFn_handler, updateTransaction_createServerFn_handler };
