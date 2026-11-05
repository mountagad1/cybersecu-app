"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BatteryFull,
  ChevronLeft,
  Eye,
  ScanSearch,
  ShieldCheck,
  Signal,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UiStrings } from "@/domain/i18n/dictionary";

type RevealStrings = UiStrings["home"]["reveal"];

/**
 * The hero's interactive scene: the fictional bank SMS of the `sms-banque`
 * simulation, shown first as the reader would receive it, then — one toggle
 * later — with its three giveaways marked in place and explained.
 *
 * Built from HTML/CSS only (no image, no video), so it stays sharp, light and
 * free of any real brand; the link never resolves (reserved `.test` TLD, see
 * docs/decisions/0002-synthetic-content-only.md).
 *
 * The two-state cross-fade and the glass pill controls are adapted from the
 * "Elsewhere" hero by guglielmogiannattasio on 21st.dev.
 *
 * Motion respects the OS "reduce motion" setting through `MotionProvider`:
 * the scan sweep is a transform, so it is skipped and only the end states show.
 */
export function ScamRevealScene({ strings }: { strings: RevealStrings }) {
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sweep, setSweep] = useState(0);
  const { phone, giveaways } = strings;

  function toggle() {
    setTouched(true);
    setRevealed((value) => {
      if (!value) setSweep((n) => n + 1);
      return !value;
    });
  }

  return (
    /* One grid, two orders. On a phone the DOM order is the reading order:
       state, SMS, button, then the explanations right under the button the
       thumb just pressed — no scrolling back up to toggle again. From `sm`
       up, the explanations sit beside the phone and the button below both. */
    <div
      role="group"
      aria-label={strings.sceneLabel}
      className="grid grid-cols-1 gap-5 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-x-6"
    >
      <div className="justify-self-center sm:col-span-2 sm:justify-self-start">
        <StateChip revealed={revealed} strings={strings} />
      </div>

      {/* PHONE */}
      <div
        className={cn(
          "relative w-full max-w-[16rem] self-start justify-self-center rounded-[2.25rem] sm:row-start-2 border p-2 shadow-2xl transition-[border-color,box-shadow] duration-700",
          revealed
            ? "border-danger/40 shadow-danger/20"
            : "border-white/15 shadow-black/50",
        )}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950">
          <div
            className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-white/80"
            aria-hidden
          >
            <span>{phone.time}</span>
            <span className="flex items-center gap-1">
              <Signal className="size-3" />
              <Wifi className="size-3" />
              <BatteryFull className="size-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-2 border-b border-white/10 px-3 pt-3 pb-2.5">
            <ChevronLeft className="size-4 text-secondary" aria-hidden />
            <Mark n={1} on={revealed} className="inline-flex items-center rounded-md pl-1">
              <span className="flex items-center gap-2 px-1 py-0.5">
                <span
                  className="flex size-7 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white"
                  aria-hidden
                >
                  {phone.sender.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-white">
                  {phone.sender}
                </span>
              </span>
            </Mark>
          </div>

          <div className="relative min-h-[15rem] px-3 pt-3 pb-6">
            <p className="mb-2 text-center text-[10px] text-white/50">
              {phone.received}
            </p>
            <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-white/10 px-3 py-2.5 text-[13px] leading-relaxed text-white/90">
              {phone.before}
              <Mark n={2} on={revealed}>
                {phone.urgency}
              </Mark>
              {phone.middle}
              <Mark n={3} on={revealed} className="break-all">
                <span className="text-sky-300 underline underline-offset-2">
                  {phone.link}
                </span>
              </Mark>
            </p>

            {/* Darkens the screen a touch once the trap is unmasked. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(220_38_38/0.18),transparent_70%)] transition-opacity duration-700",
                revealed ? "opacity-100" : "opacity-0",
              )}
            />
          </div>

          {/* One teal scan line per reveal. */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                key={sweep}
                aria-hidden
                className="pointer-events-none absolute inset-0"
                initial={{ y: "-5%", opacity: 0 }}
                animate={{ y: "105%", opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              >
                <div className="h-px w-full bg-secondary shadow-[0_0_18px_4px_var(--brand-teal)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 sm:col-span-2 sm:row-start-3 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={revealed}
          className={cn(
            "inline-flex h-12 w-full max-w-[16rem] touch-manipulation items-center justify-center gap-2 rounded-full border px-5 text-[15px] font-medium [-webkit-tap-highlight-color:transparent] sm:h-11 sm:w-auto sm:max-w-none sm:text-sm text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]",
            revealed
              ? "border-white/20 bg-white/10 hover:bg-white/15"
              : "border-danger/50 bg-danger/20 hover:bg-danger/30",
          )}
        >
          {revealed ? (
            <Eye className="size-4" aria-hidden />
          ) : (
            <ScanSearch className="size-4" aria-hidden />
          )}
          {revealed ? strings.toggleBack : strings.toggleReveal}
        </button>
        {!touched && (
          <span className="animate-pulse text-sm text-slate-400" aria-hidden>
            <span className="hidden sm:inline">← </span>
            {strings.hint}
          </span>
        )}
      </div>

      {/* EXPLANATION — fixed height from `sm` up, so the hero does not jump when the state flips. */}
      <div className="w-full sm:col-start-2 sm:row-start-2 sm:min-h-[29rem]">
        <AnimatePresence mode="wait" initial={false}>
          {revealed ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ol className="flex flex-col gap-3">
                {giveaways.map((g, i) => (
                  <motion.li
                    key={g.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.35 + i * 0.15,
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                    }}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3"
                  >
                    <Badge n={i + 1} />
                    <span className="text-[13px] leading-snug">
                      <span className="font-semibold text-white">
                        {g.title}
                      </span>
                      <span className="block text-slate-300">{g.body}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + giveaways.length * 0.15 }}
                className="mt-3 flex gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-[13px] leading-snug text-emerald-100"
              >
                <ShieldCheck
                  className="mt-0.5 size-4 shrink-0 text-emerald-300"
                  aria-hidden
                />
                {strings.reflex}
              </motion.p>
            </motion.div>
          ) : (
            <motion.p
              key="seen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden text-base leading-relaxed text-slate-300 sm:block sm:pt-6"
            >
              {strings.seenCaption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="sr-only" aria-live="polite">
        {revealed ? strings.announce : ""}
      </p>
    </div>
  );
}

function StateChip({
  revealed,
  strings,
}: {
  revealed: boolean;
  strings: RevealStrings;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-colors duration-500",
        revealed
          ? "border-danger/50 bg-danger/15 text-red-200"
          : "border-white/15 bg-white/5 text-slate-300",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          revealed ? "bg-red-400" : "bg-emerald-400",
        )}
      />
      {revealed ? strings.stateHidden : strings.stateSeen}
    </span>
  );
}

/** Highlights a giveaway in place, with its number, once the trap is unmasked. */
function Mark({
  n,
  on,
  className,
  children,
}: {
  n: number;
  on: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-sm box-decoration-clone ring-inset transition-[background-color,box-shadow] duration-500",
        on && "bg-danger/25 ring-1 ring-red-400/80",
        className,
      )}
    >
      {/* Inline, not absolute: an absolute badge on a mark that wraps across
          lines lands on the neighbouring mark on narrow screens. */}
      <span
        aria-hidden
        className={cn(
          "inline-flex overflow-hidden align-[-0.15em] transition-[width,margin,opacity] duration-300",
          on ? "mr-1 w-4 opacity-100" : "w-0 opacity-0",
        )}
      >
        <Badge n={n} small />
      </span>
      {children}
    </span>
  );
}

function Badge({ n, small = false }: { n: number; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-danger font-bold text-white shadow-lg shadow-danger/40",
        small ? "size-4 text-[10px]" : "size-6 text-xs",
      )}
    >
      {n}
    </span>
  );
}
