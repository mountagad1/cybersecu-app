"use client";

import { useEffect } from "react";
import {
  aiAssistantOf,
  searchEngineOf,
  trackEvent,
  type Locale,
  type PageType,
} from "@/lib/analytics";

/**
 * True once this document has counted its landing. Module state, not
 * storage: a client-side navigation keeps the same document (and the same
 * `document.referrer`), so only the first tracked page of a visit from a
 * search engine is its landing page. Nothing is written to the browser.
 */
let landingCounted = false;

/**
 * Funnel entry events for a page: `seo_landing` when the visit came from a
 * search engine and this is the first page of it, `ai_landing` when it came
 * from an AI assistant, and `attack_view` on a fiche. Renders nothing.
 */
export function PageTracker({
  pageType,
  locale,
  attackCode,
}: {
  pageType: PageType;
  locale: Locale;
  attackCode?: string;
}) {
  useEffect(() => {
    const firstPage = !landingCounted;
    landingCounted = true;
    // Checked first: an assistant can live on a search engine's domain
    // (gemini.google.com), and it is not a search result.
    const assistant = firstPage
      ? aiAssistantOf(document.referrer, window.location.search)
      : null;
    const engine =
      firstPage && !assistant ? searchEngineOf(document.referrer) : null;
    if (assistant) {
      trackEvent({
        name: "ai_landing",
        props: { page_type: pageType, locale, assistant },
      });
    }
    if (engine) {
      trackEvent({
        name: "seo_landing",
        props: { page_type: pageType, locale, engine },
      });
    }
    if (attackCode) {
      trackEvent({
        name: "attack_view",
        props: {
          attack_code: attackCode,
          locale,
          from_search: firstPage && engine !== null,
        },
      });
    }
  }, [pageType, locale, attackCode]);
  return null;
}
