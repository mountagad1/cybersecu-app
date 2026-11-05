# Blank `/attaques` and `/simulations` — root cause analysis

**Reported:** 2026-08-24 — `https://www.cybersecu.app/attaques` and
`/simulations` blank in production.
**Investigated on commit:** `3c8659a`
**Fix branch:** `claude/fix-blank-pages-incident`, cut from `main` so the
remediation ships without the unrelated SEO changeset on PR #4.

---

## 0. What I could and could not verify

**I could not fetch the production pages.** This sandbox's egress policy
denies `CONNECT www.cybersecu.app:443` with HTTP 403, exactly as it does for
`*.vercel.app`:

```
* Establish HTTP proxy tunnel to www.cybersecu.app:443
< HTTP/1.1 403 Forbidden
* CONNECT tunnel failed, response 403
```

So this analysis is **code- and database-level evidence**, verified against a
real PostgreSQL 16 instance, plus one production observation supplied by the
reporter (the pages are blank). Steps 8 and 20 of the incident brief — fetching
production HTML and re-testing the live domain — **have not been performed by
me** and are listed as outstanding in §6.

Nothing below is asserted as "production is fixed".

---

## 1. Root cause

There is no single fault. **Three independent defects compound**, and two of
them are individually sufficient to produce the reported symptom.

### Defect A — The failure was undiagnosable (primary)

```
$ find src/app -name "error.tsx" -o -name "global-error.tsx" -o -name "not-found.tsx"
  (no results)
```

`/attaques` and `/simulations` are Server Components that call the database at
request time. Their repositories `throw` on failure — correctly — but the throw
fell through to Next.js's built-in production error screen, which renders
essentially nothing, and **nothing recorded why**.

**This is what "blank" is.** Any of the following produced an identical blank
page, with no message, no recovery path, and nothing distinguishing them:

| Trigger | Reality |
| --- | --- |
| Supabase env vars absent in the deployment environment | `getSupabaseUrl()` throws `Missing SUPABASE_URL` |
| Migrations never applied | Postgres `42P01 undefined_table` |
| RLS read policy missing | Postgres `42501 insufficient_privilege` |

Reproduced locally: with no Supabase env configured, `/attaques`,
`/simulations` and `/attaques/[slug]` all return **HTTP 500** while `/` returns
200 — the exact split the reporter describes (homepage fine, these two blank).

### Defect B — The seed publishes exactly one attack (secondary)

Even with schema and seed correctly applied, the database yields almost
nothing. Verified against a real Postgres with all migrations plus
`seed/0001` applied:

```
attacks total                 | 9
attacks PUBLISHED             | 1     ← only this reaches /attaques
scenarios total               | 1
scenario_versions PUBLISHED   | 1
```

The other eight attacks carry only a one-line `definition`:

```
      code      |              slug              | def | how | signs | published
 IDN-000001     | typosquatting                  | t   | f   |     0 | f
 IDN-000002     | homoglyphes                    | t   | f   |     0 | f
 PHISH-000001   | phishing-email                 | t   | f   |     0 | f
 ...
 SMS-000001     | smishing-faux-sms-bancaire     | t   | t   |     4 | t
```

They fail the publish gate (`how_it_works`, `warning_signs`, and a
trigger/indicator are required), so a *fully correct* deployment still rendered
a single card on `/attaques` and a single card on `/simulations`. To a visitor
that reads as an empty page even when nothing is broken.

### Defect C — The setup instructions were incomplete (contributing)

`README.md` listed only two of the three migrations — `0003_no_login_pivot.sql`
was never mentioned — and labelled the seed **"optional sample content"** when
it in fact contains every published attack and the only simulation. There is no
migration runner in `package.json`, no `.github/` CI, and no Supabase CLI
config: schema application is entirely manual `psql`, with nothing verifying it
happened.

Anyone following the README would produce a database that is missing the
anonymous-session/quota/entitlement tables and, if they treated the seed as
genuinely optional, contains zero content.

---

## 2. Affected files

| File | Defect | Change |
| --- | --- | --- |
| `src/app/(marketing)/error.tsx` | A | **New** — error boundary. See the correction in §3a: it does **not** catch this particular failure |
| `src/infra/supabase/server.ts` | A | Logs `supabase.config_missing` at the actual throw site, which is earlier than any query |
| `src/infra/observability/log.ts` | A | **New** — structured logging; maps `42P01`/`42501`/missing-env to a plain-language cause |
| `src/infra/attacks/repository.ts` | A | Logs before rethrowing; warns explicitly on a zero-row result |
| `src/infra/scenarios/repository.ts` | A | Same |
| `supabase/seed/0002_attack_content.sql` | B | **New** — real content for the eight stubs, then publishes them |
| `supabase/seed/0003_simulation_content.sql` | B | **New** — a published simulation for each of those eight attacks (see §6) |
| `README.md` | C | All seven files listed, in order, marked required; adds `pnpm db:doctor` |
| `scripts/db-doctor.ts` | C | **New** — read-only diagnostic using the **anon** key |

