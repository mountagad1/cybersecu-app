-- No-login + quota + one-time-payment pivot (docs/decisions/0005).
--
-- REJOUABLE : tables et index gardés, colonne ajoutée conditionnellement, et
-- la contrainte XOR n'est posée que si elle n'existe pas — `add constraint`
-- n'accepte pas `if not exists` en Postgres 16.
-- Adds anonymous sessions, a server-authoritative simulation quota, and
-- the Stripe entitlement/purchase/recovery schema. The previously-built
-- authenticated path (attempts.user_id -> auth.users) is preserved.

-- ============================================================
-- Anonymous sessions
-- ============================================================

create table if not exists anonymous_sessions (
  id uuid primary key default gen_random_uuid(),
  quota_limit int not null default 10,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- ============================================================
-- attempts: support anonymous OR authenticated ownership
-- ============================================================

-- `alter column drop not null` est déjà idempotent ; la colonne et la
-- contrainte ne le sont pas et sont donc gardées séparément.
alter table attempts alter column user_id drop not null;

alter table attempts
  add column if not exists anonymous_session_id uuid references anonymous_sessions (id) on delete cascade;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'attempts_owner_xor'
  ) then
    alter table attempts add constraint attempts_owner_xor check (
      (user_id is not null) <> (anonymous_session_id is not null)
    );
  end if;
end $$;

create index if not exists attempts_anonymous_session_idx on attempts (anonymous_session_id);

-- ============================================================
-- Simulation usage (quota accounting) — one row per answered attempt,
-- written in the same server action that grades the attempt so usage
-- and grading can never drift apart (docs/SIMULATION_QUOTA.md §2-3).
-- ============================================================

create table if not exists simulation_usage (
  id uuid primary key default gen_random_uuid(),
  anonymous_session_id uuid references anonymous_sessions (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  attempt_id uuid not null unique references attempts (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint simulation_usage_owner_xor check (
    (user_id is not null) <> (anonymous_session_id is not null)
  )
);

create index if not exists simulation_usage_anonymous_session_idx on simulation_usage (anonymous_session_id);
create index if not exists simulation_usage_user_idx on simulation_usage (user_id);

-- ============================================================
-- Entitlements (docs/PAYMENT_ENTITLEMENT.md)
-- ============================================================

create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  -- `restrict`, not `set null`: an entitlement always needs exactly one
  -- owner (see the xor check below) — `set null` would leave a row with
  -- neither owner set and violate that constraint the moment the owning
  -- session/user is deleted, blocking the delete entirely. `restrict`
  -- surfaces that conflict explicitly instead (revoke the entitlement
  -- first) rather than failing confusingly deep in a cascade.
  anonymous_session_id uuid references anonymous_sessions (id) on delete restrict,
  user_id uuid references auth.users (id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'revoked')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  product_id text not null default 'premium-unlock-2026',
  -- sha-256 of the email Stripe Checkout collected at purchase time
  -- (session.customer_details.email), never the raw address — this is
  -- what access restoration matches against
  -- (docs/PAYMENT_ENTITLEMENT.md §4). Nullable: Stripe Checkout always
  -- collects an email, but this stays optional at the schema level in
  -- case a future purchase path doesn't.
  email_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entitlements_owner_xor check (
    (user_id is not null) <> (anonymous_session_id is not null)
  )
);

drop trigger if exists entitlements_set_updated_at on entitlements;
create trigger entitlements_set_updated_at
  before update on entitlements
  for each row execute function set_updated_at();

create index if not exists entitlements_anonymous_session_idx on entitlements (anonymous_session_id) where status = 'active';
create index if not exists entitlements_user_idx on entitlements (user_id) where status = 'active';
create index if not exists entitlements_email_hash_idx on entitlements (email_hash) where status = 'active';

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references entitlements (id) on delete cascade,
  stripe_event_id text not null unique, -- idempotency: one row per Stripe webhook event
  amount_cents int not null,
  currency text not null,
  created_at timestamptz not null default now()
);

create table if not exists license_events (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references entitlements (id) on delete cascade,
  event_type text not null check (event_type in ('created', 'revoked', 'restored')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Access restoration tokens (docs/PAYMENT_ENTITLEMENT.md §4)
-- ============================================================

create table if not exists recovery_tokens (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references entitlements (id) on delete cascade,
  email_hash text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists recovery_tokens_email_hash_idx on recovery_tokens (email_hash);

-- ============================================================
-- RLS: every table introduced here is service-role only. Anonymous
-- writes are authorized by the Route Handler verifying the signed
-- session cookie (docs/NO_LOGIN_ARCHITECTURE.md §4), not by RLS —
-- Postgres RLS cannot evaluate an HMAC signature against a server
-- secret, so there is nothing meaningful for anon/authenticated
-- policies to check here.
-- ============================================================

alter table anonymous_sessions enable row level security;
alter table simulation_usage enable row level security;
alter table entitlements enable row level security;
alter table purchases enable row level security;
alter table license_events enable row level security;
alter table recovery_tokens enable row level security;

-- No policies are created for anon/authenticated on these tables:
-- with RLS enabled and zero policies, every role except the
-- service role (which bypasses RLS entirely) is denied by default.
