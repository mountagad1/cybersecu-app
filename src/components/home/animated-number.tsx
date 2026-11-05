"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";

/**
 * Counts up from 0 to `value` once scrolled into view, then stays put —
 * never replays on re-scroll (`once: true`), and jumps straight to the
 * final value for anyone with reduced-motion preferences instead of
 * animating it (brief: never present fake scientific precision, and
 * accessibility requires respecting reduced-motion).
 */
export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    if (!isInView) return;

    if (prefersReducedMotion) {
      ref.current.textContent = `${prefix}${value.toLocaleString("fr-FR")}${suffix}`;
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("fr-FR")}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, prefix, suffix, motionValue, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
