import { r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as toNumber, n as newId } from "./utils-WuDAn4c5.mjs";
import { n as hashPassword$1 } from "./password-LrodHk_g.mjs";
import { a as logAudit, i as loadProfile, n as ensureUserWorkspace, r as hashToken, s as seedAdmin } from "./helpers-Cvk6DR2i.mjs";
import { a as incomeSourceLabel, i as formatMoney, n as formatDateBR } from "./format-ByvtKy4h.mjs";
import { i as normalizePhone, r as isValidPhone, t as isStrongPassword } from "./password-BFD6B2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-CT9dpl1y.js
function escapePdfText(text) {
	return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function buildSimplePdf(title, lines) {
	const header = "%PDF-1.4\n";
	const wrapped = [];
	for (const line of lines) {
		const chunks = line.length > 92 ? line.match(/.{1,92}/g) ?? [line] : [line];
		wrapped.push(...chunks);
	}
	const stream = `BT /F1 16 Tf 48 780 Td ${[
		`(${escapePdfText(title)}) Tj`,
		"0 -22 Td",
		...wrapped.flatMap((l, i) => {
			const cmd = [`(${escapePdfText(l)}) Tj`];
			if (i < wrapped.length - 1) cmd.push("0 -14 Td");
			return cmd;
		})
	].join(" ")} ET`;
	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
		`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
	];
	let offset = 9;
	const xref = [
		"xref",
		"0 6",
		"0000000000 65535 f "
	];
	let body = "";
	objects.forEach((obj, i) => {
		xref.push(`${String(offset).padStart(10, "0")} 00000 n `);
		const chunk = `${i + 1} 0 obj\n${obj}\nendobj\n`;
		body += chunk;
		offset += chunk.length;
	});
	const xrefStart = 9 + body.length;
	const tail = `${xref.join("\n")}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
	return new TextEncoder().encode(header + body + tail);
}
var buckets = /* @__PURE__ */ new Map();
function rateLimit(key, max, windowMs) {
	const now = Date.now();
	const current = buckets.get(key);
	if (!current || current.resetAt < now) {
		buckets.set(key, {
			count: 1,
			resetAt: now + windowMs
		});
		return true;
	}
	if (current.count >= max) return false;
	current.count += 1;
	return true;
}
var bootstrapApp_createServerFn_handler = createServerRpc({
	id: "eb4deefc910625e3c2922b2ca1ff7e9b60e903af91b81f1095b689edeecafab2",
	name: "bootstrapApp",
	filename: "src/lib/server/user.ts"
}, (opts) => bootstrapApp.__executeServer(opts));
var bootstrapApp = createServerFn({ method: "POST" }).handler(bootstrapApp_createServerFn_handler, async () => {
	await seedAdmin();
	return { ok: true };
});
var getMe_createServerFn_handler = createServerRpc({
	id: "e24b84f6107950e4c242209ad8eec7226d939eb1de5137b410acd5b96dc18d53",
	name: "getMe",
	filename: "src/lib/server/user.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	await seedAdmin();
	await ensureUserWorkspace(context.userId);
	const profile = await loadProfile(context.userId);
	if (!profile) throw new Error("Perfil não encontrado.");
	if (!profile.isActive) throw new Error("Conta desativada.");
	return profile;
});
var savePhone_createServerFn_handler = createServerRpc({
	id: "42762a0dd15439420dd1857dc8662866dcddf5dae53e2b593e4164c9d41dafb9",
	name: "savePhone",
	filename: "src/lib/server/user.ts"
}, (opts) => savePhone.__executeServer(opts));
var savePhone = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(savePhone_createServerFn_handler, async ({ context, data }) => {
	if (!isValidPhone(data.phone)) throw new Error("Informe um telefone válido.");
	await (await getSql())`
      update profiles
      set phone = ${normalizePhone(data.phone)}, updated_at = now()
      where user_id = ${context.userId}
    `;
	return loadProfile(context.userId);
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "2afc58f2e961aeb80146aaf9a3269ced6025b87cbcffa8bdbda0b0f9b9237ad4",
	name: "completeOnboarding",
	filename: "src/lib/server/user.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	if (!(data.monthlyIncome >= 0) || !Number.isFinite(data.monthlyIncome)) throw new Error("Informe uma renda mensal válida.");
	await (await getSql())`
      update profiles
      set monthly_income = ${data.monthlyIncome},
          financial_goal = ${data.financialGoal},
          onboarding_completed = true,
          updated_at = now()
      where user_id = ${context.userId}
    `;
	return loadProfile(context.userId);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "70f7e0d6d1208b4cbf51a55c650316c64674d3c46651ffe197bc28dd2daa0d6d",
	name: "updateProfile",
	filename: "src/lib/server/user.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const name = data.name.trim();
	if (name.length < 2) throw new Error("Informe seu nome.");
	if (data.phone && !isValidPhone(data.phone)) throw new Error("Informe um telefone válido.");
	const sql = await getSql();
	await sql`update "user" set name = ${name}, "updatedAt" = now() where id = ${context.userId}`;
	await sql`
      update profiles
      set phone = ${data.phone ? normalizePhone(data.phone) : null},
          monthly_income = ${data.monthlyIncome},
          financial_goal = ${data.financialGoal},
          updated_at = now()
      where user_id = ${context.userId}
    `;
	return loadProfile(context.userId);
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "26e7b6aab0ad63a2232ef2641f5dfb19d7bf028ebe66b7261189bf1d8dfae289",
	name: "updateSettings",
	filename: "src/lib/server/user.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.theme) await sql`update settings set theme = ${data.theme}, updated_at = now() where user_id = ${context.userId}`;
	if (typeof data.notificationsEnabled === "boolean") await sql`
        update settings
        set notifications_enabled = ${data.notificationsEnabled}, updated_at = now()
        where user_id = ${context.userId}
      `;
	return loadProfile(context.userId);
});
var markPasswordChanged_createServerFn_handler = createServerRpc({
	id: "a227e1f4199a29004cba8866f7f4a83cbd3d7e0031e52822815c808e521bdbcd",
	name: "markPasswordChanged",
	filename: "src/lib/server/user.ts"
}, (opts) => markPasswordChanged.__executeServer(opts));
var markPasswordChanged = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markPasswordChanged_createServerFn_handler, async ({ context }) => {
	await (await getSql())`
      update profiles
      set must_change_password = false, updated_at = now()
      where user_id = ${context.userId}
    `;
	await logAudit({
		actorUserId: context.userId,
		action: "password.change",
		result: "success"
	});
	return { ok: true };
});
var revokeAllSessions_createServerFn_handler = createServerRpc({
	id: "50b38b631a442d7fcaf9b06dd4bb3efd7c35eeffca2eba62f0c05f78d0858c58",
	name: "revokeAllSessions",
	filename: "src/lib/server/user.ts"
}, (opts) => revokeAllSessions.__executeServer(opts));
var revokeAllSessions = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(revokeAllSessions_createServerFn_handler, async ({ context }) => {
	await (await getSql())`delete from session where "userId" = ${context.userId}`;
	await logAudit({
		actorUserId: context.userId,
		action: "session.revoke_all",
		result: "success"
	});
	return { ok: true };
});
var requestPasswordReset_createServerFn_handler = createServerRpc({
	id: "711340b9dd018cae1f6f4d42e888880dae9eee480163bae1504c47ddc10fde21",
	name: "requestPasswordReset",
	filename: "src/lib/server/user.ts"
}, (opts) => requestPasswordReset.__executeServer(opts));
var requestPasswordReset = createServerFn({ method: "POST" }).validator((data) => data).handler(requestPasswordReset_createServerFn_handler, async ({ data }) => {
	if (!rateLimit(`reset:${data.email.toLowerCase()}`, 5, 9e5)) throw new Error("Muitas tentativas. Aguarde alguns minutos.");
	const generic = {
		ok: true,
		token: null
	};
	const sql = await getSql();
	const user = (await sql`
      select id from "user" where lower(email) = ${data.email.trim().toLowerCase()} limit 1
    `)[0];
	if (!user) return generic;
	const phone = (await sql`
      select phone from profiles where user_id = ${user.id} limit 1
    `)[0]?.phone;
	if (!phone || normalizePhone(data.phone) !== normalizePhone(phone)) return generic;
	const token = newId().replace(/-/g, "") + newId().replace(/-/g, "").slice(0, 8);
	await sql`
      insert into password_reset_tokens (id, user_id, token_hash, expires_at)
      values (${newId()}, ${user.id}, ${hashToken(token)}, now() + interval '30 minutes')
    `;
	return {
		ok: true,
		token
	};
});
var confirmPasswordReset_createServerFn_handler = createServerRpc({
	id: "eea59c053ef9abc18dcaa077fcca69fe5490f289052e33ebfb12da020b1aa87f",
	name: "confirmPasswordReset",
	filename: "src/lib/server/user.ts"
}, (opts) => confirmPasswordReset.__executeServer(opts));
var confirmPasswordReset = createServerFn({ method: "POST" }).validator((data) => data).handler(confirmPasswordReset_createServerFn_handler, async ({ data }) => {
	if (!isStrongPassword(data.password)) throw new Error("A nova senha não atende aos requisitos de segurança.");
	const sql = await getSql();
	const row = (await sql`
      select id, user_id from password_reset_tokens
      where token_hash = ${hashToken(data.token)}
        and used_at is null
        and expires_at > now()
      limit 1
    `)[0];
	if (!row) throw new Error("Não foi possível redefinir a senha. Verifique os dados informados.");
	if (!(await sql`
      update account
      set password = ${await hashPassword$1(data.password)}, "updatedAt" = now()
      where "userId" = ${row.user_id} and "providerId" = 'credential'
      returning id
    `)[0]) throw new Error("Esta conta não possui senha local.");
	await sql`update password_reset_tokens set used_at = now() where id = ${row.id}`;
	await sql`delete from session where "userId" = ${row.user_id}`;
	await logAudit({
		actorUserId: row.user_id,
		action: "password.reset",
		result: "success"
	});
	return { ok: true };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "b9240a8b634e20ac46a9db5016d9f599a7ae690149cc45224a57ed1bec9a7abf",
	name: "listNotifications",
	filename: "src/lib/server/user.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, title, body, kind, read_at, created_at
      from notifications
      where user_id = ${context.userId}
      order by created_at desc
      limit 50
    `;
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "0e9dc92c3f3aed591d44f8add7a17263b72bca735939ad87a90bb597b47c7eb0",
	name: "markNotificationsRead",
	filename: "src/lib/server/user.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`
      update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null
    `;
	return { ok: true };
});
var exportMyData_createServerFn_handler = createServerRpc({
	id: "2a7762ddc3c799479176297d62c0f9daf302495b8e23a90ae3df225d03dc194d",
	name: "exportMyData",
	filename: "src/lib/server/user.ts"
}, (opts) => exportMyData.__executeServer(opts));
var exportMyData = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(exportMyData_createServerFn_handler, async ({ context, data }) => {
	const profile = await loadProfile(context.userId);
	if (!profile) throw new Error("Perfil não encontrado.");
	const sql = await getSql();
	const txs = await sql`
      select t.type, t.amount, t.description, t.occurred_on, t.place, t.income_source, c.name as category
      from transactions t
      left join categories c on c.id = t.category_id and c.user_id = t.user_id
      where t.user_id = ${context.userId}
      order by t.occurred_on desc, t.created_at desc
    `;
	const goals = await sql`
      select name, target_amount, current_amount, deadline
      from goals where user_id = ${context.userId}
      order by created_at desc
    `;
	if (data.format === "csv") return {
		filename: "fintrack-export.csv",
		mime: "text/csv;charset=utf-8",
		content: `\uFEFF${[
			"tipo,descricao,local,categoria,data,valor,origem",
			...txs.map((t) => [
				t.type === "income" ? "receita" : "despesa",
				csv(t.description),
				csv(t.place ?? ""),
				csv(t.category ?? ""),
				t.occurred_on,
				toNumber(t.amount).toFixed(2),
				csv(t.income_source ? incomeSourceLabel(t.income_source) : "")
			].join(",")),
			"",
			"meta,valor_atual,valor_alvo,prazo",
			...goals.map((g) => [
				csv(g.name),
				toNumber(g.current_amount).toFixed(2),
				toNumber(g.target_amount).toFixed(2),
				g.deadline ?? ""
			].join(","))
		].join("\n")}`
	};
	const bytes = buildSimplePdf("FinTrack - Exportacao", [
		`Nome: ${profile.name}`,
		`E-mail: ${profile.email}`,
		`Telefone: ${profile.phone ?? "-"}`,
		"",
		"Movimentacoes",
		...txs.map((t) => `${formatDateBR(t.occurred_on)} | ${t.type === "income" ? "Receita" : "Despesa"} | ${t.description} | ${formatMoney(toNumber(t.amount))}`),
		"",
		"Metas",
		...goals.map((g) => `${g.name}: ${formatMoney(toNumber(g.current_amount))} / ${formatMoney(toNumber(g.target_amount))}`)
	]);
	return {
		filename: "fintrack-export.pdf",
		mime: "application/pdf",
		content: Buffer.from(bytes).toString("base64"),
		encoding: "base64"
	};
});
var deleteMyAccount_createServerFn_handler = createServerRpc({
	id: "8c3a37e976f41e7733c0932240adfd595d2c8eb872301302ab1a9fafd587bb2b",
	name: "deleteMyAccount",
	filename: "src/lib/server/user.ts"
}, (opts) => deleteMyAccount.__executeServer(opts));
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(deleteMyAccount_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	if ((await loadProfile(context.userId))?.role === "admin") throw new Error("A conta administrativa não pode ser excluída por este fluxo.");
	await sql`delete from "user" where id = ${context.userId}`;
	await logAudit({
		actorUserId: context.userId,
		action: "account.delete",
		result: "success"
	});
	return { ok: true };
});
function csv(value) {
	if (/[",\n]/.test(value)) return `"${value.replace(/"/g, "\"\"")}"`;
	return value;
}
//#endregion
export { bootstrapApp_createServerFn_handler, completeOnboarding_createServerFn_handler, confirmPasswordReset_createServerFn_handler, deleteMyAccount_createServerFn_handler, exportMyData_createServerFn_handler, getMe_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, markPasswordChanged_createServerFn_handler, requestPasswordReset_createServerFn_handler, revokeAllSessions_createServerFn_handler, savePhone_createServerFn_handler, updateProfile_createServerFn_handler, updateSettings_createServerFn_handler };
