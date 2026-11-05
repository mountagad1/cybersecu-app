"use client";

import { useCallback, useMemo, useRef } from "react";
import { trackEvent, type Locale } from "@/lib/analytics";

/**
 * `tool_start` once, at the visitor's first interaction with a tool (not on
 * page load: a visit is not a use), and `tool_complete` each time the tool
 * produces its result, and `tool_error` when it cannot (with a failure
 * code). Codes only — the tool's slug, the page language, the failure kind.
 */
export function useToolTracking(tool: string, locale: Locale) {
  const started = useRef(false);
  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    trackEvent({ name: "tool_start", props: { tool, locale } });
  }, [tool, locale]);
  const complete = useCallback(() => {
    start();
    trackEvent({
      name: "tool_complete",
      props: { tool, locale, action: "result" },
    });
  }, [start, tool, locale]);
  const error = useCallback(
    (code: "random_unavailable" | "resource_load" | "other") => {
      trackEvent({ name: "tool_error", props: { tool, locale, error: code } });
    },
    [tool, locale],
  );
  // Stable across renders, so it can be a dependency of the caller's callbacks.
  return useMemo(() => ({ start, complete, error }), [start, complete, error]);
}
