"use client";

import { motion, AnimatePresence } from "motion/react";
import { STREAK_MILESTONES } from "@/lib/sessionScore";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

/**
 * One-off celebration shown inline when a streak crosses a declared
 * milestone (`isStreakMilestone`, src/lib/sessionScore.ts). Purely
 * additive to the flow it appears in: it never blocks the next-simulation
 * buttons underneath it, and `AnimatePresence` animates it back out on
 * unmount so it never leaves a layout jump when the parent's timer clears
 * it a few seconds later.
 *
 * Messages scale with the achievement rather than repeating the same
 * line — a 30-streak visitor has earned different words than a 3-streak
 * one — but stay factual (no invented stakes, no comparison to other
 * visitors) in keeping with the rest of this codebase's tone.
 */
export function StreakMilestoneToast({
  milestone,
  locale = "fr",
}: {
  milestone: number | null;
  locale?: Locale;
}) {
  const message = milestone !== null ? getUiStrings(locale).streak.milestones[milestone] : undefined;
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={milestone}
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div
            role="status"
            className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm font-medium text-foreground"
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Re-exported for callers that only have a raw streak number to hand. */
export { STREAK_MILESTONES };
