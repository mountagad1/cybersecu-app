"use client";

import { motion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fades/slides content in once it's scrolled into view. `once: true` so
 * it never replays — a scroll animation that fires every time you scroll
 * past it is distracting, not convincing. Reduced-motion users get these
 * transitions disabled globally via `<MotionConfig reducedMotion="user">`
 * in the root layout (src/components/motion-provider.tsx) — not handled
 * per-component here.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={variants}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
