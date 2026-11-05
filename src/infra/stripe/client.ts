import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env/read";

let cached: Stripe | null = null;

/**
 * Pinned rather than left to the SDK's compiled-in default: an
 * unannounced `pnpm update` of the `stripe` package would otherwise be
 * able to silently move every request to a newer Stripe API version in
 * production, with no code review of what that version actually changed.
 * Bump this deliberately, in its own commit, when there is a reason to.
 */
const STRIPE_API_VERSION = "2026-07-29.dahlia" satisfies Stripe.LatestApiVersion;

/**
 * Lazily constructed so importing this module doesn't throw at build
 * time in environments without STRIPE_SECRET_KEY configured (e.g. a
 * `next build` run before Stripe is wired up) — only actually calling
 * `getStripeClient()` from a request requires the key to exist.
 */
export function getStripeClient(): Stripe {
  if (cached) return cached;

  cached = new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: STRIPE_API_VERSION });
  return cached;
}
