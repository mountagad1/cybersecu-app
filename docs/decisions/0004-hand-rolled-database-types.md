# 0004 — Hand-rolled Supabase database types + `.returns<T>()` on every query

**Context**: This environment has no live Supabase project, so
`supabase gen types typescript` cannot be run — the generated types file
described in `docs/ARCHITECTURE.md` §5 doesn't exist yet. A hand-written
`Database` type was written instead (`src/infra/supabase/database.types.ts`).

While integrating it, every `supabase.from(table).select(...)` call
resolved to `never` after `if (error) throw error` narrowing, even though
the hand-written `Database` type structurally satisfied postgrest-js's
`GenericSchema`/`GenericTable` shape (verified with isolated repros).
Root cause, isolated empirically: postgrest-js 2.x's compile-time
select-string parser (`select-query-parser/result.ts`) branches on
`Database['__InternalSupabase']['PostgrestVersion']`, which a hand-rolled
type (unlike CLI-generated ones) doesn't include by default — without it,
and without an explicit `.returns<T>()` override, the parser silently
computes `never` for the result row type instead of erroring.

**Decision**:
1. `Database` includes `__InternalSupabase: { PostgrestVersion: "13.0.4" }`.
2. Every query in this codebase appends `.returns<Row[]>()` (or
   `Row | null` after `.maybeSingle()`) as the last call before awaiting,
   using the exported `*Row` interfaces from `database.types.ts`. This
   bypasses the select-string parser's inferred type entirely and is
   postgrest-js's documented mechanism for exactly this situation.

**Why not just use `Database = any`**: that would silence the type
checker everywhere instead of only at the query boundary, and would lose
compile-time verification that repository code reads/writes the columns
this migration set actually defines.

**Tradeoffs**: `.returns<T>()` means the compiler trusts the annotation
rather than deriving it from the select string — a typo'd column in a
`.select("...")` string won't be caught by TypeScript, only at runtime.
Mitigated by keeping the `.select()` argument and the `Row` interface
close together and reviewed together.

**Addendum — `.insert()`/`.upsert()` typing**: even after the fix above,
`.insert(...)`/`.upsert(...)` calls still resolve their `Row extends
Relation['Insert']` generic to `never` for this hand-rolled `Database`
(confirmed the same table's `.select()` resolves correctly, so this is
isolated to the insert/upsert generic path specifically — not the same
root cause, and not fixed by `.returns<T>()`, which only affects the
read/result side). Rather than keep excavating a second postgrest-js
generic-inference edge case, writes use an explicit locally-typed
`const payload: SomeRow = {...}` (still checked against our own
hand-written row interfaces) passed to `.insert(payload as never)` — the
object literal is fully type-checked against the domain-accurate shape
before the cast, so a wrong field name or type is still caught; only the
library's own (currently broken) constraint check is bypassed. Revisit
once CLI-generated types replace this file — the addendum above should
no longer be needed at that point.

**Future migration path**: once a real Supabase project exists, run
`supabase gen types typescript --project-id <id> > src/infra/supabase/database.types.ts`
and delete the hand-written version. Generated types include
`__InternalSupabase` correctly, and the `.returns<T>()` calls can be
removed at that point if desired (they remain harmless if kept, since
they'd then match the generated `Row` types) — but that's a follow-up
cleanup, not required for correctness.
