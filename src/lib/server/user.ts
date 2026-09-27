import { createServerFn } from "@tanstack/react-start";
import { hashPassword } from "better-auth/crypto";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { isStrongPassword, isValidPhone, normalizePhone } from "@/lib/finance/password";
import { formatDateBR, formatMoney, incomeSourceLabel } from "@/lib/format";
import { buildSimplePdf } from "@/lib/pdf";
import { rateLimit } from "@/lib/rate-limit";
import { newId, toNumber } from "@/lib/utils";
import {
  ensureUserWorkspace,
  hashToken,
  loadProfile,
  logAudit,
  seedAdmin,
} from "./helpers";

export const bootstrapApp = createServerFn({ method: "POST" }).handler(async () => {
  await seedAdmin();
  return { ok: true as const };
});

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await seedAdmin();
    await ensureUserWorkspace(context.userId);
    const profile = await loadProfile(context.userId);
    if (!profile) throw new Error("Perfil não encontrado.");
    if (!profile.isActive) throw new Error("Conta desativada.");
    return profile;
  });

export const savePhone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { phone: string }) => data)
  .handler(async ({ context, data }) => {
    if (!isValidPhone(data.phone)) throw new Error("Informe um telefone válido.");
    const sql = await getSql();
    await sql`
      update profiles
      set phone = ${normalizePhone(data.phone)}, updated_at = now()
      where user_id = ${context.userId}
    `;
    return loadProfile(context.userId);
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { monthlyIncome: number; financialGoal: string }) => data)
  .handler(async ({ context, data }) => {
    if (!(data.monthlyIncome >= 0) || !Number.isFinite(data.monthlyIncome)) {
      throw new Error("Informe uma renda mensal válida.");
    }
    const sql = await getSql();
    await sql`
      update profiles
      set monthly_income = ${data.monthlyIncome},
          financial_goal = ${data.financialGoal},
          onboarding_completed = true,
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return loadProfile(context.userId);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; phone: string; monthlyIncome: number | null; financialGoal: string | null }) => data)
  .handler(async ({ context, data }) => {
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

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    theme?: "light" | "dark" | "system";
    notificationsEnabled?: boolean;
  }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.theme) {
      await sql`update settings set theme = ${data.theme}, updated_at = now() where user_id = ${context.userId}`;
    }
    if (typeof data.notificationsEnabled === "boolean") {
      await sql`
        update settings
        set notifications_enabled = ${data.notificationsEnabled}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    return loadProfile(context.userId);
  });

