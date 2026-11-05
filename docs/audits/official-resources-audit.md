# Audit des dispositifs officiels, signalements et recours — 2026-10-08

**Nature de l'audit :** audit documentaire. **Ce n'est pas une validation
juridique professionnelle.**

**Limite principale :** toutes les sources primaires étaient **inaccessibles**
depuis l'environnement de travail (§1). Aucun statut CONFIRMÉ n'est donc
attribué. Les corrections appliquées se limitent à celles qui **réduisent** le
risque d'erreur sans affirmer de fait nouveau :
- retirer une consigne obsolète ou non sourcée ;
- séparer l'urgence de l'écoute et de l'orientation ;
- resserrer une formulation trop large.

Aucun numéro, aucun lien et aucune sanction non vérifiés n'ont été ajoutés.

Le rapport précédent `docs/content/SOURCE_REVIEW_2026-10.md` est intégré et
complété ici.

---

## 1. Accès aux sources primaires

Tests du 2026-10-08, avec `curl` (proxy de l'environnement) puis avec l'outil
de lecture de pages web.

| Source | Résultat |
| --- | --- |
| legifrance.gouv.fr | INACCESSIBLE — proxy : `CONNECT tunnel failed, response 403` ; lecteur : `getaddrinfo ENOTFOUND` |
| service-public.fr / service-public.gouv.fr | INACCESSIBLE — 403 / ENOTFOUND |
| cybermalveillance.gouv.fr | INACCESSIBLE — 403 / ENOTFOUND |
| cnil.fr | INACCESSIBLE — 403 |
| police-nationale.interieur.gouv.fr, interieur.gouv.fr | INACCESSIBLE — 403 |
| 33700.fr | INACCESSIBLE — 403 |
| signal-spam.fr | INACCESSIBLE — 403 |
| internet-signalement.gouv.fr, 17cyber.gouv.fr, 3018.fr, arretonslesviolences.gouv.fr, bloctel.gouv.fr, economie.gouv.fr, info.urgence114.fr | INACCESSIBLE — 403 |
| unicode.org | INACCESSIBLE |

Le refus 403 vient de la **politique réseau de l'environnement**, pas des
sites. Il ne prouve pas qu'un service n'existe pas. La politique réseau n'a
pas été modifiée (consigne de la mission).

Seule la **recherche web** répondait. Elle renvoie des extraits de résultats,
parfois issus de domaines officiels (cnil.fr, justice.fr,
gendarmerie.interieur.gouv.fr, legifrance.gouv.fr). Ces extraits ont servi à
**orienter** les décisions. Ils ne valent pas consultation de la page.

## 2. Inventaire

Date de consultation : 2026-10-08 pour toutes les lignes. « Indices » désigne
ce que disent les résultats de recherche (sources secondaires ou extraits),
sans consultation de la page.

### A. Affirmations présentes sur le site

| # | Affirmation initiale | Où | Statut | Indices | Action |
| --- | --- | --- | --- | --- | --- |
| A1 | Transférer un SMS frauduleux au 33700 | smishing, faux-livreur-colis, sms-surtaxe (FR, EN) ; `/outils/checklist-urgence` ; `src/content/guides/index.ts` ; `/sources` | INACCESSIBLE | Concordants (extraits CNIL et DGCCRF) : plateforme de signalement des SMS et appels frauduleux ; pour un appel, signalement par SMS « spam vocal » suivi du numéro ; ne concerne pas le démarchage légal. | Aucune |
| A2 | « 33700 (service gratuit) » | `/sources` | **CORRIGÉ** | Un extrait CNIL indique la gratuité chez certains opérateurs seulement ; d'autres sources disent « gratuit ». Coût non établi. | Mention du coût retirée. FR : « transférez le SMS suspect au 33700. » Page sans version EN. |
| A3 | « le 17, ou le 114 par SMS » en cas de danger immédiat | stalkerware (2 endroits, FR + EN) | **CORRIGÉ** | Concordants (AP-HP, informations handicap, annonce 2020) : le 114 est l'accès aux urgences par écrit, pour les personnes qui ne peuvent pas entendre ou parler. SMS ouvert en 2020 aux victimes de violences intrafamiliales. Ce n'est pas un numéro de signalement. | FR : « …ou envoyez un SMS au 114 si vous ne pouvez pas parler. » EN : « …or text 114 if you can't speak. » |
| A4 | Article 226-8 du code pénal | non cité sur le site | INACCESSIBLE | Selon les commentaires, modifié par la loi SREN (contenus générés par traitement algorithmique). | Aucune, rien à corriger |
| A5 | Diffusion d'images intimes fabriquées réprimée | detournement-de-photos-par-ia (FR, EN) | INACCESSIBLE | Concordants : l'article 226-8-1, créé par la loi n° 2024-449, vise les hypertrucages **à caractère sexuel** diffusés sans consentement. La fiche ne parle que de contenus intimes, ce qui reste dans ce périmètre. | Aucune ; article à citer après vérification |
| A6 | Loi n° 2024-449 (SREN) | non citée | INACCESSIBLE | Voir A4 et A5. | Aucune |
| A7 | 3919 pour les violences faites aux femmes | stalkerware (FR, EN) | INACCESSIBLE | Concordants : écoute, information et orientation des femmes victimes de violences et de leur entourage. **Pas un numéro d'urgence.** Horaires divergents selon les sources : non affichés. | Aucune, formulation cohérente |
| A8 | « Contactez le 3919 ou les forces de l'ordre » face à un traceur, si l'on craint pour sa sécurité | tracage-par-balise, grille (FR, EN) | **CORRIGÉ** | Le 3919 n'est pas un numéro d'urgence (A7). | L'urgence passe d'abord. FR : « En cas de danger immédiat, appelez le 17. Le 3919 écoute et oriente les femmes victimes de violences. » EN équivalent. |
| A9 | « violences, où ce type de traçage s'inscrit le plus souvent » | tracage-par-balise, « Si c'est déjà arrivé » (FR, EN) | **RETIRÉ** | Affirmation de fréquence sans source (interdit par le standard éditorial). | FR : « Si ce traçage s'inscrit dans des violences conjugales, le 3919 écoute et oriente les femmes qui en sont victimes. » EN équivalent. |
| A10 | Composer le 17 en cas de menace directe ou de danger immédiat | doxxing, stalkerware, tracage-par-balise | INACCESSIBLE | Le 17 est Police-secours ; les sources sur PHAROS orientent aussi vers le 17 en cas d'urgence. | Aucune |
| A11 | Saisir la CNIL après une demande restée sans réponse | fuite-de-donnees, moissonnage-de-donnees, reidentification, revente-de-donnees-personnelles, tracage-publicitaire-abusif (FR, EN) ; `/sources` ; `/confidentialite` | INACCESSIBLE | Extraits cnil.fr : s'adresser d'abord à l'organisme ou à son délégué à la protection des données, puis à la CNIL faute de réponse dans le délai d'un mois. Les fiches ne citent pas de délai. | Aucune, formulation cohérente |
| A12 | « Inscrivez-vous sur la liste d'opposition au démarchage téléphonique » | revente-de-donnees-personnelles : « Que faire », habitude de prévention, FAQ (FR, EN) | **RETIRÉ** | Concordants (CCI, cabinets d'avocats, presse) : depuis le 11 août 2026, en application de la loi n° 2025-594 du 30 juin 2025 (article L223-1 du code de la consommation), le démarchage suppose le consentement préalable et **Bloctel disparaît**. | Consigne retirée en FR et en EN, remplacée par le droit de refuser l'usage commercial de ses coordonnées et un rappel : les règles du démarchage ne protègent pas des appels frauduleux. Le nouveau régime n'est **pas** décrit tant que le texte n'est pas vérifié. |
| A13 | PHAROS : « signalement des contenus et comportements illicites rencontrés en ligne » | `/sources` | **CORRIGÉ** | Concordants (justice.fr, guide académique) : contenus accessibles publiquement ; ni plainte ni urgence. Les urgences relèvent du 17. | FR : « …illicites publiés en ligne. Un signalement n'est ni un dépôt de plainte ni un appel d'urgence : en cas de danger immédiat, appelez le 17. » |
| A14 | 3018 pour les victimes de harcèlement en ligne, avec retraits auprès des plateformes | cyberharcelement, raid-de-harcelement, diffusion-non-consentie-d-images, detournement-de-photos-par-ia, sextorsion (FR, EN) | **NON VÉRIFIÉ** | Contradictoires sur le **public adulte**. Le service est opéré par e-Enfance, signaleur de confiance auprès des plateformes. Certaines sources le réservent aux mineurs et à leurs parents ; d'autres, dont la page d'aide e-Enfance, l'ouvrent à tous. | Aucune. Priorité de vérification n° 1 (`remaining-verification.md`). |
| A15 | « La publication de données personnelles à des fins de nuisance est réprimée » | doxxing (FR, EN) | **NON VÉRIFIÉ**, formulation resserrée | Concordants (commentaires juridiques citant l'article 223-1-1) : l'infraction vise la diffusion d'informations permettant d'**identifier ou localiser** une personne **pour l'exposer à un risque** d'atteinte à sa personne ou à ses biens. « À des fins de nuisance » était plus large que le texte. | FR : « la loi française réprime la diffusion d'informations permettant d'identifier ou de localiser une personne dans le but de l'exposer à un danger ». EN équivalent. Article non cité tant qu'il n'est pas vérifié. |
| A16 | Harcèlement : répétition par plusieurs auteurs (« raid ») | cyberharcelement, raid-de-harcelement (FR, EN) | INACCESSIBLE | Un extrait legifrance.gouv.fr (article 222-33-2-2, version en vigueur depuis le 23/03/2024) prévoit les auteurs agissant de concert ou successivement en sachant constituer une répétition. Cohérent. | Aucune |
| A17 | Diffusion d'images intimes sans consentement réprimée, y compris entre anciens partenaires | diffusion-non-consentie-d-images, sextorsion (FR, EN) | INACCESSIBLE | Concordants : article 226-2-1, contenus obtenus avec le consentement puis diffusés sans accord. Montant de la peine discordant selon les sources : aucune peine n'est affichée sur le site. | Aucune |
| A18 | La sextorsion est une infraction ; régime spécifique pour les mineurs | sextorsion (FR, EN) | INACCESSIBLE | Une source évoque un alourdissement par la loi SREN, non vérifié. | Aucune |
| A19 | Faux signalement provoquant l'intervention des secours : infraction | swatting (FR, EN) | INACCESSIBLE | Non recherché en détail. | Aucune |
| A20 | Usurpation d'identité numérique : infraction | usurpation-de-profil-sur-les-reseaux-sociaux (FR, EN) | INACCESSIBLE | Non recherché en détail. | Aucune |
| A21 | Surveillance d'un conjoint sans consentement : infraction | stalkerware (FR, EN) | INACCESSIBLE | Non recherché en détail. | Aucune |
| A22 | Lien `cybermalveillance.gouv.fr/` | 81 fiches (FR, EN) ; `/sources` | INACCESSIBLE | Site actif, communiqués de 2025. | Aucune |
| A23 | Lien `…/menaces/hameconnage-phishing` | 16 fiches | INACCESSIBLE | Page non retrouvée telle quelle dans les résultats. | Aucune |
| A24 | Lien `…/menaces/faux-support-technique-arnaque` | 5 fiches | INACCESSIBLE | **Écart possible :** une infographie officielle renvoie à `…/fiches-reflexes/arnaques-au-faux-support-technique`. | Priorité de vérification n° 2 |
| A25 | Lien `unicode.org/reports/tr36/` | homoglyphes | INACCESSIBLE | Dernière révision trouvée ancienne ; UTS #39 en est le document normatif associé. | Aucune |
| A26 | Lien `internet-signalement.gouv.fr` | `/sources` | INACCESSIBLE | Concordants : adresse du portail officiel. | Aucune |
| A27 | Lien `cnil.fr` | `/sources`, `/confidentialite` | INACCESSIBLE | — | Aucune |

### B. Dispositifs officiels absents du site

Aucun n'a été ajouté : la mission interdit d'afficher un numéro, une URL, un
horaire ou un tarif non validé.

| # | Dispositif | Statut | Indices | Scénarios pertinents, si confirmé |
| --- | --- | --- | --- | --- |
| B1 | 17Cyber (`17cyber.gouv.fr`) | INACCESSIBLE | Concordants, dont gendarmerie.interieur.gouv.fr et service-public.gouv.fr : diagnostic en ligne gratuit, 24h/24, porté par la police, la gendarmerie et Cybermalveillance.gouv.fr ; échange avec un policier ou un gendarme si l'incident est grave. | Les fiches qui disent « signalez sur cybermalveillance.gouv.fr ». La consigne reste juste. |
| B2 | Signal Spam | INACCESSIBLE | Recommandé par Cybermalveillance pour les courriels indésirables. | phishing, hameconnage-genere-par-ia |
| B3 | Pré-plainte en ligne | NON VÉRIFIÉ | Selon les sources, remplacée depuis le 15/10/2024 par la **Plainte en ligne** (atteintes aux biens, auteur inconnu, majeurs), avec **THESEE** pour certaines escroqueries sur internet et **Perceval** pour la fraude à la carte bancaire. Le site ne mentionne pas la pré-plainte. | Fraudes en ligne, à distinguer du signalement |
| B4 | 116 006 (France Victimes) | INACCESSIBLE | Extrait justice.fr (mis à jour le 15/10/2025) : gratuit, 7 jours sur 7 ; horaires discordants selon les sources. | Accompagnement des victimes de toute infraction |
| B5 | Info Escroqueries 0 805 805 817 | INACCESSIBLE | Extraits CNIL et justice.fr : gratuit depuis la France, lundi–vendredi 9 h–18 h 30. | Fraudes financières |
| B6 | Plainte en ligne, THESEE, Perceval (découverts) | NON VÉRIFIÉ | Voir B3. | Selon le cas |

## 3. Bilan des statuts

| Statut | Nombre | Éléments |
| --- | ---: | --- |
| CONFIRMÉ | 0 | Aucune source primaire consultable |
| CORRIGÉ | 4 | A2, A3, A8, A13 |
| RETIRÉ | 2 | A9, A12 |
| NON VÉRIFIÉ | 4 | A14, A15 (formulation resserrée), B3, B6 |
| INACCESSIBLE | 23 | A1, A4–A7, A10, A11, A16–A27, B1, B2, B4, B5 |
| **Total** | **33** | 27 affirmations du site, 6 dispositifs à évaluer |

## 4. Décisions de méthode

- **Pas de date de révision avancée.** Aucune fiche n'a été validée sur une
  source primaire.
- **Pas de nouvelle ressource.** 17Cyber, Signal Spam, 116 006, Info
  Escroqueries, Plainte en ligne et THESEE attendent une vérification sur
  leur page officielle.
- **Pas de peine affichée.** Le site n'en affichait aucune, et les sources
  secondaires divergent sur plusieurs montants.
- **Version anglaise :** les dispositifs français restent français et sont
  situés (« 17 in France », « 3919 in France »). Aucun service étranger
  n'est présenté comme équivalent.
- **Non-régression :** `src/content/attacks/official-resources.test.ts` fixe
  trois points :
  - aucune consigne d'inscription à une liste d'opposition ;
  - le 114 seulement sur la fiche stalkerware, toujours avec sa condition ;
  - aucun tarif affiché pour le 33700.
