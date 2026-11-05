import { listAttacks, type AttackEntry } from "@/content/attacks";
import { getLocalizedGuide, listGuides, type GuideEntry, type LocalizedGuide } from "@/content/guides";
import { getLocalizedAttack, type LocalizedAttack } from "@/content/attacks/localize";
import { LINK_SIGNAL, SIGNALS } from "@/domain/message/signals";
import { audienceAttacks, listAudiences } from "@/content/audiences";
import { BOUNDARIES } from "@/content/attacks/boundaries";

/**
 * Free tools. Each one does a single job a visitor has at a specific
 * moment, and is attached — like a guide — by declaring the fiches and
 * guides it serves, so they link to it without each having to know it
 * exists.
 *
 * A tool earns its place only if it can be exact and cannot put the
 * visitor at risk: nothing here ever says a link or a message is « safe »
 * (see `@/domain/link/decode`).
 */
export interface ToolEntry {
  slug: string;
  title: string;
  /** One sentence: what it does for you, shown on cards and in metadata. */
  description: string;
  relatedAttackCodes: string[];
  relatedGuideSlugs: string[];
  /** English page: what a reader reads. Links and identity stay shared. */
  translations?: { en?: { slug: string; title: string; description: string } };
}

const ALL_TOOLS: readonly ToolEntry[] = [
  {
    slug: "analyseur-de-message",
    title: "Analyseur de message suspect : ce SMS ou cet email est-il une arnaque ?",
    description:
      "Collez un SMS, un email ou un message : l'outil montre les procédés d'arnaque, lit chaque lien et nomme les attaques qui y ressemblent. Rien n'est envoyé.",
    translations: {
      en: {
        slug: "message-analyzer",
        title: "Suspicious message analyzer: is this text or email a scam?",
        description:
          "Paste a text message, email or message: the tool shows the scam techniques it contains, reads every link and names the attacks it looks like. Nothing is sent.",
      },
    },
    // Every fiche whose procedure the analyzer recognises: those pages
    // link here, and the result links back to them.
    relatedAttackCodes: [...new Set([...SIGNALS.flatMap((s) => s.attackCodes), ...LINK_SIGNAL.attackCodes])],
    relatedGuideSlugs: [
      "verifier-un-lien-avant-de-cliquer",
      "verifier-l-identite-d-un-interlocuteur",
      "j-ai-donne-mes-coordonnees-bancaires-ou-un-code",
      "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
    ],
  },
  {
    slug: "j-ai-clique",
    title: "Assistant « J'ai cliqué » : que faire après un lien, un SMS ou un appel frauduleux ?",
    description:
      "Deux questions — ce que vous avez fait, par où c'est arrivé — puis les gestes à faire, par ordre d'urgence. À imprimer ou à envoyer. Rien n'est enregistré.",
    translations: {
      en: {
        slug: "i-clicked",
        title: "“I clicked” assistant: what to do after a scam link, text or call?",
        description:
          "Two questions — what you did, how it reached you — and the plan of steps to take, in order of urgency. To print or send to someone close. Nothing is stored.",
      },
    },
    // The channels the assistant asks about, each with the fiche (and its
    // simulation) shown under « to recognize it next time ».
    relatedAttackCodes: ["SMS-000001", "PHISH-000001", "SOCIAL-000006", "WEB-000003", "QR-000001"],
    relatedGuideSlugs: [
      "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
      "j-ai-donne-mes-coordonnees-bancaires-ou-un-code",
      "que-faire-apres-avoir-paye-une-arnaque",
      "mon-compte-a-ete-pirate",
      "j-ai-laisse-quelqu-un-prendre-la-main-sur-mon-appareil",
    ],
  },
  {
    slug: "checklist-urgence",
    title: "Checklist d'urgence : vous venez de vous faire piéger",
    description:
      "Les premiers gestes, dans l'ordre, selon ce que vous avez donné : argent, coordonnées bancaires, mot de passe, accès à un appareil ou à un compte.",
    translations: {
      en: {
        slug: "emergency-checklist",
        title: "Emergency checklist: you've just been scammed",
        description:
          "The first steps, in order, depending on what you gave away: money, bank details, a password, access to a device or an account.",
      },
    },
    // Attached from the victim section of every fiche, not by code: it is
    // the one page that answers « it already happened » for all of them.
    relatedAttackCodes: [],
    relatedGuideSlugs: [
      "que-faire-apres-avoir-paye-une-arnaque",
      "j-ai-donne-mes-coordonnees-bancaires-ou-un-code",
      "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
      "mon-compte-a-ete-pirate",
      "j-ai-laisse-quelqu-un-prendre-la-main-sur-mon-appareil",
    ],
  },
  {
    slug: "decodeur-de-lien",
    title: "Décodeur de lien : à qui appartient vraiment cette adresse ?",
    description:
      "Collez un lien : l'outil montre le nom de domaine réel, ce qui n'est que décor, et les caractères qui imitent d'autres lettres. Rien n'est envoyé.",
    translations: {
      en: {
        slug: "link-decoder",
        title: "Link decoder: who really owns this address?",
        description:
          "Paste a link: the tool shows the real domain name, what is only decoration, and characters that imitate other letters. Nothing is sent.",
      },
    },
    relatedAttackCodes: ["PHISH-000001", "SMS-000001", "IDN-000001", "IDN-000002", "QR-000001", "WEB-000003"],
    relatedGuideSlugs: ["verifier-un-lien-avant-de-cliquer", "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site"],
  },
  {
    slug: "x-ou-y",
    title: "X ou Y ? Les attaques qu'on confond, côte à côte",
    description:
      "Phishing ou smishing, faux support ou scareware, virus ou ver : les attaques qui se ressemblent, comparées, avec le critère qui les distingue.",
    translations: {
      en: {
        slug: "x-or-y",
        title: "X or Y? The attacks people mix up, side by side",
        description:
          "Phishing or smishing, fake tech support or scareware, virus or worm: lookalike attacks compared side by side, with the criterion that tells them apart.",
      },
    },
    // Every fiche that belongs to a pair: their « À ne pas confondre avec »
    // section links here, and the page links back to each of them.
    relatedAttackCodes: [...new Set(BOUNDARIES.flatMap((b) => [...b.pair]))],
    relatedGuideSlugs: [],
  },
  {
    slug: "generateur-mot-de-passe",
    title: "Générateur de mot de passe et de phrase de passe aléatoires",
    description:
      "Un mot de passe ou une phrase de passe tirés au hasard dans votre navigateur, longueur et caractères réglables. Rien n'est envoyé ni enregistré.",
    translations: {
      en: {
        slug: "password-generator",
        title: "Random password and passphrase generator",
        description:
          "A random password or passphrase drawn in your browser, with adjustable length and characters. Nothing is sent or stored.",
      },
    },
    // Empty on purpose: this field also lists the tool on the fiches, which
    // are frozen until 2026-11-24 (EXP-020). The page links to them itself
    // (PASSWORD_ATTACK_CODES in ./password-generator).
    relatedAttackCodes: [],
    relatedGuideSlugs: [
      "comment-un-mot-de-passe-est-vole",
      "activer-la-double-authentification",
      "mon-compte-a-ete-pirate",
      // Its first step is « change it from the real service »: the moment a new one is needed.
      "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
    ],
  },
  // Printable checklists by audience (src/content/audiences): each one
  // serves the fiches whose prevention advice it gathers.
  ...listAudiences().map(
    (audience): ToolEntry => ({
      slug: audience.slug,
      title: audience.title.fr,
      description: audience.description.fr,
      translations: {
        en: { slug: audience.enSlug, title: audience.title.en, description: audience.description.en },
      },
      relatedAttackCodes: audienceAttacks(audience).map((a) => a.code),
      relatedGuideSlugs: [],
    }),
  ),
];

