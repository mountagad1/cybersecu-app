"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AUDIENCE_LINKS } from "@/components/home/audience-links";
import { Briefcase, Building2, GraduationCap, Pin, Store, UserRound, Users } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { OrbitalDiagram } from "@/components/home/orbital-diagram";
import type { Locale } from "@/domain/i18n/locale";

const AUDIENCES_FR = [
  {
    icon: UserRound,
    title: "Seniors",
    description:
      "Reconnaître un faux conseiller bancaire, un faux support technique ou une fausse alerte, expliqué simplement et sans jargon.",
    note: "bg-amber-100 border-amber-300/80 text-amber-950",
    pin: "text-amber-600",
    rotate: -3,
  },
  {
    icon: Briefcase,
    title: "Employés administratifs",
    description:
      "Détecter une fausse facture, un faux ordre de virement ou un email qui usurpe la direction avant qu'il ne cause un incident.",
    note: "bg-sky-100 border-sky-300/80 text-sky-950",
    pin: "text-sky-600",
    rotate: 2,
  },
  {
    icon: Store,
    title: "Commerçants",
    description:
      "Repérer les arnaques au faux client, au faux remboursement ou au terminal de paiement compromis.",
    note: "bg-rose-100 border-rose-300/80 text-rose-950",
    pin: "text-rose-600",
    rotate: -2,
  },
  {
    icon: Building2,
    title: "TPE / PME",
    description:
      "Former une équipe entière aux réflexes de base, sans logiciel à installer ni formation d'une journée.",
    note: "bg-lime-100 border-lime-300/80 text-lime-950",
    pin: "text-lime-700",
    rotate: 3,
  },
  {
    icon: GraduationCap,
    title: "Universités",
    description:
      "Sensibiliser étudiants et personnel aux faux mails de l'ENT, aux fausses bourses et aux arnaques au logement étudiant.",
    note: "bg-teal-100 border-teal-300/80 text-teal-950",
    pin: "text-teal-600",
    rotate: -2.5,
  },
  {
    icon: Users,
    title: "Particuliers & familles",
    description:
      "S'entraîner ensemble à repérer les arnaques par SMS, email ou réseaux sociaux, à son rythme.",
    note: "bg-violet-100 border-violet-300/80 text-violet-950",
    pin: "text-violet-600",
    rotate: -1.5,
  },
] as const;

const AUDIENCES_EN = [
  {
    icon: UserRound,
    title: "Seniors",
    description:
      "Recognise a fake bank advisor, fake tech support or a fake alert, explained simply and without jargon.",
    note: "bg-amber-100 border-amber-300/80 text-amber-950",
    pin: "text-amber-600",
    rotate: -3,
  },
  {
    icon: Briefcase,
    title: "Office staff",
    description:
      "Spot a fake invoice, a fake transfer order or an email impersonating management before it causes an incident.",
    note: "bg-sky-100 border-sky-300/80 text-sky-950",
    pin: "text-sky-600",
    rotate: 2,
  },
  {
    icon: Store,
    title: "Shopkeepers",
    description: "Recognise fake-customer scams, fake refunds or a compromised payment terminal.",
    note: "bg-rose-100 border-rose-300/80 text-rose-950",
    pin: "text-rose-600",
    rotate: -2,
  },
  {
    icon: Building2,
    title: "Small businesses",
    description: "Train an entire team on the basic reflexes, with no software to install and no day-long course.",
    note: "bg-lime-100 border-lime-300/80 text-lime-950",
    pin: "text-lime-700",
    rotate: 3,
  },
  {
    icon: GraduationCap,
    title: "Universities",
    description: "Raise awareness among students and staff about fake portal emails, fake scholarships and student housing scams.",
    note: "bg-teal-100 border-teal-300/80 text-teal-950",
    pin: "text-teal-600",
    rotate: -2.5,
  },
  {
    icon: Users,
    title: "Individuals & families",
    description: "Train together to spot scams by text, email or social media, at your own pace.",
    note: "bg-violet-100 border-violet-300/80 text-violet-950",
    pin: "text-violet-600",
    rotate: -1.5,
  },
] as const;

const STRINGS = {
  fr: {
    heading: "Pour qui ?",
    subtitle:
      "Personne n'est à l'abri d'une arnaque bien faite. cybersecu.app s'adresse à tous ceux qui utilisent un téléphone, un email ou une carte bancaire au quotidien.",
    dossier: "Dossier : qui est visé par les arnaques ?",
    audiences: AUDIENCES_FR,
  },
  en: {
    heading: "Who is it for?",
    subtitle:
      "No one is immune to a well-made scam. cybersecu.app is for anyone who uses a phone, email or a bank card day to day.",
    dossier: "Case file : who scams target",
    audiences: AUDIENCES_EN,
  },
} as const;

export function AudienceSection({ locale = "fr" }: { locale?: Locale }) {
  const t = STRINGS[locale];
  return (
    <section aria-labelledby="audience-heading" className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <div className="text-center">
          <h2 id="audience-heading" className="text-3xl font-bold tracking-tight text-balance">
            {t.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-balance">{t.subtitle}</p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <OrbitalDiagram items={t.audiences} />
      </Reveal>

      <div className="relative mt-8 overflow-hidden rounded-2xl border border-dashed border-white/20 bg-[#16261f] p-5 shadow-inner sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <p
          className="relative text-center text-base font-semibold text-white/70 sm:text-xl"
          style={{ fontFamily: "var(--font-handwriting)" }}
        >
          {t.dossier}
        </p>

        <div className="relative mt-6 grid gap-x-4 gap-y-8 pt-3 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
          {t.audiences.map(({ icon: Icon, title, description, note, pin, rotate }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16, rotate }}
              whileInView={{ opacity: 1, y: 0, rotate }}
              whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-sm border p-5 pt-6 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)] ${note}`}
            >
              <Pin
                className={`absolute -top-3 left-1/2 size-6 -translate-x-1/2 -rotate-12 drop-shadow-md ${pin}`}
                aria-hidden
                fill="currentColor"
              />
              <div className="flex size-11 items-center justify-center rounded-lg bg-white/50">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3
                className="mt-4 text-xl font-semibold leading-none"
                style={{ fontFamily: "var(--font-handwriting)" }}
              >
                {title}
              </h3>
              <p className="mt-2 text-sm opacity-80">{description}</p>
              {AUDIENCE_LINKS[locale][title] && (
                <Link
                  href={AUDIENCE_LINKS[locale][title]!.href}
                  className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
                >
                  {AUDIENCE_LINKS[locale][title]!.label} →
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
