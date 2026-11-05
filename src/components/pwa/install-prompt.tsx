"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Download } from "lucide-react";
import { getUiStrings } from "@/domain/i18n/dictionary";

/** Not in the standard DOM lib yet — Chromium-only event. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "cybersecu:install-prompt-dismissed-at";
const DISMISS_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_SNOOZE_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

/**
 * A dismissible install prompt shown once the browser signals the app is
 * installable (Chromium's `beforeinstallprompt`). White background by
 * design regardless of the site's light/dark theme — this is a small,
 * transient piece of chrome, not page content, so it stays visually
 * consistent rather than flipping with `prefers-color-scheme`.
 *
 * DELIBERATELY ONE ROW, EVEN ON MOBILE
 * The previous layout stacked an icon+text block above a full-width button.
 * Measured on a 390×844 viewport (iPhone 12), that occupied 169 px — 20 % of
 * the screen — permanently, over the hero and the first call to action. A
 * single row with the explanatory subtitle dropped costs about a third of
 * that: the button already says "Installer", so the second line was restating
 * the action rather than adding to it.
 *
 * Both controls keep a 44 px hit area. The close button looks small because a
 * `size-4` glyph sits inside a `size-11` box — visual weight and touch target
 * are separate concerns, and the old close target was 36 px, below the usual
 * guidance. Making the install button 44 px too costs nothing in height: the
 * row is already that tall because of the close button.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  // Rendered from the root layout, above both the French (unprefixed) and
  // English (/en) locale-specific layouts, so it has no locale prop to
  // read — the URL is the only signal available here.
  const pathname = usePathname();
  const t = getUiStrings(pathname?.startsWith("/en") ? "en" : "fr").pwa;

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function handleAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // localStorage can throw in private browsing — dismissal just
      // won't be remembered, not worth surfacing an error for.
    }
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-label={t.installLabel}
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80 sm:px-0"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 pl-2.5 pr-1 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
            icon served by our own dynamic route
            (src/app/icons/192/route.tsx), not a candidate for
            next/image's remote-optimization pipeline */}
        <img src="/icons/192" alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />

        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">cybersecu.app</p>

        <button
          type="button"
          onClick={install}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Download className="size-4 shrink-0" aria-hidden />
          {t.installCta}
        </button>

        <button
          type="button"
          onClick={dismiss}
          aria-label={t.close}
          className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
