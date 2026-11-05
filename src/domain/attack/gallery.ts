import { listAttacks } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { leversForAttack, leversForAttackEn } from "@/content/levers";
import type { Locale } from "@/domain/i18n/locale";
import type { AttackVectorCode } from "@/domain/scenario/types";
import { ATTACK_VECTOR_LABELS, ATTACK_VECTOR_LABELS_EN } from "./labels";

/**
 * The scam gallery (A3, docs/growth/ENGINEERING_AS_MARKETING_ROADMAP.md
 * étape 4): every fictional example already written in the fiches, grouped
 * by channel, each one followed by the path the site teaches — what gives
 * it away, the lever it pulls, the simulation, then the decision and the
 * protection on the fiche itself.
 *
 * No new example and no new sentence: each card is the fiche's `example`
 * (decision 0002 — fictional, `.test` domains), its levers and links. The
 * full explanation stays on the fiche; the gallery only points to it
 * (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv, candidate A3).
 */

export const GALLERY_PATH: Record<Locale, string> = {
  fr: "/exemples",
  en: "/en/examples",
};

/** Order in which channels are shown: what arrives to you first, then the web. */
const CHANNEL_ORDER: AttackVectorCode[] = [
  "email",
  "sms",
  "phone",
  "messaging_app",
  "social_media",
  "qr_code",
  "web",
  "advertisement",
  "file_attachment",
];

/** Stable, readable fragment ids, so a fiche can link to « its » channel. */
const CHANNEL_ANCHORS: Record<Locale, Record<AttackVectorCode, string>> = {
  fr: {
    email: "email",
    sms: "sms",
    phone: "telephone",
    messaging_app: "messagerie",
    social_media: "reseaux-sociaux",
    qr_code: "qr-code",
    web: "site-web",
    advertisement: "publicite",
    file_attachment: "piece-jointe",
  },
  en: {
    email: "email",
    sms: "text-message",
    phone: "phone",
    messaging_app: "messaging",
    social_media: "social-media",
    qr_code: "qr-code",
    web: "website",
    advertisement: "advertising",
    file_attachment: "attachment",
  },
};

export interface GalleryLink {
  label: string;
  href: string;
}

export interface GalleryItem {
  code: string;
  name: string;
  href: string;
  setting: string;
  message: string;
  giveaways: string[];
  levers: GalleryLink[];
  simulationHref?: string;
  /** The fiche's « questions à se poser », when it has them. */
  decisionHref?: string;
  /** The fiche's « pour que ça ne se reproduise pas », when it has it. */
  protectionHref?: string;
}

export interface GalleryChannel {
  channel: AttackVectorCode;
  label: string;
  anchor: string;
  items: GalleryItem[];
}

export function galleryAnchor(
  channel: AttackVectorCode,
  locale: Locale,
): string {
  return CHANNEL_ANCHORS[locale][channel];
}

/** Link to the gallery section of a fiche's channel, e.g. `/exemples#sms`. */
export function galleryHrefForChannel(
  channel: AttackVectorCode,
  locale: Locale,
): string {
  return `${GALLERY_PATH[locale]}#${galleryAnchor(channel, locale)}`;
}

export function buildGallery(locale: Locale): GalleryChannel[] {
  const prefix = locale === "en" ? "/en" : "";
  const labels =
    locale === "en" ? ATTACK_VECTOR_LABELS_EN : ATTACK_VECTOR_LABELS;
  const byChannel = new Map<AttackVectorCode, GalleryItem[]>();

  for (const attack of listAttacks()) {
    const localized = getLocalizedAttack(attack, locale);
    const example = localized?.example;
    if (!localized || !example) continue;
    const href = `${prefix}/attaques/${localized.slug}`;
    const levers: GalleryLink[] =
      locale === "en"
        ? leversForAttackEn(attack).map((l) => ({
            label: l.name,
            href: `/en/levers/${l.slug}`,
          }))
        : leversForAttack(attack).map((l) => ({
            label: l.name,
            href: `/leviers/${l.slug}`,
          }));
    const simSlug =
      locale === "en" ? localized.simulationSlug : attack.simulationSlug;
    const item: GalleryItem = {
      code: attack.code,
      name: localized.name,
      href,
      setting: example.setting,
      message: example.message,
      giveaways: example.giveaways,
      levers,
      ...(simSlug && { simulationHref: `${prefix}/simulations/${simSlug}` }),
      ...(localized.decisionChecklist?.length && {
        decisionHref: `${href}#how-to-verify`,
      }),
      ...(localized.prevention?.length && {
        protectionHref: `${href}#prevention`,
      }),
    };
    const list = byChannel.get(attack.primaryVector) ?? [];
    list.push(item);
    byChannel.set(attack.primaryVector, list);
  }

  return CHANNEL_ORDER.flatMap((channel) => {
    const items = byChannel.get(channel);
    return items?.length
      ? [
          {
            channel,
            label: labels[channel],
            anchor: galleryAnchor(channel, locale),
            items,
          },
        ]
      : [];
  });
}
