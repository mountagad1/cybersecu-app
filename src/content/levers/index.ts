import type { PsychologicalTriggerCode } from "@/domain/scenario/types";
import { listAttacks, type AttackEntry } from "@/content/attacks";
import { LEVER_PUBLICATION_THRESHOLD, type LeverEntry, type LeverTranslation } from "./types";
import { LEVERS_EN } from "./en";

export type { LeverEntry, LeverTranslation } from "./types";
export { LEVER_PUBLICATION_THRESHOLD } from "./types";

const ALL_LEVERS: readonly LeverEntry[] = [
  {
    code: "urgency",
    slug: "urgence",
    name: "L'urgence",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "On vous donne trop peu de temps pour réfléchir. Ce n'est pas un hasard de calendrier : le délai est choisi pour que vous décidiez avant d'avoir pu vérifier.",
    definition:
      "L'urgence est la réduction délibérée du temps disponible entre la réception d'une demande et la décision, afin d'empêcher toute vérification indépendante.",
    whyItWorks:
      "Décider vite et décider bien sont deux modes différents, et nous ne pouvons pas être dans les deux à la fois. Sous contrainte de temps, l'attention se porte sur ce qu'il faut faire plutôt que sur la question de savoir si la demande est légitime — un déplacement dont on ne s'aperçoit pas, parce qu'on a le sentiment de réfléchir normalement. L'urgence n'a même pas besoin d'être crédible : il lui suffit d'être présente pour que la vérification passe après l'action au lieu de la précéder.",
    howToResist:
      "Rendez la lenteur automatique plutôt que volontaire : une règle décidée à froid — aucun paiement, aucun code, aucun identifiant dans les dix minutes qui suivent une demande — résiste là où la bonne volonté cède. Une demande légitime survit toujours à dix minutes ; c'est même la meilleure définition pratique d'une demande légitime.",
    counterQuestion:
      "Qu'est-ce qui se passe réellement si j'attends une heure avant de faire ça ?",
  },
  {
    code: "fear",
    slug: "peur",
    name: "La peur",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "On vous annonce qu'une chose grave est en train de se produire ou va se produire. La peur occupe l'esprit, et pendant ce temps c'est l'autre qui propose la solution.",
    definition:
      "La peur est l'annonce d'une conséquence redoutée — perte d'argent, sanction, poursuite, révélation — présentée comme imminente et évitable par une action précise que l'attaquant indique.",
    whyItWorks:
      "Une menace crédible mobilise l'attention sur elle-même : on cherche à écarter le danger, pas à examiner qui l'annonce. Le procédé est d'autant plus efficace qu'il fournit immédiatement une issue, ce qui transforme une situation angoissante en tâche à exécuter — et exécuter soulage. C'est ce soulagement, et non la crédulité, qui fait agir. Sa forme la plus dure est la sidération : une accusation grave pousse à se disculper plutôt qu'à vérifier.",
    howToResist:
      "Séparez les deux moments : constater le risque, puis choisir par où le vérifier. La solution proposée par celui qui annonce le danger n'est jamais la seule, et c'est précisément le point à tester. Rejoignez l'organisme concerné par un chemin que vous avez choisi, sans utiliser ce qui vous a été fourni.",
    counterQuestion:
      "Qui m'annonce ce danger, et pourquoi la solution vient-elle de la même personne ?",
  },
  {
    code: "authority",
    slug: "autorite",
    name: "L'autorité",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "L'interlocuteur se présente comme quelqu'un qu'on ne contredit pas : la banque, l'administration, la police, la direction. On obéit avant d'avoir vérifié qui parle.",
    definition:
      "L'autorité est l'emprunt d'une position institutionnelle ou hiérarchique afin d'obtenir une exécution rapide et de rendre la vérification socialement coûteuse.",
    whyItWorks:
      "Nous déléguons en permanence notre jugement à des rôles, et c'est efficace : demander ses preuves à chaque interlocuteur serait invivable. L'attaquant emprunte ce raccourci. Son avantage supplémentaire est que vérifier une autorité paraît impoli ou méfiant — le frein n'est pas cognitif mais social, ce qui le rend plus difficile à surmonter qu'un doute ordinaire. Les marqueurs d'autorité, eux, se copient tous : un logo, un ton, un numéro affiché, une adresse.",
    howToResist:
      "Impersonnalisez la vérification pour lui retirer sa charge sociale : « je vous rappelle sur le numéro officiel » ne met personne en cause et n'a pas besoin d'être justifié. Une autorité réelle accepte toujours d'être rappelée — c'est même la seule chose qui la distingue d'une autorité empruntée.",
    counterQuestion:
      "Est-ce que j'hésite parce que c'est douteux, ou parce que je n'ose pas demander ?",
  },
  {
    code: "trust",
    slug: "confiance",
    name: "La confiance",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "Ce qui vous parvient ressemble à ce que vous connaissez : le nom d'un proche, le logo de votre banque, une adresse presque exacte. La ressemblance fait office de preuve.",
    definition:
      "La confiance est l'exploitation des signes auxquels nous reconnaissons habituellement un interlocuteur — nom affiché, identité visuelle, adresse, historique de conversation — signes qui sont tous reproductibles.",
    whyItWorks:
      "Nous n'authentifions presque jamais : nous reconnaissons. C'est une économie nécessaire, car vérifier chaque message serait impraticable, et elle fonctionne parce que la plupart des messages sont authentiques. L'attaquant ne casse rien : il fabrique les signes de la reconnaissance. Un nom d'expéditeur est un champ libre, un libellé de SMS se choisit, un numéro appelant se falsifie, une photo de profil se recopie. Le cas le plus difficile est celui où la confiance est réelle — un compte authentique compromis — car alors aucun signe n'est faux.",
    howToResist:
      "Faites porter la vérification sur le canal plutôt que sur le contenu : changez de chemin. Rappeler un numéro que vous possédiez déjà, ouvrir l'application officielle, utiliser un favori — ces gestes ne demandent aucune expertise et fonctionnent même quand le message est parfaitement imité.",
    counterQuestion:
      "Est-ce que je reconnais cette personne, ou seulement les signes qui la désignent ?",
  },
  {
    code: "social_pressure",
    slug: "pression-sociale",
    name: "La pression sociale",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "On vous met dans une situation où refuser paraît déplacé : ne pas aider un proche, faire attendre un supérieur, décevoir quelqu'un qui compte sur vous.",
    definition:
      "La pression sociale est l'utilisation d'un rapport interpersonnel — lien affectif, hiérarchie, réciprocité, regard d'un groupe — pour rendre le refus coûteux indépendamment du bien-fondé de la demande.",
    whyItWorks:
      "Le coût d'un refus est immédiat et se paie devant quelqu'un ; le coût d'une erreur est différé et abstrait. Entre les deux, nous choisissons presque toujours d'éviter le premier. Deux formes reviennent : la demande de discrétion, qui isole en interdisant d'en parler à la personne qui trancherait en dix secondes ; et le sentiment de dette, quand un service a été rendu d'abord. Le procédé ne vise pas la crédulité mais la politesse, ce qui explique qu'il fonctionne sur des personnes averties.",
    howToResist:
      "Faites entrer un tiers dans la boucle : c'est exactement ce que la demande cherche à empêcher, et c'est donc ce qui la neutralise. Une consigne de secret sur une demande d'argent ou d'accès est, à elle seule, un motif suffisant de vérifier.",
    counterQuestion:
      "Est-ce que j'accepte parce que c'est justifié, ou parce que refuser serait gênant ?",
  },
  {
    code: "reward",
    slug: "recompense",
    name: "La récompense",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "On vous annonce une bonne nouvelle : un remboursement, un gain, une offre. Une bonne nouvelle ne déclenche pas de méfiance — c'est tout son intérêt pour l'attaquant.",
    definition:
      "La récompense est l'annonce d'un gain — somme due, lot, avantage, opportunité — dont l'obtention exige une action de la victime.",
    whyItWorks:
      "Nous avons appris à nous méfier des menaces, beaucoup moins des cadeaux. Une annonce agréable n'active aucun signal d'alarme : on cherche à obtenir plutôt qu'à vérifier, et l'attention se porte sur la démarche à accomplir. La perspective d'un gain rend aussi acceptable ce qui serait autrement absurde — communiquer un numéro de carte complet pour *recevoir* de l'argent, par exemple, une incohérence que la bonne humeur laisse passer.",
    howToResist:
      "Appliquez au gain la même vérification qu'à une menace, et retenez une règle qui tranche presque tous les cas : recevoir de l'argent ne demande jamais d'en avancer, ni de fournir autre chose qu'un IBAN. Un remboursement réel figure dans votre espace officiel, où vous pouvez aller le constater.",
    counterQuestion:
      "Pourquoi cette démarche a-t-elle besoin de quelque chose de ma part si c'est moi qui reçois ?",
  },
  {
    code: "financial_incentive",
    slug: "appat-du-gain",
    name: "L'appât du gain",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "Une occasion financière trop belle, présentée comme réservée à ceux qui savent. Ce n'est pas la cupidité qui fait céder : c'est la peur de laisser passer.",
    definition:
      "L'appât du gain est la promesse d'un rendement, d'une remise ou d'un revenu disproportionné, entretenue dans la durée plutôt qu'obtenue en un seul message.",
    whyItWorks:
      "Là où la récompense est une bonne nouvelle ponctuelle, l'appât du gain s'installe : il construit une relation, montre des résultats, autorise parfois un petit retrait. Cette preuve apparente est le cœur du procédé, car elle transforme le doute en confiance et justifie des versements bien supérieurs. S'y ajoute l'engagement : une fois de l'argent placé, renoncer revient à acter une perte, ce que nous faisons très mal — et chaque nouveau versement se justifie par les précédents.",
    howToResist:
      "Vérifiez l'acteur avant le produit : les registres publics des sociétés autorisées à proposer des placements se consultent en quelques minutes, et cette vérification se fait avant le premier versement, pas après. Retenez qu'un rendement élevé garanti n'existe pas — rendement et risque sont indissociables — et qu'il ne faut jamais payer pour récupérer de l'argent.",
    counterQuestion:
      "Si c'est si rentable et sans risque, pourquoi a-t-on besoin de mon argent ?",
  },
  {
    code: "curiosity",
    slug: "curiosite",
    name: "La curiosité",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "Un fichier, un lien ou un objet trouvé dont on veut juste savoir ce qu'il contient. Regarder paraît sans risque — et c'est ce « juste regarder » qui suffit.",
    definition:
      "La curiosité est l'exploitation du besoin de lever une incertitude : un contenu dont la nature n'est pas connue avant d'avoir été ouvert.",
    whyItWorks:
      "Une information incomplète crée une tension que l'on cherche à résoudre, et l'ouverture paraît anodine parce qu'elle semble réversible : on peut refermer. C'est faux pour un fichier exécuté, un support branché ou un lien ouvert, où l'action a lieu à l'ouverture. Le procédé est d'autant plus efficace qu'il n'exige aucune histoire : ni urgence, ni autorité, ni relation — donc aucun des signaux d'alerte que l'on a appris à repérer.",
    howToResist:
      "Traitez « juste regarder » comme une action et non comme une observation. Un support de stockage trouvé se remet au service concerné plutôt qu'il ne s'examine ; un lien s'ouvre après avoir lu le domaine, pas avant ; un fichier inattendu se vérifie auprès de son expéditeur supposé, par un autre canal.",
    counterQuestion:
      "Qu'est-ce que ça me coûte de ne jamais savoir ce qu'il y avait dedans ?",
  },
  {
    code: "scarcity",
    slug: "rarete",
    name: "La rareté",
    editorialStatus: "published",
    updatedAt: "2026-09-02",
    plainLanguageDefinition:
      "Il ne reste que deux exemplaires, l'offre finit dans neuf minutes, le logement part demain. Une rareté annoncée n'a pas besoin d'être réelle pour fonctionner : il lui suffit d'être affichée, et elle sert à empêcher la comparaison.",
    definition:
      "La rareté est la limitation annoncée d'une quantité ou d'une durée, destinée à faire décider avant toute comparaison avec les alternatives disponibles.",
    whyItWorks:
      "Une chose disponible en petit nombre paraît plus désirable, et la crainte de laisser passer pèse plus lourd que l'espoir d'obtenir. Elle diffère de l'urgence par ce qu'elle empêche : l'urgence supprime le temps de vérifier la légitimité, la rareté supprime le temps de comparer les offres. Elle est aussi la plus banalisée — le commerce en ligne l'utilise licitement en permanence — ce qui la rend presque invisible là où elle est frauduleuse. Un marché réellement tendu, comme la location, en fournit une version gratuite dont l'attaquant n'a plus qu'à se servir.",
    howToResist:
      "Laissez expirer une fois pour voir : les décomptes fabriqués se réinitialisent, et une offre réelle réapparaît. Décidez sur les critères qui ne dépendent pas du temps — le vendeur est-il identifiable, le moyen de paiement est-il contestable — car ce sont les seuls que la pression ne déforme pas.",
    counterQuestion:
      "Est-ce que je choisis cette offre, ou est-ce que je fuis seulement l'idée de la rater ?",
  },
];

