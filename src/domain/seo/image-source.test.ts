import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { DECORATIVE_IMAGES } from "./image-rules";

/**
 * Static check of the source, so a missing alt fails `pnpm test` before any
 * build (docs/seo/IMAGE_SEO_STRATEGY.md §4). `pnpm seo:images` checks the
 * rendered HTML; this catches images that are only rendered client-side
 * (e.g. the install prompt), which the build output never shows.
 */

const SRC = join(process.cwd(), "src");

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name) ? [path] : [];
  });
}

/** `<img …>` and `<Image …>` JSX elements, attributes included (they span lines). */
function imageElements(source: string): string[] {
  return [...source.matchAll(/<(img|Image)\b(?:[^>"'{}]|"[^"]*"|'[^']*'|\{[^{}]*\})*\/?>/g)].map((m) => m[0]);
}

const files = tsxFiles(SRC).map((path) => ({ path: relative(process.cwd(), path), source: readFileSync(path, "utf8") }));
const elements = files.flatMap(({ path, source }) => imageElements(source).map((el) => ({ path, el })));

describe("images in the source", () => {
  it("finds the images the site actually renders", () => {
    // If this drops to zero the pattern broke, and every check below would pass vacuously.
    expect(elements.length).toBeGreaterThan(0);
  });

  it("give every <img> and <Image> an alt attribute", () => {
    const missing = elements.filter(({ el }) => !/\balt=/.test(el)).map(({ path, el }) => `${path}: ${el.slice(0, 80)}`);
    expect(missing).toEqual([]);
  });

  it("only leave alt empty on a source registered as decorative", () => {
    const wrong = elements
      .filter(({ el }) => /\balt=(""|\{""\}|'')/.test(el))
      .map(({ path, el }) => ({ path, src: el.match(/\bsrc=["{]["']?([^"'}]+)/)?.[1] ?? "?" }))
      .filter(({ src }) => !(src in DECORATIVE_IMAGES))
      .map(({ path, src }) => `${path}: ${src}`);
    expect(wrong).toEqual([]);
  });

  it("give every <img> and <Image> explicit dimensions", () => {
    const missing = elements
      .filter(({ el }) => !/\bfill\b/.test(el) && !(/\bwidth=/.test(el) && /\bheight=/.test(el)))
      .map(({ path, el }) => `${path}: ${el.slice(0, 80)}`);
    expect(missing).toEqual([]);
  });
});
