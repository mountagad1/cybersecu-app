/**
 * Product events, without content.
 *
 * The site has no analytics provider yet (docs/seo/06_GEO_AUDIT.md §6), so
 * this does not pick one. It defines the events and their properties in
 * one place, forwards them to a provider if a page ever loads one, and
 * always dispatches a DOM event a future integration can listen to
 * without touching the components.
 *
 * PRIVACY RULE: properties are codes and counts only. Never a typed text,
 * a pasted URL, a domain, an email or anything a visitor wrote
 * (docs/growth/ENGINEERING_AS_MARKETING_STRATEGY.md §4–5). The types below
 * make that the easy path: no event accepts a free-form string field.
 */

export type AnalyticsEvent =
  | FunnelEvent
  | {
      name: "message_analyzer_analyzed";
      props: {
        locale: "fr" | "en";
        channel: string;
        signal_count: number;
        /** Comma-separated signal codes, e.g. "urgence,lien". */
        signals: string;
        link_count: number;
        source: "typed" | "example";
      };
    }
  | { name: "message_analyzer_example_loaded"; props: { example: string } }
  | {
      name: "message_analyzer_result_shared";
      props: { method: "share" | "copy"; signal_count: number };
    }
  | {
      name: "message_analyzer_cta_clicked";
      props: {
        target:
          | "simulation"
          | "attack"
          | "checklist"
          | "incident_assistant"
          | "link_decoder"
          | "lever"
          | "gallery";
        attack_code?: string;
      };
    }
  | {
      name: "incident_assistant_planned";
      props: {
        locale: "fr" | "en";
        /** Comma-separated situation codes, e.g. "banque,clic". */
        situations: string;
        situation_count: number;
        channel: string;
      };
    }
  | {
      name: "incident_assistant_shared";
      props: { method: "share" | "copy"; situation_count: number };
    }
  | { name: "incident_assistant_printed"; props: { situation_count: number } }
  | {
      name: "incident_assistant_cta_clicked";
      props: { target: "guide" | "attack" | "simulation" | "tool" };
    };

// --- SEO → product funnel (docs/growth/ANALYTICS_EVENT_MODEL.md) ----------

export type Locale = "fr" | "en";

/** The kind of page an event happened on — never its URL. */
export type PageType =
  | "home"
  | "attack"
  | "category"
  | "guide"
  | "simulation"
  | "tool"
  | "audience"
  | "gallery"
  | "comparator"
  | "lever"
  | "index"
  | "other";

/** Which search engine sent the visitor, by referrer host — never the query. */
export type SearchEngine =
  | "google"
  | "bing"
  | "duckduckgo"
  | "qwant"
  | "ecosia"
  | "yahoo"
  | "brave"
  | "other";

/** Which AI assistant sent the visitor, by referrer host or its own `utm_source` tag — never the conversation. */
export type AiAssistant =
  | "chatgpt"
  | "perplexity"
  | "gemini"
  | "copilot"
  | "claude"
  | "mistral"
  | "other";

export type FunnelEvent =
  | {
      name: "seo_landing";
      props: { page_type: PageType; locale: Locale; engine: SearchEngine };
    }
  | {
      name: "ai_landing";
      props: { page_type: PageType; locale: Locale; assistant: AiAssistant };
    }
  | {
      name: "attack_view";
      props: { attack_code: string; locale: Locale; from_search: boolean };
    }
  | {
      name: "simulation_start";
      props: { simulation: string; attack_code: string; locale: Locale };
    }
  | {
      name: "simulation_complete";
      props: {
        simulation: string;
        attack_code: string;
        locale: Locale;
        correct: boolean;
      };
    }
  | { name: "tool_start"; props: { tool: string; locale: Locale } }
  | {
      name: "tool_complete";
      props: { tool: string; locale: Locale; action: "result" | "print" };
    }
  | {
      /** A tool could not produce its result: which failure, by code — never the input or the output. */
      name: "tool_error";
      props: { tool: string; locale: Locale; error: "random_unavailable" | "resource_load" | "other" };
    }
  | {
      name: "related_attack_click";
      props: {
        from: PageType;
        /** Code of the fiche or simulation's fiche the click comes from, if any. */
        from_code?: string;
        to_attack: string;
        section: "related" | "channel" | "boundary" | "audience" | "guide";
      };
    }
  | {
      name: "guide_click";
      props: { from: PageType; from_code?: string; guide: string };
    }
  | {
      name: "premium_intent";
      props: { locale: Locale; trigger: "quota_exhausted" | "reopened" };
    }
  | { name: "checkout_start"; props: { locale: Locale } }
  | { name: "purchase"; props: { locale: Locale } }
  | {
      /** A contextual next step from one stage of the funnel to the next. */
      name: "funnel_cta_click";
      props: {
        from: PageType;
        cta:
          | "test_yourself"
          | "nearby_simulation"
          | "recognize_signals"
          | "review_signals"
          | "next_simulation";
        attack_code?: string;
      };
    }
  | {
      name: "simulation_shared";
      props: { simulation: string; method: "share" | "copy" };
    };