export const markPasswordChanged = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      update profiles
      set must_change_password = false, updated_at = now()
      where user_id = ${context.userId}
    `;
    await logAudit({
      actorUserId: context.userId,
      action: "password.change",
      result: "success",
    });
    return { ok: true as const };
  });

export const revokeAllSessions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`delete from session where "userId" = ${context.userId}`;
    await logAudit({
      actorUserId: context.userId,
      action: "session.revoke_all",
      result: "success",
    });
    return { ok: true as const };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: { email: string; phone: string }) => data)
  .handler(async ({ data }) => {
    if (!rateLimit(`reset:${data.email.toLowerCase()}`, 5, 15 * 60 * 1000)) {
      throw new Error("Muitas tentativas. Aguarde alguns minutos.");
    }
    const generic = { ok: true as const, token: null as string | null };
    const sql = await getSql();
    const users = await sql<{ id: string }>`
      select id from "user" where lower(email) = ${data.email.trim().toLowerCase()} limit 1
    `;
    const user = users[0];
    if (!user) return generic;
    const profiles = await sql<{ phone: string | null }>`
      select phone from profiles where user_id = ${user.id} limit 1
    `;
    const phone = profiles[0]?.phone;
    if (!phone || normalizePhone(data.phone) !== normalizePhone(phone)) return generic;
    const token = newId().replace(/-/g, "") + newId().replace(/-/g, "").slice(0, 8);
    await sql`
      insert into password_reset_tokens (id, user_id, token_hash, expires_at)
      values (${newId()}, ${user.id}, ${hashToken(token)}, now() + interval '30 minutes')
    `;
    // Token is returned only after email + phone match (identity proof without SMTP).
    return { ok: true as const, token };
  });

export const confirmPasswordReset = createServerFn({ method: "POST" })
  .validator((data: { token: string; password: string }) => data)
  .handler(async ({ data }) => {
    if (!isStrongPassword(data.password)) {
      throw new Error("A nova senha não atende aos requisitos de segurança.");
    }
    const sql = await getSql();
    const rows = await sql<{ id: string; user_id: string }>`
      select id, user_id from password_reset_tokens
      where token_hash = ${hashToken(data.token)}
        and used_at is null
        and expires_at > now()
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Não foi possível redefinir a senha. Verifique os dados informados.");
    const hashed = await hashPassword(data.password);
    const updated = await sql`
      update account
      set password = ${hashed}, "updatedAt" = now()
      where "userId" = ${row.user_id} and "providerId" = 'credential'
      returning id
    `;
    if (!updated[0]) throw new Error("Esta conta não possui senha local.");
    await sql`update password_reset_tokens set used_at = now() where id = ${row.id}`;
    await sql`delete from session where "userId" = ${row.user_id}`;
    await logAudit({
      actorUserId: row.user_id,
      action: "password.reset",
      result: "success",
    });
    return { ok: true as const };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      title: string;
      body: string;
      kind: string;
      read_at: string | null;
      created_at: string;
    }>`
      select id, title, body, kind, read_at, created_at
      from notifications
      where user_id = ${context.userId}
      order by created_at desc
      limit 50
    `;
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null
    `;
    return { ok: true as const };
  });

export const exportMyData = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { format: "csv" | "pdf" }) => data)
  .handler(async ({ context, data }) => {
    const profile = await loadProfile(context.userId);
    if (!profile) throw new Error("Perfil não encontrado.");
    const sql = await getSql();
    const txs = await sql<{
      type: string;
      amount: string | number;
      description: string;
      occurred_on: string;
      place: string | null;
      income_source: string | null;
      category: string | null;
    }>`
      select t.type, t.amount, t.description, t.occurred_on, t.place, t.income_source, c.name as category
      from transactions t
      left join categories c on c.id = t.category_id and c.user_id = t.user_id
      where t.user_id = ${context.userId}
      order by t.occurred_on desc, t.created_at desc
    `;
    const goals = await sql<{
      name: string;
      target_amount: string | number;
      current_amount: string | number;
      deadline: string | null;
    }>`
      select name, target_amount, current_amount, deadline
      from goals where user_id = ${context.userId}
      order by created_at desc
    `;

    if (data.format === "csv") {
      const lines = [
        "tipo,descricao,local,categoria,data,valor,origem",
        ...txs.map((t) =>
          [
            t.type === "income" ? "receita" : "despesa",
            csv(t.description),
            csv(t.place ?? ""),
            csv(t.category ?? ""),
            t.occurred_on,
            toNumber(t.amount).toFixed(2),
            csv(t.income_source ? incomeSourceLabel(t.income_source) : ""),
          ].join(","),
        ),
        "",
        "meta,valor_atual,valor_alvo,prazo",
        ...goals.map((g) =>
          [csv(g.name), toNumber(g.current_amount).toFixed(2), toNumber(g.target_amount).toFixed(2), g.deadline ?? ""].join(","),
        ),
      ];
      const csvText = `\uFEFF${lines.join("\n")}`;
      return {
        filename: "fintrack-export.csv",
        mime: "text/csv;charset=utf-8",
        content: csvText,
      };
    }

    const lines = [
      `Nome: ${profile.name}`,
      `E-mail: ${profile.email}`,
      `Telefone: ${profile.phone ?? "-"}`,
      "",
      "Movimentacoes",
      ...txs.map(
        (t) =>
          `${formatDateBR(t.occurred_on)} | ${t.type === "income" ? "Receita" : "Despesa"} | ${t.description} | ${formatMoney(toNumber(t.amount))}`,
      ),
      "",
      "Metas",
      ...goals.map(
        (g) =>
          `${g.name}: ${formatMoney(toNumber(g.current_amount))} / ${formatMoney(toNumber(g.target_amount))}`,
      ),
    ];
    const bytes = buildSimplePdf("FinTrack - Exportacao", lines);
    return {
      filename: "fintrack-export.pdf",
      mime: "application/pdf",
      content: Buffer.from(bytes).toString("base64"),
      encoding: "base64" as const,
    };
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await loadProfile(context.userId);
    if (profile?.role === "admin") {
      throw new Error("A conta administrativa não pode ser excluída por este fluxo.");
    }
    await sql`delete from "user" where id = ${context.userId}`;
    await logAudit({
      actorUserId: context.userId,
      action: "account.delete",
      result: "success",
    });
    return { ok: true as const };
  });

function csv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
