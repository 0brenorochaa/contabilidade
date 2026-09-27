-- FinTrack application schema. Per-user rows always carry user_id TEXT.
-- Better Auth owns "user" / "session" / "account" / "verification".

create table if not exists profiles (
  user_id text primary key references "user" ("id") on delete cascade,
  phone text,
  monthly_income numeric(14, 2),
  financial_goal text,
  onboarding_completed boolean not null default false,
  role text not null default 'user',
  must_change_password boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_chk check (role in ('user', 'admin'))
);

create table if not exists categories (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  name text not null,
  kind text not null default 'expense',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_kind_chk check (kind in ('expense', 'income', 'both'))
);
create index if not exists categories_user_id_idx on categories (user_id);

create table if not exists accounts (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  name text not null,
  type text not null,
  initial_balance numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_type_chk check (type in ('banco', 'dinheiro', 'carteira_digital', 'poupanca', 'outra'))
);
create index if not exists accounts_user_id_idx on accounts (user_id);

create table if not exists transactions (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  type text not null,
  amount numeric(14, 2) not null,
  description text not null,
  occurred_on date not null,
  place text,
  category_id text references categories (id) on delete set null,
  account_id text references accounts (id) on delete set null,
  income_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_type_chk check (type in ('income', 'expense')),
  constraint transactions_amount_chk check (amount > 0)
);
create index if not exists transactions_user_id_idx on transactions (user_id);
create index if not exists transactions_user_date_idx on transactions (user_id, occurred_on desc);
create index if not exists transactions_user_type_idx on transactions (user_id, type);

create table if not exists budgets (
  id text primary key,
  user_id text not null unique references "user" ("id") on delete cascade,
  monthly_limit numeric(14, 2) not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_limit_chk check (monthly_limit > 0)
);

create table if not exists goals (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null,
  current_amount numeric(14, 2) not null default 0,
  deadline date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_target_chk check (target_amount > 0),
  constraint goals_current_chk check (current_amount >= 0)
);
create index if not exists goals_user_id_idx on goals (user_id);

create table if not exists goal_contributions (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  goal_id text not null references goals (id) on delete cascade,
  amount numeric(14, 2) not null,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now(),
  constraint goal_contributions_amount_chk check (amount > 0)
);
create index if not exists goal_contributions_user_id_idx on goal_contributions (user_id);
create index if not exists goal_contributions_goal_id_idx on goal_contributions (goal_id);

create table if not exists notifications (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  title text not null,
  body text not null,
  kind text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on notifications (user_id, created_at desc);

create table if not exists settings (
  user_id text primary key references "user" ("id") on delete cascade,
  theme text not null default 'system',
  currency text not null default 'BRL',
  date_format text not null default 'DD/MM/YYYY',
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint settings_theme_chk check (theme in ('light', 'dark', 'system'))
);

create table if not exists audit_logs (
  id text primary key,
  actor_user_id text,
  action text not null,
  result text not null,
  target_user_id text,
  details text,
  created_at timestamptz not null default now(),
  constraint audit_logs_result_chk check (result in ('success', 'failure'))
);
create index if not exists audit_logs_created_at_idx on audit_logs (created_at desc);

create table if not exists password_reset_tokens (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists password_reset_tokens_hash_idx on password_reset_tokens (token_hash);

create table if not exists system_errors (
  id text primary key,
  message text not null,
  path text,
  created_at timestamptz not null default now()
);
create index if not exists system_errors_created_at_idx on system_errors (created_at desc);
