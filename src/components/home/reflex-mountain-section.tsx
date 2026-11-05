"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Mountain } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { cn } from "@/lib/utils";

/**
 * "The road to recognizing the trap": a scroll-driven ascent up a
 * minimalist snowy mountain, from "Apprendre" at the base to "Se
 * protéger" at the summit — climbing it is purely a function of scroll
 * position, deliberately decoupled from the separate interactive
 * scenario rendered below it. That scenario echoes the "Décider" stage
 * thematically but doesn't gate the climb: answering it correctly shows
 * a CTA into the real simulation catalogue; answering incorrectly
 * explains the risk (never "wrong answer") and offers a retry — there's
 * no score to lose, only a reflex to build, and no click-through-five-
 * steps gate on the mountain itself (scroll is the only input it reads).
 *
 * The mountain, path and marker are plain SVG (`MountainAscent` below)
 * — flat geometric shapes built from the app's own tokens, not a
 * stock/AI illustration. Scroll position is the only input: one
 * `useScroll` progress value drives the path reveal, the marker's
 * position, and which stage is "active" — never five independent
 * listeners, never a JS scroll-jack (native scrolling is untouched;
 * the mountain just stays pinned via `position: sticky` while its tall
 * wrapper scrolls past underneath it). The five stage names are always
 * present as a real, always-visible `<ol>` next to the mountain — the
 * SVG's own stage labels are `aria-hidden` decoration on top of it, so
 * nothing here depends on position, color or animation alone to convey
 * which stage means what.
 *
 * `prefers-reduced-motion` hides the one genuinely continuous piece of
 * motion — the chasing marker circle — and freezes the path's traveled-
 * segment illumination to fully drawn instead of animating its reveal,
 * per the brief's explicit "disable smooth marker movement, disable
 * decorative transitions" instruction. The full route and every stage
 * dot's reached/unreached state stay on either way: that state is a
 * factual read of how far the visitor has actually scrolled, not
 * decorative movement, so there's nothing to gate there.
 */
type AnswerState = "idle" | "risk" | "success";

const STAGE_COUNT = 5;

/** [x, y] in a fixed 0–400 × 0–600 SVG coordinate space: start, then one
 * point per stage, ascending as a switchback rather than a straight
 * vertical line. `preserveAspectRatio="xMidYMid meet"` keeps this exact
 * shape (no stretching) at every viewport width — mobile included. */
const ANCHORS: [number, number][] = [
  [70, 560], // start
  [170, 470], // 01 Apprendre
  [80, 370], // 02 Observer
  [210, 290], // 03 Vérifier
  [100, 180], // 04 Décider
  [220, 70], // 05 Se protéger / summit
];
const PROGRESS_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function polylineLength(points: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    total += Math.hypot(x2 - x1, y2 - y1);
  }
  return total;
}
const PATH_LENGTH = polylineLength(ANCHORS);
const PATH_D = ANCHORS.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

interface Snowflake {
  left: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  opacity: number;
}

const SNOWFLAKES: Snowflake[] = [
  { left: "6%", size: "4px", duration: "13s", delay: "0s", drift: "18px", opacity: 0.3 },
  { left: "16%", size: "3px", duration: "10s", delay: "2.5s", drift: "-14px", opacity: 0.25 },
  { left: "27%", size: "5px", duration: "15s", delay: "1s", drift: "10px", opacity: 0.35 },
  { left: "38%", size: "3px", duration: "11s", delay: "4s", drift: "-20px", opacity: 0.2 },
  { left: "49%", size: "4px", duration: "14s", delay: "0.5s", drift: "16px", opacity: 0.3 },
  { left: "60%", size: "3px", duration: "9s", delay: "3s", drift: "-10px", opacity: 0.22 },
  { left: "71%", size: "5px", duration: "16s", delay: "5.5s", drift: "22px", opacity: 0.32 },
  { left: "82%", size: "3px", duration: "12s", delay: "1.5s", drift: "-16px", opacity: 0.25 },
  { left: "91%", size: "4px", duration: "10.5s", delay: "6s", drift: "12px", opacity: 0.28 },
  { left: "20%", size: "3px", duration: "13.5s", delay: "2s", drift: "-18px", opacity: 0.22 },
  { left: "55%", size: "3px", duration: "17s", delay: "7s", drift: "14px", opacity: 0.2 },
  { left: "85%", size: "4px", duration: "10s", delay: "8s", drift: "-18px", opacity: 0.28 },
];