export function auditTools(tools: readonly ToolEntry[]): string[] {
  const problems: string[] = [];
  const codes = new Set(listAttacks().map((a) => a.code));
  const guides = new Set(listGuides().map((g) => g.slug));
  const seen = new Set<string>();
  for (const tool of tools) {
    if (seen.has(tool.slug)) problems.push(`slug d'outil dupliqué : ${tool.slug}`);
    seen.add(tool.slug);
    for (const code of tool.relatedAttackCodes) {
      if (!codes.has(code)) problems.push(`${tool.slug} : code d'attaque inexistant « ${code} »`);
    }
    for (const slug of tool.relatedGuideSlugs) {
      if (!guides.has(slug)) problems.push(`${tool.slug} : guide inexistant « ${slug} »`);
    }
  }
  return problems;
}

const problems = auditTools(ALL_TOOLS);
if (problems.length > 0) {
  throw new Error(`Catalogue d'outils invalide :\n  - ${problems.join("\n  - ")}`);
}

export function listTools(): ToolEntry[] {
  return [...ALL_TOOLS];
}

export function findTool(slug: string): ToolEntry {
  const tool = ALL_TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`outil inconnu : ${slug}`);
  return tool;
}

export function toolsForAttack(attack: AttackEntry): ToolEntry[] {
  return ALL_TOOLS.filter((t) => t.relatedAttackCodes.includes(attack.code));
}

