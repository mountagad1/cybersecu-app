import Link from "next/link";
import { Heart, Mail, MessageSquare, Phone, ShieldAlert, UserRound } from "lucide-react";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";

interface Theme {
  icon: typeof MessageSquare;
  title: string;
  teaser: string;
  slug: string;
}

/**
 * A taste of the catalogue's breadth before the visitor commits to trying
 * one — six real, already-published simulations (never invented for this
 * section), spanning six different channels/attack families so the grid
 * doesn't read as six variations on the same scam.
 */
const THEMES: Record<Locale, { heading: string; subheading: string; seeAll: string; items: Theme[] }> = {
  fr: {
    heading: "Un aperçu des simulations",
    subheading: "Six familles de pièges parmi des dizaines de simulations réalistes.",
    seeAll: "Voir toutes les simulations",
    items: [
      {
        icon: MessageSquare,
        title: "SMS colis bloqué",
        teaser: "Un simple SMS de livraison peut cacher un piège à 1,95 €.",
        slug: "sms-colis",
      },
      {
        icon: Phone,
        title: "Faux conseiller bancaire",
        teaser: "Un appel du « service anti-fraude » qui vous demande de confirmer un code.",
        slug: "appel-conseiller-bancaire",
      },
      {
        icon: ShieldAlert,
        title: "Faux support technique",
        teaser: "Une alerte de sécurité qui vous pousse à appeler un faux support.",
        slug: "alerte-support-technique",
      },
      {
        icon: Mail,
        title: "Email bancaire frauduleux",
        teaser: "Un email qui imite parfaitement votre banque pour voler vos identifiants.",
        slug: "email-banque",
      },
      {
        icon: UserRound,
        title: "Message d'un proche",
        teaser: "« J'ai changé de numéro » — puis une demande d'argent urgente.",
        slug: "message-proche-nouveau-numero",
      },
      {
        icon: Heart,
        title: "Rencontre en ligne",
        teaser: "Une relation qui se termine toujours par une demande d'argent.",
        slug: "message-relation-en-ligne",
      },
    ],
  },
  en: {
    heading: "A taste of the simulations",
    subheading: "Six families of traps among dozens of realistic simulations.",
    seeAll: "See all simulations",
    items: [
      {
        icon: MessageSquare,
        // The English catalogue has no parcel simulation: this card describes
        // the bank text it actually opens, not the French parcel one.
        title: "Blocked bank card text",
        teaser: "A text says your card is blocked and gives you thirty minutes to react.",
        slug: "bank-sms",
      },
      {
        icon: Phone,
        title: "Fraud department call",
        teaser: "A call from the \"fraud department\" asking you to confirm a code.",
        slug: "fraud-department-call",
      },
      {
        icon: ShieldAlert,
        title: "Fake tech support",
        teaser: "A security alert that pushes you to call fake support.",
        slug: "tech-support-alert",
      },
      {
        icon: Mail,
        title: "Fraudulent bank email",
        teaser: "An email that perfectly imitates your bank to steal your credentials.",
        slug: "bank-email",
      },
      {
        icon: UserRound,
        title: "Message from a relative",
        teaser: "\"I got a new number\" — followed by an urgent request for money.",
        slug: "relative-new-number-message",
      },
      {
        icon: Heart,
        title: "Online dating scam",
        teaser: "A relationship that always ends with a request for money.",
        slug: "online-relationship-message",
      },
    ],
  },
};

export function SimulationThemesSection({ locale = "fr" }: { locale?: Locale }) {
  const t = THEMES[locale];
  const prefix = localePrefix(locale);

  return (
    <section aria-labelledby="themes-heading" className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h2 id="themes-heading" className="text-3xl font-bold tracking-tight text-balance">
          {t.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300 text-balance">{t.subheading}</p>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map(({ icon: Icon, title, teaser, slug }) => (
          <li key={slug}>
            <Link
              href={`${prefix}/simulations/${slug}`}
              className="group flex h-full flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.05] p-4 transition-colors hover:border-sky-400/60 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                <Icon className="size-5" aria-hidden />
              </div>
              <span className="font-semibold text-white group-hover:text-sky-300">{title}</span>
              <span className="text-sm text-slate-300">{teaser}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center">
        <Link href={`${prefix}/simulations`} className="inline-flex min-h-11 items-center text-sm font-medium text-sky-300 underline-offset-4 hover:underline focus-visible:outline-white">
          {t.seeAll} →
        </Link>
      </div>
    </section>
  );
}
