import { readEnv } from "@/lib/env/read";

/**
 * Single source of truth for the site's public origin and for canonical
 * URL construction.
 *
 * Before this existed the origin was re-derived independently in
 * `app/layout.tsx`, `app/robots.ts` and `app/sitemap.ts`, which is exactly
 * how a canonical tag and a sitemap entry end up disagreeing about the same
 * page (docs/SEO_CURRENT_STATE_AUDIT.md M-5).
 *
 * `||` rather than `??` is deliberate: an env var set to an empty string is
 * a real deployment state, and `new URL("")` throws.
 *
 * The variable is `SITE_URL`, unprefixed, matching the Supabase ones
 * (src/infra/supabase/env.ts). Nothing here needs to be readable from the
 * browser: this module is imported by metadata, robots, sitemap and route
 * handlers, all of which run on the server. The legacy
 * `NEXT_PUBLIC_SITE_URL` name is still read as a fallback.
 *
 * The fallback to the production origin means a missing value degrades
 * silently rather than throwing, so a preview deployment that forgets to
 * set it emits production canonicals. That is the historical behaviour and
 * is kept deliberately — a throw here would take the whole site down over a
 * metadata detail — but nothing detects it automatically (`pnpm seo:audit`
 * audits the URL registry, not the deployed origin), so setting it per
 * environment is a manual step.
 */
/**
 * ⚠ The fallback is a guess, and a wrong guess is silent.
 *
 * This value feeds every canonical tag, the sitemap and robots.txt. If it
 * names a host different from the one actually served — apex where the
 * site answers on `www`, or the reverse — every canonical points at a URL
 * that redirects. Nothing in the build can detect that, because the build
 * cannot reach the deployed host.
 *
 * `https://www.cybersecu.app` is canonical: production serves on `www`
 * and redirects the apex there. This fallback previously named the apex
 * instead, which is exactly the silent mismatch this comment warns about —
 * confirmed in production (canonicals, sitemap and JSON-LD were all
 * pointing at a host that 301s). Set `SITE_URL` explicitly in each
 * environment to the host you serve; this value is only the guess used
 * when that step is skipped.
 */
export const SITE_URL = (readEnv("SITE_URL") ?? "https://www.cybersecu.app").replace(/\/+$/, "");

/**
 * Absolute URL for a site-relative path. Used for canonicals, sitemap
 * entries and JSON-LD `item`/`@id` values, so all three agree by
 * construction.
 *
 * Trailing slashes are stripped (except for the root) because the app
 * serves the no-trailing-slash form; emitting both would manufacture the
 * duplicate the canonical is supposed to resolve.
 */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) throw new Error(`absoluteUrl expects a rooted path, got: ${path}`);
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/+$/, "")}`;
}