export const ANALYTICS_DOM_EVENT = "cybersecu:analytics";

type ProviderWindow = Window & {
  plausible?: (
    name: string,
    options?: { props?: Record<string, unknown> },
  ) => void;
};

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_DOM_EVENT, { detail: event }),
    );
    (window as ProviderWindow).plausible?.(event.name, { props: event.props });
  } catch {
    // Measurement must never break the tool.
  }
}

/**
 * Data attributes that make a server-rendered link report a click, read
 * by `<ClickTracker />` (one delegated listener for the whole page). Typed
 * like `trackEvent`, so a server component cannot declare an event the
 * model does not know.
 */
export function trackAttrs(event: AnalyticsEvent): {
  "data-analytics-event": string;
  "data-analytics-props": string;
} {
  return {
    "data-analytics-event": event.name,
    "data-analytics-props": JSON.stringify(event.props),
  };
}

const SEARCH_ENGINES: [RegExp, SearchEngine][] = [
  [/(^|\.)google\.[a-z.]{2,6}$/, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)qwant\.com$/, "qwant"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
  [/(^|\.)yahoo\.[a-z.]{2,6}$/, "yahoo"],
  [/(^|\.)search\.brave\.com$/, "brave"],
  [/(^|\.)(yandex\.[a-z.]{2,6}|baidu\.com|startpage\.com|search\.lilo\.org)$/, "other"],
];

/**
 * The search engine a referrer belongs to, or null when it is not one.
 * Only the host is read — the referrer's path and query (which may carry
 * the visitor's search) are never looked at or kept.
 */
export function searchEngineOf(referrer: string): SearchEngine | null {
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const [pattern, engine] of SEARCH_ENGINES) {
    if (pattern.test(host)) return engine;
  }
  return null;
}

const AI_ASSISTANTS: [RegExp, AiAssistant][] = [
  [/^(chatgpt\.com|chat\.openai\.com)$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/^gemini\.google\.com$/, "gemini"],
  [/^copilot\.microsoft\.com$/, "copilot"],
  [/^claude\.ai$/, "claude"],
  [/^chat\.mistral\.ai$/, "mistral"],
  [/^(chat\.deepseek\.com|www\.phind\.com|phind\.com)$/, "other"],
];

/**
 * The AI assistant that sent the visitor, or null. Read from the referrer
 * host, or — because several assistants send no referrer — from the
 * `utm_source` value some of them add to the links they cite, matched
 * against the same list of hosts. Nothing else of either URL is read.
 */
export function aiAssistantOf(referrer: string, pageSearch = ""): AiAssistant | null {
  const hosts: string[] = [];
  try {
    hosts.push(new URL(referrer).hostname.toLowerCase());
  } catch {
    // no referrer
  }
  const source = new URLSearchParams(pageSearch).get("utm_source");
  if (source) hosts.push(source.toLowerCase());
  for (const host of hosts) {
    for (const [pattern, assistant] of AI_ASSISTANTS) {
      if (pattern.test(host)) return assistant;
    }
  }
  return null;
}

const EVENT_NAMES = new Set<string>([
  "seo_landing",
  "ai_landing",
  "attack_view",
  "simulation_start",
  "simulation_complete",
  "tool_start",
  "tool_complete",
  "related_attack_click",
  "guide_click",
  "premium_intent",
  "checkout_start",
  "purchase",
  "funnel_cta_click",
  "simulation_shared",
]);

/**
 * Rebuilds an event from the attributes `trackAttrs` wrote. Returns null
 * for anything unknown or malformed, and keeps only flat string, number
 * and boolean properties — a tampered attribute cannot smuggle more.
 */
export function eventFromAttrs(
  name: string | undefined,
  props: string | undefined,
): AnalyticsEvent | null {
  if (!name || !EVENT_NAMES.has(name) || !props) return null;
  try {
    const parsed: unknown = JSON.parse(props);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string" && v.length <= 80) clean[k] = v;
      else if (typeof v === "number" || typeof v === "boolean") clean[k] = v;
    }
    return { name, props: clean } as unknown as AnalyticsEvent;
  } catch {
    return null;
  }
}
