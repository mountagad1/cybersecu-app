"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes every Motion animation in the app respect
 * the OS-level "reduce motion" accessibility setting automatically —
 * transforms/opacity transitions still apply their end state instantly
 * instead of animating. This is the one global switch; individual
 * components (Reveal, AnimatedNumber) don't need to re-check it, except
 * AnimatedNumber, which reads it directly because it drives raw text
 * content rather than a CSS transform Motion can intercept.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
