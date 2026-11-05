/**
 * Whether the €29 unlock is on sale. Closed on 2026-10-12, at the owner's
 * request: the site has no legal entity yet, and selling is a professional
 * activity that needs one (docs/growth/EXPERIMENT_LOG.md, EXP-002 bis).
 *
 * While closed:
 * - `/api/checkout` refuses with 503 `sales_closed`, so nothing can be
 *   bought even by calling the API directly;
 * - the paywall says the full offer is coming, without a price or a button;
 * - public copy (home, FAQ) mentions the 10 free simulations only.
 *
 * Earlier buyers keep their access: entitlements, the webhook and
 * `/restaurer` are untouched.
 *
 * To reopen once a professional status exists (and the legal pages carry
 * it, src/lib/publisher.ts): set this to `true`.
 */
export const SALES_OPEN = false;
