import type { NextConfig } from "next";
import { REDIRECTS } from "./src/content/redirects";

/**
 * Baseline security headers. A site that teaches people to recognise unsafe
 * sites is held to that standard itself.
 *
 * Deliberately absent:
 * - a full Content-Security-Policy: Next.js inline scripts, Stripe and the
 *   Dograh voice widget each need allowances that must be tested first;
 *   only `frame-ancestors` is set, which governs who may embed the site
 *   and nothing else.
 * - a microphone restriction: the voice simulation needs it on this origin.
 */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  experimental: {
    // The app has two root layouts (French and English, for a correct
    // `<html lang>`), so unmatched URLs need `app/global-not-found.tsx`.
    globalNotFound: true,
  },
  // Redirects are a projection of `src/content/redirects.ts`, not a second
  // list — the same rule the sitemap and the internal links follow. A slug
  // that moves is declared once.
  async redirects() {
    return REDIRECTS.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
