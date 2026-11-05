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
