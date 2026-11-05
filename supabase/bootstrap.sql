-- =====================================================================
-- cybersecu.app — installation complète du schéma et du contenu.
--
-- GÉNÉRÉ par `pnpm db:bootstrap`. Ne pas éditer à la main : modifiez le
-- fichier source concerné dans supabase/, puis régénérez.
--
-- À coller tel quel dans l'éditeur SQL de Supabase, ou :
--   psql "$SUPABASE_DB_URL" -f supabase/bootstrap.sql
--
-- REJOUABLE et NON DESTRUCTIF : chaque instruction est gardée. Sur une
-- base vide il installe tout ; sur une base partielle il complète ce qui
-- manque ; sur une base déjà à jour il ne change rien. Aucune donnée
-- existante n'est supprimée.
--
-- Contenu : 7 fichiers, dans cet ordre.
--   - migrations/0001_init.sql
--   - migrations/0002_rls.sql
--   - migrations/0003_no_login_pivot.sql
--   - migrations/0004_scenario_content_integrity.sql
--   - seed/0001_taxonomy_and_content.sql
--   - seed/0002_attack_content.sql
--   - seed/0003_simulation_content.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- migrations/0001_init.sql
-- ---------------------------------------------------------------------
-- cybersecu.app — initial schema
--
-- REJOUABLE. Chaque instruction est gardée (`if not exists`, `drop trigger if
-- exists` avant recréation, `create or replace` pour les fonctions), afin que
-- ce fichier converge vers l'état cible quel que soit l'état de départ. Une
-- base déjà migrée n'y perd rien ; une base partiellement migrée est complétée.
-- C'est nécessaire parce que ces fichiers sont appliqués à la main, sans
-- table de suivi des versions : sans garde, « rejouer les migrations » échoue
-- dès la première table existante et laisse l'opérateur sans recours.
-- Implements the domain model documented in docs/DOMAIN_MODEL.md.
-- Every table follows docs/ARCHITECTURE.md §20: UUID PK, created_at,
-- explicit FKs, constraints, and indexes on filtered/joined columns.

create extension if not exists "pgcrypto";

-- ============================================================
-- Profiles (extends auth.users; role is never client-writable)
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  preferred_profile text not null default 'general'
    check (preferred_profile in ('general', 'senior', 'business')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ============================================================
-- Taxonomy (seeded catalogs — see docs/ATTACK_TAXONOMY.md)
-- ============================================================

create table if not exists attack_vectors (
  code text primary key,
  label_fr text not null
);

create table if not exists psychological_triggers (
  code text primary key,
  label_fr text not null
);

create table if not exists indicators (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label_fr text not null,
  created_at timestamptz not null default now()
);

create table if not exists mistake_patterns (
  code text primary key,
  label_fr text not null,
  description_fr text not null
);

create table if not exists cyber_reflex_dimensions (
  code text primary key,
  label_fr text not null
);

-- ============================================================
-- Attacks (attack knowledge graph)
-- ============================================================

create table if not exists attacks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                     -- stable, immutable, e.g. SMS-000001
  slug text not null unique,                      -- mutable, SEO URL
  name text not null,
  primary_vector text not null references attack_vectors (code),
  primary_dimension text not null references cyber_reflex_dimensions (code),
  definition text,
  how_it_works text,
  warning_signs text[] not null default '{}',
  how_to_verify text,
  what_to_do text,
  what_to_do_if_victim text,
  faq jsonb not null default '[]',                -- [{question, answer}]
  "references" jsonb not null default '[]',       -- [{label, url}]
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists attacks_set_updated_at on attacks;
create trigger attacks_set_updated_at
  before update on attacks
  for each row execute function set_updated_at();

create index if not exists attacks_published_idx on attacks (published_at) where published_at is not null;
create index if not exists attacks_primary_vector_idx on attacks (primary_vector);

-- publish gate: mirrors docs/SEO_ARCHITECTURE.md §3 — an attack cannot be
-- published without the minimum content contract satisfied.
create or replace function check_attack_publishable() returns trigger as $$
begin
  if new.published_at is not null then
    if new.definition is null or new.how_it_works is null
       or array_length(new.warning_signs, 1) is null then
      raise exception 'attack % cannot be published: missing definition/how_it_works/warning_signs', new.code;
    end if;
    if not exists (select 1 from attack_triggers where attack_id = new.id)
       and not exists (select 1 from attack_indicators where attack_id = new.id) then
      raise exception 'attack % cannot be published: needs at least one trigger or indicator', new.code;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- Deferred: attack_triggers/attack_indicators don't exist yet at this
-- point in the file, so the trigger is created after those tables below.

create table if not exists attack_related (
  attack_id uuid not null references attacks (id) on delete cascade,
  related_attack_id uuid not null references attacks (id) on delete cascade,
  primary key (attack_id, related_attack_id),
  check (attack_id <> related_attack_id)
);

create table if not exists attack_triggers (
  attack_id uuid not null references attacks (id) on delete cascade,
  trigger_code text not null references psychological_triggers (code),
  primary key (attack_id, trigger_code)
);

create table if not exists attack_indicators (
  attack_id uuid not null references attacks (id) on delete cascade,
  indicator_id uuid not null references indicators (id) on delete cascade,
  primary key (attack_id, indicator_id)
);

drop trigger if exists attacks_check_publishable on attacks;
create trigger attacks_check_publishable
  before insert or update on attacks
  for each row execute function check_attack_publishable();

-- ============================================================
-- Slug redirects (docs/SEO_ARCHITECTURE.md §2)
-- ============================================================

create table if not exists slug_redirects (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('attaques', 'arnaques', 'guides', 'simulations')),
  old_slug text not null,
  new_slug text not null,
  created_at timestamptz not null default now(),
  unique (section, old_slug)
);

-- ============================================================
-- Learning objectives
-- ============================================================

create table if not exists learning_objectives (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description_fr text not null,
  dimension text not null references cyber_reflex_dimensions (code),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Scenarios + versions (docs/SCENARIO_ENGINE.md)
-- ============================================================

create table if not exists scenarios (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                      -- stable, e.g. SCENARIO-000142
  attack_id uuid not null references attacks (id) on delete restrict,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists scenario_versions (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references scenarios (id) on delete cascade,
  version int not null,
  channel text not null references attack_vectors (code),
  target_profile text not null default 'general'
    check (target_profile in ('general', 'senior', 'business')),
  difficulty smallint not null check (difficulty between 1 and 5),
  impersonated_entity text not null,
  content jsonb not null,                          -- {sender, body, ui}
  choices jsonb not null,                           -- [{id,label,isUnsure?,isRecommended?,mistakePatternCodes?}]
  correct_choice_ids text[] not null,
  explanations jsonb not null,                       -- {[choiceId]: {technique,indicator,whyDangerous,reflex}}
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (scenario_id, version),
  -- content/choices/explanations must only reference fictional entities
  -- is an editorial rule (docs/decisions/0002), not enforceable in SQL.
  check (array_length(correct_choice_ids, 1) > 0)
);

-- "Je ne sais pas" is mandatory (brief §13): at least one choice must be
-- flagged isUnsure. A CHECK constraint can't contain a subquery, so this
-- is enforced with a trigger instead.
create or replace function check_scenario_version_has_unsure_choice() returns trigger as $$
begin
  if not exists (
    select 1 from jsonb_array_elements(new.choices) as c
    where (c ->> 'isUnsure')::boolean is true
  ) then
    raise exception 'scenario_version for scenario % must include a choice with isUnsure=true ("Je ne sais pas")', new.scenario_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists scenario_versions_check_unsure_choice on scenario_versions;
create trigger scenario_versions_check_unsure_choice
  before insert or update on scenario_versions
  for each row execute function check_scenario_version_has_unsure_choice();

create index if not exists scenario_versions_scenario_idx on scenario_versions (scenario_id);
create index if not exists scenario_versions_published_idx on scenario_versions (published_at) where published_at is not null;
create index if not exists scenario_versions_channel_idx on scenario_versions (channel);
create index if not exists scenario_versions_difficulty_idx on scenario_versions (difficulty);

-- immutability of published semantic fields (docs/SCENARIO_ENGINE.md §2)
create or replace function protect_published_scenario_version() returns trigger as $$
begin
  if old.published_at is not null then
    if new.choices is distinct from old.choices
       or new.correct_choice_ids is distinct from old.correct_choice_ids
       or new.explanations is distinct from old.explanations
       or new.difficulty is distinct from old.difficulty
       or new.channel is distinct from old.channel then
      raise exception 'scenario_version % is published: create a new version instead of mutating scoring/learning semantics', old.id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists scenario_versions_protect_published on scenario_versions;
create trigger scenario_versions_protect_published
  before update on scenario_versions
  for each row execute function protect_published_scenario_version();

create table if not exists scenario_objectives (
  scenario_version_id uuid not null references scenario_versions (id) on delete cascade,
  learning_objective_id uuid not null references learning_objectives (id) on delete cascade,
  primary key (scenario_version_id, learning_objective_id)
);

-- ============================================================
-- Attempts (docs/LEARNING_ENGINE.md, docs/SECURITY_MODEL.md §9)
-- ============================================================

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scenario_version_id uuid not null references scenario_versions (id) on delete restrict,
  started_at timestamptz not null default now(),
  answered_at timestamptz
);

create index if not exists attempts_user_idx on attempts (user_id);
create index if not exists attempts_scenario_version_idx on attempts (scenario_version_id);

create table if not exists attempt_decisions (
  attempt_id uuid primary key references attempts (id) on delete cascade,
  choice_id text not null,
  correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists attempt_mistakes (
  attempt_id uuid not null references attempts (id) on delete cascade,
  mistake_pattern_code text not null references mistake_patterns (code),
  primary key (attempt_id, mistake_pattern_code)
);

-- attempts are immutable once answered: no application role gets UPDATE/
-- DELETE on attempts/attempt_decisions (enforced via RLS below, this
-- trigger is a second layer against a future service-role bug).
create or replace function block_attempt_mutation() returns trigger as $$
begin
  raise exception 'attempts are immutable once created; insert a new attempt instead';
end;
$$ language plpgsql;

drop trigger if exists attempts_block_update on attempts;
create trigger attempts_block_update
  before update on attempts
  for each row
  when (old.answered_at is not null)
  execute function block_attempt_mutation();

-- ============================================================
-- Cyber Reflex profile
-- ============================================================

create table if not exists cyber_reflex_scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  dimension text not null references cyber_reflex_dimensions (code),
  score smallint check (score between 0 and 100),
  attempts_count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, dimension)
);

-- ============================================================
-- Audit log (admin actions — brief §22)
-- ============================================================

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists audit_log_actor_idx on audit_log (actor_id);
create index if not exists audit_log_entity_idx on audit_log (entity_type, entity_id);


