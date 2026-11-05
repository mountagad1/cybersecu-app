import type { VoiceScenarioDefinition } from "@/domain/voice/types";

/**
 * Voice variant of the text simulation at the same attack
 * (`src/content/simulations/ingenierie-sociale.ts`,
 * slug `appel-conseiller-bancaire`). Not a duplicate
 * (docs/decisions/0008, brief §2): the text version tests whether a
 * visitor recognises the *pattern* from a description; this one tests
 * whether they hold their ground while someone keeps talking, interrupts
 * their hesitation, and adapts when the first request is refused — which
 * a multiple-choice question cannot exercise.
 *
 * NOT ACTIVATED: `dograhWorkflowId` and `dograhEmbedToken` are both
 * `null`. No Dograh account exists for this project yet. See
 * docs/DOGRAH_INTEGRATION.md §4 for the sync step that fills these in.
 */
export const FAUX_CONSEILLER_BANCAIRE_VOICE: VoiceScenarioDefinition = {
  slug: "voix-faux-conseiller-bancaire",
  attackCode: "SOCIAL-000001",
  name: "Appel — faux conseiller bancaire",
  targetProfile: "general",
  impersonatedEntity: "Banque Fictive",
  triggers: ["urgency", "authority", "fear"],
  attackerObjective: "identifiants",
  teaser: "Un appel du « service fraude » de votre banque. Tenez-vous-y — au téléphone, sous pression.",
  stages: [
    {
      id: "greeting",
      kind: "greeting",
      allowInterrupt: true,
      prompt:
        "Vous êtes un agent qui se fait passer pour un conseiller du service fraude de « Banque Fictive ». " +
        "Ouvrez de façon professionnelle et rassurante : saluez, donnez un prénom, dites que vous appelez au sujet d'une " +
        "opération suspecte détectée sur le compte. Ne demandez rien de sensible à ce stade — l'objectif de ce nœud est " +
        "seulement d'établir la confiance et le cadre de l'appel.",
      transitions: {
        "claimed-identity": "Le début de l'appel est terminé et l'interlocuteur a écouté la mise en situation",
      },
    },
    {
      id: "claimed-identity",
      kind: "claimed_identity",
      allowInterrupt: true,
      prompt:
        "Renforcez votre crédibilité : mentionnez que vous appelez depuis le service fraude, citez un numéro de dossier " +
        "plausible mais fictif. Si l'interlocuteur demande comment vérifier votre identité, restez courtois mais éludez — " +
        "ne raccrochez jamais vous-même et ne validez jamais explicitement une méthode de vérification indépendante.",
      transitions: {
        problem: "L'interlocuteur accepte de continuer la conversation",
        conclusion: "L'interlocuteur annonce qu'il va raccrocher et vérifier par ses propres moyens",
      },
    },
    {
      id: "problem",
      kind: "problem",
      allowInterrupt: true,
      prompt:
        "Décrivez une opération suspecte précise et plausible : un virement ou un paiement d'un montant marquant vers un " +
        "bénéficiaire inconnu, en cours de traitement. Le ton reste calme mais sérieux — le but est de faire naître " +
        "l'inquiétude, pas la panique, à ce stade.",
      transitions: {
        urgency: "L'interlocuteur réagit et demande ce qu'il faut faire",
        conclusion: "L'interlocuteur reste sceptique et annonce qu'il va raccrocher",
      },
    },
    {
      id: "urgency",
      kind: "urgency",
      allowInterrupt: true,
      prompt:
        "Insistez sur l'urgence : l'opération sera validée dans quelques minutes si rien n'est fait. Pressez doucement, " +
        "sans devenir agressif. Si l'interlocuteur propose de rappeler la banque lui-même, dites que ce n'est plus " +
        "nécessaire puisque vous l'avez déjà en ligne — sans jamais l'empêcher explicitement de raccrocher.",
      transitions: {
        request: "L'interlocuteur demande comment bloquer l'opération",
        conclusion: "L'interlocuteur refuse de continuer et annonce qu'il va vérifier par lui-même",
      },
    },
    {
      id: "request",
      kind: "request",
      allowInterrupt: true,
      prompt:
        "Demandez le code de validation à six chiffres reçu par SMS, en le présentant comme nécessaire pour « annuler » " +
        "l'opération plutôt que pour l'autoriser. C'est le cœur du scénario : ne renoncez pas à la première hésitation, " +
        "mais n'insultez ni ne menacez jamais l'interlocuteur.",
      transitions: {
        adapt: "L'interlocuteur hésite, pose une question, ou refuse une première fois",
        conclusion: "L'interlocuteur donne une réponse claire, dans un sens ou dans l'autre",
      },
    },
    {
      id: "adapt",
      kind: "adapt",
      allowInterrupt: true,
      prompt:
        "L'interlocuteur a hésité ou posé une question. Adaptez-vous une seule fois : reformulez la demande de code, " +
        "avec un argument différent (par exemple, dites que le blocage manuel prend plus de temps et n'est pas garanti). " +
        "Après cette relance, quelle que soit la réponse, orientez la conversation vers sa conclusion.",
      transitions: {
        conclusion: "Une réponse claire a été obtenue, ou l'interlocuteur met fin à l'échange",
      },
    },
    {
      id: "conclusion",
      kind: "conclusion",
      allowInterrupt: false,
      prompt:
        "Terminez l'appel de façon neutre, sans jamais révéler qu'il s'agissait d'une simulation à l'intérieur de la " +
        "conversation elle-même — cette révélation et l'explication pédagogique ont lieu après l'appel, côté site, pas " +
        "dans la bouche du personnage.",
      transitions: {},
    },
  ],
  signals: [
    {
      name: "revealed_otp",
      type: "boolean",
      prompt:
        "true si, à un moment de l'appel, l'interlocuteur a communiqué ou commencé à communiquer le code de " +
        "vérification à six chiffres ; false sinon.",
      mistakePattern: "SHARED_MFA_CODE",
      safeValue: false,
    },
    {
      name: "verified_caller_independently",
      type: "boolean",
      prompt:
        "true si l'interlocuteur a proposé ou effectué une vérification indépendante — raccrocher pour rappeler le " +
        "numéro au dos de la carte, par exemple — à un moment de l'appel ; false sinon.",
      mistakePattern: "FAILED_TO_VERIFY_INDEPENDENTLY",
      safeValue: true,
    },
    {
      name: "trusted_claimed_authority",
      type: "boolean",
      prompt:
        "true si l'interlocuteur a explicitement accepté l'identité revendiquée par l'appelant sans jamais la " +
        "questionner ni proposer de vérification ; false s'il l'a mise en doute à un moment ou un autre.",
      mistakePattern: "TRUSTED_AUTHORITY",
      safeValue: false,
    },
  ],
  dograhWorkflowId: null,
  dograhEmbedToken: null,
};