export function toolsForGuide(guide: GuideEntry): ToolEntry[] {
  return ALL_TOOLS.filter((t) => t.relatedGuideSlugs.includes(guide.slug));
}

/** Fiches a tool serves, resolved to published entries. */
export function attacksForTool(tool: ToolEntry): AttackEntry[] {
  const published = listAttacks();
  return tool.relatedAttackCodes
    .map((code) => published.find((a) => a.code === code))
    .filter((a): a is AttackEntry => a !== undefined);
}

/** Guides a tool complements, resolved to published entries. */
export function guidesForTool(tool: ToolEntry): GuideEntry[] {
  const published = listGuides();
  return tool.relatedGuideSlugs
    .map((slug) => published.find((g) => g.slug === slug))
    .filter((g): g is GuideEntry => g !== undefined);
}

/** A tool as the English pages show it. */
export interface LocalizedTool {
  frSlug: string;
  slug: string;
  title: string;
  description: string;
}

export function getLocalizedTool(tool: ToolEntry): LocalizedTool | null {
  const en = tool.translations?.en;
  return en ? { frSlug: tool.slug, ...en } : null;
}

export function listToolsEn(): LocalizedTool[] {
  return ALL_TOOLS.map(getLocalizedTool).filter((t): t is LocalizedTool => t !== null);
}

export function findToolEn(frSlug: string): LocalizedTool {
  const tool = getLocalizedTool(findTool(frSlug));
  if (!tool) throw new Error(`outil sans traduction anglaise : ${frSlug}`);
  return tool;
}

export function toolsForAttackEn(attack: AttackEntry): LocalizedTool[] {
  return toolsForAttack(attack).map(getLocalizedTool).filter((t): t is LocalizedTool => t !== null);
}

/** English tools that complement an English guide. */
export function toolsForGuideEn(guide: LocalizedGuide): LocalizedTool[] {
  return ALL_TOOLS.filter((t) => t.relatedGuideSlugs.includes(guide.frSlug))
    .map(getLocalizedTool)
    .filter((t): t is LocalizedTool => t !== null);
}

/** English fiches a tool serves, skipping untranslated ones. */
export function attacksForToolEn(frSlug: string): LocalizedAttack[] {
  return attacksForTool(findTool(frSlug))
    .map((a) => getLocalizedAttack(a, "en"))
    .filter((a): a is LocalizedAttack => a !== null);
}

/** English guides a tool complements, skipping untranslated ones. */
export function guidesForToolEn(frSlug: string): LocalizedGuide[] {
  return guidesForTool(findTool(frSlug))
    .map(getLocalizedGuide)
    .filter((g): g is LocalizedGuide => g !== null);
}

/** English slug of a French tool, for hreflang. */
export function englishToolSlug(frSlug: string): string | null {
  return getLocalizedTool(findTool(frSlug))?.slug ?? null;
}
