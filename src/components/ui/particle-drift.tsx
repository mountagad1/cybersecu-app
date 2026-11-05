"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A canvas background of drifting glyphs, fast upward beams and faint links
 * between nearby glyphs; glyphs near the pointer light up and connect to it.
 *
 * Ported from the "Particle Drift" effect on 21st.dev. The original renders a
 * whole HTML document in a sandboxed iframe that loads the Tailwind CDN,
 * GSAP, Iconify and Google Fonts just to draw this canvas; here it is the
 * same drawing loop, native, with no dependency and no external request.
 *
 * - Fills its parent (`absolute inset-0`); purely decorative, `aria-hidden`.
 *   The canvas itself is at most one viewport tall and sticks to the
 *   viewport while its parent scrolls past, so a tall section costs no more
 *   than a screenful of pixels. The parent must not use `overflow: hidden`
 *   (which breaks sticky positioning): use `overflow: clip`.
 * - Starts once the browser is idle, so it never competes with the page's
 *   own loading and hydration.
 * - Particle counts scale with the area, capped, so a tall section or a big
 *   screen costs no more than the original 90 glyphs / 25 beams.
 * - Draws at most 30 frames per second (motion is time-based, so speeds do
 *   not change), batches the links into four strokes per frame, and stops
 *   when off-screen or when the tab is hidden.
 * - Under `prefers-reduced-motion`, draws one still frame and never animates.
 */
export interface ParticleDriftProps {
  /** Multiplies the particle counts (0.25–2.5). */
  density?: number;
  /** Multiplies every speed (0–3). */
  speed?: number;
  /** Base colour of beams and highlighted glyphs, as "r, g, b". */
  accent?: string;
  /** Colour of resting glyphs and links, as "r, g, b". */
  muted?: string;
  className?: string;
}

const CHARS = "0123456789ABCDEF@#$%&*<>/{}".split("");
/** Particles per 100 000 px² at density 1 — 90 nodes / 25 beams on a ~1 000 × 650 frame. */
const NODES_PER_AREA = 14;
const BEAMS_PER_AREA = 3.8;
const MAX_NODES = 90;
const MAX_BEAMS = 25;
const LINK_DISTANCE = 120;
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
/** Links are drawn in this many opacity steps: one stroke per step. */
const LINK_STEPS = 4;
const POINTER_RADIUS = 180;
const FRAME_MS = 1000 / 30;
/** The original moved particles by a fixed amount per 60 Hz frame. */
const BASE_FRAME_MS = 1000 / 60;

/** `char`: index into CHARS. */
type Node = { x: number; y: number; vy: number; char: number };
type Beam = {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
};

const pick = () => Math.floor(Math.random() * CHARS.length);
/** Glyph cell size in the sprite atlas, in CSS pixels. */
const CELL = 16;
/** Height of the pre-rendered beam gradient, in CSS pixels. */
const BEAM_SPRITE_HEIGHT = 150;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** requestIdleCallback where available (Safari lacks it), else a short timeout. */
function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 300);
  return () => window.clearTimeout(id);
}

