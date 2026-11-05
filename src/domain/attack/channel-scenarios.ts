import { findAttackByCode, listAttacks } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { findSimulationBySlug } from "@/content/simulations";
import { findSimulationEnBySlug } from "@/content/simulations-en";
import type { Locale } from "@/domain/i18n/locale";
import type { AttackVectorCode } from "@/domain/scenario/types";

/**
 * « Arnaques par SMS », « par email », « par téléphone », « par QR code »:
 * these intents are served by the channel fiche itself (smishing,
 * phishing, vishing, quishing), not by a generated hub
 * (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv, ENRICH). This lists, on that
 * fiche, the other fiches whose scenario uses the same channel.
 *
 * Nothing is written for it. A fiche belongs to a channel's list when its
 * primary vector is that channel, or when its own simulation is played on
 * that channel; the text shown is the simulation's teaser in the second
 * case (it describes the message that arrives), the fiche's « en clair »
 * otherwise.
 */

export const CHANNEL_FICHES: Readonly<Record<string, AttackVectorCode>> = {
  "SMS-000001": "sms",
  "PHISH-000001": "email",
  "SOCIAL-000006": "phone",
  "QR-000001": "qr_code",
};

export interface ChannelScenario {
  code: string;
  slug: string;
  name: string;
  text: string;
  /** Present when the fiche's simulation is played on this channel. */
  simulation?: { slug: string; teaser: string };
}

export function channelOf(attackCode: string): AttackVectorCode | undefined {
  return CHANNEL_FICHES[attackCode];
}

export function channelScenarios(
  attackCode: string,
  locale: Locale,
): ChannelScenario[] {
  const channel = channelOf(attackCode);
  if (!channel || !findAttackByCode(attackCode)) return [];

  return listAttacks().flatMap((attack): ChannelScenario[] => {
    if (attack.code === attackCode) return [];
    const localized = getLocalizedAttack(attack, locale);
    if (!localized) return [];
    const simSlug =
      locale === "fr" ? attack.simulationSlug : localized.simulationSlug;
    const sim = simSlug
      ? locale === "fr"
        ? findSimulationBySlug(simSlug)
        : findSimulationEnBySlug(simSlug)
      : undefined;
    const simOnChannel = sim?.channel === channel ? sim : undefined;
    if (!simOnChannel && attack.primaryVector !== channel) return [];
    return [
      {
        code: attack.code,
        slug: localized.slug,
        name: localized.name,
        text: simOnChannel?.teaser ?? localized.plainLanguageDefinition,
        ...(simOnChannel && {
          simulation: { slug: simOnChannel.slug, teaser: simOnChannel.teaser },
        }),
      },
    ];
  });
}
