import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ChevronDown,
  FlaskConical,
  UserRoundX,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUiStrings } from "@/domain/i18n/dictionary";
import type { Locale } from "@/domain/i18n/locale";
import { ParticleDrift } from "@/components/ui/particle-drift";
import { ScamRevealScene } from "@/components/home/scam-reveal-scene";
import { HERO_END_SENTINEL_ID } from "@/components/home/sticky-cta-bar";
import { SALES_OPEN } from "@/lib/sales";

/** Anchor of the scene, for the mobile "spot the trap below" cue. */
const SCENE_ID = "demo-piege";

const LINKS: Record<
  Locale,
  { try: string; discover: string; sources: string }
> = {
  fr: {
    try: "/simulations/sms-banque",
    discover: "/attaques",
    sources: "/sources",
  },
  en: {
    try: "/en/simulations/bank-sms",
    discover: "/en/attaques",
    sources: "/en/sources",
  },
};

/**
 * The home hero: a dark stage with the promise and the two CTAs on one side,
 * and on the other a fictional scam SMS the visitor can unmask
 * (`ScamRevealScene`, the only client part).
 *
 * The copy is server-rendered and the <h1> is never faded in, so it stays the
 * page's LCP element; the other lines rise in through the `hero-rise` CSS
 * class (globals.css), which reduced motion turns off.
 */
export function ScamRevealHero({ locale }: { locale: Locale }) {
  const t = getUiStrings(locale).home;
  const links = LINKS[locale];
  const rise = (i: number) =>
    ({ "--rise-delay": `${0.1 + i * 0.12}s` }) as React.CSSProperties;

  return (
    <section className="relative isolate overflow-clip bg-(--brand-navy) text-white">
      <div aria-hidden className="hero-glow absolute inset-0 -z-10" />
      <ParticleDrift className="hero-particles -z-10" />
      <div aria-hidden className="hero-particles-veil absolute inset-0 -z-10" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-10 pb-12 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:py-24">
        <div className="flex flex-col gap-5 text-center sm:gap-6 lg:text-left">
          <p
            className="hero-rise mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 lg:mx-0"
            style={rise(0)}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-secondary" />
            {t.reveal.eyebrow}
          </p>

          <h1 className="text-[2.125rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl sm:leading-tight lg:text-[3.25rem] lg:leading-[1.05]">
            {t.heroTitle}
          </h1>

          <p
            className="hero-rise mx-auto max-w-[60ch] text-base text-pretty text-slate-300 sm:text-lg lg:mx-0"
            style={rise(1)}
          >
            {t.heroSubtitle}
          </p>

          <div
            className="hero-rise flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start"
            style={rise(2)}
          >
            <Link
              href={links.try}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group w-full touch-manipulation rounded-full shadow-lg shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto",
              )}
            >
              {t.tryCta}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href={links.discover}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full touch-manipulation rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto",
              )}
            >
              {t.discoverCta}
            </Link>
          </div>
          {/* Right after the CTAs, not after the whole hero: on mobile the scene
              sits below them, and the sticky bar must take over as soon as the
              CTAs scroll away. */}
          <div id={HERO_END_SENTINEL_ID} aria-hidden className="-mt-6" />

          <div className="hero-rise flex flex-col gap-3" style={rise(3)}>
            <p className="text-sm text-slate-400">{SALES_OPEN ? t.quotaNote : t.quotaNoteSalesClosed}</p>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-300 lg:justify-start">
              <li className="flex items-center gap-1.5">
                <UserRoundX className="size-4 text-secondary" aria-hidden />
                {t.reveal.trust.noAccount}
              </li>
              <li className="flex items-center gap-1.5">
                <FlaskConical className="size-4 text-secondary" aria-hidden />
                {t.reveal.trust.fictional}
              </li>
              <li>
                <Link
                  href={links.sources}
                  // Padding widens the tap target to ~44px without moving the row.
                  className="-my-2 flex items-center gap-1.5 py-2 underline-offset-4 hover:text-white hover:underline focus-visible:outline-white"
                >
                  <BookOpenCheck
                    className="size-4 text-secondary"
                    aria-hidden
                  />
                  {t.reveal.trust.sources}
                </Link>
              </li>
            </ul>
          </div>

          {/* Below `lg` the scene is under the fold: say there is something to try there. */}
          <a
            href={`#${SCENE_ID}`}
            className="hero-rise mx-auto -mb-2 inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-full px-3 text-sm font-medium text-secondary hover:text-white lg:hidden"
            style={rise(4)}
          >
            {t.reveal.jumpToDemo}
            <ChevronDown
              className="size-4 motion-safe:animate-bounce"
              aria-hidden
            />
          </a>
        </div>

        {/* scroll-mt clears the sticky CTA bar when the cue above jumps here. */}
        <div
          id={SCENE_ID}
          className="hero-rise mx-auto w-full max-w-2xl scroll-mt-20"
          style={rise(4)}
        >
          {/* On a phone the card chrome would only eat width: just a divider there. */}
          <div className="border-t border-white/10 pt-8 sm:rounded-3xl sm:border sm:bg-white/[0.03] sm:p-6 sm:shadow-2xl sm:shadow-black/40">
            <ScamRevealScene strings={t.reveal} />
          </div>
        </div>
      </div>
    </section>
  );
}
