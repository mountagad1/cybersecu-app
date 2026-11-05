import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aiAssistantOf,
  ANALYTICS_DOM_EVENT,
  eventFromAttrs,
  searchEngineOf,
  trackAttrs,
  trackEvent,
  type AnalyticsEvent,
} from "./analytics";

describe("searchEngineOf", () => {
  it("names the engine from the referrer host only", () => {
    expect(searchEngineOf("https://www.google.fr/")).toBe("google");
    expect(
      searchEngineOf("https://www.google.com/search?q=sms+colis+arnaque"),
    ).toBe("google");
    expect(searchEngineOf("https://www.bing.com/")).toBe("bing");
    expect(searchEngineOf("https://duckduckgo.com/")).toBe("duckduckgo");
    expect(searchEngineOf("https://www.qwant.com/")).toBe("qwant");
    expect(searchEngineOf("https://www.ecosia.org/")).toBe("ecosia");
    expect(searchEngineOf("https://fr.search.yahoo.com/")).toBe("yahoo");
    expect(searchEngineOf("https://search.brave.com/")).toBe("brave");
    expect(searchEngineOf("https://www.startpage.com/")).toBe("other");
  });

  it("is null for anything that is not a search engine", () => {
    expect(searchEngineOf("")).toBeNull();
    expect(searchEngineOf("https://www.cybersecu.app/attaques")).toBeNull();
    expect(searchEngineOf("https://www.facebook.com/")).toBeNull();
    // A look-alike host is not the engine.
    expect(searchEngineOf("https://google.evil.test/")).toBeNull();
    expect(searchEngineOf("https://notbing.com/")).toBeNull();
    expect(searchEngineOf("not a url")).toBeNull();
  });
});

describe("aiAssistantOf", () => {
  it("names the assistant from the referrer host, or from its utm_source tag", () => {
    expect(aiAssistantOf("https://chatgpt.com/")).toBe("chatgpt");
    expect(aiAssistantOf("https://www.perplexity.ai/search/abc")).toBe("perplexity");
    expect(aiAssistantOf("https://gemini.google.com/app")).toBe("gemini");
    expect(aiAssistantOf("https://copilot.microsoft.com/")).toBe("copilot");
    expect(aiAssistantOf("https://claude.ai/chat/xyz")).toBe("claude");
    expect(aiAssistantOf("", "?utm_source=chatgpt.com")).toBe("chatgpt");
  });

  it("is null for search engines, look-alikes and anything else", () => {
    expect(aiAssistantOf("https://www.google.com/")).toBeNull();
    expect(aiAssistantOf("https://chatgpt.com.evil.test/")).toBeNull();
    expect(aiAssistantOf("", "?utm_source=newsletter")).toBeNull();
    expect(aiAssistantOf("not a url")).toBeNull();
  });

  it("is checked before search engines, which would claim Gemini as Google", () => {
    expect(searchEngineOf("https://gemini.google.com/")).toBe("google");
    expect(aiAssistantOf("https://gemini.google.com/")).toBe("gemini");
  });
});

describe("trackAttrs / eventFromAttrs", () => {
  it("round-trips a typed event through data attributes", () => {
    const event: AnalyticsEvent = {
      name: "related_attack_click",
      props: {
        from: "attack",
        from_code: "PHISH-000001",
        to_attack: "SMS-000001",
        section: "related",
      },
    };
    const attrs = trackAttrs(event);
    expect(
      eventFromAttrs(
        attrs["data-analytics-event"],
        attrs["data-analytics-props"],
      ),
    ).toEqual(event);
  });

  it("refuses unknown events and malformed or oversized properties", () => {
    expect(eventFromAttrs("message_typed", '{"text":"x"}')).toBeNull();
    expect(eventFromAttrs("guide_click", "not json")).toBeNull();
    expect(eventFromAttrs("guide_click", "[1,2]")).toBeNull();
    expect(eventFromAttrs(undefined, "{}")).toBeNull();
    const event = eventFromAttrs(
      "guide_click",
      JSON.stringify({
        from: "attack",
        guide: "x",
        nested: { a: 1 },
        long: "y".repeat(200),
      }),
    );
    expect(event?.props).toEqual({ from: "attack", guide: "x" });
  });
});

describe("trackEvent", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("dispatches the event as a DOM event and forwards it to a provider", () => {
    const target = new EventTarget();
    const plausible = vi.fn();
    vi.stubGlobal("window", Object.assign(target, { plausible }));
    const seen: unknown[] = [];
    target.addEventListener(ANALYTICS_DOM_EVENT, (e) =>
      seen.push((e as CustomEvent).detail),
    );
    const event: AnalyticsEvent = {
      name: "simulation_complete",
      props: {
        simulation: "SIM-1",
        attack_code: "SMS-000001",
        locale: "fr",
        correct: true,
      },
    };
    trackEvent(event);
    expect(seen).toEqual([event]);
    expect(plausible).toHaveBeenCalledWith("simulation_complete", {
      props: event.props,
    });
  });

  it("never throws, even when the provider does", () => {
    vi.stubGlobal(
      "window",
      Object.assign(new EventTarget(), {
        plausible: () => {
          throw new Error("down");
        },
      }),
    );
    expect(() =>
      trackEvent({ name: "purchase", props: { locale: "fr" } }),
    ).not.toThrow();
  });
});
