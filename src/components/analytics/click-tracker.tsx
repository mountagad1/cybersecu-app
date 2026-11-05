"use client";

import { useEffect } from "react";
import { eventFromAttrs, trackEvent } from "@/lib/analytics";

/**
 * One delegated click listener for the whole document: a link rendered
 * with `trackAttrs(event)` reports that event when clicked. Server
 * components can therefore declare tracked links without becoming client
 * components. Mounted once, in the root document. Renders nothing.
 */
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest<HTMLElement>("[data-analytics-event]");
      if (!el) return;
      const event = eventFromAttrs(
        el.dataset.analyticsEvent,
        el.dataset.analyticsProps,
      );
      if (event) trackEvent(event);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