const bySlug = new Map(ALL_LEVERS.map((l) => [l.slug, l]));
const byCode = new Map(ALL_LEVERS.map((l) => [l.code, l]));

/** Structural faults that must stop the build rather than ship. */
export function auditLevers(levers: readonly LeverEntry[]): string[] {
  const problems: string[] = [];
  const seenSlugs = new Set<string>();
  const seenCodes = new Set<string>();

  for (const lever of levers) {
    if (seenSlugs.has(lever.slug)) problems.push(`slug de levier dupliqué : ${lever.slug}`);
    seenSlugs.add(lever.slug);
    if (seenCodes.has(lever.code)) problems.push(`code de levier dupliqué : ${lever.code}`);
    seenCodes.add(lever.code);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(lever.updatedAt)) {
      problems.push(`${lever.slug} : updatedAt doit être au format YYYY-MM-DD`);
    }
    if (!lever.counterQuestion.trim().endsWith("?")) {
      problems.push(`${lever.slug} : counterQuestion doit être une question`);
    }
  }
  problems.push(...auditLeverTranslations(levers, LEVERS_EN));
  return problems;
}

/** The English overlay: one per lever, real question, valid unique slugs, no statistic. */
export function auditLeverTranslations(
  levers: readonly LeverEntry[],
  translations: Readonly<Partial<Record<string, LeverTranslation>>>,
): string[] {
  const problems: string[] = [];
  const slugs = new Set<string>();
  for (const lever of levers) {
    const en = translations[lever.code];
    if (!en) continue;
    if (slugs.has(en.slug)) problems.push(`${lever.slug} (en) : slug anglais dupliqué « ${en.slug} »`);
    slugs.add(en.slug);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(en.slug)) problems.push(`${lever.slug} (en) : slug invalide « ${en.slug} »`);
    if (!en.counterQuestion.trim().endsWith("?")) problems.push(`${lever.slug} (en) : counterQuestion doit être une question`);
    const text = [en.name, en.plainLanguageDefinition, en.definition, en.whyItWorks, en.howToResist];
    if (text.some((t) => !t.trim())) problems.push(`${lever.slug} (en) : texte vide`);
    if (text.some((t) => /%/.test(t))) problems.push(`${lever.slug} (en) : pourcentage (aucune statistique sans source)`);
  }
  return problems;
}