---

## 3a. Correction — the error boundary does NOT fix this failure

An earlier draft of this document, and my first report, presented
`error.tsx` as the primary fix. **Testing disproved that**, and the claim is
withdrawn.

Measured, not assumed:

- With `(marketing)/error.tsx` present, `/attaques` still returned **HTTP 500**
  serving `<html id="__next_error__">` — Next.js's *global* fallback, not the
  boundary.
- A boundary placed directly in the `attaques` segment did not catch it either,
  so this is not a placement problem.
- Adding `loading.tsx` (a Suspense boundary) *did* let the boundary render —
  but turned the response into **HTTP 200** serving a permanent "Chargement…"
  shell. That is a **soft 404**, explicitly forbidden by the brief (§28) and
  worse for search than an honest 500. **Reverted.**

A Server Component that throws before the shell is flushed escapes to the
global handler. The boundary is kept because it still covers client-side
navigation and post-shell errors, but it is **not** the fix for a
request-time database failure, and it must not be described as one.

**The actual remedy for Defect A is observability, not presentation:** a 500 is
the correct status for a genuine server fault — crawlers read it as "retry
later". What was missing was any record of *why*. That gap is now closed at the
real throw site:

```
{"level":"error","event":"supabase.config_missing",
 "message":"Missing SUPABASE_URL",
 "hint":"Définissez SUPABASE_URL et SUPABASE_ANON_KEY…"}
```

Repository-level logging alone would never have fired: `getSupabaseUrl()`
throws inside `createSupabaseServerClient()`, **before** any query runs.

## 3. Why `db:doctor` uses the anon key

It queries with the publishable/anon key (`SUPABASE_PUBLISHABLE_KEY`, or the
older `SUPABASE_ANON_KEY` — Supabase renamed the same RLS-bound role), not the
service-role key, on purpose: that is the identity a logged-out visitor and a
search crawler actually use. A table that returns rows to the service role but nothing to anon
is an RLS fault, and only an anon-key check makes that visible. A service-role
diagnostic would have reported "healthy" for precisely the failure it needed to
catch.

It performs `SELECT`s only, and reports environment variables by
**presence, never value**.

---

## 4. Verification performed

Against a real PostgreSQL 16 instance (not mocks, not assumptions):

1. **All migrations apply cleanly in order** — `0001`, `0002`, `0003`, then
   both seeds. `0001` requires Supabase's `auth.users`, stubbed locally.
2. **The publish gate is enforced by a database trigger, not just app code.**
   The first version of `seed/0002` set `published_at` in the same `UPDATE` as
   the content and was rejected:
   ```
   ERROR: attack PHISH-000001 cannot be published: needs at least one trigger or indicator
   ```
   The seed was restructured to content → triggers → publish. **This defect
   would have shipped had the SQL only been reviewed rather than executed.**
3. **Result after `seed/0002`:** 9 published attacks (was 1), 19 trigger
   relations, 10 related-attack edges.
4. **Idempotent** — re-running changes nothing (still 9 published).
5. **RLS ruled out as a cause:** `attacks_public_read` correctly permits
   `published_at is not null`, so anon can read published rows.
6. `pnpm build`, `pnpm lint` and `pnpm test` (28) all pass on this branch.
7. **Error-boundary behaviour measured rather than assumed** — see §3a. The
   first fix was wrong and was reverted before shipping.
8. Confirmed after the fix: `/attaques` returns 500 (not a soft 200) **and**
   emits `supabase.config_missing` naming the cause and the remedy.

---

## 5. Expected effect

| Surface | Before | After schema + both seeds |
| --- | --- | --- |
| `/attaques` | blank (throw) or 1 card | 9 attacks |
| `/simulations` | blank (throw) or 1 card | 1 simulation |
| Either, on DB failure | blank screen | explicit error state + retry + log reference |

`/simulations` still has **one** scenario. Seed `0002` deliberately does not
invent simulations: each needs authored content, choices, correct answers and
explanations, and fabricating them would breach
`docs/decisions/0002-synthetic-content-only.md`. That is content work, tracked
separately.

---

## 6. Outstanding — requires someone with production access

1. Run `pnpm db:doctor` against the production project. It reports the exact
   cause and the command to fix it.
2. Confirm `SUPABASE_URL` / `SUPABASE_ANON_KEY` are set
   for the **Production** environment specifically, not only Preview.
3. Apply `0003_no_login_pivot.sql` and both seeds if `db:doctor` reports them
   missing.
4. **Re-test the live URLs** — brief steps 8 and 20, which I could not perform.

Until step 4 is done by someone who can reach the domain, this incident should
be considered *diagnosed and remediated in code*, **not verified in
production**.


---

## 7. Follow-up — the same failure one level down: content, not schema

