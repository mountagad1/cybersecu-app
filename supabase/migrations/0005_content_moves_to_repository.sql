-- ============================================================
-- 0005 — the attack encyclopedia and the simulation catalogue move out
-- of the database and into the repository.
--
-- WHY
-- Those tables held editorial content: identical for every visitor,
-- written and reviewed like code, and required for any page to render.
-- Keeping them in Postgres meant a deploy shipped the application without
-- its content, and every page depended on a manual `psql` step that had
-- no runner, no CI and no verification. That is the failure recorded in
-- docs/BLANK_PAGES_ROOT_CAUSE.md. Content now lives in src/content
-- (docs/decisions/0007-content-in-repository.md); the database keeps what
-- is genuinely per-visitor: attempts, quota usage, entitlements,
-- purchases.
--
-- WHAT THIS CHANGES
-- One constraint. `attempts.scenario_version_id` still holds the
-- scenario version's UUID — those identifiers are now declared in
-- src/content/simulations and are stable — but it no longer references
-- the `scenario_versions` table, which is no longer the source of truth.
--
-- The content tables themselves are deliberately NOT dropped: existing
-- attempt rows are still interpretable against them, and dropping tables
-- is not reversible. They are simply no longer read at runtime.
--
-- Idempotent: safe to re-run.
-- ============================================================

alter table attempts
  drop constraint if exists attempts_scenario_version_id_fkey;

comment on column attempts.scenario_version_id is
  'Identifiant de version de scénario déclaré dans src/content/simulations. '
  'Plus de clé étrangère depuis la migration 0005 : le catalogue de simulations '
  'est versionné dans le dépôt, pas en base.';
