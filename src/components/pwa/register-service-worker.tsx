"use client";

import { useEffect } from "react";

/** Registers the no-op service worker (see public/sw.js) client-side. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installability is a progressive enhancement — failing silently
        // here must never block the page from working.
      });
    }
  }, []);

  return null;
}