function MountainSnowfall() {
  return (
    <div aria-hidden className="reflex-mountain-snowfall pointer-events-none absolute inset-0 overflow-hidden">
      {SNOWFLAKES.map((flake, index) => (
        <span
          key={index}
          style={
            {
              "--snow-left": flake.left,
              "--snow-size": flake.size,
              "--snow-duration": flake.duration,
              "--snow-delay": flake.delay,
              "--snow-drift": flake.drift,
              "--snow-opacity": flake.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The pinned mountain scene: sits inside a tall scroll track and stays
 * visually fixed in the viewport while that track scrolls past behind
 * it, so climbing the path reads as one continuous ascent rather than
 * a section flying by. */
function MountainAscent({ stages }: { stages: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Motion reads the OS setting synchronously on the first client render,
  // but the server always renders as if motion were allowed: honouring it
  // before hydration made the markup differ (React error #418). Wait for
  // hydration, then switch.
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = useHydrated() && prefersReducedMotion;
  // `reachedCount`: how many stage anchors the marker has actually arrived
  // at and passed (0–4) — NOT "which stage is being climbed toward". The
  // marker travels from ANCHORS[0] (start) to ANCHORS[i+1] over progress
  // stop i/5 → (i+1)/5, so stage i only becomes "reached" once progress
  // crosses (i+1)/5, one segment later than a naive `floor(progress*5)`
  // would suggest — that off-by-one previously marked every stage (the
  // summit included) as reached a whole 20%-of-scroll early.
  const [reachedCount, setReachedCount] = useState(0);
  const [atSummit, setAtSummit] = useState(false);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  const markerX = useTransform(scrollYProgress, PROGRESS_STOPS, ANCHORS.map(([x]) => x));
  const markerY = useTransform(scrollYProgress, PROGRESS_STOPS, ANCHORS.map(([, y]) => y));
  const dashOffset = useTransform(scrollYProgress, [0, 1], [PATH_LENGTH, 0]);
  const markerScale = useTransform(scrollYProgress, [0, 0.98, 1], [1, 1, 1.25]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const count = Math.min(STAGE_COUNT, Math.max(0, Math.floor(latest * STAGE_COUNT)));
    setReachedCount((prev) => (prev === count ? prev : count));
    const summit = latest >= 0.995;
    setAtSummit((prev) => (prev === summit ? prev : summit));
  });

  return (
    <div ref={trackRef} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-20 flex h-[min(78vh,640px)] items-center justify-center overflow-hidden">
        <MountainSnowfall />

        <svg
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid meet"
          className="relative h-full w-auto max-w-full"
          aria-hidden
        >
          {/* Minimalist two-peak silhouette with a light snow cap on each —
              flat geometric shapes from the app's own tokens, not a stock
              or AI-generated illustration. */}
          <polygon points="30,600 140,190 250,600" fill="var(--color-muted)" opacity={0.7} />
          <polygon points="105,270 140,190 178,270" fill="#ffffff" opacity={0.9} />
          <polygon points="0,600 235,60 400,600" fill="var(--color-primary)" opacity={0.055} />
          <polygon points="190,190 235,60 282,190" fill="#ffffff" />

          {/* Full route, always visible regardless of motion preference —
              only the traveled-segment illumination on top of it (and the
              marker below) is the part reduced-motion visitors skip. */}
          <path d={PATH_D} fill="none" stroke="var(--color-border)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <motion.path
            d={PATH_D}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={shouldReduceMotion ? undefined : { strokeDasharray: PATH_LENGTH, strokeDashoffset: dashOffset }}
          />

          {ANCHORS.slice(1).map(([x, y], index) => {
            const isSummit = index === STAGE_COUNT - 1;
            const reached = isSummit ? atSummit : index < reachedCount;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSummit ? 14 : 10}
                  fill={reached ? "var(--color-primary)" : "var(--color-card)"}
                  stroke={reached ? "var(--color-primary)" : "var(--color-border)"}
                  strokeWidth={2}
                />
                {isSummit && reached && (
                  <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fill="var(--color-primary-foreground)">
                    ✓
                  </text>
                )}
                <text
                  x={x + (x < 200 ? 22 : -22)}
                  y={y + 5}
                  textAnchor={x < 200 ? "start" : "end"}
                  fontSize={15}
                  fontWeight={reached ? 700 : 500}
                  fill={reached ? "var(--color-foreground)" : "var(--color-muted-foreground)"}
                >
                  {String(index + 1).padStart(2, "0")} — {stages[index]}
                </text>
              </g>
            );
          })}

          {/* The chasing marker is the one piece of genuinely smooth,
              continuously-interpolated motion here — hidden under
              prefers-reduced-motion per the brief, while the stage dots'
              reached/unreached state above (driven by the same scroll
              progress) stays on: that's real information about how far
              down the page you've scrolled, not decorative movement. */}
          {!shouldReduceMotion && (
            <motion.circle r={9} fill="var(--color-primary)" style={{ cx: markerX, cy: markerY, scale: markerScale }} />
          )}
        </svg>
      </div>
    </div>
  );
}

export function ReflexMountainSection({ locale = "fr" }: { locale?: Locale }) {
  const t = getUiStrings(locale).reflexMountain;
  const prefix = localePrefix(locale);
  const [status, setStatus] = useState<AnswerState>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedChoice = t.scenario.choices.find((choice) => choice.id === selectedId) ?? null;

  function handleSelect(choiceId: string) {
    const choice = t.scenario.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    setSelectedId(choiceId);
    setStatus(choice.correct ? "success" : "risk");
  }

  function handleRetry() {
    setSelectedId(null);
    setStatus("idle");
  }

  return (
    <section aria-labelledby="reflex-mountain-heading" className="border-t border-border py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="text-center">
            <Mountain className="mx-auto size-8 text-primary" aria-hidden />
            <h2 id="reflex-mountain-heading" className="mt-3 text-3xl font-bold tracking-tight text-balance">
              {t.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-balance">{t.subheading}</p>
          </div>
        </Reveal>

        {/* The real, always-present list of stages: the SVG mountain above
            is a decorative, aria-hidden visualization of this same
            information, never the only place it exists. */}
        <ol aria-label={t.roadmapAriaLabel} className="sr-only">
          {t.stages.map((stage, index) => (
            <li key={stage}>
              {String(index + 1).padStart(2, "0")} — {stage}
              {index === t.stages.length - 1 ? ` (${t.summitLabel})` : ""}
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <MountainAscent stages={t.stages} />
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.scenario.channelLabel}
            </p>
            <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm font-semibold">{t.scenario.sender}</p>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed">{t.scenario.message}</p>
              <p className="mt-2 break-all text-sm text-primary underline">{t.scenario.link}</p>
            </div>

            <p className="mt-6 font-semibold">{t.scenario.prompt}</p>

            <div className="mt-3 flex flex-col gap-2" role="group" aria-label={t.scenario.prompt}>
              {t.scenario.choices.map((choice) => {
                const isSelected = selectedId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelect(choice.id)}
                    disabled={status !== "idle"}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected
                        ? choice.correct
                          ? "border-success bg-success/10"
                          : "border-warning bg-warning/10"
                        : "border-border bg-background hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-sm",
                      "disabled:pointer-events-none disabled:opacity-100",
                    )}
                  >
                    <span className="flex-1">{choice.label}</span>
                    {isSelected &&
                      (choice.correct ? (
                        <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />
                      ) : (
                        <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
                      ))}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="mt-4 empty:mt-0">
              <AnimatePresence mode="wait">
                {selectedChoice && (
                  <motion.div
                    key={selectedChoice.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Alert tone={selectedChoice.correct ? "success" : "warning"} title={selectedChoice.feedbackTitle}>
                      {selectedChoice.feedbackBody}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {status === "risk" && (
              <button
                type="button"
                onClick={handleRetry}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
              >
                {t.scenario.retryCta}
              </button>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 flex flex-col items-start gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{t.scenario.ctaHeading}</p>
                  <p className="text-sm text-muted-foreground">{t.scenario.ctaBody}</p>
                </div>
                <Link href={`${prefix}/simulations`} className={buttonVariants({ size: "sm", className: "shrink-0" })}>
                  {t.scenario.ctaLabel}
                </Link>
              </motion.div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const noopSubscribe = () => () => {};

/** False during the server render and hydration, true afterwards. */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
