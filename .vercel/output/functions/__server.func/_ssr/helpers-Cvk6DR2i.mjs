import { i as getSql } from "./middleware-B897pzxd.mjs";
import { i as toNumber, n as newId } from "./utils-WuDAn4c5.mjs";
import { n as hashPassword$1, t as env } from "./password-LrodHk_g.mjs";
import { i as DEFAULT_CATEGORIES } from "./constants-aV2RQtvO.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-Cvk6DR2i.js
function adminConfig() {
	return {
		username: env("ADMIN_USERNAME") ?? "admin",
		email: (env("ADMIN_EMAIL") ?? "admin@fintrack.local").toLowerCase(),
		password: env("ADMIN_INITIAL_PASSWORD") ?? "FinTrack@Admin2026!"
	};
}
function hashToken(token) {
	return createHash("sha256").update(token).digest("hex");
}
async function logAudit(input) {
	await (await getSql())`
    insert into audit_logs (id, actor_user_id, action, result, target_user_id, details)
    values (
      ${newId()},
      ${input.actorUserId ?? null},
      ${input.action},
      ${input.result},
      ${input.targetUserId ?? null},
      ${input.details ?? null}
    )
  `;
}
async function seedAdmin() {
	const sql = await getSql();
	const cfg = adminConfig();
	const existing = await sql`
    select id from "user" where lower(email) = ${cfg.email} limit 1
  `;
	if (existing[0]) {
		if (!(await sql`
      select role from profiles where user_id = ${existing[0].id} limit 1
    `)[0]) await createProfileRow(existing[0].id, {
			role: "admin",
			onboardingCompleted: true,
			mustChangePassword: true
		});
		return;
	}
	const userId = newId();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await sql`
    insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
    values (${userId}, ${cfg.username}, ${cfg.email}, true, ${now}::timestamptz, ${now}::timestamptz)
  `;
	const hashed = await hashPassword$1(cfg.password);
	await sql`
    insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
    values (${newId()}, ${userId}, 'credential', ${userId}, ${hashed}, ${now}::timestamptz, ${now}::timestamptz)
  `;
	await createProfileRow(userId, {
		role: "admin",
		onboardingCompleted: true,
		mustChangePassword: true
	});
	await logAudit({
		actorUserId: userId,
		action: "admin.bootstrap",
		result: "success",
		details: "Administrador inicial criado"
	});
}
async function createProfileRow(userId, opts) {
	const sql = await getSql();
	await sql`
    insert into profiles (
      user_id, phone, role, onboarding_completed, must_change_password, is_active
    ) values (
      ${userId},
      ${opts.phone ?? null},
      ${opts.role},
      ${opts.onboardingCompleted},
      ${opts.mustChangePassword},
      true
    )
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into settings (user_id) values (${userId})
    on conflict (user_id) do nothing
  `;
	if (!(await sql`
    select id from categories where user_id = ${userId} limit 1
  `)[0]) for (const name of DEFAULT_CATEGORIES) await sql`
        insert into categories (id, user_id, name, kind, is_default)
        values (${newId()}, ${userId}, ${name}, 'expense', true)
      `;
}
async function ensureUserWorkspace(userId) {
	if (!(await (await getSql())`
    select user_id from profiles where user_id = ${userId} limit 1
  `)[0]) await createProfileRow(userId, {
		role: "user",
		onboardingCompleted: false,
		mustChangePassword: false
	});
}
async function loadProfile(userId) {
	await ensureUserWorkspace(userId);
	const row = (await (await getSql())`
    select
      p.user_id,
      u.name,
      u.email,
      p.phone,
      p.monthly_income,
      p.financial_goal,
      p.onboarding_completed,
      p.role,
      p.must_change_password,
      p.is_active,
      p.created_at,
      s.theme,
      s.currency,
      s.date_format,
      s.notifications_enabled
    from profiles p
    join "user" u on u.id = p.user_id
    join settings s on s.user_id = p.user_id
    where p.user_id = ${userId}
    limit 1
  `)[0];
	if (!row) return null;
	return {
		userId: row.user_id,
		name: row.name,
		email: row.email,
		phone: row.phone,
		monthlyIncome: row.monthly_income == null ? null : toNumber(row.monthly_income),
		financialGoal: row.financial_goal,
		onboardingCompleted: Boolean(row.onboarding_completed),
		role: row.role,
		mustChangePassword: Boolean(row.must_change_password),
		isActive: Boolean(row.is_active),
		createdAt: String(row.created_at),
		theme: row.theme,
		currency: row.currency,
		dateFormat: row.date_format,
		notificationsEnabled: Boolean(row.notifications_enabled)
	};
}
async function requireAdmin(userId) {
	const profile = await loadProfile(userId);
	if (!profile || profile.role !== "admin" || !profile.isActive) throw new Error("Acesso administrativo não autorizado.");
	return profile;
}
async function addNotification(input) {
	const sql = await getSql();
	const settings = await sql`
    select notifications_enabled from settings where user_id = ${input.userId} limit 1
  `;
	if (settings[0] && !settings[0].notifications_enabled) return;
	if ((await sql`
    select id from notifications
    where user_id = ${input.userId}
      and kind = ${input.kind}
      and title = ${input.title}
      and read_at is null
      and created_at > now() - interval '2 days'
    limit 1
  `)[0]) return;
	await sql`
    insert into notifications (id, user_id, title, body, kind)
    values (${newId()}, ${input.userId}, ${input.title}, ${input.body}, ${input.kind})
  `;
}
//#endregion
export { logAudit as a, loadProfile as i, ensureUserWorkspace as n, requireAdmin as o, hashToken as r, seedAdmin as s, addNotification as t };
