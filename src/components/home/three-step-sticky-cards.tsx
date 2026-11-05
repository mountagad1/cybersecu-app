"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, GraduationCap, Search, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The three "Apprendre/Détecter/Se protéger" cards, presented as a
 * sticky-scroll stack: each card sticks near the top of the viewport as
 * the visitor scrolls, so the next card slides over it and the numbered
 * sequence reads as a short story rather than a static grid. Sticky at
 * every breakpoint, mobile included — each card is tall enough on its
 * own (a portrait "flashcard" shape) to give the stack room to breathe
 * even on a short phone viewport, which a shorter, wide card wouldn't.
 * The stacking itself is pure CSS `position: sticky` with staggered
 * `top` offsets — no scroll-jacking, unlike a JS-driven scrollTo/wheel-
 * intercept implementation would be — and all three cards are always in
 * the DOM and server-rendered.
 *
 * Each card eases in with a smooth transition once its scroll-triggered
 * viewport entry fires (`whileInView`, `once: true`) — this reads the
 * same live scroll position under a mouse wheel, a trackpad, or a
 * finger dragging on a touchscreen, since all of those ultimately just
 * move the browser's own scroll position, which native `position:
 * sticky` and Motion's viewport tracking both already read smoothly.
 * Deliberately `once: true` rather than continuously scroll-linked: a
 * card that re-crosses the trigger band while the user scrolls back up
 * must stay resolved, not fade back out — it already told its part of
 * the story. `MotionConfig reducedMotion="user"` (see
 * `motion-provider.tsx`) then skips this entrance entirely for visitors
 * with `prefers-reduced-motion`.
 *
 * The icon badge, giant translucent step number, and per-step accent
 * color are built from the app's own token set and `lucide-react` —
 * there's no illustration asset pipeline available here (no image
 * generation, no network egress to fetch stock art), so the "more
 * attractive icon and images" ask is met with a bigger, colorful icon
 * treatment rather than raster illustrations.
 */
const ACCENTS = [
  {
    badge: "bg-primary/10 text-primary",
    border: "border-primary/20",
    number: "text-primary/10",
    iconBg: "bg-primary text-primary-foreground",
    glow: "bg-primary/10",
    text: "text-primary",
  },
  {
    badge: "bg-secondary/10 text-secondary-strong",
    border: "border-secondary/20",
    number: "text-secondary/10",
    iconBg: "bg-secondary text-secondary-foreground",
    glow: "bg-secondary/10",
    text: "text-secondary-strong",
  },
  {
    badge: "bg-success/10 text-success",
    border: "border-success/20",
    number: "text-success/10",
    iconBg: "bg-success text-success-foreground",
    glow: "bg-success/10",
    text: "text-success",
  },
] as const;

const ICONS: LucideIcon[] = [GraduationCap, Search, ShieldCheck];

function StepCard({
  card,
  index,
}: {
  card: { title: string; headline: string; paragraphs: string[]; takeaway?: string; link?: { href: string; label: string } };
  index: number;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  const Icon = ICONS[index % ICONS.length];

  return (
    <div className="sticky mb-6 last:mb-0" style={{ top: `${4 + index * 1.25}rem`, zIndex: index + 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      >
        <Card
          className={cn(
            "relative flex min-h-[22rem] flex-col overflow-hidden border-2 bg-card shadow-lg",
            accent.border,
          )}
        >
          <span
            aria-hidden
            className={cn("pointer-events-none absolute -right-4 -top-10 text-[11rem] font-black leading-none", accent.number)}
          >
            {`0${index + 1}`}
          </span>
          <span aria-hidden className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-3xl", accent.glow)} />

          <CardContent className="relative flex flex-1 flex-col p-8">
            <div className={cn("flex size-14 items-center justify-center rounded-2xl shadow-sm", accent.iconBg)}>
              <Icon className="size-7" aria-hidden />
            </div>

            <span
              className={cn(
                "mt-6 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                accent.badge,
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {card.title}
            </span>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-balance">{card.headline}</h3>

            <div className="mt-3 flex flex-col gap-3 text-muted-foreground">
              {card.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>

            {card.takeaway && (
              <p className="mt-4 flex items-start gap-2 font-semibold text-foreground">
                <ArrowRight className={cn("mt-0.5 size-5 shrink-0", accent.text)} aria-hidden />
                {card.takeaway}
              </p>
            )}

            {card.link && (
              <Link href={card.link.href} className={cn("mt-4 w-fit font-medium underline-offset-4 hover:underline", accent.text)}>
                {card.link.label} →
              </Link>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function ThreeStepStickyCards({
  cards,
}: {
  cards: { title: string; headline: string; paragraphs: string[]; takeaway?: string; link?: { href: string; label: string } }[];
}) {
  return (
    <div className="relative">
      {cards.map((card, index) => (
        <StepCard key={card.title} card={card} index={index} />
      ))}
    </div>
  );
}
