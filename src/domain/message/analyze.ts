import { parse } from "tldts";
import { analyzeLink, type LinkAnalysis } from "@/domain/link/decode";
import type { Locale } from "@/domain/i18n/locale";
import {
  LINK_SIGNAL,
  SIGNALS,
  signalPatterns,
  type SignalCode,
} from "./signals";

/**
 * Reads a message the way a careful person would, and says what it saw.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * It never says a message is safe, legitimate or « probably fine ». It
 * recognises procedures scams are known to use; a message using none of
 * them can still be a scam, and the result says so every time. That is
 * the same rule the link decoder follows (`@/domain/link/decode`).
 *
 * Pure and synchronous, no network, no AI: it runs in the browser and the
 * text pasted into the tool is never sent, stored or logged. Only signal
 * codes ever leave this function, which is what makes a result shareable
 * without the message.
 */

export type MessageChannel = "sms" | "email" | "messaging" | "other";

export const MESSAGE_CHANNELS: readonly MessageChannel[] = [
  "sms",
  "email",
  "messaging",
  "other",
];

/** Upper bound on what is analysed — a message, not a document. */
export const MAX_MESSAGE_LENGTH = 5000;

export interface FoundSignal {
  code: SignalCode;
  /** The words of the message that triggered it, as typed (at most 3). */
  excerpts: string[];
}

export interface FoundLink {
  /** The link as written in the message. */
  raw: string;
  analysis: Extract<LinkAnalysis, { ok: true }>;
}

export type MessageAnalysis =
  | { ok: false; error: "empty" | "too-long" }
  | {
      ok: true;
      channel: MessageChannel;
      signals: FoundSignal[];
      links: FoundLink[];
      /** Attack codes whose procedures match best, strongest first (max 3). */
      similarAttackCodes: string[];
    };

/**
 * Lowercases, strips accents and straightens apostrophes, keeping for each
 * normalised character the index of the original one — so an excerpt can
 * be quoted exactly as the visitor typed it.
 */
