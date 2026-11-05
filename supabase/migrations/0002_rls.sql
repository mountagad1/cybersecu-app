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
