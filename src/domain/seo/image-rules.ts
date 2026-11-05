/**
 * Image and inline-SVG rules, applied to HTML (docs/seo/IMAGE_SEO_STRATEGY.md §4).
 *
 * Pure functions over a string of HTML, so the same rules run in unit tests
 * (fixtures) and over the build output (`pnpm seo:images`). The only state is
 * the decorative registry below: an `alt=""` is correct for a decorative
 * image and wrong for an informative one, and the HTML alone cannot tell
 * them apart — so a source is decorative only if it is listed here, with the
 * reason it carries no information.
 */

/** Sources that are decorative wherever they appear, and why. */
export const DECORATIVE_IMAGES: Readonly<Record<string, string>> = {
  "/logo.svg": "Logo de l'en-tête : le lien qui l'entoure porte déjà le texte « cybersecu.app ».",
  "/icons/192": "Icône de l'invite d'installation : le texte « cybersecu.app » est affiché juste à côté.",
};

export type ImageIssueCode =
  | "IMG_NO_ALT"
  | "IMG_EMPTY_ALT_NOT_DECORATIVE"
  | "IMG_ALT_ON_DECORATIVE"
  | "IMG_ALT_IS_FILENAME"
  | "IMG_ALT_REPEATS_TITLE"
  | "IMG_NO_DIMENSIONS"
  | "IMG_TOO_MANY_PRIORITY"
  | "SVG_UNNAMED";

export interface ImageIssue {
  code: ImageIssueCode;
  detail: string;
}

export interface FoundImage {
  src: string;
  alt: string | null;
  width: string | null;
  height: string | null;
  loading: string | null;
  fetchPriority: string | null;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#39": "'" };
const decode = (s: string) => s.replace(/&(amp|lt|gt|quot|#x27|#39);/g, (_, e: string) => ENTITIES[e]);

function attrs(tag: string): Map<string, string> {
  const out = new Map<string, string>();
  // Attributes with a value, then bare boolean attributes.
  for (const m of tag.matchAll(/\s([a-zA-Z:-]+)="([^"]*)"/g)) out.set(m[1].toLowerCase(), decode(m[2]));
  for (const m of tag.matchAll(/\s([a-zA-Z:-]+)(?=[\s/>])(?!=)/g)) if (!out.has(m[1].toLowerCase())) out.set(m[1].toLowerCase(), "");
  return out;
}

/** Path of a site-relative or same-site absolute URL, without query or fragment. */
export function sitePath(src: string, origin = "https://www.cybersecu.app"): string | null {
  if (src.startsWith(origin)) src = src.slice(origin.length) || "/";
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  return src.split(/[?#]/)[0];
}

/** Every `<img>` in the HTML (scripts excluded: the RSC payload repeats markup as strings). */
export function findImages(html: string): FoundImage[] {
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
  return [...markup.matchAll(/<img\b[^>]*>/g)].map((m) => {
    const a = attrs(m[0]);
    return {
      src: a.get("src") ?? "",
      alt: a.has("alt") ? a.get("alt")! : null,
      width: a.get("width") ?? null,
      height: a.get("height") ?? null,
      loading: a.get("loading") ?? null,
      fetchPriority: a.get("fetchpriority") ?? null,
    };
  });
}

/** Every resource the head points to as an image: share images, icons, preloads. */
export function findHeadImageUrls(html: string): string[] {
  const head = html.slice(0, Math.max(0, html.indexOf("</head>")));
  const urls: string[] = [];
  for (const m of head.matchAll(/<meta\s[^>]*>/g)) {
    const a = attrs(m[0]);
    const key = a.get("property") ?? a.get("name");
    if (key && /^(og:image|twitter:image)$/.test(key) && a.get("content")) urls.push(a.get("content")!);
  }
  for (const m of head.matchAll(/<link\s[^>]*>/g)) {
    const a = attrs(m[0]);
    const rel = a.get("rel") ?? "";
    if (/(^|\s)(icon|apple-touch-icon|shortcut)(\s|$)/.test(rel) || (rel === "preload" && a.get("as") === "image")) {
      if (a.get("href")) urls.push(a.get("href")!);
    }
  }
  return urls;
}

const baseName = (src: string) => decodeURIComponent((sitePath(src) ?? src).split("/").pop() ?? "");

export function auditImages(html: string, opts: { pageTitle?: string } = {}): ImageIssue[] {
  const issues: ImageIssue[] = [];
  const images = findImages(html);
  const title = opts.pageTitle?.replace(/\s*\|\s*cybersecu\.app$/, "").trim().toLowerCase();

  for (const img of images) {
    const path = sitePath(img.src) ?? img.src;
    const decorative = path in DECORATIVE_IMAGES;
    if (img.alt === null) {
      issues.push({ code: "IMG_NO_ALT", detail: img.src });
      continue;
    }
    const alt = img.alt.trim();
    if (alt === "" && !decorative) issues.push({ code: "IMG_EMPTY_ALT_NOT_DECORATIVE", detail: img.src });
    if (alt !== "" && decorative) issues.push({ code: "IMG_ALT_ON_DECORATIVE", detail: `${img.src} alt="${alt}"` });
    if (alt !== "") {
      const name = baseName(img.src).toLowerCase();
      if (/\.(png|jpe?g|gif|webp|avif|svg)\b/i.test(alt) || (name && alt.toLowerCase() === name.replace(/\.[a-z0-9]+$/, "").replace(/[-_]/g, " "))) {
        issues.push({ code: "IMG_ALT_IS_FILENAME", detail: `${img.src} alt="${alt}"` });
      }
      if (title && alt.toLowerCase() === title) issues.push({ code: "IMG_ALT_REPEATS_TITLE", detail: `${img.src} alt="${alt}"` });
    }
    if (!img.width || !img.height) issues.push({ code: "IMG_NO_DIMENSIONS", detail: img.src });
  }

  const head = html.slice(0, Math.max(0, html.indexOf("</head>")));
  const preloads = [...head.matchAll(/<link\s[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].length;
  const highs = images.filter((i) => i.fetchPriority?.toLowerCase() === "high").length;
  if (Math.max(preloads, highs) > 1) {
    issues.push({ code: "IMG_TOO_MANY_PRIORITY", detail: `${preloads} préchargement(s), ${highs} fetchpriority="high"` });
  }

  const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
  for (const m of markup.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) {
    const a = attrs(m[0].slice(0, m[0].indexOf(">") + 1));
    const hidden = a.get("aria-hidden") === "true" || a.has("aria-hidden") && a.get("aria-hidden") === "";
    const named = a.has("aria-label") || a.has("aria-labelledby") || /<title\b/.test(m[1]);
    if (!hidden && !named) issues.push({ code: "SVG_UNNAMED", detail: m[0].slice(0, 80) });
  }
  return issues;
}
