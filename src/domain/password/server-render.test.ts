import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PasswordGenerator } from "@/components/tools/password-generator";

/**
 * The server render of the generator — what ends up in the static HTML and
 * the CDN cache — must hold no password and must not even draw one. A
 * source check cannot catch `useState(() => generate…)` or a draw in the
 * render body; rendering does.
 */
describe("PasswordGenerator server render", () => {
  afterEach(() => vi.restoreAllMocks());

  for (const locale of ["fr", "en"] as const) {
    it(`draws nothing and shows the loading state (${locale})`, () => {
      const spy = vi.spyOn(globalThis.crypto, "getRandomValues");
      const html = renderToString(createElement(PasswordGenerator, { locale }));
      expect(spy).not.toHaveBeenCalled();
      expect(html).toContain(locale === "fr" ? "Génération en cours" : "Generating…");
      expect(html).not.toContain("data-value");
      expect(html).toContain("<noscript>");
    });
  }
});
