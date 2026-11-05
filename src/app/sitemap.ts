import type { MetadataRoute } from "next";
import { buildUrlRegistry, indexableEntries } from "@/domain/seo/indexability";
import { absoluteUrl } from "@/lib/site";

/**
 * A projection of the URL registry, not a second list.
 *
 * Writing a sitemap by hand is how a site ends up declaring URLs that do
 * not exist and omitting ones that do. Deriving it from the same registry
 * the routes are generated from makes that drift impossible, and
 * `indexableEntries` guarantees a noindex URL is never listed here
 * (docs/decisions/0007-content-in-repository.md).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableEntries(buildUrlRegistry()).map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: entry.lastModified ?? undefined,
    changeFrequency:
      entry.type === "attack" || entry.type === "simulation" || entry.type === "lever"
        ? "monthly"
        : "weekly",
    priority:
      entry.path === "/"
        ? 1
        : entry.type === "attack" || entry.type === "guide"
          ? 0.7
          : entry.type === "lever" || entry.type === "simulation"
            ? 0.6
            : 0.8,
  }));
}
