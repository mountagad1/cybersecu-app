import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { SimulationFollowUps } from "@/components/scenario/simulation-follow-ups";
import { linksForSimulation } from "@/domain/linking/engine";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DifficultyBadge } from "@/components/scenario/difficulty-badge";
import { ScenarioPlayer } from "@/components/scenario/scenario-player";
import { findSimulationEnBySlug, listSimulationsEn, toPublicScenario } from "@/content/simulations-en";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { computeQuotaState } from "@/domain/quota/checkQuota";
import { absoluteUrl } from "@/lib/site";
import { languageAlternates } from "@/lib/hreflang";

/**
 * English mirror of `(marketing)/simulations/[slug]/page.tsx`, sourcing
 * from the separate English catalogue (docs/decisions/0009-i18n-pilot.md
 * §3) rather than a translated projection of a French simulation.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const DEFAULT_FREE_QUOTA = 10;

export function generateStaticParams() {
  return listSimulationsEn().map((sim) => ({ slug: sim.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sim = findSimulationEnBySlug(slug);
  if (!sim) return {};

  const attack = findAttackByCode(sim.attackCode);
  const localized = attack ? getLocalizedAttack(attack, "en") : null;
  const title = `Simulation: ${localized?.name ?? sim.impersonatedEntity}`;
  // The French counterpart is the simulation of the same attack.
  const frenchSlug = localized?.simulationSlug === sim.slug ? attack?.simulationSlug : undefined;

  return {
    title,
    description: sim.teaser,
    alternates: {
      canonical: `/en/simulations/${sim.slug}`,
      ...(frenchSlug
        ? { languages: languageAlternates({ fr: `/simulations/${frenchSlug}`, en: `/en/simulations/${sim.slug}` }) }
        : {}),
    },
    openGraph: openGraph("en", { title, description: sim.teaser, type: "article", url: absoluteUrl(`/en/simulations/${sim.slug}`) }),
  };
}

export default async function EnglishSimulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sim = findSimulationEnBySlug(slug);
  if (!sim) notFound();

  const attack = findAttackByCode(sim.attackCode);
  const localized = attack ? getLocalizedAttack(attack, "en") : null;
  const scenario = toPublicScenario(sim);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="simulation" locale="en" />
      <Breadcrumbs
        trail={[
          { name: "Home", href: "/en" },
          { name: "Simulations", href: "/en/simulations" },
          { name: localized?.name ?? "Simulation", href: `/en/simulations/${sim.slug}` },
        ]}
        locale="en"
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{localized?.name ?? "Simulation"}</h1>
        <DifficultyBadge difficulty={sim.difficulty} locale="en" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{sim.teaser}</p>

      <div className="mt-6">
        <ScenarioPlayer
          scenario={scenario}
          initialQuota={{ ...computeQuotaState(0, DEFAULT_FREE_QUOTA), hasEntitlement: false }}
          locale="en"
          signalsHref={localized ? `/en/attaques/${localized.slug}#warning-signs` : undefined}
        />
      </div>

      {localized && (
        <p className="mt-10 text-sm text-muted-foreground">
          This simulation illustrates{" "}
          <Link href={`/en/attaques/${localized.slug}`} className="text-primary hover:underline">
            {localized.name}
          </Link>
          . The article explains the full mechanism, the warning signs and what to do.
        </p>
      )}

      <SimulationFollowUps links={linksForSimulation(sim, "en")} locale="en" />
    </div>
  );
}
