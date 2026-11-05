"use client";

import { motion } from "motion/react";
import { ShieldCheck, type LucideIcon } from "lucide-react";

const STARS = [
  { top: "8%", left: "18%", size: 2, duration: 3.2, delay: 0 },
  { top: "14%", left: "82%", size: 1.5, duration: 4.1, delay: 0.6 },
  { top: "28%", left: "6%", size: 1.5, duration: 3.7, delay: 1.1 },
  { top: "38%", left: "92%", size: 2, duration: 3, delay: 0.3 },
  { top: "62%", left: "4%", size: 1.5, duration: 4.4, delay: 1.6 },
  { top: "72%", left: "90%", size: 2, duration: 3.6, delay: 0.9 },
  { top: "88%", left: "22%", size: 1.5, duration: 3.3, delay: 1.9 },
  { top: "92%", left: "78%", size: 2, duration: 4, delay: 0.2 },
] as const;

// Orbit icons are positioned by their centre, so the radius must leave room
// for half an icon (~7% of the container at the smallest size) or they'd sit
// past the container edge — and the rotating layer's bounding box would then
// widen the page into a horizontal scroll on a 320px screen.
const RADIUS_PERCENT = 41;

function orbitPosition(index: number, total: number) {
  const angle = (index / total) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  return {
    left: `${50 + RADIUS_PERCENT * Math.cos(rad)}%`,
    top: `${50 + RADIUS_PERCENT * Math.sin(rad)}%`,
  };
}

/**
 * Purely decorative (aria-hidden) — every persona's name and description
 * lives in the visible card grid rendered alongside this. Continuous
 * rotation is a transform animation, so <MotionConfig reducedMotion="user">
 * in the root layout already disables it for prefers-reduced-motion users.
 */
export function OrbitalDiagram({
  items,
}: {
  items: readonly { icon: LucideIcon; title: string }[];
}) {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[260px] select-none overflow-hidden sm:max-w-[360px]"
    >
      {STARS.map((star, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-primary/40"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-[6%] rounded-full border border-dashed border-border" />
      <div className="absolute inset-[26%] rounded-full border border-dashed border-border/60" />

      <motion.div
        className="absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:size-20"
        style={{ left: "50%", top: "50%" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck className="size-6 sm:size-7" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      >
        {items.map(({ icon: Icon, title }, index) => {
          const position = orbitPosition(index, items.length);
          return (
            <motion.div
              key={title}
              className="absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm sm:size-12"
              style={position}
              animate={{ rotate: -360 }}
              transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            >
              <Icon className="size-4 sm:size-5" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
