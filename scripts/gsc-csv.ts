/**
 * Reading Search Console Performance exports (Performance → Export → CSV,
 * unzipped), shared by the growth scripts. Files are read from disk and
 * never leave it; the exports stay out of the repository (G-008).
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { WindowMetrics } from "../src/domain/growth/noise";

export interface Row extends WindowMetrics {
  key: string;
}

/** RFC 4180 enough for Search Console: quoted fields, doubled quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const endField = () => {
    row.push(field);
    field = "";
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") endField();
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      endField();
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) {
    endField();
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

/** « 1 234 », « 12,5 % », « 3.2 » → number. */
export function num(s: string): number {
  const n = Number(s.replace(/[\s %]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export const FILES: Record<string, RegExp> = {
  pages: /^pages\.csv$/i,
  queries: /^(queries|requ[eê]tes)\.csv$/i,
  countries: /^(countries|pays)\.csv$/i,
  devices: /^(devices|appareils)\.csv$/i,
  dates: /^(dates|graphique|chart)\.csv$/i,
};

export function load(dir: string | undefined, kind: keyof typeof FILES): Row[] {
  if (!dir) return [];
  if (!existsSync(dir)) throw new Error(`dossier introuvable : ${dir}`);
  const file = readdirSync(dir).find((f) => FILES[kind].test(f));
  if (!file) return [];
  const [, ...body] = parseCsv(readFileSync(join(dir, file), "utf8").replace(/^﻿/, ""));
  // Column order is fixed by Search Console: key, clicks, impressions, CTR, position.
  return body.map(([key, clicks, impressions, , position]) => ({
    key,
    clicks: num(clicks),
    impressions: num(impressions),
    position: num(position),
  }));
}

