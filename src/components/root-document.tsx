import { ClickTracker } from "@/components/analytics/click-tracker";
import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import { RegisterServiceWorker } from "@/components/pwa/register-service-worker";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { MotionProvider } from "@/components/motion-provider";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import type { Locale } from "@/domain/i18n/locale";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { openGraph } from "@/lib/open-graph";
import "@/app/globals.css";

/**
 * The `<html>` shell shared by the two root layouts — `(marketing)/layout.tsx`
 * (French) and `en/layout.tsx` (English).
 *
 * There is deliberately no `app/layout.tsx`: a single root layout can only
 * hardcode one `lang`, which declared all 110 English pages as French. Two
 * root layouts keep every page statically rendered and give each its real
 * language. The cost is a full page load when switching language, which is
 * a rare, deliberate navigation.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const SITE_COPY: Record<Locale, { title: string; description: string; home: string }> = {
  fr: {
    title: "cybersecu.app — Apprendre, détecter, se protéger",
    description:
      "Développez vos réflexes face aux arnaques et cyberattaques grâce à des simulations réalistes de SMS, emails, appels et sites frauduleux.",
    home: "/",
  },
  en: {
    title: "cybersecu.app — Learn, detect, protect yourself",
    description:
      "Build your reflexes against scams and cyberattacks with realistic simulations of fraudulent texts, emails, calls and websites.",
    home: "/en",
  },
};

/**
 * Metadata defaults for a root layout.
 *
 * NOTE: deliberately no `alternates.canonical` default. Inheriting a canonical
 * from a root layout would make any route that forgets one silently declare
 * itself a duplicate of the homepage — a worse failure than no canonical at
 * all. Each indexable route sets its own; `src/app/seo.test.ts` guards that.
 */
export function rootMetadata(locale: Locale): Metadata {
  const copy = SITE_COPY[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy.title, template: "%s | cybersecu.app" },
    description: copy.description,
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/apple-icon",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "cybersecu",
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
    openGraph: openGraph(locale, { type: "website", url: absoluteUrl(copy.home) }),
    // Pages never set `twitter`, so this reaches all of them; Twitter/X
    // falls back to the Open Graph image.
    twitter: { card: "summary_large_image" },
  };
}

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // White, matching the site's permanent light background — the mobile
  // browser chrome (address bar/status bar) should never tint navy.
  themeColor: "#ffffff",
};

export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${inter.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteJsonLd locale={locale} />
        <MotionProvider>{children}</MotionProvider>
        <RegisterServiceWorker />
        <InstallPrompt />
        <ClickTracker />
      </body>
    </html>
  );
}
