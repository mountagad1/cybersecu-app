import { PageTracker } from "@/components/analytics/page-tracker";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/hreflang";
import { ScamRevealHero } from "@/components/home/scam-reveal-hero";
import { ThreeStepStickyCards } from "@/components/home/three-step-sticky-cards";
import { AudienceSection } from "@/components/home/audience-section";
import { WhySection } from "@/components/home/why-section";
import { FaqSection } from "@/components/home/faq-section";
import { DarkStage } from "@/components/home/dark-stage";
import { PhoneScamDemo } from "@/components/home/phone-scam-demo";
import { StickyCtaBar } from "@/components/home/sticky-cta-bar";
import { SimulationThemesSection } from "@/components/home/simulation-themes-section";
import { ReflexMountainSection } from "@/components/home/reflex-mountain-section";
import { getUiStrings } from "@/domain/i18n/dictionary";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: languageAlternates({ fr: "/", en: "/en" }) },
};

export default function HomePage() {
  const t = getUiStrings("fr").home;
  return (
    <>
      <PageTracker pageType="home" locale="fr" />
      <StickyCtaBar />
      <ScamRevealHero locale="fr" />
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <section aria-labelledby="comment-ca-marche">
          {/* A heading, not only a label: the cards' h3s need an h2 above them (axe heading-order). */}
          <h2 id="comment-ca-marche" className="sr-only">
            Comment ça marche
          </h2>
          <ThreeStepStickyCards cards={t.cards} />
        </section>
      </div>

      <DarkStage>
        <PhoneScamDemo />
        <SimulationThemesSection />
      </DarkStage>
      <AudienceSection />
      <WhySection />
      <ReflexMountainSection />
      <DarkStage>
        <FaqSection />
      </DarkStage>
    </>
  );
}