export function ParticleDrift({
  density = 1,
  speed = 1,
  accent = "96, 165, 250",
  muted = "156, 163, 175",
  className,
}: ParticleDriftProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const densityFactor = clamp(density, 0.25, 2.5);
    const speedFactor = clamp(speed, 0, 3);
    const linkStyles = Array.from(
      { length: LINK_STEPS },
      (_, i) => `rgba(${muted}, ${(0.15 * (i + 0.5)) / LINK_STEPS})`,
    );
    const restingGlyph = `rgba(${muted}, 0.4)`;
    const activeGlyph = `rgb(${accent})`;
    // Pre-rendered on resize: drawing an image is far cheaper per frame than
    // fillText or a fresh gradient for every glyph and beam.
    let atlas: HTMLCanvasElement | null = null;
    let beamSprite: HTMLCanvasElement | null = null;
    let atlasScale = 1;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let beams: Beam[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    let frame = 0;
    let lastTime = 0;
    let visible = true;
    let ready = false;

    function seed() {
      const area = (width * height) / 100_000;
      const nodeCount = clamp(
        Math.round(area * NODES_PER_AREA * densityFactor),
        12,
        Math.round(MAX_NODES * densityFactor),
      );
      const beamCount = clamp(
        Math.round(area * BEAMS_PER_AREA * densityFactor),
        4,
        Math.round(MAX_BEAMS * densityFactor),
      );
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: Math.random() * 0.4 + 0.1,
        char: pick(),
      }));
      beams = Array.from({ length: beamCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 6 + 3,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    }

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      // 1.5× is sharp enough for faint 12px glyphs and costs about half of 2×.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!atlas || atlasScale !== dpr) buildSprites(dpr);
      seed();
    }

    /** Row 0: resting glyphs; row 1: highlighted glyphs. Plus one beam gradient. */
    function buildSprites(dpr: number) {
      atlasScale = dpr;
      atlas = document.createElement("canvas");
      atlas.width = Math.ceil(CHARS.length * CELL * dpr);
      atlas.height = Math.ceil(2 * CELL * dpr);
      const a = atlas.getContext("2d")!;
      a.scale(dpr, dpr);
      a.font = "12px ui-monospace, monospace";
      a.textAlign = "center";
      a.textBaseline = "middle";
      [restingGlyph, activeGlyph].forEach((style, row) => {
        a.fillStyle = style;
        CHARS.forEach((ch, i) =>
          a.fillText(ch, i * CELL + CELL / 2, row * CELL + CELL / 2),
        );
      });

      beamSprite = document.createElement("canvas");
      beamSprite.width = Math.max(1, Math.round(1.5 * dpr));
      beamSprite.height = Math.round(BEAM_SPRITE_HEIGHT * dpr);
      const b = beamSprite.getContext("2d")!;
      const g = b.createLinearGradient(0, 0, 0, beamSprite.height);
      g.addColorStop(0, `rgb(${accent})`);
      g.addColorStop(1, `rgba(${accent}, 0)`);
      b.fillStyle = g;
      b.fillRect(0, 0, beamSprite.width, beamSprite.height);
    }

    function drawGlyph(c: CanvasRenderingContext2D, n: Node, row: number) {
      const s = atlasScale;
      c.drawImage(
        atlas!,
        n.char * CELL * s,
        row * CELL * s,
        CELL * s,
        CELL * s,
        n.x - CELL / 2,
        n.y - CELL / 2,
        CELL,
        CELL,
      );
    }

    /** `step`: how many 60 Hz frames of movement to apply (0 for a still frame). */
    function draw(step: number) {
      const c = ctx!;
      c.clearRect(0, 0, width, height);

      for (const b of beams) {
        if (step) {
          b.y -= b.speed * speedFactor * step;
          if (b.y + b.length < 0) {
            b.y = height + 100;
            b.x = Math.random() * width;
          }
        }
        if (b.y > height || b.y + b.length < 0) continue;
        c.globalAlpha = b.opacity;
        c.drawImage(beamSprite!, b.x - 0.75, b.y, 1.5, b.length);
      }
      c.globalAlpha = 1;

      for (const n of nodes) {
        if (!step) continue;
        n.y += n.vy * speedFactor * step;
        if (n.y > height + 20) {
          n.y = -20;
          n.x = Math.random() * width;
        }
      }

      // Links between nearby glyphs, bucketed by opacity: one pass over the
      // pairs, then LINK_STEPS strokes per frame instead of one per pair.
      const paths = Array.from({ length: LINK_STEPS }, () => new Path2D());
      const used = new Array<boolean>(LINK_STEPS).fill(false);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          if (dx > LINK_DISTANCE || dx < -LINK_DISTANCE) continue;
          const dy = a.y - b.y;
          if (dy > LINK_DISTANCE || dy < -LINK_DISTANCE) continue;
          const dSq = dx * dx + dy * dy;
          if (dSq >= LINK_DISTANCE_SQ) continue;
          const strength = 1 - Math.sqrt(dSq) / LINK_DISTANCE;
          const s = Math.min(LINK_STEPS - 1, Math.floor(strength * LINK_STEPS));
          paths[s].moveTo(a.x, a.y);
          paths[s].lineTo(b.x, b.y);
          used[s] = true;
        }
      }
      c.lineWidth = 0.5;
      for (let s = 0; s < LINK_STEPS; s++) {
        if (!used[s]) continue;
        c.strokeStyle = linkStyles[s];
        c.stroke(paths[s]);
      }

      const near: Node[] = [];
      for (const n of nodes) {
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        if (dx * dx + dy * dy < POINTER_RADIUS * POINTER_RADIUS) {
          near.push(n);
          continue;
        }
        if (step && Math.random() > 0.98) n.char = pick();
        drawGlyph(c, n, 0);
      }
      if (near.length) {
        for (const n of near) {
          const dist = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          if (step) n.char = pick();
          c.strokeStyle = `rgba(${accent}, ${0.5 * (1 - dist / POINTER_RADIUS)})`;
          c.beginPath();
          c.moveTo(n.x, n.y);
          c.lineTo(pointer.x, pointer.y);
          c.stroke();
        }
        for (const n of near) drawGlyph(c, n, 1);
      }
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      const elapsed = now - lastTime;
      if (elapsed < FRAME_MS - 2) return;
      // Clamp, so a long pause (a stalled tab) doesn't teleport particles.
      const step = Math.min(elapsed, 100) / BASE_FRAME_MS;
      lastTime = now;
      draw(step);
    }

    function start() {
      if (!ready || reduceMotion || frame || !visible || document.hidden)
        return;
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function onPointer(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    function onPointerLeave() {
      pointer.x = pointer.y = -1e4;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!ready) return;
      resize();
      if (!frame) draw(0);
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    // The canvas ignores the pointer (the content above it stays clickable);
    // the section that holds the effect reports where the pointer is.
    const host = canvas.parentElement?.parentElement?.parentElement ?? canvas;

    const cancelIdle = whenIdle(() => {
      ready = true;
      resize();
      draw(0);
      resizeObserver.observe(canvas);
      intersection.observe(canvas);
      if (!reduceMotion) {
        host.addEventListener("pointermove", onPointer, { passive: true });
        host.addEventListener("pointerdown", onPointer, { passive: true });
        host.addEventListener("pointerleave", onPointerLeave);
      }
      document.addEventListener("visibilitychange", onVisibility);
      start();
    });

    return () => {
      cancelIdle();
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerdown", onPointer);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, speed, accent, muted]);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div className="sticky top-0 h-svh max-h-full">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}
