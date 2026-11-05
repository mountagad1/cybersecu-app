# Générateur de mots de passe — rapport de revue

Date : 2026-10-24.

Périmètre : le générateur, c'est-à-dire :
- `src/domain/password/*` ;
- `src/lib/clipboard.ts` ;
- `src/components/tools/password-generator*.tsx` ;
- `src/content/tools/password-generator.ts` ;
- les deux pages ;
- les entrées de `src/content/tools/index.ts` et de `src/domain/seo/indexability.ts`.

État : implémenté et testé localement. **Non commité, non poussé, non déployé.**

Ce rapport ne revendique aucune certification. Les deux passes ont été faites dans cette session : la première par l'auteur, la seconde par un relecteur indépendant, en lecture seule et sans le contexte de conception.

Échelle de gravité :
- **P0** : rupture de sécurité ou de confidentialité ;
- **P1** : comportement faux ou trompeur ;
- **P2** : à corriger ;
- **P3** : détail.

## Passe 1 (auteur)

| # | Gr. | Constat | Correction |
|---|---|---|---|
| A1 | P2 | Une copie lente (attente d'une permission) suivie d'un nouveau tirage affichait « Copié » sous un mot de passe différent de celui qui était dans le presse-papiers. | Numéro de tirage capturé avant l'`await` ; le message est ignoré s'il est périmé. Test navigateur « slow copy then redraw ». |
| A2 | P3 | Avec plusieurs propositions, le message de copie ne disait pas laquelle avait été copiée. | « Proposition N copiée dans le presse-papiers. » |
| A3 | P1 (trouvé pendant l'écriture) | La liste EFF contient 4 mots à trait d'union (« t-shirt », « yo-yo »…). Avec « - » comme séparateur, une phrase se relirait de plusieurs façons, et n·log2(7776) serait surestimé. | « - » retiré des séparateurs. Le générateur refuse tout séparateur présent dans un mot. Testé. |
| A4 | P1 (trouvé pendant les tests) | `getRandomValues` refuse plus de 64 Kio par appel, ce qui faisait planter le grand tirage du test χ². | Tampon plafonné à 16 384 mots. Garde de 64 tours vides consécutifs. |
| A5 | P2 (lint) | Tirage dans un `useEffect` à chaque changement d'options, d'où des rendus en cascade. | Tirages déclenchés par les gestionnaires d'événements. Un seul tirage au montage, justifié en commentaire. |
| A6 | P2 | Le commentaire de `generate-password.ts` annonçait un taux d'acceptation minimal de 2,4 %. Valeur réelle : 43 %. | Commentaire corrigé, et un test vérifie le minimum sur toutes les combinaisons. |

## Passe 2 (relecteur indépendant)

Aucun P0 ni P1. Le relecteur a vérifié et jugé conformes les points suivants :
- source unique `crypto.getRandomValues`, qui échoue proprement en l'absence de l'API ;
- seuil de rejet correct, sans erreur d'une unité ;
- validation de l'alphabet ;
- inclusion–exclusion correcte ;
- entropie exacte, y compris pour les séparateurs, les majuscules et la remise ;
- aucune fuite par le réseau, le stockage, l'URL, les journaux ou l'analytics ;
- copie sur clic uniquement, sans faux succès ;
- aucun tirage au rendu serveur ;
- gestion des courses sur la liste de mots ;
- absence de revendication de garantie.

| # | Gr. | Constat | Suite donnée |
|---|---|---|---|
| R1 | P2 | Même constat que A1 (message de copie périmé). | Déjà corrigé en passe 1. |
| R2 | P2 | `<output>` a le rôle implicite `status`, donc une région live. Insérée à chaque tirage, elle pouvait faire lire le mot de passe à voix haute. Le test de sécurité imposait même `<output>`. | Remplacé par un `<span>`. Le test interdit désormais `<output>`. Contrôle navigateur : aucune région live ne contient la valeur. |
| R3 | P2 | Le texte disait « chaque caractère a exactement la même probabilité ». C'est faux quand chaque type est exigé : le rejet rend les **mots de passe** valides équiprobables, mais les petites classes apparaissent plus souvent à chaque position. | Reformulé en « chaque mot de passe possible a exactement la même probabilité » (FR et EN). |
| R4 | P3 | Annonce et message de validation à chaque frappe dans les champs numériques. | Validation passée de `role="alert"` à `aria-live="polite"`. L'annonce est désormais différée de 600 ms et remise à zéro à chaque tirage (2026-10-24, voir `docs/marketing-engineering/REVIEW_REPORT.md`). |
| R5 | P3 | Erreurs non reliées à leurs champs. | `aria-describedby` vers le message sur la longueur, les mots et le groupe des types. |
| R6 | P3 | « les 94 du clavier » est inexact : un clavier français a aussi é, è, à, ç… | « les 94 caractères ASCII imprimables (lettres sans accent, chiffres, symboles) ». |
| R7 | P3 | Les clés d'accès ne sont pas toujours « sur votre appareil » : elles peuvent être synchronisées. | « gardée par votre appareil ou votre gestionnaire de mots de passe ». |
| R8 | P3 | Un test du presse-papiers passait pour une mauvaise raison (paramètre par défaut). | Le test passe maintenant `null` explicitement. |
| R9 | P3 | Le test « rien au rendu serveur » ne détectait pas une génération dans `useState` ou dans le corps du rendu. | Nouveau `server-render.test.ts` (`renderToString` et espion sur `getRandomValues`). Une mutation qui génère au rendu le fait échouer (vérifié). |
| R10 | P3 | Aucun test de composant. | Couvert par le test navigateur (45 contrôles), sans test de composant en vitest : l'environnement du dépôt est `node`, sans jsdom. **Partiellement différé.** |
| R11 | P3 | Le titre « Propositions / Résultat » suivait le réglage plutôt que ce qui était affiché. | Il suit maintenant le résultat affiché. |

## Vérification des garde-fous statiques par mutation

Mutations introduites une à une, puis annulées :

| Mutation | Test qui a échoué |
|---|---|
| `Math.random()` dans `random.ts` | « never uses Math.random… » |
| `localStorage.setItem` après un tirage | « stores nothing in the browser » |
| `fetch()` après un tirage | « makes no network request » |
| `copyText()` automatique après un tirage | « only copies from a click » |
| génération dans l'initialiseur de `useState` | `server-render.test.ts` (FR et EN) |

## Tests exécutés (résultats réels)

| Contrôle | Résultat |
|---|---|
| `pnpm test` (vitest) | 51 fichiers, **696/696**, dont 54 sur le générateur (7 fichiers ; 642 avant) |
| `pnpm typecheck` | OK |
| `pnpm lint` | OK |
| `pnpm build` | OK ; `/outils/generateur-mot-de-passe` et `/en/tools/password-generator` sont statiques (○) |
| `pnpm seo:metadata` | 429 pages, **0 erreur**. Les 195 avertissements portent tous sur d'autres pages : aucun ne concerne les 2 nouvelles |
| `pnpm seo:images` | 0 anomalie |
| `pnpm seo:audit` | aucune incohérence |
| Gel EXP-020 | empreinte du HTML visible (scripts exclus) des **354** pages de fiches et de simulations, avant et après : **0 différence** |
| Test navigateur (Playwright + Chromium, `next start`, script hors dépôt) | **45/45** (détail ci-dessous) |
| axe-core 4.10.2 (WCAG 2.1 A/AA et bonnes pratiques) | 0 violation, en mode phrase de passe, FR à 360 px et EN à 360 px |

Contrôles navigateur :
- génération au chargement ;
- 4 types de caractères ;
- alphabet de 94 caractères affiché ;
- entropie affichée (130 bits par défaut) ;
- régénération sans rechargement ;
- changement de longueur ;
- longueur 7 et 129 refusées ;
- caractères ambigus exclus ;
- état vide sans type coché ;
- sous-ensemble de types respecté ;
- 3 propositions distinctes, avec la décote expliquée ;
- phrase de 6 mots EFF ;
- séparateur et majuscules ;
- 3 mots refusés ;
- liste chargée depuis le même domaine ;
- stockages vides, aucune base IndexedDB, aucun cookie ;
- URL et historique inchangés ;
- aucune requête vers une autre origine ;
- aucune des 11 valeurs générées dans une requête ;
- événements d'analytics sans valeur (`tool`, `locale`) ;
- aucune copie automatique ;
- copie exacte au clic ;
- `tool_complete` seulement après une copie réussie ;
- message effacé au nouveau tirage ;
- copie refusée, puis message d'échec ;
- API absente, puis message de copie manuelle ;
- copie lente suivie d'un nouveau tirage ;
- pas de Web Crypto, puis erreur sans mot de passe ;
- pas de défilement horizontal à 360 px ;
- bouton de 44 px ;
- page EN avec `lang="en"` ;
- copie au clavier ;
- aucune région live ne contient la valeur.

Au premier passage, 2 contrôles ont échoué à cause du script lui-même et non du produit :
- `history.length` était comparé à 1 alors que le point de départ vaut 2, à cause de `about:blank` ;
- le libellé du bouton était tronqué à 20 caractères.

Le script a été corrigé, puis relancé.

Poids : la liste de mots est un morceau JS séparé, chargé seulement en mode phrase de passe (63,8 Ko, soit 25,6 Ko compressé).

## Test en production (2026-10-26)

Le même script navigateur (Playwright, Chromium), avec les contrôles ajoutés depuis par la revue « engineering as marketing », a tourné contre `https://www.cybersecu.app`. Version servie : commit `2079908`, déploiement de production prêt. La vérification TLS est restée normale, via le proxy de la session.

- **Premier passage : 56/57.** Le contrôle « liste de mots chargée depuis le même domaine » attendait le chemin local `/_next/static/chunks/`. En production, Vercel sert `/_next/static/immutable/chunks/`. La liste EFF était bien chargée depuis `www.cybersecu.app`, avec une réponse 200 (vérifié séparément).
- **Après correction du motif dans le script : 57/57.**

Ce que couvrent ces 57 contrôles en production :
- génération et réglages ;
- états invalide et vide, absence de Web Crypto ;
- copie : refusée, absente, lente puis nouveau tirage ;
- aucune requête vers un autre domaine, et aucune des 11 valeurs générées dans une requête ;
- stockages vides, URL et historique inchangés ;
- événements sans valeur ;
- axe-core : 0 violation ;
- affichage à 360 px, et copie au clavier ;
- FAQPage identique à la FAQ visible ;
- liens depuis la checklist d'urgence (FR et EN) et depuis le plan de « J'ai cliqué ».

## Non testé

- Les vrais lecteurs d'écran (NVDA, VoiceOver, TalkBack) : seul axe-core a été exécuté.
- Firefox et Safari : seul Chromium a été testé, en local et en production.
- Le comportement de l'historique du presse-papiers du système.

## Différé

- **R10** : des tests de composant vitest, qui demandent jsdom et donc une nouvelle dépendance de développement.
- Une option pour masquer la valeur, contre le regard par-dessus l'épaule.
- Une liste de mots française vérifiée et sous licence claire.
- Le rattachement de l'outil **depuis** les fiches (`relatedAttackCodes`) après le 2026-11-24 (gel EXP-020).
- L'intégration du test navigateur en CI (Playwright n'est pas une dépendance du dépôt).

## Bloqué

- Commit, push et PR : la mission les interdit sans autorisation explicite du propriétaire.
