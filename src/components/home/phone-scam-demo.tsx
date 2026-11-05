import Link from "next/link";
import { AlertTriangle, BatteryFull, ChevronLeft, Signal, User, Wifi } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";

/**
 * A realistic phone mockup of a fake delivery SMS, matching the page's
 * own locale — the French page shows only the French phone, the English
 * page only the English one. There's nothing to hydrate: this is a plain
 * server component, no client JS at all.
 *
 * Deliberately not wired to /api/attempts or the quota system: this is a
 * passive, always-visible educational demonstration, not a scored
 * attempt, so it must never consume the free quota or require a session.
 * The CTA links to the actual playable version of this same scenario.
 *
 * The phone is built entirely from HTML/CSS/SVG icons (no raster image),
 * and the fictional link never resolves — the domain is under the
 * reserved `.test` TLD (RFC 2606), matching the convention every other
 * scenario in `src/content/simulations` already uses for exactly this
 * reason (docs/decisions/0002-synthetic-content-only.md).
 */
const SITE_STRINGS: Record<
  Locale,
  { heading: string; subheading: string; disclaimer: string; cta: string }
> = {
  fr: {
    heading: "Reconnaissez une arnaque avant de tomber dans le piège.",
    subheading:
      "Découvrez à quoi ressemble un faux SMS de livraison et apprenez à repérer les signaux d'alerte.",
    disclaimer:
      "Ceci est un exemple fictif à des fins de sensibilisation. Ne cliquez jamais sur un lien dans un message non sollicité.",
    cta: "Testez-vous gratuitement",
  },
  en: {
    heading: "Recognize a scam before it tricks you.",
    subheading: "See what a fake delivery SMS looks like and learn how to spot the warning signs.",
    disclaimer: "This is a fictional example for awareness purposes. Never click a link in an unsolicited message.",
    cta: "Test yourself for free",
  },
};

const PHONE_CONTENT: Record<
  Locale,
  {
    time: string;
    contact: string;
    dateLabel: string;
    sender: string;
    message: string;
    link: string;
    signature: string;
    messageFieldPlaceholder: string;
    whySuspiciousTitle: string;
    whySuspiciousBody: string;
    warningSigns: string[];
  }
> = {
  fr: {
    time: "09:41",
    contact: "+33 6 12 34 56 78",
    dateLabel: "Aujourd'hui 09:38",
    sender: "Bonjour,",
    message:
      "Votre colis n'a pas pu être livré en raison d'une adresse incorrecte.\n\nVeuillez cliquer sur le lien ci-dessous pour reprogrammer la livraison :",
    link: "https://mon-colis-suivi.example-not-real.test",
    signature: "Merci de votre réactivité.",
    messageFieldPlaceholder: "Message",
    whySuspiciousTitle: "Pourquoi est-ce suspect ?",
    whySuspiciousBody:
      "Le message crée un sentiment d'urgence et vous demande de cliquer sur un lien pour résoudre un problème de livraison.",
    warningSigns: [
      "Expéditeur inconnu",
      "Demande de cliquer sur un lien",
      "Urgence artificielle",
      "Adresse web inhabituelle",
    ],
  },
  en: {
    time: "09:41",
    contact: "+1 202 555 0119",
    dateLabel: "Today 09:38",
    sender: "Hello,",
    message:
      "Your package could not be delivered because the address appears to be incorrect.\n\nPlease click the link below to reschedule your delivery:",
    link: "https://my-parcel-tracking.example-not-real.test",
    signature: "Thank you for your prompt action.",
    messageFieldPlaceholder: "Text message",
    whySuspiciousTitle: "Why is this suspicious?",
    whySuspiciousBody:
      "The message creates a sense of urgency and asks you to click a link to solve a delivery problem.",
    warningSigns: ["Unknown sender", "Request to click a link", "Artificial urgency", "Unusual web address"],
  },
};

function PhoneColumn({ locale }: { locale: Locale }) {
  const t = PHONE_CONTENT[locale];
  return (
    <div lang={locale} className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[300px]">
        {/* A light phone on the dark stage: it reads as the real device. */}
        <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-slate-800 bg-background text-foreground shadow-2xl ring-1 ring-white/15 shadow-black/50">
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-xs font-semibold">
            <span>{t.time}</span>
            <div className="flex items-center gap-1 text-foreground">
              <Signal className="size-3.5" aria-hidden />
              <Wifi className="size-3.5" aria-hidden />
              <BatteryFull className="size-4" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-b border-border px-4 pb-3 pt-1">
            <div className="flex w-full items-center">
              <ChevronLeft className="size-5 text-primary" aria-hidden />
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User className="size-6" aria-hidden />
            </div>
            <span className="text-xs text-muted-foreground">{t.contact}</span>
          </div>

          <div className="min-h-[280px] bg-muted/40 px-3 py-4">
            <p className="mb-3 text-center text-[11px] text-muted-foreground">{t.dateLabel}</p>
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-card px-3.5 py-2.5 text-[13px] leading-snug shadow-sm">
              <p className="font-medium">{t.sender}</p>
              <p className="mt-1.5 whitespace-pre-line break-words">{t.message}</p>
              <p className="mt-1.5 break-all text-primary underline">{t.link}</p>
              <p className="mt-1.5">{t.signature}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
            <div className="flex-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              {t.messageFieldPlaceholder}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[300px] text-left">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <AlertTriangle className="size-4 shrink-0 text-amber-300" aria-hidden />
          {t.whySuspiciousTitle}
        </h3>
        <p className="mt-1.5 text-sm text-slate-300">{t.whySuspiciousBody}</p>

        <ul className="mt-3 flex flex-col gap-1.5">
          {t.warningSigns.map((sign) => (
            <li
              key={sign}
              className="flex items-center gap-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-2.5 py-1.5 text-xs text-amber-50"
            >
              <AlertTriangle className="size-3.5 shrink-0 text-amber-300" aria-hidden />
              {sign}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PhoneScamDemo({ locale = "fr" }: { locale?: Locale }) {
  const site = SITE_STRINGS[locale];
  const prefix = localePrefix(locale);
  const ctaHref = locale === "en" ? `${prefix}/simulations` : `${prefix}/simulations/sms-colis`;

  return (
    <section aria-labelledby="phone-scam-demo-heading" className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h2 id="phone-scam-demo-heading" className="text-3xl font-bold tracking-tight text-balance">
          {site.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300 text-balance">{site.subheading}</p>
      </div>

      <div className="mt-10 flex justify-center">
        <PhoneColumn locale={locale} />
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full max-w-xs touch-manipulation rounded-full shadow-lg shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          )}
        >
          {site.cta}
        </Link>
        <p role="note" className="mx-auto max-w-2xl rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-300">
          {site.disclaimer}
        </p>
      </div>
    </section>
  );
}
