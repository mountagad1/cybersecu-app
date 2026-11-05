import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { buildGallery, galleryHrefForChannel, GALLERY_PATH } =
  await import("./gallery");
const { listAttacks } = await import("@/content/attacks");
const { getLocalizedAttack } = await import("@/content/attacks/localize");
const { buildUrlRegistry } = await import("@/domain/seo/indexability");

const indexable = new Set(
  buildUrlRegistry()
    .filter((e) => e.indexable)
    .map((e) => e.path),
);

describe.each(["fr", "en"] as const)("scam gallery (%s)", (locale) => {
  const channels = buildGallery(locale);
  const items = channels.flatMap((c) => c.items);

  it("shows every fiche example once, and only those", () => {
    const expected = listAttacks()
      .filter((a) => getLocalizedAttack(a, locale)?.example)
      .map((a) => a.code)
      .sort();
    expect(items.map((i) => i.code).sort()).toEqual(expected);
  });

  it("reuses the fiche's example verbatim, under its own channel", () => {
    for (const c of channels) {
      for (const item of c.items) {
        const attack = listAttacks().find((a) => a.code === item.code)!;
        const example = getLocalizedAttack(attack, locale)!.example!;
        expect(attack.primaryVector).toBe(c.channel);
        expect(item.message).toBe(example.message);
        expect(item.giveaways).toEqual(example.giveaways);
      }
    }
  });

  it("only links to pages that exist, in its own language", () => {
    const prefix = locale === "en" ? /^\/en\// : /^\/(?!en\/)/;
    for (const item of items) {
      const links = [
        item.href,
        item.simulationHref,
        item.decisionHref,
        item.protectionHref,
        ...item.levers.map((l) => l.href),
      ].filter((h): h is string => Boolean(h));
      for (const href of links) {
        expect(href, item.code).toMatch(prefix);
        expect(indexable.has(href.split("#")[0]), href).toBe(true);
      }
    }
  });

  it("gives each channel a distinct anchor the fiches can link to", () => {
    const anchors = channels.map((c) => c.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(indexable.has(GALLERY_PATH[locale])).toBe(true);
    for (const c of channels)
      expect(galleryHrefForChannel(c.channel, locale)).toBe(
        `${GALLERY_PATH[locale]}#${c.anchor}`,
      );
  });
});

describe("links into the gallery from elsewhere", () => {
  it("keeps the anchors the message analyzer hard-codes", () => {
    // src/components/tools/message-analyzer.tsx, `galleryPaths`.
    expect(galleryHrefForChannel("sms", "fr")).toBe("/exemples#sms");
    expect(galleryHrefForChannel("email", "fr")).toBe("/exemples#email");
    expect(galleryHrefForChannel("messaging_app", "fr")).toBe(
      "/exemples#messagerie",
    );
    expect(galleryHrefForChannel("sms", "en")).toBe(
      "/en/examples#text-message",
    );
    expect(galleryHrefForChannel("email", "en")).toBe("/en/examples#email");
    expect(galleryHrefForChannel("messaging_app", "en")).toBe(
      "/en/examples#messaging",
    );
  });
});
