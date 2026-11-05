import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { VoicePlayer } from "@/components/voice/voice-player";
import { findVoiceSimulationBySlug, listVoiceSimulations } from "@/content/voice-simulations";
import { findAttackByCode } from "@/content/attacks";
import { absoluteUrl } from "@/lib/site";

/**
 * Statically rendered, same reasoning as the text simulation page
 * (src/app/(marketing)/simulations/[slug]/page.tsx): the scenario itself
 * is authored content, so the page has nothing per-visitor baked in —
 * `VoicePlayer` fetches the embed session on click, never on render.
 *
 * `noSimulationYet` note: this route is reachable for every entry in
 * `listVoiceSimulations()` even before a Dograh workflow exists for it
 * (`dograhEmbedToken: null`) — the page renders, and the "Décrocher"
 * button surfaces the honest 503 from `/api/voice-simulations/{slug}/session`.
 * A crawler indexing this page before activation sees a real page
 * explaining a real attack, not a broken one — see `generateMetadata`
 * for why it is nonetheless `noindex` until then.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listVoiceSimulations().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = findVoiceSimulationBySlug(slug);
  if (!scenario) return {};

  const attack = findAttackByCode(scenario.attackCode);
  const title = `Simulation vocale : ${attack?.name ?? scenario.impersonatedEntity}`;
  const activated = scenario.dograhEmbedToken !== null;

  return {
    title,
    description: scenario.teaser,
    alternates: { canonical: `/simulations/voix/${scenario.slug}` },
    // Not yet indexed until a real Dograh workflow exists — see
    // docs/decisions/0008 §6. Flip this once `dograhEmbedToken` is set.
    robots: activated ? undefined : { index: false, follow: true },
    openGraph: openGraph("fr", {
      title,
      description: scenario.teaser,
      type: "article",
      url: absoluteUrl(`/simulations/voix/${scenario.slug}`),
    }),
  };
}

export default async function VoiceSimulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = findVoiceSimulationBySlug(slug);
  if (!scenario) notFound();

  const attack = findAttackByCode(scenario.attackCode);
  const textSimulationHref = attack?.simulationSlug ? `/simulations/${attack.simulationSlug}` : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Simulations", href: "/simulations" },
          { name: attack?.name ?? "Simulation vocale", href: `/simulations/voix/${scenario.slug}` },
        ]}
      />

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">{attack?.name ?? scenario.impersonatedEntity}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{scenario.teaser}</p>

      <div className="mt-6">
        <VoicePlayer scenarioSlug={scenario.slug} textSimulationHref={textSimulationHref} />
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
    </div>
  );
}
