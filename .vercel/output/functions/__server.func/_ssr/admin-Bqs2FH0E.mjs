import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as toNumber, r as toIsoDate } from "./utils-WuDAn4c5.mjs";
import { a as logAudit, o as requireAdmin } from "./helpers-Cvk6DR2i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bqs2FH0E.js
var getAdminDashboard_createServerFn_handler = createServerRpc({
	id: "36a0d6f1c97d92068a5f4a7080d0ecfcee4f0333332d0828686298ef670d6062",
	name: "getAdminDashboard",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminDashboard.__executeServer(opts));
var getAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminDashboard_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const now = /* @__PURE__ */ new Date();
	const totals = await sql`
      select
        (select count(*)::int from profiles) as users,
        (select count(*)::int from profiles where is_active = true) as active,
        (select count(*)::int from profiles where created_at >= ${toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1))}::date) as newcomers,
        (select count(*)::int from transactions) as transactions,
        (select count(*)::int from goals) as goals,
        (select count(*)::int from accounts) as accounts,
        (select count(*)::int from system_errors where created_at >= now() - interval '7 days') as errors
    `;
	const growth = await sql`
      select to_char(created_at::date, 'YYYY-MM-DD') as day, count(*)::int as total
      from profiles
      where created_at >= now() - interval '30 days'
      group by created_at::date
      order by day
    `;
	await logAudit({
		actorUserId: context.userId,
		action: "admin.dashboard.view",
		result: "success"
	});
	const t = totals[0];
	return {
		users: toNumber(t?.users),
		active: toNumber(t?.active),
		newcomers: toNumber(t?.newcomers),
		transactions: toNumber(t?.transactions),
		goals: toNumber(t?.goals),
		accounts: toNumber(t?.accounts),
		errors: toNumber(t?.errors),
		growth: growth.map((g) => ({
			day: g.day,
			total: toNumber(g.total)
		}))
	};
});
var listUsersAdmin_createServerFn_handler = createServerRpc({
	id: "2fb0171e9fa68cbd1250176d8f73c54fea6b67aead481796588fd815900d6f96",
	name: "listUsersAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => listUsersAdmin.__executeServer(opts));
var listUsersAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(listUsersAdmin_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const q = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
	return await sql.query(`select p.user_id, u.name, u.email, p.role, p.is_active, p.created_at, p.onboarding_completed
       from profiles p
       join "user" u on u.id = p.user_id
       where ($1::text is null or lower(u.name) like $1 or lower(u.email) like $1)
       order by p.created_at desc
       limit 200`, [q]);
});
var updateUserAdmin_createServerFn_handler = createServerRpc({
	id: "b752b2c6efc60f5f7c945c6b6b1c297476281fe8b5cdd4028d714bb7f4b2beaa",
	name: "updateUserAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => updateUserAdmin.__executeServer(opts));
var updateUserAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateUserAdmin_createServerFn_handler, async ({ context, data }) => {
	const admin = await requireAdmin(context.userId);
	if (data.userId === context.userId && data.isActive === false) throw new Error("Você não pode desativar a própria conta.");
	if (data.userId === context.userId && data.role === "user") throw new Error("Você não pode remover o próprio acesso administrativo.");
	const sql = await getSql();
	if (typeof data.isActive === "boolean") {
		await sql`
        update profiles set is_active = ${data.isActive}, updated_at = now()
        where user_id = ${data.userId}
      `;
		if (!data.isActive) await sql`delete from session where "userId" = ${data.userId}`;
		await logAudit({
			actorUserId: admin.userId,
			action: data.isActive ? "admin.user.activate" : "admin.user.deactivate",
			result: "success",
			targetUserId: data.userId
		});
	}
	if (data.role) {
		await sql`
        update profiles set role = ${data.role}, updated_at = now()
        where user_id = ${data.userId}
      `;
		await logAudit({
			actorUserId: admin.userId,
			action: "admin.user.role",
			result: "success",
			targetUserId: data.userId,
			details: data.role
		});
	}
	return { ok: true };
});
var listAuditLogs_createServerFn_handler = createServerRpc({
	id: "cefd777af2826db44231a01cba14377bee9dded3bb723f6de53499bba419454e",
	name: "listAuditLogs",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAuditLogs.__executeServer(opts));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAuditLogs_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await getSql())`
      select a.id, a.actor_user_id, a.action, a.result, a.target_user_id, a.details, a.created_at, u.email as actor_email
      from audit_logs a
      left join "user" u on u.id = a.actor_user_id
      order by a.created_at desc
      limit 200
    `;
});
var listSystemErrors_createServerFn_handler = createServerRpc({
	id: "6fcf4adb0fb777184ea039169e0bb5115e585583c841f269f5a28468ada83cc2",
	name: "listSystemErrors",
	filename: "src/lib/server/admin.ts"
}, (opts) => listSystemErrors.__executeServer(opts));
var listSystemErrors = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSystemErrors_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await getSql())`
      select id, message, path, created_at from system_errors
      order by created_at desc
      limit 100
    `;
});
var logAdminAuthEvent_createServerFn_handler = createServerRpc({
	id: "1d5bea2b9a4020bfcf1f136e0c03d5d121596e257e8866705b09b942bd0dd854",
	name: "logAdminAuthEvent",
	filename: "src/lib/server/admin.ts"
}, (opts) => logAdminAuthEvent.__executeServer(opts));
var logAdminAuthEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(logAdminAuthEvent_createServerFn_handler, async ({ context, data }) => {
	const profile = await requireAdmin(context.userId);
	await logAudit({
		actorUserId: profile.userId,
		action: data.action,
		result: data.result
	});
	return { ok: true };
});
//#endregion
export { getAdminDashboard_createServerFn_handler, listAuditLogs_createServerFn_handler, listSystemErrors_createServerFn_handler, listUsersAdmin_createServerFn_handler, logAdminAuthEvent_createServerFn_handler, updateUserAdmin_createServerFn_handler };
