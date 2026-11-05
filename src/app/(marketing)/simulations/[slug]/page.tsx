import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DifficultyBadge } from "@/components/scenario/difficulty-badge";
import { ScenarioPlayer } from "@/components/scenario/scenario-player";
import { findSimulationBySlug, listSimulations, toPublicScenario } from "@/content/simulations";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { languageAlternates } from "@/lib/hreflang";
import { SimulationFollowUps } from "@/components/scenario/simulation-follow-ups";
import { linksForSimulation } from "@/domain/linking/engine";
import { computeQuotaState } from "@/domain/quota/checkQuota";
import { absoluteUrl } from "@/lib/site";

/**
 * Statically rendered. The scenario is authored content, so the page
 * itself has nothing per-visitor in it — the player fetches the current
 * quota on mount, and the attempt routes remain the only authority on
 * whether an attempt may be consumed (docs/SIMULATION_QUOTA.md §2).
 * Making this static is what lets a crawler see the exercise at all.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const DEFAULT_FREE_QUOTA = 10;

export function generateStaticParams() {
  return listSimulations().map((sim) => ({ slug: sim.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sim = findSimulationBySlug(slug);
  if (!sim) return {};

  const attack = findAttackByCode(sim.attackCode);
  const title = `Simulation : ${attack?.name ?? sim.impersonatedEntity}`;
  // The English counterpart is the simulation of the same attack, when
  // this is the attack's own simulation and the attack is translated.
  const englishSlug =
    attack && attack.simulationSlug === sim.slug ? getLocalizedAttack(attack, "en")?.simulationSlug : undefined;

  return {
    title,
    description: sim.teaser,
    alternates: {
      canonical: `/simulations/${sim.slug}`,
      ...(englishSlug
        ? { languages: languageAlternates({ fr: `/simulations/${sim.slug}`, en: `/en/simulations/${englishSlug}` }) }
        : {}),
    },
    openGraph: openGraph("fr", { title, description: sim.teaser, type: "article", url: absoluteUrl(`/simulations/${sim.slug}`) }),
  };
}

export default async function SimulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sim = findSimulationBySlug(slug);
  if (!sim) notFound();

  const attack = findAttackByCode(sim.attackCode);
  const scenario = toPublicScenario(sim);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="simulation" locale="fr" />
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Simulations", href: "/simulations" },
          { name: attack?.name ?? "Simulation", href: `/simulations/${sim.slug}` },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{attack?.name ?? "Simulation"}</h1>
        <DifficultyBadge difficulty={sim.difficulty} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{sim.teaser}</p>

      <div className="mt-6">
        <ScenarioPlayer
          scenario={scenario}
          initialQuota={{ ...computeQuotaState(0, DEFAULT_FREE_QUOTA), hasEntitlement: false }}
          signalsHref={attack ? `/attaques/${attack.slug}#warning-signs` : undefined}
        />
      </div>

      {attack && (
        <p className="mt-10 text-sm text-muted-foreground">
          Cette simulation illustre{" "}
          <Link href={`/attaques/${attack.slug}`} className="text-primary hover:underline">
            {attack.name}
          </Link>
          . La fiche explique le mécanisme complet, les signaux d&apos;alerte et la marche à suivre.
        </p>
      )}

      <SimulationFollowUps links={linksForSimulation(sim, "fr")} locale="fr" />
    </div>
  );
}