Seeds 0001 and 0002 fixed `/attaques`: nine attacks, all published. They did
not fix `/simulations`, and the reason is the same one this document is about
— a healthy system with nothing to show.

`0001` ships exactly one scenario (`SCENARIO-000001`, smishing). `0002`
publishes eight more *attacks* but no scenarios for them. So a correctly
migrated, correctly seeded production rendered:

- `/simulations` — one card;
- eight of nine attack pages — no "Testez-vous" section at all, because
  `listPublishedScenariosForAttack()` correctly found nothing to link;
- the paywall — unreachable, since the free allowance is ten simulations
  (`docs/SIMULATION_QUOTA.md`) and the catalogue held one. The entitlement and
  Stripe paths could not be exercised by playing the product.

None of that is an error state. Every query succeeds, every log is clean, and
`db:doctor` reported "contenu publié visible" because it only counted
*published scenario versions*, of which there was one — above zero, therefore
"fine".

`supabase/seed/0003_simulation_content.sql` authors and publishes one scenario
per remaining attack. Two guards were added so the gap cannot silently reopen:

- **`supabase/migrations/0004_scenario_content_integrity.sql`** rejects a
  scenario version whose choices, `correct_choice_ids` and `explanations`
  disagree. The worst of those — a choice with no explanation — produced a
  graded answer the player could not render, i.e. a blank screen *after* the
  visitor's quota had already been spent.
- **`src/domain/seo/seedInventory.test.ts`** diffed the audit's content
  inventory against the seed `.sql` files, so a seed that added pages while
  the audit reported the old count failed CI. Both are removed in §8: the
  content catalogue is now the inventory, so the two cannot disagree.

---

## 8. Resolution — 2026-08-31

The three defects in §1 were all real and all fixed, and §7 fixed the
follow-up gap as well. **The pages stayed empty in production anyway**, and
the reason was structural rather than a bug:

> Every attack page and every simulation existed only as rows created by
> `supabase/seed/*.sql`. **A Vercel deploy never runs SQL.** There is no
> migration runner in `package.json`, no CI, no Supabase CLI config. So
> every deploy shipped the application and none of its content — and no
> number of deploys could ever have changed that.

Defect B ("the seed publishes exactly one attack") and the §7 follow-up
were therefore symptoms of a larger problem, not the cause: each fix made
the content correct in a database that production was never going to
receive. `src/domain/seo/seedInventory.ts` — which existed to keep the
audit in step with the seeds — is removed with them: the catalogue is now
the inventory, so there is nothing left to diff.

**What changed.** The encyclopedia and the simulations moved into the
repository as typed content under `src/content/`
(`docs/decisions/0007-content-in-repository.md`). The database keeps
attempts, quota usage, entitlements and purchases. Migration `0005` drops
the now-meaningless foreign key from `attempts` to `scenario_versions`.

**Why this closes the incident class rather than this instance of it:**

| Failure mode from §1 | Still possible? |
| --- | --- |
| Env vars absent in the deployment environment | Content pages unaffected — they read nothing |
| Migrations never applied (`42P01`) | Content pages unaffected |
| RLS read policy missing (`42501`) | Content pages unaffected |
| Seed never run | Cannot happen — content is in the build |
| Content present but unpublishable | Fails `next build`, never deploys |

A database fault can still stop a visitor *playing* a simulation. That is
reported honestly — `GET /api/health` states content and database health
separately — rather than presented as the site being down.

**Verified on this branch**, against the real build output rather than by
inspection:

- `pnpm build` pre-renders every content page as static HTML, and no route
  reads the database to render. *(Chiffres à la date de rédaction : 20 fiches
  et 4 hubs. Le catalogue a grossi depuis — voir `pnpm seo:audit` pour
  l'inventaire courant, qui est la source à jour ; ce document décrit
  l'incident, pas l'état présent.)*
- `pnpm seo:audit` reports 52 registry URLs, 50 indexable, 2 noindex, and
  no inconsistency.
- Serving that build with **no Supabase configuration at all**, every one
  of those URLs returns HTTP 200 with its full content, and `/sitemap.xml`
  lists every published page.
- `/simulations/sms-banque` contains no `correctChoiceIds`,
  `whyDangerous` or `mistakePatternCodes` in its HTML — answers still do
  not reach the browser before a submission.
- `pnpm lint`, `pnpm typecheck` and `pnpm test` pass. Two sitemap
  tests were rewritten: one asserted that a repository failure propagates,
  which is now meaningless, and its replacement asserts the opposite —
  the sitemap stays complete with `listPublishedAttacks` mocked to throw
  on every call.

**Still not verified by me:** the live domain. This sandbox's egress
policy denies `CONNECT www.cybersecu.app:443` and `*.vercel.app:443` with
HTTP 403, so §0 still applies — steps 8 and 20 of the incident brief have
not been performed by me. What is now different is that they no longer
depend on anyone running SQL first.