function normalise(text: string): { value: string; origin: number[] } {
  let value = "";
  const origin: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[’‘ʼ`]/g, "'")
      .replace(/[  ]/g, " ");
    for (const c of ch) {
      value += c;
      origin.push(i);
    }
  }
  origin.push(text.length);
  return { value, origin };
}

function excerpt(
  text: string,
  origin: number[],
  start: number,
  end: number,
): string {
  return text
    .slice(origin[start], origin[end - 1] + 1)
    .replace(/\s+/g, " ")
    .trim();
}

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"«»]+/gi;
/** Bare domains (« amende-paiement.example.test/payer »). Not preceded by
 * « @ », so an email address is not read as a link. */
const BARE_DOMAIN_PATTERN =
  /(?<![@\w.-])(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"«»]*)?/gi;
const TRAILING_PUNCTUATION = /[).,;:!?»"']+$/;

function extractLinks(text: string, locale: Locale): FoundLink[] {
  const found: FoundLink[] = [];
  const seen = new Set<string>();
  const consider = (candidate: string, bare: boolean) => {
    const raw = candidate.replace(TRAILING_PUNCTUATION, "");
    if (!raw || seen.has(raw.toLowerCase())) return;
    if (bare) {
      // A bare « mot.fr » counts only on a real public suffix (or the
      // reserved .test used by the site's own fictional examples).
      const host = raw.split("/")[0];
      const info = parse(host);
      if (!host.endsWith(".test") && !info.isIcann) return;
      // Amounts and versions (« 1.95 », « v4.2 ») are not domains.
      if (/^[\d.]+$/.test(host)) return;
    }
    const analysis = analyzeLink(raw, locale);
    if (!analysis.ok) return;
    seen.add(raw.toLowerCase());
    found.push({ raw, analysis });
  };
  const withScheme = text.match(URL_PATTERN) ?? [];
  withScheme.forEach((m) => consider(m, false));
  const remainder = withScheme.reduce((acc, m) => acc.replace(m, " "), text);
  (remainder.match(BARE_DOMAIN_PATTERN) ?? []).forEach((m) =>
    consider(m, true),
  );
  return found.slice(0, 5);
}

function similarAttacks(
  signals: FoundSignal[],
  channel: MessageChannel,
): string[] {
  const score = new Map<string, number>();
  const firstSeen = new Map<string, number>();
  let order = 0;
  for (const signal of signals) {
    const definition =
      signal.code === "lien"
        ? LINK_SIGNAL
        : SIGNALS.find((s) => s.code === signal.code);
    let codes = definition?.attackCodes ?? [];
    // A link in a text message is smishing before it is phishing.
    if (signal.code === "lien")
      codes = channel === "sms" ? ["SMS-000001"] : ["PHISH-000001"];
    // A signal shared by many fiches says less about which one this is:
    // each signal spreads one point across the fiches it points to.
    for (const code of codes) {
      score.set(code, (score.get(code) ?? 0) + 1 / codes.length);
      if (!firstSeen.has(code)) firstSeen.set(code, order++);
    }
  }
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1] || firstSeen.get(a[0])! - firstSeen.get(b[0])!)
    .slice(0, 3)
    .map(([code]) => code);
}

export function analyzeMessage(
  raw: string,
  channel: MessageChannel = "other",
  locale: Locale = "fr",
): MessageAnalysis {
  const text = raw.trim();
  if (!text) return { ok: false, error: "empty" };
  if (text.length > MAX_MESSAGE_LENGTH) return { ok: false, error: "too-long" };

  const normalised = normalise(text);
  const { origin } = normalised;
  // Links have their own reading below; words inside an address
  // (« /reglement », « secure-login ») are the attacker's decor, not the
  // message's wording. Blanked with spaces so indices stay aligned.
  const value = normalised.value
    .replace(URL_PATTERN, (m) => " ".repeat(m.length))
    .replace(BARE_DOMAIN_PATTERN, (m) => " ".repeat(m.length));
  const signals: FoundSignal[] = [];

  for (const signal of SIGNALS) {
    const excerpts: string[] = [];
    for (const pattern of signalPatterns(signal, locale)) {
      const global = new RegExp(
        pattern.source,
        pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`,
      );
      for (const match of value.matchAll(global)) {
        if (match.index === undefined || match[0].length === 0) continue;
        const quoted = excerpt(
          text,
          origin,
          match.index,
          match.index + match[0].length,
        );
        if (
          quoted &&
          !excerpts.some((e) => e.toLowerCase() === quoted.toLowerCase())
        )
          excerpts.push(quoted);
        if (excerpts.length >= 3) break;
      }
      if (excerpts.length >= 3) break;
    }
    if (excerpts.length > 0) signals.push({ code: signal.code, excerpts });
  }

  const links = extractLinks(text, locale);
  if (links.length > 0)
    signals.push({
      code: "lien",
      excerpts: links.slice(0, 3).map((l) => l.raw),
    });

  return {
    ok: true,
    channel,
    signals,
    links,
    similarAttackCodes: similarAttacks(signals, channel),
  };
}

/** Signal codes, in a URL-safe form, for a result shared without its text. */
export function encodeSharedResult(
  signals: readonly { code: SignalCode }[],
): string {
  return signals.map((s) => s.code).join(",");
}

/** Keeps only codes the analyzer knows: a shared URL is untrusted input. */
export function decodeSharedResult(param: string | null): SignalCode[] {
  if (!param) return [];
  const known = new Set<string>([
    ...SIGNALS.map((s) => s.code),
    LINK_SIGNAL.code,
  ]);
  const codes = param
    .split(",")
    .map((c) => c.trim())
    .filter((c): c is SignalCode => known.has(c));
  return [...new Set(codes)];
}

/** Same ranking as a live analysis, from codes alone. */
export function similarAttacksForCodes(
  codes: readonly SignalCode[],
  channel: MessageChannel = "other",
): string[] {
  return similarAttacks(
    codes.map((code) => ({ code, excerpts: [] })),
    channel,
  );
}
