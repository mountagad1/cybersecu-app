"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";

/**
 * "🔥 N en série" — shown once a run reaches two correct answers in a row
 * (a single correct answer isn't yet a streak worth flaunting). Pops in
 * with a spring on every increase via `key={streak}`, so the chip itself
 * re-mounts and re-animates each time the number changes rather than the
 * text silently updating in place.
 *
 * Disappears the instant a miss resets the streak to 0/1 — there is no
 * "streak broken" animation. A visible loss animation is exactly the kind
 * of negative reinforcement brief §14 ("never shame the learner") rules
 * out elsewhere in this codebase (see explanation-panel.tsx); the same
 * rule applies to a gamification layer built on top of it.
 */
export function StreakChip({ streak, locale = "fr" }: { streak: number; locale?: Locale }) {
  return (
    <AnimatePresence mode="popLayout">
      {streak >= 2 && (
        <motion.span
          key={streak}
          initial={{ opacity: 0, scale: 0.6, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-sm font-semibold text-warning"
        >
          {getUiStrings(locale).streak.inARow(streak)}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
