"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import type { Locale } from "@/domain/i18n/locale";
import { SALES_OPEN } from "@/lib/sales";

const FAQ_ITEMS_FR = [
  {
    question: "Est-ce vraiment gratuit ?",
    answer: SALES_OPEN
      ? "Oui. Vous disposez de 10 simulations gratuites, sans carte bancaire ni inscription. Au-delà, un accès complet à toutes les simulations (actuelles et futures) coûte 29 € en paiement unique — jamais d'abonnement."
      : "Oui. Vous disposez de 10 simulations gratuites, sans carte bancaire ni inscription. Les fiches d'attaques, les guides et les outils sont entièrement gratuits.",
  },
  {
    question: "Ai-je besoin de créer un compte ?",
    answer:
      "Non. cybersecu.app fonctionne sans compte : une session anonyme sur votre navigateur suffit pour suivre votre progression et vos simulations gratuites.",
  },
  {
    question: "Que se passe-t-il si je change de téléphone ou d'ordinateur ?",
    answer:
      "Si vous avez acheté l'accès complet, vous pouvez le restaurer sur un nouvel appareil grâce à un lien envoyé par email — aucun mot de passe à retenir.",
  },
  {
    question: "Les simulations sont-elles de vraies arnaques ?",
    answer:
      "Non, jamais. Chaque simulation (SMS, email, appel, site) est un contenu pédagogique entièrement fictif que nous créons. Aucune simulation ne peut vous exposer à un vrai risque, et rien sur le site ne permet de créer de véritables tentatives de phishing.",
  },
  {
    question: "C'est adapté aux personnes peu à l'aise avec la technologie ?",
    answer:
      "C'est justement pensé pour ça : phrases courtes, vocabulaire simple, aucune notion tenue pour acquise, et jamais de ton culpabilisant en cas d'erreur — l'objectif est de comprendre, pas de se sentir jugé.",
  },
  {
    question: "Quelles données collectez-vous ?",
    answer:
      "Le minimum nécessaire : votre session anonyme et l'historique de vos simulations (quelle simulation, quel choix, correct ou non). Jamais de contenu de message privé, jamais de revente de données. Détails complets dans notre politique de confidentialité.",
  },
] as const;

const FAQ_ITEMS_EN = [
  {
    question: "Is it really free?",
    answer: SALES_OPEN
      ? "Yes. You get 10 free simulations, no credit card and no sign-up. Beyond that, full access to all simulations (current and future) costs a one-time payment of €29 — never a subscription."
      : "Yes. You get 10 free simulations, no credit card and no sign-up. The attack pages, guides and tools are entirely free.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. cybersecu.app works with no account: an anonymous session in your browser is enough to track your progress and your free simulations.",
  },
  {
    question: "What happens if I change phone or computer?",
    answer:
      "If you purchased full access, you can restore it on a new device via a link sent by email — no password to remember.",
  },
  {
    question: "Are the simulations real scams?",
    answer:
      "No, never. Every simulation (SMS, email, call, website) is entirely fictional educational content that we create. No simulation can ever expose you to a real risk, and nothing on the site can be used to create actual phishing attempts.",
  },
  {
    question: "Is it suitable for people uncomfortable with technology?",
    answer:
      "It's designed exactly for that: short sentences, simple vocabulary, nothing assumed as known, and never a guilt-inducing tone on a mistake — the goal is to understand, not to feel judged.",
  },
  {
    question: "What data do you collect?",
    answer:
      "The minimum necessary: your anonymous session and your simulation history (which simulation, which choice, correct or not). Never private message content, never data resale. Full details in our privacy policy.",
  },
] as const;

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = useId();

  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex min-h-11 w-full touch-manipulation items-center justify-between gap-4 rounded-md py-5 text-left text-base font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {question}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-slate-400"
          >
            <ChevronDown className="size-5" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-slate-300">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const HEADING: Record<Locale, string> = {
  fr: "Questions fréquentes",
  en: "Frequently asked questions",
};

const FAQ_ITEMS: Record<Locale, { question: string; answer: string }[]> = {
  fr: [...FAQ_ITEMS_FR],
  en: [...FAQ_ITEMS_EN],
};

export function FaqSection({ locale = "fr" }: { locale?: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = FAQ_ITEMS[locale];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-3xl px-6 py-16"
    >
      {/* Genuine FAQ content only — matches docs/SEO_ARCHITECTURE.md §4:
          FAQPage schema only where the page actually has authored FAQ content. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Reveal>
        <h2
          id="faq-heading"
          className="text-center text-3xl font-bold tracking-tight text-balance"
        >
          {HEADING[locale]}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10">
          {items.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