-- ---------------------------------------------------------------------
-- migrations/0002_rls.sql
-- ---------------------------------------------------------------------
-- Row Level Security policies (docs/SECURITY_MODEL.md §2).
--
-- REJOUABLE : chaque policy est supprimée si elle existe avant d'être
-- recréée, de sorte que ce fichier redéfinit l'état voulu au lieu d'échouer
-- sur une policy déjà présente. `enable row level security` est déjà
-- idempotent côté Postgres.
-- Authorization is never client-only: every table holding user data is
-- gated here at the database layer, independent of application code.

-- ------------------------------------------------------------
-- Helper: is the current user an admin? SECURITY DEFINER so the check
-- itself doesn't get blocked by RLS on profiles, but it only ever reads
-- role — it grants nothing by itself.
-- ------------------------------------------------------------

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------

alter table profiles enable row level security;

drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles
  for select using (id = auth.uid());

drop policy if exists profiles_select_admin on profiles;
create policy profiles_select_admin on profiles
  for select using (is_admin());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = 'user'); -- role is not self-promotable

drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own on profiles
  for insert with check (id = auth.uid());

-- ------------------------------------------------------------
-- Public knowledge tables: readable by everyone (anon + authenticated),
-- published rows only for anon/general authenticated; admin manages via
-- service role (bypasses RLS) or a dedicated admin-checked write policy.
-- ------------------------------------------------------------

alter table attack_vectors enable row level security;
alter table psychological_triggers enable row level security;
alter table indicators enable row level security;
alter table mistake_patterns enable row level security;
alter table cyber_reflex_dimensions enable row level security;
alter table learning_objectives enable row level security;

drop policy if exists taxonomy_public_read on attack_vectors;
create policy taxonomy_public_read on attack_vectors for select using (true);
drop policy if exists taxonomy_public_read on psychological_triggers;
create policy taxonomy_public_read on psychological_triggers for select using (true);
drop policy if exists taxonomy_public_read on indicators;
create policy taxonomy_public_read on indicators for select using (true);
drop policy if exists taxonomy_public_read on mistake_patterns;
create policy taxonomy_public_read on mistake_patterns for select using (true);
drop policy if exists taxonomy_public_read on cyber_reflex_dimensions;
create policy taxonomy_public_read on cyber_reflex_dimensions for select using (true);
drop policy if exists taxonomy_public_read on learning_objectives;
create policy taxonomy_public_read on learning_objectives for select using (true);

alter table attacks enable row level security;
alter table attack_related enable row level security;
alter table attack_triggers enable row level security;
alter table attack_indicators enable row level security;

drop policy if exists attacks_public_read on attacks;
create policy attacks_public_read on attacks
  for select using (published_at is not null or is_admin());

drop policy if exists attacks_admin_write on attacks;
create policy attacks_admin_write on attacks
  for all using (is_admin()) with check (is_admin());

drop policy if exists attack_related_public_read on attack_related;
create policy attack_related_public_read on attack_related for select using (true);
drop policy if exists attack_related_admin_write on attack_related;
create policy attack_related_admin_write on attack_related
  for all using (is_admin()) with check (is_admin());

drop policy if exists attack_triggers_public_read on attack_triggers;
create policy attack_triggers_public_read on attack_triggers for select using (true);
drop policy if exists attack_triggers_admin_write on attack_triggers;
create policy attack_triggers_admin_write on attack_triggers
  for all using (is_admin()) with check (is_admin());

drop policy if exists attack_indicators_public_read on attack_indicators;
create policy attack_indicators_public_read on attack_indicators for select using (true);
drop policy if exists attack_indicators_admin_write on attack_indicators;
create policy attack_indicators_admin_write on attack_indicators
  for all using (is_admin()) with check (is_admin());

alter table slug_redirects enable row level security;
drop policy if exists slug_redirects_public_read on slug_redirects;
create policy slug_redirects_public_read on slug_redirects for select using (true);
drop policy if exists slug_redirects_admin_write on slug_redirects;
create policy slug_redirects_admin_write on slug_redirects
  for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------
-- Scenarios: published versions are public read; drafts are admin-only.
-- IMPORTANT: correct_choice_ids / explanations still must not be sent to
-- the client for an unanswered attempt — that's enforced at the API
-- layer (docs/SECURITY_MODEL.md §9), RLS alone can't hide specific
-- columns from an authorized row. The public read API route selects only
-- the safe columns; it never forwards a raw `select *` to the client.
-- ------------------------------------------------------------

alter table scenarios enable row level security;
alter table scenario_versions enable row level security;
alter table scenario_objectives enable row level security;

drop policy if exists scenarios_public_read on scenarios;
create policy scenarios_public_read on scenarios for select using (true);
drop policy if exists scenarios_admin_write on scenarios;
create policy scenarios_admin_write on scenarios
  for all using (is_admin()) with check (is_admin());

drop policy if exists scenario_versions_public_read on scenario_versions;
create policy scenario_versions_public_read on scenario_versions
  for select using (published_at is not null or is_admin());

drop policy if exists scenario_versions_admin_write on scenario_versions;
create policy scenario_versions_admin_write on scenario_versions
  for all using (is_admin()) with check (is_admin());

drop policy if exists scenario_objectives_public_read on scenario_objectives;
create policy scenario_objectives_public_read on scenario_objectives for select using (true);
drop policy if exists scenario_objectives_admin_write on scenario_objectives;
create policy scenario_objectives_admin_write on scenario_objectives
  for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------
-- Attempts / decisions / mistakes: strictly owner-scoped. No update or
-- delete policy is granted to `authenticated` at all — attempts are
-- append-only from the app's perspective (docs/SECURITY_MODEL.md §2).
-- ------------------------------------------------------------

alter table attempts enable row level security;
alter table attempt_decisions enable row level security;
alter table attempt_mistakes enable row level security;

drop policy if exists attempts_select_own on attempts;
create policy attempts_select_own on attempts
  for select using (user_id = auth.uid());

drop policy if exists attempts_insert_own on attempts;
create policy attempts_insert_own on attempts
  for insert with check (user_id = auth.uid());

drop policy if exists attempts_admin_read on attempts;
create policy attempts_admin_read on attempts
  for select using (is_admin());

