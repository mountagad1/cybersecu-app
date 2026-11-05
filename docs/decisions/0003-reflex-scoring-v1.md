# 0003 — Cyber Reflex score v1 is a documented weighted/decayed average

**Context**: Brief §9 lists many potential scoring inputs (difficulty,
confidence, repeated mistakes, time-to-decision, trigger category,
trajectory) but explicitly warns against "fake mathematical sophistication."

**Decision**: v1 formula is
`weighted_avg(correct, weight = difficulty, decayed by recency)`,
implemented as a pure, unit-tested function
(`src/domain/scoring/reflexScore.ts`). Documented in `DOMAIN_MODEL.md` §6.

**Why**: Transparent and defensible with the data we actually have after
launch (few attempts per user). Richer signals (confidence, time-to-
decision) require UI/data we haven't built yet.

**Tradeoffs**: Less nuanced than a full model; may misrank users with
very few attempts (mitigated by the UI showing a "not enough data yet"
state below N attempts, tracked as a follow-up UI task).

**Future migration path**: Once attempt volume exists, revisit with
confidence and time-to-decision as additional weighted factors — new
decision record required before changing the formula (it affects
historical comparability).
