"use client";

import { motion } from "motion/react";

const PARTICLES = ["✨", "🎉", "⭐", "✨", "🎉", "⭐", "✨", "🎉"] as const;

/**
 * A small, contained particle pop shown once when a correct answer lands —
 * the immediate reward the retention research behind spaced-repetition
 * tools is built on. Deliberately tiny in scope: 8 emoji travelling at
 * most ~50px before fading, so it can never cause the horizontal overflow
 * a wider effect risked on mobile (the exact bug fixed in
 * scenario-player.tsx's button row). No sound, no full-screen takeover —
 * this sits inline next to the verdict it celebrates.
 *
 * No `key`-driven re-render logic here: the parent mounts this component
 * fresh (via a changing `key` prop) each time a burst should fire, and
 * unmounts it after `DURATION_MS`. That keeps "when does it fire" a parent
 * concern and this component a pure one-shot animation.
 */
const DURATION_MS = 900;

export { DURATION_MS as CONFETTI_DURATION_MS };

export function ConfettiBurst() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-visible"
    >
      {PARTICLES.map((particle, i) => {
        const angle = (i / PARTICLES.length) * Math.PI * 2;
        const distance = 28 + (i % 3) * 8;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-base"
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 0, x, y, scale: 1 }}
            transition={{ duration: DURATION_MS / 1000, ease: "easeOut", delay: i * 0.02 }}
          >
            {particle}
          </motion.span>
        );
      })}
    </span>
  );
}