const problems = auditLevers(ALL_LEVERS);
if (problems.length > 0) {
  throw new Error(`Catalogue de leviers invalide :\n  - ${problems.join("\n  - ")}`);
}

/** Fiches declaring this lever. Derived from `triggers`, never declared twice. */
export function attacksUsingLever(code: PsychologicalTriggerCode): AttackEntry[] {
  return listAttacks().filter((a) => a.triggers.includes(code));
}

export function isLeverPublishable(lever: LeverEntry): boolean {
  return (
    lever.editorialStatus === "published" &&
    attacksUsingLever(lever.code).length >= LEVER_PUBLICATION_THRESHOLD
  );
}

export function listLevers(): LeverEntry[] {
  return [...ALL_LEVERS].filter(isLeverPublishable);
}

/** Including the ones held back, for the audits and the editorial report. */
export function listAllLevers(): LeverEntry[] {
  return [...ALL_LEVERS];
}

export function findLeverBySlug(slug: string): LeverEntry | undefined {
  const lever = bySlug.get(slug);
  return lever && isLeverPublishable(lever) ? lever : undefined;
}

export function findLeverByCode(code: PsychologicalTriggerCode): LeverEntry | undefined {
  const lever = byCode.get(code);
  return lever && isLeverPublishable(lever) ? lever : undefined;
}

