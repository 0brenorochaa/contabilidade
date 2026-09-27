import { createHash } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { newId, toNumber } from "@/lib/utils";

export function adminConfig() {
  return {
    username: env("ADMIN_USERNAME") ?? "admin",
    email: (env("ADMIN_EMAIL") ?? "admin@fintrack.local").toLowerCase(),
    password: env("ADMIN_INITIAL_PASSWORD") ?? "FinTrack@Admin2026!",
  };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function logAudit(input: {
  actorUserId?: string | null;
  action: string;
  result: "success" | "failure";
  targetUserId?: string | null;
  details?: string;
}) {
  const sql = await getSql();
  await sql`
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

export async function logSystemError(message: string, path?: string) {
  try {
    const sql = await getSql();
    await sql`
      insert into system_errors (id, message, path)
      values (${newId()}, ${message.slice(0, 500)}, ${path ?? null})
    `;
  } catch {
    /* never throw from logger */
  }
}

export async function seedAdmin() {
  const sql = await getSql();
  const cfg = adminConfig();
  const existing = await sql<{ id: string }>`
    select id from "user" where lower(email) = ${cfg.email} limit 1
  `;
  if (existing[0]) {
    const profile = await sql<{ role: string }>`
      select role from profiles where user_id = ${existing[0].id} limit 1
    `;
    if (!profile[0]) {
      await createProfileRow(existing[0].id, {
        role: "admin",
        onboardingCompleted: true,
        mustChangePassword: true,
      });
    }
    return;
  }

  const userId = newId();
  const now = new Date().toISOString();
  await sql`
    insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
    values (${userId}, ${cfg.username}, ${cfg.email}, true, ${now}::timestamptz, ${now}::timestamptz)
  `;
  const hashed = await hashPassword(cfg.password);
  await sql`
    insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
    values (${newId()}, ${userId}, 'credential', ${userId}, ${hashed}, ${now}::timestamptz, ${now}::timestamptz)
  `;
  await createProfileRow(userId, {
    role: "admin",
    onboardingCompleted: true,
    mustChangePassword: true,
  });
  await logAudit({
    actorUserId: userId,
    action: "admin.bootstrap",
    result: "success",
    details: "Administrador inicial criado",
  });
}

async function createProfileRow(
  userId: string,
  opts: { role: "user" | "admin"; onboardingCompleted: boolean; mustChangePassword: boolean; phone?: string | null },
) {
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
  const existingCats = await sql<{ id: string }>`
    select id from categories where user_id = ${userId} limit 1
  `;
  if (!existingCats[0]) {
    for (const name of DEFAULT_CATEGORIES) {
      await sql`
        insert into categories (id, user_id, name, kind, is_default)
        values (${newId()}, ${userId}, ${name}, 'expense', true)
      `;
    }
  }
}

export async function ensureUserWorkspace(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from profiles where user_id = ${userId} limit 1
  `;
  if (!rows[0]) {
    await createProfileRow(userId, {
      role: "user",
      onboardingCompleted: false,
      mustChangePassword: false,
    });
  }
}

export type ProfileDTO = {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  monthlyIncome: number | null;
  financialGoal: string | null;
  onboardingCompleted: boolean;
  role: "user" | "admin";
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
  theme: "light" | "dark" | "system";
  currency: string;
  dateFormat: string;
  notificationsEnabled: boolean;
};

export async function loadProfile(userId: string): Promise<ProfileDTO | null> {
  await ensureUserWorkspace(userId);
  const sql = await getSql();
  const rows = await sql<{
    user_id: string;
    name: string;
    email: string;
    phone: string | null;
    monthly_income: string | number | null;
    financial_goal: string | null;
    onboarding_completed: boolean;
    role: "user" | "admin";
    must_change_password: boolean;
    is_active: boolean;
    created_at: string;
    theme: "light" | "dark" | "system";
    currency: string;
    date_format: string;
    notifications_enabled: boolean;
  }>`
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
  `;
  const row = rows[0];
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
    notificationsEnabled: Boolean(row.notifications_enabled),
  };
}

export async function requireAdmin(userId: string): Promise<ProfileDTO> {
  const profile = await loadProfile(userId);
  if (!profile || profile.role !== "admin" || !profile.isActive) {
    throw new Error("Acesso administrativo não autorizado.");
  }
  return profile;
}

export async function addNotification(input: {
  userId: string;
  title: string;
  body: string;
  kind: string;
}) {
  const sql = await getSql();
  const settings = await sql<{ notifications_enabled: boolean }>`
    select notifications_enabled from settings where user_id = ${input.userId} limit 1
  `;
  if (settings[0] && !settings[0].notifications_enabled) return;
  const dup = await sql<{ id: string }>`
    select id from notifications
    where user_id = ${input.userId}
      and kind = ${input.kind}
      and title = ${input.title}
      and read_at is null
      and created_at > now() - interval '2 days'
    limit 1
  `;
  if (dup[0]) return;
  await sql`
    insert into notifications (id, user_id, title, body, kind)
    values (${newId()}, ${input.userId}, ${input.title}, ${input.body}, ${input.kind})
  `;
}
