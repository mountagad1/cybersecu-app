import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";
import type { Locale } from "@/domain/i18n/locale";
import { OG_IMAGE_SIZE } from "@/lib/open-graph";

/**
 * Site-wide share image, one per language, served by
 * `src/app/og/[locale]/route.tsx`. Text only states what the site is — no
 * claim, no number.
 */
const COPY: Record<Locale, { tagline: string; line: string }> = {
  fr: {
    tagline: "Apprendre, détecter, se protéger",
    line: "Encyclopédie des arnaques et cyberattaques, simulations réalistes",
  },
  en: {
    tagline: "Learn, detect, protect yourself",
    line: "Scam and cyberattack encyclopedia, realistic simulations",
  },
};

export function renderOgImage(locale: Locale): ImageResponse {
  const copy = COPY[locale];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#ffffff",
          color: "#0b1220",
          borderTop: "16px solid #2563eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <AppIcon size={120} />
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
            cybersecu<span style={{ color: "#0fb5ae" }}>.app</span>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 56, fontWeight: 700 }}>{copy.tagline}</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#475569" }}>{copy.line}</div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