/** The levers a fiche declares, resolved to the ones that have a page. */
export function leversForAttack(attack: AttackEntry): LeverEntry[] {
  return attack.triggers
    .map((code) => findLeverByCode(code))
    .filter((l): l is LeverEntry => l !== undefined);
}

/** A lever as the English pages show it: the French entry's identity, the English text. */
export interface LocalizedLever extends LeverTranslation {
  code: LeverEntry["code"];
  frSlug: string;
  updatedAt: string;
}

export function getLocalizedLever(lever: LeverEntry): LocalizedLever | null {
  const en = LEVERS_EN[lever.code];
  return en ? { ...en, code: lever.code, frSlug: lever.slug, updatedAt: lever.updatedAt } : null;
}

/** Published levers that have an English version. */
export function listLeversEn(): LocalizedLever[] {
  return listLevers()
    .map(getLocalizedLever)
    .filter((l): l is LocalizedLever => l !== null);
}

export function findLeverByEnSlug(slug: string): LocalizedLever | undefined {
  return listLeversEn().find((l) => l.slug === slug);
}

/** English slug of a French lever, for hreflang. Null when untranslated or unpublished. */
export function englishLeverSlug(frSlug: string): string | null {
  const lever = findLeverBySlug(frSlug);
  return lever ? (getLocalizedLever(lever)?.slug ?? null) : null;
}

/** The levers an English fiche declares, resolved to the ones with an English page. */
export function leversForAttackEn(attack: AttackEntry): LocalizedLever[] {
  return leversForAttack(attack)
    .map(getLocalizedLever)
    .filter((l): l is LocalizedLever => l !== null);
}

/** English name of a lever code, published or not — for the plain badge of a lever without a page. */
export function englishLeverName(code: PsychologicalTriggerCode): string {
  return LEVERS_EN[code].name;
}
