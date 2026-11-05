import { describe, expect, it } from "vitest";
import { auditImages, findHeadImageUrls, findImages, sitePath } from "./image-rules";

const codes = (html: string, title?: string) => auditImages(html, { pageTitle: title }).map((i) => i.code);

describe("auditImages", () => {
  it("accepts the decorative logo with an empty alt and dimensions", () => {
    expect(codes('<a href="/"><img alt="" width="28" height="28" src="/logo.svg"/>cybersecu.app</a>')).toEqual([]);
  });

  it("flags an image with no alt attribute", () => {
    expect(codes('<img src="/schema-phishing.svg" width="600" height="400">')).toEqual(["IMG_NO_ALT"]);
  });

  it("flags an informative image whose alt is empty", () => {
    expect(codes('<img src="/schema-phishing.svg" alt="" width="600" height="400">')).toEqual(["IMG_EMPTY_ALT_NOT_DECORATIVE"]);
  });

  it("flags a decorative image given descriptive alt text (noise for screen readers)", () => {
    expect(codes('<img src="/logo.svg" alt="Logo bleu en forme de bouclier" width="28" height="28">')).toEqual(["IMG_ALT_ON_DECORATIVE"]);
  });

  it("flags an alt that is the file name, or that repeats the page title", () => {
    expect(codes('<img src="/schema-phishing.svg" alt="schema phishing" width="1" height="1">')).toEqual(["IMG_ALT_IS_FILENAME"]);
    expect(codes('<img src="/a.png" alt="a.png" width="1" height="1">')).toEqual(["IMG_ALT_IS_FILENAME"]);
    expect(codes('<img src="/a.svg" alt="Phishing" width="1" height="1">', "Phishing | cybersecu.app")).toEqual(["IMG_ALT_REPEATS_TITLE"]);
  });

  it("flags missing dimensions (layout shift)", () => {
    expect(codes('<img src="/x.svg" alt="Schéma : le message passe par un faux site">')).toEqual(["IMG_NO_DIMENSIONS"]);
  });

  it("allows one prioritised image, not two", () => {
    const one = '<head><link rel="preload" as="image" href="/logo.svg"/></head>';
    const two = '<head><link rel="preload" as="image" href="/a.svg"/><link rel="preload" as="image" href="/b.svg"/></head>';
    expect(codes(one)).toEqual([]);
    expect(codes(two)).toEqual(["IMG_TOO_MANY_PRIORITY"]);
  });

  it("requires an inline svg to be hidden or named", () => {
    expect(codes('<svg aria-hidden="true"><path/></svg>')).toEqual([]);
    expect(codes('<svg role="img" aria-label="Schéma du relais"><path/></svg>')).toEqual([]);
    expect(codes('<svg role="img"><title>Schéma</title><path/></svg>')).toEqual([]);
    expect(codes('<svg viewBox="0 0 10 10"><path/></svg>')).toEqual(["SVG_UNNAMED"]);
  });

  it("ignores markup repeated as strings inside scripts (RSC payload)", () => {
    expect(codes('<script>self.__next_f.push(["<img src=\\"/x.png\\">"])</script>')).toEqual([]);
  });
});

describe("resource discovery", () => {
  it("finds images in markup and in the head", () => {
    expect(findImages('<img alt="" width="1" height="1" src="/logo.svg">')[0].src).toBe("/logo.svg");
    const head =
      '<head><meta property="og:image" content="https://www.cybersecu.app/og/fr"/><link rel="icon" href="/favicon.ico?x=1"/><link rel="apple-touch-icon" href="/apple-icon"/></head>';
    expect(findHeadImageUrls(head).map((u) => sitePath(u))).toEqual(["/og/fr", "/favicon.ico", "/apple-icon"]);
  });

  it("keeps only same-site paths", () => {
    expect(sitePath("https://example.test/a.png")).toBeNull();
    expect(sitePath("//cdn.test/a.png")).toBeNull();
  });
});
