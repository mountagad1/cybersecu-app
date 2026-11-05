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
