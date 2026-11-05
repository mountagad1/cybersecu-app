import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // `Allow: /` permits the whole site; the previous per-section Allow
      // entries beneath it were no-ops that read like a whitelist, inviting
      // a maintainer to think a new section must be listed here to be
      // crawlable (docs/SEO_CURRENT_STATE_AUDIT.md M-1).
      allow: "/",
      // Disallowed because there is nothing for a crawler to index, not to
      // control indexing: robots.txt hides a URL from crawling, which
      // *prevents* a crawler seeing a noindex directive. Pages that must
      // stay out of the index (`/restaurer`, `/simulations/merci`) use
      // noindex metadata instead and are deliberately left crawlable.
      // `/admin`, `/dashboard` and `/profil` were listed here for routes the
      // no-login pivot removed (docs/decisions/0005); they no longer exist.
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