drop policy if exists attempt_decisions_select_own on attempt_decisions;
create policy attempt_decisions_select_own on attempt_decisions
  for select using (
    exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

drop policy if exists attempt_decisions_admin_read on attempt_decisions;
create policy attempt_decisions_admin_read on attempt_decisions
  for select using (is_admin());

drop policy if exists attempt_mistakes_select_own on attempt_mistakes;
create policy attempt_mistakes_select_own on attempt_mistakes
  for select using (
    exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

drop policy if exists attempt_mistakes_admin_read on attempt_mistakes;
create policy attempt_mistakes_admin_read on attempt_mistakes
  for select using (is_admin());

-- Inserts to attempt_decisions/attempt_mistakes happen only via the
-- service role from the answer API route (server-side grading, never a
-- direct client insert of a "correct" claim) — see
-- docs/SECURITY_MODEL.md §3. No authenticated insert policy is granted.

-- ------------------------------------------------------------
-- Cyber Reflex scores: owner-scoped read; writes are service-role only
-- (computed server-side after grading).
-- ------------------------------------------------------------

alter table cyber_reflex_scores enable row level security;

drop policy if exists reflex_scores_select_own on cyber_reflex_scores;
create policy reflex_scores_select_own on cyber_reflex_scores
  for select using (user_id = auth.uid());

drop policy if exists reflex_scores_admin_read on cyber_reflex_scores;
create policy reflex_scores_admin_read on cyber_reflex_scores
  for select using (is_admin());

-- ------------------------------------------------------------
-- Audit log: admin read-only; writes are service-role only.
-- ------------------------------------------------------------

alter table audit_log enable row level security;

drop policy if exists audit_log_admin_read on audit_log;
create policy audit_log_admin_read on audit_log
  for select using (is_admin());


-- ---------------------------------------------------------------------
-- migrations/0003_no_login_pivot.sql
-- ---------------------------------------------------------------------
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


-- ---------------------------------------------------------------------
-- migrations/0004_scenario_content_integrity.sql
-- ---------------------------------------------------------------------
-- Scenario content integrity (docs/SCENARIO_ENGINE.md §2).
--
-- WHY
-- `scenario_versions` already guarantees a non-empty `correct_choice_ids` and
-- the presence of a "Je ne sais pas" choice, but nothing tied the three JSON
-- columns to each other. Three authoring mistakes were therefore accepted
-- silently, and each surfaced only once a visitor answered:
--
--   1. A choice with no entry in `explanations`. The answer route returns
--      `explanation: null` for it (src/domain/mistakes/classify.ts), and the
--      player renders an explanation panel from that object — so the whole
--      simulation page fails client-side, after the answer was already graded
--      and the quota already consumed.
--   2. A `correct_choice_ids` entry naming a choice that does not exist. Every
--      answer is then graded incorrect, including the recommended one.
--   3. Two choices sharing an id: the second is unreachable, and grading
--      resolves whichever comes first.
--
-- These are content bugs, not code bugs, so they belong where the content is
-- written. A BEFORE trigger rejects the write; the seeds already satisfy it.

create or replace function check_scenario_version_content_integrity() returns trigger as $$
declare
  choice_ids text[];
  missing text;
begin
  select array_agg(c ->> 'id' order by ord)
    into choice_ids
    from jsonb_array_elements(new.choices) with ordinality as t(c, ord);

  if choice_ids is null or array_length(choice_ids, 1) is null then
    raise exception 'scenario_version for scenario % has no choices', new.scenario_id;
  end if;

  if exists (select 1 from unnest(choice_ids) as id where id is null or id = '') then
    raise exception 'scenario_version for scenario % has a choice without an id', new.scenario_id;
  end if;

  if array_length(choice_ids, 1) <> (select count(distinct id) from unnest(choice_ids) as id) then
    raise exception 'scenario_version for scenario % has duplicate choice ids', new.scenario_id;
  end if;

  -- Every choice must be explainable: the player shows an explanation for
  -- whatever the visitor picked, including "Je ne sais pas".
  select id into missing
    from unnest(choice_ids) as id
   where not (new.explanations ? id)
   limit 1;
  if missing is not null then
    raise exception 'scenario_version for scenario % has no explanation for choice "%"', new.scenario_id, missing;
  end if;

  -- Every correct answer must name a real choice, or nothing can be answered
  -- correctly.
  select cid into missing
    from unnest(new.correct_choice_ids) as cid
   where not (cid = any (choice_ids))
   limit 1;
  if missing is not null then
    raise exception 'scenario_version for scenario % marks unknown choice "%" as correct', new.scenario_id, missing;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists scenario_versions_check_content_integrity on scenario_versions;
create trigger scenario_versions_check_content_integrity
  before insert or update on scenario_versions
  for each row execute function check_scenario_version_content_integrity();


-- ---------------------------------------------------------------------
-- seed/0001_taxonomy_and_content.sql
-- ---------------------------------------------------------------------
-- REJOUABLE : chaque insert se termine par `on conflict do nothing`, et la
-- publication ne repousse pas `published_at` si elle a déjà eu lieu. Ces
-- fichiers sont appliqués à la main, sans table de suivi des versions : sans
-- ces gardes, « rejouer le seed » échoue sur la première ligne déjà présente.
--
-- Seed data: taxonomy catalogs (docs/ATTACK_TAXONOMY.md) + the MVP attack
-- family stubs + one fully-authored vertical slice (smishing / bank
-- impersonation, matching docs/decisions/0001).

insert into attack_vectors (code, label_fr) values
  ('sms', 'SMS'),
  ('email', 'Email'),
  ('phone', 'Téléphone'),
  ('web', 'Site web'),
  ('qr_code', 'QR code'),
  ('social_media', 'Réseau social'),
  ('messaging_app', 'Application de messagerie'),
  ('advertisement', 'Publicité'),
  ('file_attachment', 'Pièce jointe')
on conflict do nothing;

insert into psychological_triggers (code, label_fr) values
  ('urgency', 'Urgence'),
  ('fear', 'Peur'),
  ('authority', 'Autorité'),
  ('reward', 'Récompense'),
  ('curiosity', 'Curiosité'),
  ('scarcity', 'Rareté'),
  ('social_pressure', 'Pression sociale'),
  ('trust', 'Confiance'),
  ('financial_incentive', 'Incitation financière')
on conflict do nothing;

insert into mistake_patterns (code, label_fr, description_fr) values
  ('MISSED_SUSPICIOUS_DOMAIN', 'Domaine suspect non repéré', 'L''utilisateur n''a pas remarqué un nom de domaine anormal.'),
  ('TRUSTED_DISPLAY_NAME', 'Nom affiché trop vite cru', 'L''utilisateur a fait confiance au nom affiché sans vérifier l''expéditeur réel.'),
  ('RESPONDED_TO_URGENCY', 'A réagi à l''urgence', 'L''utilisateur a agi rapidement à cause d''une contrainte de temps artificielle.'),
  ('TRUSTED_AUTHORITY', 'A fait confiance à l''autorité affichée', 'L''utilisateur a obéi car le message prétendait venir d''une autorité.'),
  ('CLICKED_UNKNOWN_LINK', 'A cliqué sur un lien inconnu', 'L''utilisateur a cliqué sur un lien sans le vérifier.'),
  ('SHARED_CREDENTIAL', 'A partagé un mot de passe', 'L''utilisateur a communiqué un identifiant ou mot de passe.'),
  ('SHARED_MFA_CODE', 'A partagé un code de vérification', 'L''utilisateur a communiqué un code MFA/OTP.'),
  ('FAILED_TO_VERIFY_INDEPENDENTLY', 'N''a pas vérifié de façon indépendante', 'L''utilisateur n''a pas contacté l''organisme par un canal officiel séparé.'),
  ('TRUSTED_LOGO', 'A fait confiance au logo', 'L''utilisateur a jugé le message légitime uniquement à cause d''un logo.'),
  ('TRUSTED_BRAND_NAME', 'A fait confiance au nom de marque', 'L''utilisateur a jugé le message légitime uniquement à cause du nom de marque cité.'),
  ('MISSED_UNUSUAL_PAYMENT_REQUEST', 'Demande de paiement inhabituelle non repérée', 'L''utilisateur n''a pas identifié une demande de paiement anormale.')
on conflict do nothing;

insert into cyber_reflex_dimensions (code, label_fr) values
  ('phishing_recognition', 'Reconnaissance du phishing'),
  ('sms_scam_recognition', 'Reconnaissance des arnaques SMS'),
  ('url_verification', 'Vérification des liens'),
  ('identity_verification', 'Vérification d''identité'),
  ('financial_fraud_recognition', 'Reconnaissance des fraudes financières'),
  ('social_engineering_resistance', 'Résistance à l''ingénierie sociale'),
  ('qr_phishing_recognition', 'Reconnaissance du quishing'),
  ('deepfake_ai_awareness', 'Vigilance face aux deepfakes / IA'),
  ('device_integrity_awareness', 'Vigilance sur l''intégrité de l''appareil'),
  ('network_trust_awareness', 'Vigilance sur la confiance accordée au réseau'),
  ('personal_data_exposure_awareness', 'Maîtrise de l''exposition des données personnelles'),
  ('pressure_and_coercion_resistance', 'Résistance à la pression et au chantage'),
  ('account_security_awareness', 'Vigilance sur la sécurité du compte')
on conflict do nothing;

insert into indicators (code, label_fr) values
  ('shortened_url', 'Lien raccourci'),
  ('urgent_deadline', 'Délai artificiellement court'),
  ('unexpected_sender', 'Expéditeur inattendu'),
  ('payment_request', 'Demande de paiement'),
  ('credential_request', 'Demande d''identifiants'),
  ('suspicious_domain', 'Nom de domaine suspect')
on conflict do nothing;

-- ------------------------------------------------------------
-- MVP attack family (docs/ATTACK_TAXONOMY.md §5). Only the first is
-- fully authored + published this pass; the rest are seeded stubs
-- (published_at stays NULL — never shown publicly per the "no thin SEO
-- pages" rule).
-- ------------------------------------------------------------

-- Inserted unpublished first: the publish-gate trigger on `attacks`
-- requires at least one attack_triggers/attack_indicators row to already
-- exist, so those relations must be inserted before `published_at` is set.
insert into attacks (code, slug, name, primary_vector, primary_dimension, definition, how_it_works, warning_signs, how_to_verify, what_to_do, what_to_do_if_victim, "references")
values (
  'SMS-000001',
  'smishing-faux-sms-bancaire',
  'Smishing (faux SMS bancaire)',
  'sms',
  'sms_scam_recognition',
  'Le smishing est une arnaque par SMS qui imite un organisme de confiance (souvent une banque) pour pousser la victime à cliquer sur un lien frauduleux ou à communiquer des informations sensibles.',
  'L''attaquant envoie un SMS qui semble provenir de votre banque, annonçant un problème urgent (carte bloquée, virement suspect). Le message contient un lien vers un faux site qui imite l''interface bancaire, où la victime saisit ses identifiants ou son code de carte, immédiatement récupérés par l''attaquant.',
  array[
    'Message non sollicité annonçant un problème urgent',
    'Lien raccourci ou domaine qui ne correspond pas au site officiel de la banque',
    'Demande de saisir un mot de passe ou un code depuis un lien SMS',
    'Délai très court imposé ("sous 30 minutes")'
  ],
  'Ne cliquez jamais sur le lien reçu. Ouvrez l''application officielle de votre banque ou appelez le numéro figurant au dos de votre carte pour vérifier.',
  'Supprimez le SMS. Si vous avez un doute sur votre compte, contactez votre banque via un canal officiel, jamais via le lien reçu.',
  'Contactez immédiatement votre banque pour bloquer votre carte/compte, changez vos mots de passe, et signalez l''arnaque sur signal-arnaques.com ou cybermalveillance.gouv.fr.',
  '[{"label": "cybermalveillance.gouv.fr — Hameçonnage / phishing", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
)
on conflict do nothing;

insert into attack_triggers (attack_id, trigger_code)
select id, t.code from attacks, unnest(array['urgency', 'authority', 'fear']) as t(code) where attacks.code = 'SMS-000001'
on conflict do nothing;

insert into attack_indicators (attack_id, indicator_id)
select a.id, i.id from attacks a, indicators i
where a.code = 'SMS-000001' and i.code in ('shortened_url', 'urgent_deadline', 'unexpected_sender', 'credential_request', 'suspicious_domain')
on conflict do nothing;

update attacks set published_at = now() where code = 'SMS-000001' and published_at is null;

-- Unpublished stubs for the remaining MVP-priority attack family.
insert into attacks (code, slug, name, primary_vector, primary_dimension, definition)
values
  ('PHISH-000001', 'phishing-email', 'Phishing (email)', 'email', 'phishing_recognition', 'Email frauduleux imitant un expéditeur légitime pour voler des informations.'),
  ('SOCIAL-000001', 'usurpation-conseiller-bancaire', 'Faux conseiller bancaire', 'phone', 'social_engineering_resistance', 'Appel se faisant passer pour un conseiller bancaire afin d''obtenir des informations sensibles.'),
  ('SOCIAL-000002', 'faux-livreur-colis', 'Faux livreur / colis en attente', 'sms', 'sms_scam_recognition', 'SMS prétendant qu''un colis est en attente pour pousser au paiement de frais fictifs.'),
  ('PAYMENT-000001', 'faux-remboursement', 'Faux remboursement', 'email', 'financial_fraud_recognition', 'Message annonçant un remboursement pour obtenir des données bancaires.'),
  ('SOCIAL-000003', 'faux-support-technique', 'Faux support technique', 'phone', 'social_engineering_resistance', 'Appel ou pop-up se faisant passer pour un support technique afin d''obtenir un accès à distance.'),
  ('IDN-000001', 'typosquatting', 'Typosquatting', 'web', 'url_verification', 'Nom de domaine proche d''un site légitime, avec une faute volontaire, pour tromper l''utilisateur.'),
  ('IDN-000002', 'homoglyphes', 'Attaque par homoglyphes', 'web', 'url_verification', 'Utilisation de caractères visuellement similaires pour imiter un domaine légitime.'),
  ('QR-000001', 'quishing', 'Quishing (QR code frauduleux)', 'qr_code', 'qr_phishing_recognition', 'QR code frauduleux redirigeant vers un site de phishing.')
on conflict do nothing;

-- ------------------------------------------------------------
-- Learning objective + scenario for the vertical slice.
-- ------------------------------------------------------------

insert into learning_objectives (code, description_fr, dimension) values
  ('LO-SMS-001', 'Reconnaître un SMS de banque frauduleux et vérifier par un canal officiel avant d''agir.', 'sms_scam_recognition')
on conflict do nothing;

insert into scenarios (code, attack_id, slug)
select 'SCENARIO-000001', id, 'sms-banque' from attacks where code = 'SMS-000001'
on conflict do nothing;

insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select
  s.id, 1, 'sms', 'general', 2, 'Banque Fictive',
  '{"sender": "Banque Fictive", "body": "Votre carte a ete temporairement bloquee suite a une activite inhabituelle. Confirmez vos informations sous 30 minutes : https://banque-fictive-secure.example-not-real.test/confirmer", "ui": "sms"}'::jsonb,
  '[
    {"id": "click", "label": "Je clique sur le lien pour confirmer mes informations", "mistakePatternCodes": ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "reply", "label": "Je reponds au SMS pour demander des precisions", "mistakePatternCodes": ["FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "verify", "label": "Je verifie directement aupres de ma banque (application officielle ou numero au dos de ma carte)", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "click": {"technique": "Urgence artificielle", "indicator": "Lien vers un domaine qui n''est pas celui de votre banque (\"banque-fictive-secure.example-not-real.test\")", "whyDangerous": "Le lien mene a un faux site qui capture vos identifiants bancaires des que vous les saisissez.", "reflex": "Ne cliquez jamais sur un lien recu par SMS non sollicite, meme s''il semble urgent."},
    "reply": {"technique": "Urgence artificielle", "indicator": "Le SMS incite a repondre directement plutot qu''a verifier par un canal officiel", "whyDangerous": "Repondre confirme a l''attaquant que votre numero est actif et peut mener a d''autres questions pieges.", "reflex": "Ne repondez jamais a un SMS suspect : contactez l''organisme par un canal que vous connaissez deja."},
    "verify": {"technique": "Urgence artificielle", "indicator": "Demande d''action immediate sous 30 minutes", "whyDangerous": "N/A - c''est la bonne reponse : verifier independamment neutralise l''urgence fabriquee par l''attaquant.", "reflex": "Continuez a verifier aupres de l''organisme via un canal officiel avant toute action."},
    "unsure": {"technique": "Urgence artificielle", "indicator": "Demande d''action immediate sous 30 minutes", "whyDangerous": "Ne pas savoir est normal - le plus important est de ne rien faire depuis le lien du SMS.", "reflex": "Dans le doute, ne cliquez pas et verifiez toujours aupres de l''organisme via un canal officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000001'
on conflict do nothing;

insert into scenario_objectives (scenario_version_id, learning_objective_id)
select sv.id, lo.id
from scenario_versions sv
join scenarios s on s.id = sv.scenario_id
join learning_objectives lo on lo.code = 'LO-SMS-001'
where s.code = 'SCENARIO-000001' and sv.version = 1
on conflict do nothing;


-- ---------------------------------------------------------------------
-- seed/0002_attack_content.sql
-- ---------------------------------------------------------------------
-- ============================================================
-- Seed 0002 — complete and publish the eight stub attacks.
--
-- WHY THIS EXISTS
-- Seed 0001 inserts nine attacks but publishes exactly one: the other
-- eight carry only a one-line `definition`, so they fail the publish gate
-- (definition + how_it_works + warning_signs + at least one trigger or
-- indicator). The result is that a correctly-migrated, correctly-seeded
-- production still renders a single card on /attaques — which reads as an
-- empty page. See docs/BLANK_PAGES_ROOT_CAUSE.md.
--
-- This file fills in real content for those eight and publishes them.
--
-- CONTENT RULES (docs/decisions/0002-synthetic-content-only.md, brief §14)
--   * No fabricated statistics, incidents, victims, dates or organisations.
--   * Every `references` entry points to a real public authority page.
--   * Mechanisms are described generically; nothing here is operational
--     guidance for conducting an attack.
--
-- Idempotent: safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- PHISH-000001 — Phishing (email)
-- ------------------------------------------------------------
update attacks set
  definition = 'L''hameçonnage par email est un message frauduleux qui imite un expéditeur légitime — banque, administration, service en ligne, employeur — pour obtenir des identifiants, des données bancaires, ou faire ouvrir une pièce jointe malveillante.',
  how_it_works = 'L''attaquant envoie un email reprenant l''identité visuelle d''un organisme connu : logo, mise en page, ton habituel. Le message annonce un problème à régler rapidement (compte suspendu, facture impayée, colis bloqué) et propose un lien. Ce lien mène à une page de connexion imitant le site officiel. Tout ce qui y est saisi part directement chez l''attaquant, qui s''en sert immédiatement pour se connecter au vrai service.',
  warning_signs = array[
    'Adresse d''expéditeur qui ne correspond pas au domaine officiel de l''organisme',
    'Demande de « confirmer » ou « vérifier » des identifiants via un lien',
    'Urgence ou menace de conséquence immédiate (suspension, pénalité)',
    'Formulation impersonnelle (« Cher client ») alors que l''organisme connaît votre nom',
    'Pièce jointe inattendue, en particulier un fichier à activer ou à autoriser'
  ],
  how_to_verify = 'N''utilisez pas le lien du message. Ouvrez votre navigateur et rejoignez le service par un chemin que vous maîtrisez : un favori enregistré, l''application officielle, ou l''adresse saisie à la main. Si le message était authentique, l''information s''y retrouvera.',
  what_to_do = 'Ne cliquez pas, ne répondez pas, ne téléchargez pas la pièce jointe. Signalez le message comme hameçonnage dans votre messagerie, puis supprimez-le.',
  what_to_do_if_victim = 'Changez immédiatement le mot de passe du compte concerné, puis celui de tout autre compte réutilisant le même mot de passe. Activez la double authentification. Si des données bancaires ont été saisies, contactez votre banque sans attendre. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Comment distinguer un vrai email de ma banque d''un faux ?", "answer": "Une banque ne demande jamais vos identifiants complets, votre code secret ou un code reçu par SMS, quel que soit le canal. En cas de doute, n''utilisez pas le lien : passez par l''application officielle ou le numéro figurant au dos de votre carte."},
    {"question": "Est-ce dangereux d''avoir simplement ouvert l''email ?", "answer": "Ouvrir un email est rarement suffisant pour compromettre un appareil. Le risque vient de ce que l''on fait ensuite : cliquer sur le lien, saisir des informations, ou ouvrir une pièce jointe."},
    {"question": "J''ai cliqué sur le lien mais rien saisi, que faire ?", "answer": "Le risque principal reste limité si aucune information n''a été saisie et aucun fichier téléchargé. Par précaution, vérifiez l''activité récente du compte concerné et changez son mot de passe."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'PHISH-000001';

-- ------------------------------------------------------------
-- SOCIAL-000001 — Faux conseiller bancaire
-- ------------------------------------------------------------
update attacks set
  definition = 'L''usurpation de conseiller bancaire est un appel téléphonique dans lequel l''attaquant se fait passer pour le service anti-fraude de votre banque afin de vous faire valider vous-même une opération frauduleuse.',
  how_it_works = 'L''attaquant appelle en affichant parfois le numéro réel de la banque, technique connue sous le nom d''usurpation de numéro. Il annonce détecter une opération suspecte et propose de la « bloquer ». Pour cela, il demande de confirmer un code reçu par SMS, de valider une notification dans l''application bancaire, ou d''effectuer un virement vers un « compte sécurisé ». Chacune de ces actions autorise en réalité l''opération frauduleuse : c''est la victime elle-même qui valide, ce qui rend la contestation ultérieure plus difficile.',
  warning_signs = array[
    'Appel non sollicité annonçant une fraude en cours sur votre compte',
    'Demande de communiquer ou de valider un code reçu par SMS',
    'Demande de virement vers un prétendu « compte sécurisé » ou « compte tampon »',
    'Insistance pour rester en ligne et ne raccrocher sous aucun prétexte',
    'Pression pour agir avant de vérifier auprès de quelqu''un d''autre'
  ],
  how_to_verify = 'Raccrochez, sans exception. Rappelez ensuite votre banque au numéro figurant au dos de votre carte ou dans l''application officielle. Un conseiller légitime ne vous reprochera jamais d''avoir raccroché pour vérifier.',
  what_to_do = 'Ne communiquez aucun code, ne validez aucune notification, n''effectuez aucun virement pendant l''appel. Une banque ne demande jamais de déplacer de l''argent pour le protéger.',
  what_to_do_if_victim = 'Contactez immédiatement votre banque pour faire opposition et signaler l''opération. Déposez plainte. Conservez les traces disponibles : heure de l''appel, numéro affiché, montants. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le numéro affiché était bien celui de ma banque, est-ce possible ?", "answer": "Oui. L''affichage du numéro appelant peut être falsifié. Un numéro correct ne prouve donc jamais l''identité de l''interlocuteur, et ne doit pas servir de critère de confiance."},
    {"question": "Pourquoi ma banque ne me rembourse-t-elle pas automatiquement ?", "answer": "Parce que les opérations ont été validées depuis vos propres dispositifs d''authentification. C''est précisément l''objectif de l''attaque. Cela ne vous prive pas de recours : contestez par écrit auprès de votre banque, et déposez plainte."},
    {"question": "Un vrai conseiller peut-il me demander un code SMS ?", "answer": "Non. Aucun code d''authentification ne doit être communiqué à qui que ce soit, y compris à une personne se présentant comme votre banque ou comme la police."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'SOCIAL-000001';

-- ------------------------------------------------------------
-- SOCIAL-000002 — Faux livreur / colis en attente
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au colis est un SMS ou un email prétendant qu''une livraison est bloquée et qu''un petit paiement — frais de douane, de réexpédition, d''ajustement — est nécessaire pour la débloquer.',
  how_it_works = 'Le message imite un transporteur connu et annonce un colis en attente. Le montant réclamé est volontairement faible, souvent quelques euros, car une petite somme déclenche moins de méfiance qu''un montant important. La page de paiement collecte les coordonnées bancaires complètes. Celles-ci servent ensuite à des débits nettement supérieurs, ou à souscrire un abonnement récurrent. L''attaque fonctionne parce qu''elle arrive à un moment plausible : beaucoup de gens attendent effectivement une livraison.',
  warning_signs = array[
    'Frais réclamés pour un colis que vous n''avez pas commandé, ou dont le transporteur ne correspond pas',
    'Montant faible mais paiement par carte demandé en ligne',
    'Lien menant à un domaine qui n''est pas le site officiel du transporteur',
    'Message reçu alors qu''aucune livraison n''est en cours',
    'Absence de numéro de suivi vérifiable sur le site officiel'
  ],
  how_to_verify = 'Retrouvez le numéro de suivi dans la confirmation de commande d''origine, puis saisissez-le vous-même sur le site officiel du transporteur. Ne suivez jamais le lien du message pour vérifier le message lui-même.',
  what_to_do = 'Ne payez pas, ne saisissez pas votre carte. Supprimez le message. En France, un SMS frauduleux peut être transféré au 33700.',
  what_to_do_if_victim = 'Faites opposition sur votre carte immédiatement et surveillez les prélèvements des semaines suivantes, notamment les abonnements récurrents. Contestez les débits auprès de votre banque et déposez plainte.',
  faq = '[
    {"question": "Le montant demandé était minuscule, où est le risque ?", "answer": "Le paiement n''est pas l''objectif : la collecte de vos coordonnées bancaires l''est. Le faible montant sert uniquement à obtenir la saisie complète de la carte."},
    {"question": "J''attends vraiment un colis, comment savoir ?", "answer": "Un transporteur légitime rattache toujours la démarche à un numéro de suivi que vous pouvez vérifier vous-même sur son site officiel. Vérifiez ce numéro par vos propres moyens, jamais via le lien reçu."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'SOCIAL-000002';

-- ------------------------------------------------------------
-- SOCIAL-000003 — Faux support technique
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au faux support technique fait croire que votre ordinateur est infecté ou bloqué, afin d''obtenir un accès à distance à la machine ou le paiement d''une assistance inutile.',
  how_it_works = 'Le point de départ est souvent une page web affichant une alerte alarmante, parfois accompagnée d''un son et d''un message empêchant de fermer la fenêtre, avec un numéro à appeler. Au téléphone, un interlocuteur se présentant comme technicien demande d''installer un logiciel de prise en main à distance — outil légitime, détourné de son usage. Une fois connecté, il montre des éléments anodins du système présentés comme des preuves d''infection, puis facture une intervention, souscrit un abonnement, ou installe un logiciel malveillant.',
  warning_signs = array[
    'Page web ou fenêtre affichant une alerte de sécurité avec un numéro de téléphone à appeler',
    'Impossibilité apparente de fermer la fenêtre d''alerte',
    'Demande d''installer un outil de prise de contrôle à distance',
    'Éditeur légitime invoqué (système d''exploitation, antivirus) alors qu''aucun éditeur n''appelle spontanément',
    'Paiement demandé par carte, virement ou cartes prépayées'
  ],
  how_to_verify = 'Aucun éditeur de logiciel ni fournisseur d''accès ne détecte une infection sur votre machine à distance pour vous appeler ensuite. Une alerte affichée dans un navigateur est une page web, pas un diagnostic de votre appareil : fermez l''onglet, au besoin en fermant le navigateur.',
  what_to_do = 'N''appelez pas le numéro affiché, n''installez aucun logiciel de prise en main. Fermez le navigateur et, si nécessaire, redémarrez l''appareil.',
  what_to_do_if_victim = 'Déconnectez l''appareil d''internet, désinstallez tout outil de prise à distance installé pendant l''appel et faites analyser la machine. Changez vos mots de passe depuis un autre appareil sain, en commençant par la messagerie et la banque. Faites opposition si un paiement a été effectué, et signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le technicien m''a montré des erreurs dans le système, ce n''était pas réel ?", "answer": "Les éléments affichés sont généralement des journaux d''événements normaux, présents sur toute machine en bon état, présentés comme des preuves d''infection. C''est un procédé de mise en scène, pas un diagnostic."},
    {"question": "J''ai laissé quelqu''un prendre la main sur mon ordinateur, que risque-t-il d''avoir vu ?", "answer": "Tout ce qui était accessible sur la session : fichiers, messagerie, mots de passe enregistrés dans le navigateur, sessions ouvertes. Changez vos mots de passe depuis un autre appareil et faites vérifier la machine."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Faux support technique", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/faux-support-technique-arnaque"}]'::jsonb
where code = 'SOCIAL-000003';

-- ------------------------------------------------------------
-- PAYMENT-000001 — Faux remboursement
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au faux remboursement annonce qu''une somme vous est due — impôts, mutuelle, énergie, abonnement — et demande vos coordonnées bancaires pour « procéder au versement ».',
  how_it_works = 'Le message reprend l''identité d''un organisme public ou d''un fournisseur et annonce un trop-perçu à restituer. La perspective de recevoir de l''argent réduit la vigilance : contrairement à une menace, une bonne nouvelle n''éveille pas la méfiance. Le formulaire demande les coordonnées bancaires complètes, souvent le numéro de carte plutôt qu''un simple IBAN — détail révélateur, car un remboursement ne nécessite jamais un numéro de carte complet avec date d''expiration et cryptogramme.',
  warning_signs = array[
    'Remboursement annoncé sans démarche préalable de votre part',
    'Demande du numéro de carte bancaire complet, avec cryptogramme, pour recevoir de l''argent',
    'Délai imposé pour « réclamer » la somme sous peine de la perdre',
    'Montant précis destiné à rendre le message crédible',
    'Domaine du lien différent du site officiel de l''organisme'
  ],
  how_to_verify = 'Connectez-vous à votre espace personnel officiel par vos propres moyens. Un remboursement réel y figure. Un organisme public ne réclame jamais un numéro de carte pour verser de l''argent : un versement se fait sur un IBAN déjà connu.',
  what_to_do = 'Ne saisissez aucune coordonnée bancaire. Supprimez le message et signalez-le comme frauduleux.',
  what_to_do_if_victim = 'Faites opposition sur votre carte, surveillez les prélèvements suivants et contestez les débits non autorisés auprès de votre banque. Déposez plainte et signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Pourquoi demander une carte bancaire pour un remboursement ?", "answer": "C''est précisément le signal d''alerte. Un versement ne nécessite qu''un IBAN. La demande d''un numéro de carte complet, avec date d''expiration et cryptogramme, ne sert qu''à débiter, jamais à créditer."},
    {"question": "Le message reprenait exactement le logo de l''administration.", "answer": "Un logo se copie en quelques secondes. L''apparence d''un message ne constitue jamais une preuve d''authenticité : seul l''accès à votre espace officiel, par vos propres moyens, permet de vérifier."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'PAYMENT-000001';

-- ------------------------------------------------------------
-- IDN-000001 — Typosquatting
-- ------------------------------------------------------------
update attacks set
  definition = 'Le typosquatting consiste à enregistrer un nom de domaine très proche d''un site légitime — une lettre en moins, une inversion, une extension différente — pour capter les visiteurs qui se trompent en saisissant l''adresse ou qui lisent trop vite.',
  how_it_works = 'L''attaquant enregistre des variantes plausibles du domaine visé : faute de frappe courante, doublement ou omission d''une lettre, tiret ajouté, extension différente. Le site hébergé reproduit l''apparence de l''original. Le visiteur, persuadé d''être au bon endroit, s''y connecte normalement. La technique se combine souvent avec l''hameçonnage : le domaine trompeur sert de destination à un lien envoyé par email ou SMS, où il paraît crédible à la lecture.',
  warning_signs = array[
    'Adresse presque identique à celle attendue, à une lettre ou un caractère près',
    'Extension inhabituelle pour l''organisme concerné',
    'Tiret inséré dans un nom de domaine qui n''en comporte pas habituellement',
    'Page de connexion demandant des identifiants après un lien reçu par message',
    'Absence des éléments personnalisés habituels une fois « connecté »'
  ],
  how_to_verify = 'Lisez l''adresse en partant de la fin du nom de domaine, juste avant la première barre oblique : c''est cette partie qui détermine à qui appartient réellement le site. Le plus sûr reste de ne pas saisir l''adresse du tout et d''utiliser un favori enregistré une fois pour toutes.',
  what_to_do = 'Ne saisissez aucun identifiant. Quittez la page et rejoignez le site par un favori ou l''application officielle.',
  what_to_do_if_victim = 'Changez immédiatement le mot de passe du service concerné, ainsi que celui de tout compte réutilisant le même mot de passe. Activez la double authentification et vérifiez les connexions récentes du compte.',
  faq = '[
    {"question": "Quelle différence avec une attaque par homoglyphes ?", "answer": "Le typosquatting utilise des caractères ordinaires arrangés différemment — une faute de frappe crédible. L''attaque par homoglyphes utilise des caractères différents mais visuellement identiques, ce qui la rend indétectable à la simple lecture."},
    {"question": "Le cadenas était affiché, le site n''était-il pas sécurisé ?", "answer": "Le cadenas indique seulement que la connexion est chiffrée, pas que le site est légitime. N''importe quel site, y compris frauduleux, peut obtenir un certificat."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'IDN-000001';

-- ------------------------------------------------------------
-- IDN-000002 — Attaque par homoglyphes
-- ------------------------------------------------------------
update attacks set
  definition = 'Une attaque par homoglyphes utilise des caractères issus d''alphabets différents mais visuellement identiques aux caractères latins pour composer une adresse web qui paraît authentique à la lecture, tout en désignant un domaine entièrement distinct.',
  how_it_works = 'Plusieurs systèmes d''écriture partagent des formes de lettres identiques ou quasi identiques : certaines lettres cyrilliques ou grecques sont indiscernables de leurs équivalents latins à l''œil nu. En substituant une seule de ces lettres dans un nom de domaine, l''attaquant obtient une adresse qui s''affiche comme l''originale mais pointe vers son propre serveur. Contrairement au typosquatting, il n''y a ici aucune faute à repérer : la lecture attentive ne suffit pas, car les caractères sont réellement différents pour la machine tout en étant identiques pour l''œil. Les navigateurs se défendent en affichant ces domaines sous leur forme technique encodée lorsqu''ils mélangent des alphabets.',
  warning_signs = array[
    'Adresse affichée sous une forme technique commençant par « xn-- », signe d''un domaine internationalisé',
    'Avertissement du navigateur signalant un domaine mêlant plusieurs alphabets',
    'Lien reçu par message dont l''adresse paraît pourtant parfaitement correcte',
    'Page de connexion atteinte via un lien plutôt que par un favori',
    'Le gestionnaire de mots de passe ne propose pas de remplir le formulaire'
  ],
  how_to_verify = 'Le signal le plus fiable est le comportement de votre gestionnaire de mots de passe : il associe vos identifiants au domaine réel, pas à son apparence. S''il ne propose rien sur un site que vous utilisez habituellement, considérez que le domaine n''est pas celui attendu. Sinon, rejoignez le service par un favori enregistré.',
  what_to_do = 'Ne saisissez aucun identifiant. Fermez l''onglet et accédez au service par un chemin que vous maîtrisez.',
  what_to_do_if_victim = 'Changez le mot de passe du service concerné depuis une session ouverte par vos propres moyens, activez la double authentification et vérifiez l''historique de connexion du compte.',
  faq = '[
    {"question": "Comment vérifier une adresse qui semble identique à la vraie ?", "answer": "Ne vous fiez pas à la lecture : c''est précisément ce que l''attaque contourne. Fiez-vous au comportement de votre gestionnaire de mots de passe, ou n''utilisez pas le lien du tout et passez par un favori."},
    {"question": "Cette attaque fonctionne-t-elle aussi sur téléphone ?", "answer": "Oui, et le risque y est accru : les navigateurs mobiles affichent l''adresse de façon tronquée, ce qui laisse encore moins d''éléments visibles pour repérer une anomalie."},
    {"question": "Que signifie une adresse commençant par xn-- ?", "answer": "C''est la forme encodée d''un domaine contenant des caractères non latins. Ce n''est pas frauduleux en soi, mais voir cette forme là où vous attendiez un nom ordinaire justifie de ne pas s''y connecter."}
  ]'::jsonb,
  "references" = '[
    {"label": "Unicode Consortium — Unicode Security Considerations (UTS #36)", "url": "https://www.unicode.org/reports/tr36/"},
    {"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}
  ]'::jsonb
where code = 'IDN-000002';

-- ------------------------------------------------------------
-- QR-000001 — Quishing (QR code frauduleux)
-- ------------------------------------------------------------
update attacks set
  definition = 'Le quishing est l''utilisation d''un QR code pour diriger vers un site frauduleux : le code masque l''adresse de destination, qui n''est donc pas lisible avant d''être ouverte.',
  how_it_works = 'Un QR code n''est qu''une adresse encodée sous forme graphique. Rien dans son apparence n''indique où il mène : deux codes visuellement semblables peuvent pointer vers des destinations sans rapport. L''attaquant place un code frauduleux là où la démarche paraît normale — autocollant apposé sur un horodateur ou une borne, courrier imitant une administration, affiche dans un lieu public — et la destination reproduit un service de paiement ou une page de connexion. Le scan se fait le plus souvent au téléphone, où l''adresse s''affiche tronquée et où l''on est moins attentif qu''au bureau.',
  warning_signs = array[
    'Autocollant apposé par-dessus un QR code d''origine, ou code visiblement rapporté',
    'Adresse affichée après le scan sans rapport avec l''organisme attendu',
    'Demande de paiement immédiat ou de saisie d''identifiants après un simple scan',
    'QR code reçu par courrier ou par message pour une démarche non sollicitée',
    'Redirections successives entre le scan et la page finale'
  ],
  how_to_verify = 'Avant d''ouvrir, lisez l''adresse que votre téléphone affiche en aperçu et vérifiez le nom de domaine. Pour un paiement ou une démarche administrative, ignorez le code et rejoignez le service officiel par vos propres moyens : un QR code n''est jamais le seul chemin disponible.',
  what_to_do = 'N''ouvrez pas la page si le domaine ne correspond pas à l''organisme attendu. Sur un support physique, vérifiez qu''aucun autocollant ne recouvre le code d''origine.',
  what_to_do_if_victim = 'Si des coordonnées bancaires ont été saisies, faites opposition immédiatement. Si des identifiants ont été saisis, changez le mot de passe concerné et activez la double authentification. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le simple fait de scanner un QR code est-il dangereux ?", "answer": "Scanner ne fait qu''afficher une adresse. Le risque commence à l''ouverture de la page et surtout à la saisie d''informations. Prenez l''habitude de lire l''aperçu de l''adresse avant d''ouvrir."},
    {"question": "Comment repérer un QR code frauduleux sur un support physique ?", "answer": "Passez le doigt dessus : un autocollant apposé par-dessus le code d''origine se sent au toucher et constitue le signal le plus fiable sur une borne ou un horodateur."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'QR-000001';

-- ------------------------------------------------------------
-- Psychological triggers.
--
-- MUST run before publication: the publish gate is enforced by a database
-- trigger (see supabase/migrations/0001_init.sql), which rejects
-- `published_at` on an attack with no trigger or indicator. Setting
-- published_at in the UPDATEs above fails with:
--   "cannot be published: needs at least one trigger or indicator"
-- Idempotent.
-- ------------------------------------------------------------
insert into attack_triggers (attack_id, trigger_code)
select a.id, t.code
from attacks a
join (values
  ('PHISH-000001',   'urgency'),
  ('PHISH-000001',   'authority'),
  ('PHISH-000001',   'fear'),
  ('SOCIAL-000001',  'authority'),
  ('SOCIAL-000001',  'urgency'),
  ('SOCIAL-000001',  'fear'),
  ('SOCIAL-000002',  'urgency'),
  ('SOCIAL-000002',  'curiosity'),
  ('SOCIAL-000003',  'fear'),
  ('SOCIAL-000003',  'authority'),
  ('PAYMENT-000001', 'reward'),
  ('PAYMENT-000001', 'financial_incentive'),
  ('IDN-000001',     'trust'),
  ('IDN-000002',     'trust'),
  ('QR-000001',      'trust'),
  ('QR-000001',      'curiosity')
) as t(attack_code, code) on t.attack_code = a.code
on conflict do nothing;

-- ------------------------------------------------------------
-- Related-attack edges. Symmetric, so each page links both ways.
-- ------------------------------------------------------------
insert into attack_related (attack_id, related_attack_id)
select a.id, b.id
from (values
  ('PHISH-000001',  'SMS-000001'),
  ('SMS-000001',    'PHISH-000001'),
  ('IDN-000001',    'IDN-000002'),
  ('IDN-000002',    'IDN-000001'),
  ('IDN-000002',    'PHISH-000001'),
  ('QR-000001',     'PHISH-000001'),
  ('SOCIAL-000001', 'SOCIAL-000003'),
  ('SOCIAL-000003', 'SOCIAL-000001'),
  ('SOCIAL-000002', 'SMS-000001'),
  ('PAYMENT-000001','PHISH-000001')
) as e(from_code, to_code)
join attacks a on a.code = e.from_code
join attacks b on b.code = e.to_code
on conflict do nothing;

-- ------------------------------------------------------------
-- Publication. Last, so the gate's precondition is already satisfied.
-- ------------------------------------------------------------
update attacks set published_at = now()
where code in (
  'PHISH-000001', 'SOCIAL-000001', 'SOCIAL-000002', 'SOCIAL-000003',
  'PAYMENT-000001', 'IDN-000001', 'IDN-000002', 'QR-000001'
) and published_at is null;


-- ---------------------------------------------------------------------
-- seed/0003_simulation_content.sql
-- ---------------------------------------------------------------------
-- ============================================================
-- Seed 0003 — a published simulation for every published attack.
--
-- WHY THIS EXISTS
-- Seeds 0001 and 0002 publish nine attacks but exactly one scenario
-- (SCENARIO-000001, smishing). The consequences were product-wide, and none
-- of them looked like an error:
--   * /simulations listed a single card — the site's headline feature read as
--     unfinished rather than broken.
--   * Eight of the nine attack pages rendered no "Testez-vous" section at all,
--     because `listPublishedScenariosForAttack()` correctly found nothing to
--     link (docs/SEO_CURRENT_STATE_AUDIT.md H-3).
--   * The free quota is ten simulations (docs/SIMULATION_QUOTA.md), so with one
--     scenario a visitor could never reach the paywall by playing the
--     catalogue. The entitlement and Stripe paths were unreachable in practice.
--
-- This file authors and publishes one scenario per remaining attack.
--
-- CONTENT RULES (docs/decisions/0002-synthetic-content-only.md, brief §14)
--   * Every impersonated entity is explicitly fictional ("Banque Fictive",
--     "Transporteur Fictif", …) and every domain sits under
--     `example-not-real.test`, a name that cannot resolve.
--   * No real organisation, statistic, incident, victim or date.
--   * Each scenario teaches the verification reflex; none of them is
--     operational guidance for conducting an attack.
--
-- SCHEMA CONTRACT (supabase/migrations/0001_init.sql)
--   * `correct_choice_ids` must be non-empty.
--   * Exactly one choice per scenario carries `isUnsure: true` — "Je ne sais
--     pas" is mandatory (brief §13) and enforced by a trigger.
--   * `explanations` carries an entry for EVERY choice id, including the
--     unsure one: the player shows an explanation whatever the visitor picks.
--
-- Idempotent: safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- Learning objectives, one per dimension exercised below.
-- ------------------------------------------------------------
insert into learning_objectives (code, description_fr, dimension) values
  ('LO-PHISH-001', 'Repérer un email qui imite un service en ligne et rejoindre le service par un chemin maîtrisé.', 'phishing_recognition'),
  ('LO-SMS-002', 'Refuser une demande de frais présentée par SMS et vérifier une livraison par le canal officiel.', 'sms_scam_recognition'),
  ('LO-SOCIAL-001', 'Raccrocher face à un appel qui demande de valider une opération, et rappeler soi-même.', 'social_engineering_resistance'),
  ('LO-SOCIAL-002', 'Refuser une prise de contrôle à distance sollicitée par un appel ou un message d''alerte.', 'social_engineering_resistance'),
  ('LO-PAYMENT-001', 'Reconnaître une promesse de remboursement qui sert à collecter des coordonnées bancaires.', 'financial_fraud_recognition'),
  ('LO-URL-001', 'Lire une adresse web caractère par caractère avant de saisir des identifiants.', 'url_verification'),
  ('LO-URL-002', 'Se méfier d''une adresse dont les caractères imitent visuellement ceux d''un domaine connu.', 'url_verification'),
  ('LO-QR-001', 'Ne pas payer depuis un QR code affiché en libre accès sur un support physique.', 'qr_phishing_recognition')
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- Scenario rows. `attack_id` is resolved from the stable attack code, never
-- from a hardcoded uuid.
-- ------------------------------------------------------------
insert into scenarios (code, attack_id, slug)
select v.scenario_code, a.id, v.slug
from (values
  ('SCENARIO-000002', 'PHISH-000001',   'email-espace-client-suspendu'),
  ('SCENARIO-000003', 'SOCIAL-000002',  'sms-colis-en-attente'),
  ('SCENARIO-000004', 'SOCIAL-000001',  'appel-conseiller-bancaire'),
  ('SCENARIO-000005', 'SOCIAL-000003',  'appel-support-technique'),
  ('SCENARIO-000006', 'PAYMENT-000001', 'email-faux-remboursement'),
  ('SCENARIO-000007', 'IDN-000001',     'adresse-mal-orthographiee'),
  ('SCENARIO-000008', 'IDN-000002',     'caracteres-similaires-dans-une-adresse'),
  ('SCENARIO-000009', 'QR-000001',      'qr-code-de-stationnement')
) as v(scenario_code, attack_code, slug)
join attacks a on a.code = v.attack_code
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000002 — Phishing par email (PHISH-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'email', 'general', 2, 'Boutique Fictive',
  '{"sender": "Boutique Fictive <securite@boutique-fictive-verif.example-not-real.test>", "body": "Objet : Votre espace client a été suspendu\n\nCher client,\n\nUne anomalie de facturation a été détectée sur votre compte. Votre espace client est suspendu et vos commandes en cours seront annulées sous 24 heures.\n\nPour le réactiver, confirmez vos identifiants ici :\nhttps://boutique-fictive-verif.example-not-real.test/reactivation\n\nLe service sécurité", "ui": "email"}'::jsonb,
  '[
    {"id": "click", "label": "Je clique sur le lien et je confirme mes identifiants", "mistakePatternCodes": ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "reply", "label": "Je réponds à l''email pour demander de quelle facture il s''agit", "mistakePatternCodes": ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "verify", "label": "J''ouvre le site de la boutique depuis mon favori ou son application, sans utiliser le lien", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "click": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Le domaine de l''expéditeur et du lien est \"boutique-fictive-verif.example-not-real.test\", pas celui de la boutique", "whyDangerous": "La page d''arrivée imite la page de connexion officielle : les identifiants saisis partent directement chez l''attaquant, qui s''en sert immédiatement sur le vrai site.", "reflex": "Ne rejoignez jamais un espace client par le lien d''un email : passez par un favori, l''application officielle, ou une adresse saisie à la main."},
    "reply": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Le nom affiché (\"Boutique Fictive\") est choisi par l''expéditeur ; seule l''adresse complète compte", "whyDangerous": "Répondre confirme que votre adresse est lue et relance l''échange sur le terrain de l''attaquant, qui contrôle la conversation.", "reflex": "Ne répondez pas au message : vérifiez l''information sur le service lui-même, par un chemin que vous maîtrisez."},
    "verify": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Une menace d''annulation sous 24 heures, destinée à faire agir avant de vérifier", "whyDangerous": "N/A — c''est la bonne réponse : en rejoignant le service par votre propre chemin, vous constatez que l''alerte n''y figure pas.", "reflex": "Une information vraie se retrouve toujours dans votre espace client officiel. Si elle n''y est pas, elle est fausse."},
    "unsure": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Formulation impersonnelle (\"Cher client\") de la part d''un service qui connaît votre nom", "whyDangerous": "Ne pas savoir est une réaction saine face à un message conçu pour paraître légitime ; l''erreur serait d''agir malgré le doute.", "reflex": "Dans le doute, ne cliquez pas : ouvrez le service par vous-même et vérifiez si l''alerte existe."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000002'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000003 — Faux colis en attente (SOCIAL-000002)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'sms', 'general', 1, 'Transporteur Fictif',
  '{"sender": "Transporteur Fictif", "body": "TRANSPORTEUR FICTIF : votre colis est en attente de livraison. Des frais de dedouanement de 1,99 EUR restent a regler sous 48h, sans quoi le colis sera retourne a l''expediteur : https://suivi-colis-fictif.example-not-real.test/paiement", "ui": "sms"}'::jsonb,
  '[
    {"id": "pay", "label": "Je paie les 1,99 € : le montant est faible et j''attends un colis", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "CLICKED_UNKNOWN_LINK", "TRUSTED_BRAND_NAME"]},
    {"id": "open", "label": "J''ouvre le lien pour voir de quel colis il s''agit, sans rien payer", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "verify", "label": "Je vérifie mes livraisons en cours dans l''application du transporteur ou avec le numéro de suivi du commerçant", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "pay": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Une demande de paiement arrivée par SMS, pour un montant volontairement dérisoire", "whyDangerous": "Le but n''est pas le 1,99 € mais le formulaire de paiement : la carte saisie sert ensuite à des débits bien plus élevés, parfois par abonnement.", "reflex": "Un transporteur ne réclame pas de frais par SMS. Ne saisissez jamais une carte depuis un lien reçu."},
    "open": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Le domaine \"suivi-colis-fictif.example-not-real.test\" n''est pas celui du transporteur", "whyDangerous": "La page est conçue pour paraître authentique et vous faire changer d''avis ; ouvrir le lien confirme aussi que votre numéro est actif.", "reflex": "Le suivi d''un colis se consulte dans l''application du transporteur ou depuis la commande, jamais depuis un lien non sollicité."},
    "verify": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Le message ne cite ni commande, ni expéditeur, ni numéro de suivi réel", "whyDangerous": "N/A — c''est la bonne réponse : le suivi officiel montre qu''aucun colis n''attend de paiement.", "reflex": "Partez toujours de votre commande ou de l''application officielle, jamais du message reçu."},
    "unsure": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Un délai de 48 h et une menace de retour du colis, pour empêcher la vérification", "whyDangerous": "Ces SMS sont envoyés en masse : ils tombent juste parce que beaucoup de gens attendent effectivement un colis.", "reflex": "Dans le doute, ne payez rien et vérifiez la livraison par le canal officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000003'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000004 — Faux conseiller bancaire (SOCIAL-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'phone', 'senior', 4, 'Banque Fictive — service anti-fraude',
  '{"sender": "Appel entrant — numéro affiché : celui figurant au dos de votre carte", "body": "« Bonjour, service anti-fraude de la Banque Fictive. Nous bloquons en ce moment un paiement de 840 € depuis votre compte, passé à l''étranger. Ce n''est pas vous, je suppose ? Je vais l''annuler tout de suite, mais le système va vous envoyer un code par SMS pour confirmer l''annulation. Ne raccrochez surtout pas, la ligne est sécurisée — sinon l''opération partira. »", "ui": "call"}'::jsonb,
  '[
    {"id": "code", "label": "Je communique le code reçu par SMS pour faire annuler le paiement", "mistakePatternCodes": ["SHARED_MFA_CODE", "TRUSTED_AUTHORITY", "RESPONDED_TO_URGENCY"]},
    {"id": "transfer", "label": "J''accepte de virer mon solde vers le « compte sécurisé » qu''il me dicte", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "hangup", "label": "Je raccroche, puis je rappelle moi-même le numéro au dos de ma carte", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['hangup'],
  '{
    "code": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "Une demande de communiquer un code reçu par SMS — ce qu''aucune banque ne fait", "whyDangerous": "Le code n''annule rien : il autorise l''opération de l''attaquant. C''est vous qui la validez, ce qui rend la contestation ensuite beaucoup plus difficile.", "reflex": "Un code reçu par SMS ne se dicte à personne, quel que soit le numéro affiché."},
    "transfer": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "L''expression « compte sécurisé » : cela n''existe pas dans une banque", "whyDangerous": "Le virement part vers un compte contrôlé par l''attaquant, et il a été ordonné par vous depuis votre propre accès.", "reflex": "Aucune banque ne demande de déplacer de l''argent pour le protéger. Cette phrase seule suffit à identifier la fraude."},
    "hangup": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "L''insistance à ne pas raccrocher — le seul geste qui casse l''attaque", "whyDangerous": "N/A — c''est la bonne réponse : en rappelant vous-même, vous choisissez l''interlocuteur au lieu de le subir.", "reflex": "Raccrochez systématiquement, puis rappelez le numéro officiel. Un vrai conseiller ne vous le reprochera jamais."},
    "unsure": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "Le numéro affiché est celui de la banque : il peut être usurpé et ne prouve rien", "whyDangerous": "L''appel est construit pour ne laisser aucun temps de réflexion ; hésiter est déjà une bonne défense.", "reflex": "Dans le doute, raccrochez. Vous pouvez toujours rappeler ; vous ne pouvez pas annuler un code communiqué."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000004'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000005 — Faux support technique (SOCIAL-000003)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'phone', 'senior', 3, 'Support Technique Fictif',
  '{"sender": "Fenêtre d''alerte sur l''écran, puis appel au numéro affiché", "body": "Une page s''ouvre en plein écran avec une alarme sonore : « ALERTE SÉCURITÉ — votre ordinateur est infecté. Ne l''éteignez pas. Appelez immédiatement le support au numéro ci-dessous. » Vous appelez. Un technicien répond, se dit mandaté par l''éditeur de votre système, et vous demande d''installer un petit logiciel pour qu''il puisse « prendre la main et nettoyer la machine ».", "ui": "web"}'::jsonb,
  '[
    {"id": "install", "label": "J''installe le logiciel pour qu''il puisse réparer l''ordinateur à distance", "mistakePatternCodes": ["TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "card", "label": "Je donne ma carte pour régler la « licence de dépannage » qu''il facture", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_AUTHORITY"]},
    {"id": "close", "label": "Je raccroche, je ferme la fenêtre (ou je redémarre), et je passe par le support officiel du fabricant", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['close'],
  '{
    "install": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "C''est vous qui appelez un numéro affiché par la page suspecte elle-même", "whyDangerous": "L''outil de prise en main donne un accès complet à l''appareil : fichiers, messagerie, sessions bancaires déjà ouvertes. Vous l''avez autorisé, donc rien ne le bloque.", "reflex": "N''installez jamais un outil de prise en main à la demande de quelqu''un qui vous a contacté ou dont vous tenez le numéro d''un message d''alerte."},
    "card": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Un dépannage facturé dans l''urgence, par téléphone, sans devis ni contrat", "whyDangerous": "Le paiement n''achète aucun service et livre en plus vos coordonnées bancaires, souvent réutilisées ensuite.", "reflex": "Un éditeur ne détecte pas d''infection sur votre machine et ne vend pas de dépannage par un message d''alerte."},
    "close": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Une page web ne peut pas analyser votre ordinateur : l''alerte est une simple image animée", "whyDangerous": "N/A — c''est la bonne réponse : la fenêtre n''a aucun pouvoir sur la machine, la fermer suffit.", "reflex": "Fermez la page (au besoin en redémarrant), puis contactez le support par l''adresse officielle du fabricant."},
    "unsure": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Alarme sonore et interdiction d''éteindre : deux signaux d''une mise sous pression", "whyDangerous": "La panique est le mécanisme de l''attaque ; ne rien faire immédiatement est déjà la bonne direction.", "reflex": "Dans le doute, n''installez rien et ne payez rien : demandez de l''aide à un proche ou au support officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000005'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000006 — Faux remboursement (PAYMENT-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'email', 'general', 2, 'Service Fictif des Remboursements',
  '{"sender": "Service Fictif des Remboursements <remboursement@service-fictif-remb.example-not-real.test>", "body": "Objet : Remboursement de 128,40 € en attente\n\nBonjour,\n\nÀ la suite d''un trop-perçu, un remboursement de 128,40 € vous est dû. Le versement ne peut être effectué qu''après vérification de vos coordonnées bancaires.\n\nRenseignez-les avant le 30 du mois, faute de quoi la demande sera clôturée :\nhttps://service-fictif-remb.example-not-real.test/formulaire", "ui": "email"}'::jsonb,
  '[
    {"id": "form", "label": "Je remplis le formulaire avec mon IBAN et ma carte pour recevoir le remboursement", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "CLICKED_UNKNOWN_LINK", "TRUSTED_AUTHORITY"]},
    {"id": "peek", "label": "J''ouvre le lien pour voir le montant, quitte à ne rien remplir", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "account", "label": "Je me connecte à mon espace officiel par mes propres moyens et je regarde si un remboursement y figure", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['account'],
  '{
    "form": {"technique": "Appât du gain et fausse échéance", "indicator": "Des coordonnées bancaires complètes demandées pour *recevoir* de l''argent", "whyDangerous": "Un IBAN suffit à mettre en place des prélèvements, et la carte saisie est débitée ailleurs. Le remboursement annoncé n''existe pas.", "reflex": "Un versement en votre faveur n''exige jamais votre numéro de carte : un IBAN déjà connu de l''organisme suffit."},
    "peek": {"technique": "Appât du gain et fausse échéance", "indicator": "Le domaine \"service-fictif-remb.example-not-real.test\" est celui de l''expéditeur, pas d''une administration", "whyDangerous": "La page est conçue pour convaincre : une fois dessus, le montant affiché et la mise en page font le reste du travail.", "reflex": "Ne jugez pas un message à ce qu''il montre : vérifiez l''information à sa source, sans passer par son lien."},
    "account": {"technique": "Appât du gain et fausse échéance", "indicator": "Une somme précise et inattendue, assortie d''une date limite", "whyDangerous": "N/A — c''est la bonne réponse : un remboursement réel apparaît dans votre espace officiel, sans qu''un email soit nécessaire.", "reflex": "Une bonne nouvelle inattendue mérite la même vérification qu''une mauvaise."},
    "unsure": {"technique": "Appât du gain et fausse échéance", "indicator": "La clôture annoncée de la demande : une pression temporelle sur une décision financière", "whyDangerous": "L''appât du gain désarme la méfiance plus efficacement que la menace ; hésiter est déjà un bon réflexe.", "reflex": "Dans le doute, ne saisissez aucune coordonnée bancaire et vérifiez depuis votre espace officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000006'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000007 — Typosquatting (IDN-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'web', 'general', 3, 'Banque Fictive',
  '{"sender": "Barre d''adresse : https://banque-ficitve.example-not-real.test/connexion", "body": "Vous cherchez le site de votre banque et vous cliquez sur le premier résultat proposé. La page qui s''ouvre est exactement celle que vous connaissez : mêmes couleurs, même logo, même formulaire « Identifiant / Code secret ». Le navigateur affiche bien un cadenas. Dans la barre d''adresse : banque-ficitve.example-not-real.test", "ui": "web"}'::jsonb,
  '[
    {"id": "login", "label": "Je saisis mes identifiants : la page est identique à celle que j''utilise d''habitude", "mistakePatternCodes": ["TRUSTED_LOGO", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "padlock", "label": "Je continue : le cadenas indique que la connexion est sécurisée", "mistakePatternCodes": ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "leave", "label": "Je ferme l''onglet et je rejoins ma banque par mon favori ou son application", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['leave'],
  '{
    "login": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Deux lettres sont inversées : \"ficitve\" au lieu de \"fictive\"", "whyDangerous": "Le site est une copie qui transmet vos identifiants à l''attaquant, parfois en les rejouant en direct sur le vrai site pendant que vous croyez vous connecter.", "reflex": "Lisez le domaine caractère par caractère avant de saisir un identifiant. L''apparence de la page ne prouve rien : elle se copie en une commande."},
    "padlock": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Le cadenas ne dit rien du propriétaire : il n''atteste que du chiffrement", "whyDangerous": "N''importe qui obtient un certificat pour son propre domaine frauduleux ; le cadenas est donc présent sur la quasi-totalité des sites de phishing.", "reflex": "Le cadenas certifie que la connexion est chiffrée, pas que le site est le bon. Seul le domaine le dit."},
    "leave": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Vous êtes arrivé par un résultat de recherche, pas par un chemin que vous maîtrisez", "whyDangerous": "N/A — c''est la bonne réponse : le favori et l''application officielle ne peuvent pas se tromper de domaine.", "reflex": "Enregistrez vos sites sensibles en favori une bonne fois, et n''y accédez plus jamais par un moteur de recherche."},
    "unsure": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Une page parfaitement conforme sur une adresse presque conforme", "whyDangerous": "L''œil lit les mots globalement, pas lettre à lettre : ne pas voir la différence est la norme, pas une faute d''attention.", "reflex": "Dans le doute, ne saisissez rien et repartez de votre favori."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000007'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000008 — Homoglyphes (IDN-000002)
-- Deliberately the hardest of the set: the substituted character is a real
-- homoglyph (U+0131, « ı » sans point), so the address is indistinguishable
-- at a glance and only the punycode form gives it away.
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'web', 'business', 5, 'Fournisseur Fictif',
  '{"sender": "Email de relance — lien : https://fournisseur-fıctif.example-not-real.test/facture", "body": "Vous êtes en charge des règlements. Un fournisseur habituel relance une facture impayée et joint un lien vers son portail. Le message reprend vos références internes et le nom de votre interlocuteur habituel. L''adresse du lien semble être exactement celle du portail que vous utilisez chaque mois. Sur le portail, un encart annonce que les coordonnées bancaires du fournisseur ont changé et invite à régler sur un nouvel IBAN.", "ui": "web"}'::jsonb,
  '[
    {"id": "pay", "label": "Je règle la facture sur le nouvel IBAN indiqué sur le portail", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "reply", "label": "Je réponds à l''email pour faire confirmer le changement d''IBAN", "mistakePatternCodes": ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "callback", "label": "Je bloque le règlement et j''appelle le fournisseur au numéro de nos contrats, pas à celui du message", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['callback'],
  '{
    "pay": {"technique": "Homoglyphe et détournement de virement", "indicator": "Le « i » de « fictif » est un « ı » sans point (U+0131) : copié dans un éditeur de texte, le domaine apparaît sous sa forme \"xn--\"", "whyDangerous": "Le virement part vers un compte contrôlé par l''attaquant, avec un ordre parfaitement régulier de votre côté — c''est le type de fraude le plus difficile à récupérer.", "reflex": "Un changement de coordonnées bancaires ne se valide jamais depuis le canal qui l''annonce."},
    "reply": {"technique": "Homoglyphe et détournement de virement", "indicator": "L''adresse de réponse appartient au domaine frauduleux : la confirmation viendra de l''attaquant lui-même", "whyDangerous": "Vous obtenez une confirmation rassurante et falsifiée, qui lève vos derniers doutes avant le virement.", "reflex": "Ne vérifiez jamais un message suspect en répondant à ce message : changez de canal."},
    "callback": {"technique": "Homoglyphe et détournement de virement", "indicator": "Un changement d''IBAN annoncé par un canal entrant, sur une facture en attente", "whyDangerous": "N/A — c''est la bonne réponse : le contre-appel sur un numéro déjà connu est le seul contrôle que l''attaquant ne peut pas fabriquer.", "reflex": "Tout changement de coordonnées bancaires se confirme par un contre-appel sur un numéro issu de vos propres archives."},
    "unsure": {"technique": "Homoglyphe et détournement de virement", "indicator": "Le message reprend vos références internes : signe d''une préparation, pas d''une légitimité", "whyDangerous": "Cette attaque est conçue pour être indétectable à l''œil ; le doute est ici la seule information exploitable.", "reflex": "Dans le doute sur un paiement, suspendez-le : un fournisseur légitime accepte toujours un contrôle de 24 heures."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000008'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000009 — Quishing (QR-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'qr_code', 'general', 3, 'Stationnement Fictif',
  '{"sender": "Autocollant collé sur un horodateur", "body": "Sur l''horodateur, un autocollant propre et bien imprimé : « Paiement sans contact — scannez ce QR code pour payer votre stationnement. Plus besoin de monnaie. » Le logo ressemble à celui de la ville. En scannant, votre téléphone propose d''ouvrir : https://stationnement-fictif-paiement.example-not-real.test", "ui": "qr"}'::jsonb,
  '[
    {"id": "pay", "label": "J''ouvre la page et je paie mon stationnement par carte", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_LOGO"]},
    {"id": "trust", "label": "J''ouvre la page : l''adresse contient « stationnement », donc elle a l''air officielle", "mistakePatternCodes": ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "machine", "label": "Je paie directement à l''horodateur, ou via l''application de stationnement que j''ai installée moi-même", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['machine'],
  '{
    "pay": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un autocollant : n''importe qui peut en coller un sur un équipement public", "whyDangerous": "La page de paiement capture la carte saisie. Le stationnement n''est pas réglé, et la carte est réutilisée ailleurs.", "reflex": "Ne payez jamais depuis un QR code affiché en libre accès : un support physique n''authentifie rien."},
    "trust": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Le mot « stationnement » est dans le nom de domaine, ce que n''importe qui peut enregistrer", "whyDangerous": "Un mot rassurant dans l''adresse ne dit rien du propriétaire du domaine ; c''est précisément ce sur quoi mise l''attaque.", "reflex": "Ce qui compte dans une adresse, c''est le domaine réel, pas les mots qu''on y a glissés."},
    "machine": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un QR code ne laisse pas lire sa destination avant le scan : rien n''est vérifiable en amont", "whyDangerous": "N/A — c''est la bonne réponse : l''horodateur et l''application installée par vos soins sont deux canaux dont vous connaissez l''origine.", "reflex": "Installez l''application de stationnement depuis la boutique officielle, et payez par elle plutôt que par un code affiché sur place."},
    "unsure": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un autocollant de bonne qualité, parfois collé par-dessus un vrai code", "whyDangerous": "L''impression soignée fait la crédibilité ; ne pas savoir trancher est normal face à un support qu''on ne peut pas authentifier.", "reflex": "Dans le doute, payez par un canal que vous avez choisi vous-même."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000009'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- Learning-objective links, resolved from the stable codes.
-- ------------------------------------------------------------
insert into scenario_objectives (scenario_version_id, learning_objective_id)
select sv.id, lo.id
from (values
  ('SCENARIO-000002', 'LO-PHISH-001'),
  ('SCENARIO-000003', 'LO-SMS-002'),
  ('SCENARIO-000004', 'LO-SOCIAL-001'),
  ('SCENARIO-000005', 'LO-SOCIAL-002'),
  ('SCENARIO-000006', 'LO-PAYMENT-001'),
  ('SCENARIO-000007', 'LO-URL-001'),
  ('SCENARIO-000008', 'LO-URL-002'),
  ('SCENARIO-000009', 'LO-QR-001')
) as m(scenario_code, objective_code)
join scenarios s on s.code = m.scenario_code
join scenario_versions sv on sv.scenario_id = s.id and sv.version = 1
join learning_objectives lo on lo.code = m.objective_code
on conflict do nothing;

