import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIsoDate, toNumber } from "@/lib/utils";
import { logAudit, requireAdmin } from "./helpers";

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const now = new Date();
    const monthStart = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const totals = await sql<{
      users: number;
      active: number;
      newcomers: number;
      transactions: number;
      goals: number;
      accounts: number;
      errors: number;
    }>`
      select
        (select count(*)::int from profiles) as users,
        (select count(*)::int from profiles where is_active = true) as active,
        (select count(*)::int from profiles where created_at >= ${monthStart}::date) as newcomers,
        (select count(*)::int from transactions) as transactions,
        (select count(*)::int from goals) as goals,
        (select count(*)::int from accounts) as accounts,
        (select count(*)::int from system_errors where created_at >= now() - interval '7 days') as errors
    `;
    const growth = await sql<{ day: string; total: number }>`
      select to_char(created_at::date, 'YYYY-MM-DD') as day, count(*)::int as total
      from profiles
      where created_at >= now() - interval '30 days'
      group by created_at::date
      order by day
    `;
    await logAudit({
      actorUserId: context.userId,
      action: "admin.dashboard.view",
      result: "success",
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
      growth: growth.map((g) => ({ day: g.day, total: toNumber(g.total) })),
    };
  });

export const listUsersAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { query?: string }) => data)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const q = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
    const rows = await sql.query<{
      user_id: string;
      name: string;
      email: string;
      role: string;
      is_active: boolean;
      created_at: string;
      onboarding_completed: boolean;
    }>(
      `select p.user_id, u.name, u.email, p.role, p.is_active, p.created_at, p.onboarding_completed
       from profiles p
       join "user" u on u.id = p.user_id
       where ($1::text is null or lower(u.name) like $1 or lower(u.email) like $1)
       order by p.created_at desc
       limit 200`,
      [q],
    );
    return rows;
  });

export const updateUserAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { userId: string; isActive?: boolean; role?: "user" | "admin" }) => data)
  .handler(async ({ context, data }) => {
    const admin = await requireAdmin(context.userId);
    if (data.userId === context.userId && data.isActive === false) {
      throw new Error("Você não pode desativar a própria conta.");
    }
    if (data.userId === context.userId && data.role === "user") {
      throw new Error("Você não pode remover o próprio acesso administrativo.");
    }
    const sql = await getSql();
    if (typeof data.isActive === "boolean") {
      await sql`
        update profiles set is_active = ${data.isActive}, updated_at = now()
        where user_id = ${data.userId}
      `;
      if (!data.isActive) {
        await sql`delete from session where "userId" = ${data.userId}`;
      }
      await logAudit({
        actorUserId: admin.userId,
        action: data.isActive ? "admin.user.activate" : "admin.user.deactivate",
        result: "success",
        targetUserId: data.userId,
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
        details: data.role,
      });
    }
    return { ok: true as const };
  });

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<{
      id: string;
      actor_user_id: string | null;
      action: string;
      result: string;
      target_user_id: string | null;
      details: string | null;
      created_at: string;
      actor_email: string | null;
    }>`
      select a.id, a.actor_user_id, a.action, a.result, a.target_user_id, a.details, a.created_at, u.email as actor_email
      from audit_logs a
      left join "user" u on u.id = a.actor_user_id
      order by a.created_at desc
      limit 200
    `;
  });

export const listSystemErrors = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql<{ id: string; message: string; path: string | null; created_at: string }>`
      select id, message, path, created_at from system_errors
      order by created_at desc
      limit 100
    `;
  });

export const logAdminAuthEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { action: "admin.login" | "admin.logout"; result: "success" | "failure" }) => data)
  .handler(async ({ context, data }) => {
    const profile = await requireAdmin(context.userId);
    await logAudit({
      actorUserId: profile.userId,
      action: data.action,
      result: data.result,
    });
    return { ok: true as const };
  });
