import { trackAttrs } from "@/lib/analytics";
import Link from "next/link";
import type { ChannelScenario } from "@/domain/attack/channel-scenarios";
import type { Locale } from "@/domain/i18n/locale";
import type { AttackVectorCode } from "@/domain/scenario/types";

const CHANNEL_NAMES: Record<
  Locale,
  Partial<Record<AttackVectorCode, string>>
> = {
  fr: { sms: "SMS", email: "email", phone: "téléphone", qr_code: "QR code" },
  en: {
    sms: "text message",
    email: "email",
    phone: "phone",
    qr_code: "QR code",
  },
};

const STRINGS: Record<
  Locale,
  {
    heading: (channel: string) => string;
    intro: (channel: string) => string;
    simulation: string;
    attackPrefix: string;
    simulationPrefix: string;
  }
> = {
  fr: {
    heading: (c) => `Ce qui arrive aussi par ${c}`,
    intro: (c) =>
      `Les autres fiches dont le scénario passe par ${c}. Quand la simulation d'une fiche se joue sur ce canal, c'est son message qui est résumé, et vous pouvez vous y entraîner.`,
    simulation: "Simulation :",
    attackPrefix: "/attaques",
    simulationPrefix: "/simulations",
  },
  en: {
    heading: (c) => `What else arrives by ${c}`,
    intro: (c) =>
      `The other attacks whose scenario goes through ${c}. When an attack's simulation is played on this channel, its message is summarized, and you can practice on it.`,
    simulation: "Simulation:",
    attackPrefix: "/en/attaques",
    simulationPrefix: "/en/simulations",
  },
};

/**
 * On a channel fiche (smishing, phishing, vishing, quishing): the other
 * fiches that use the same channel (src/domain/attack/channel-scenarios.ts).
 * Renders nothing when the list is empty.
 */
export function ChannelScenariosSection({
  channel,
  scenarios,
  locale,
  fromCode,
}: {
  channel: AttackVectorCode;
  scenarios: ChannelScenario[];
  locale: Locale;
  /** The channel fiche this section sits on, for click measurement. */
  fromCode?: string;
}) {
  const channelName = CHANNEL_NAMES[locale][channel];
  if (scenarios.length === 0 || !channelName) return null;
  const t = STRINGS[locale];
  return (
    <section aria-labelledby="channel-scenarios" className="mt-10">
      <h2 id="channel-scenarios" className="text-xl font-semibold">
        {t.heading(channelName)}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.intro(channelName)}
      </p>
      <ul className="mt-4 space-y-3">
        {scenarios.map((s) => (
          <li
            key={s.code}
            className="rounded-md border border-border px-4 py-3"
          >
            <Link
              href={`${t.attackPrefix}/${s.slug}`}
              {...trackAttrs({
                name: "related_attack_click",
                props: { from: "attack", from_code: fromCode, to_attack: s.code, section: "channel" },
              })}
              className="font-medium text-primary hover:underline"
            >
              {s.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted-foreground">{s.text}</p>
            {s.simulation && (
              <Link
                href={`${t.simulationPrefix}/${s.simulation.slug}`}
                className="mt-1 inline-block text-sm text-primary hover:underline"
              >
                {t.simulation} {s.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
