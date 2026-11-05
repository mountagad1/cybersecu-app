"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";

const STRINGS = { fr: "Tester gratuitement", en: "Try for free" } as const;

/** Matches the `id` on the sentinel `<div>` the hero section renders right
 * after its own CTA buttons — see `(marketing)/page.tsx` and
 * `en/page.tsx`. */
export const HERO_END_SENTINEL_ID = "hero-end";

/**
 * A slim bar that appears once the visitor has scrolled past the hero's
 * own CTA buttons, so the "try it" action stays reachable without forcing
 * them to scroll back up. Tracks a real sentinel element via
 * IntersectionObserver rather than a fixed scroll-pixel threshold: a fixed
 * number drifts out of sync the moment the hero's height changes (a
 * shorter viewport, a translated string that wraps differently, a future
 * redesign), showing the bar either too early — overlapping hero content
 * still on screen — or too late.
 */
export function StickyCtaBar({ locale = "fr" }: { locale?: Locale }) {
  const [visible, setVisible] = useState(false);
  const prefix = localePrefix(locale);

  useEffect(() => {
    const sentinel = document.getElementById(HERO_END_SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Not intersecting because it scrolled above the viewport (bar
      // should show) is a different state from not intersecting because
      // it hasn't been reached yet (bar should stay hidden) — the sign of
      // its own top edge tells them apart.
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex justify-center border-b border-border bg-background px-4 py-2.5 shadow-sm transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <Link
        href={`${prefix}/simulations`}
        tabIndex={visible ? 0 : -1}
        className={buttonVariants({ size: "sm", className: "w-full max-w-xs" })}
      >
        {STRINGS[locale]}
      </Link>
    </div>
  );
}
