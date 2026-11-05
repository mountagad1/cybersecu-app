# 0001 — Scope this pass to a vertical slice, not the full MVP

**Context**: The product brief specifies a full platform (30–50
simulations, admin CMS, billing, multi-persona UX, full observability).
The repository was empty at session start.

**Options considered**:
1. Attempt to scaffold all of it at once.
2. Deliver architecture docs + schema + one real, fully-worked vertical
   slice (one attack, one scenario, public SEO page + authenticated
   simulation + scoring), leaving the rest as a documented sequence.

**Chosen approach**: Option 2.

**Why**: Principle 1.2 ("no placeholder architecture presented as
finished") and the explicit instruction not to implement the complete
product immediately. A vertical slice proves the schema, domain engine,
RLS policies, and rendering strategy all actually work together before
they're replicated 30–50 times across content.

**Tradeoffs**: The repository will not look "feature complete" after this
pass. Content authoring (the bulk of the 30–50 scenario requirement) is
explicitly left for a follow-up content workstream.

**Future migration path**: Each subsequent scenario is added by following
the same pattern (seed attack row → author scenario_version → publish),
no architecture changes needed.
