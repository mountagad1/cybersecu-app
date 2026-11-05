# 0002 — All scenario content is synthetic/fictional

**Context**: Brief §26 requires the platform to teach recognition without
becoming an attack-generation service or accidentally shipping real
phishing infrastructure.

**Decision**: Every scenario's `content` (sender names, brand names,
domains, phone numbers) must be fictional and non-resolvable (e.g.
"Banque Fictive", `moncompte.exemple-securise.test`). Enforced editorially
at publish time via an admin checklist; not automatically verifiable by
the schema.

**Why**: Removes any possibility of the platform being repurposed as a
phishing kit generator, and avoids real-brand trademark/impersonation
issues.

**Tradeoffs**: Slightly less "this looks exactly like my real bank" realism.
Mitigated by making the fictional entity's styling/structure realistic
even though the name is not.

**Future migration path**: If a licensing arrangement with a real
brand/bank for authorized simulation is ever pursued, that's a distinct,
explicitly-consented product line — not a change to this default.
