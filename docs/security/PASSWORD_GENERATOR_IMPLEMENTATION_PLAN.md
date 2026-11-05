# Générateur de mots de passe — plan d'implémentation

Statut : **implémenté localement, non commité, non déployé** (voir §9).
Rédigé le 2026-10-24 à partir de la lecture du dépôt (branche
`claude/cybersecu-app-architecture-pza80u`, commit `acecbe5`).

## 1. Ce que le dépôt impose (constats)

| Constat | Où | Conséquence pour l'outil |
|---|---|---|
| Next 16.3.2, App Router, deux layouts racines (FR `(marketing)`, EN `en/`) | `src/app` | une page FR et sa jumelle EN |
| Chaque outil = une entrée `ToolEntry` + un dossier de route ; `outils/[slug]` ne sert que les checklists (`dynamicParams = false`) | `src/content/tools/index.ts`, `src/app/(marketing)/outils/[slug]/page.tsx` | un dossier `generateur-mot-de-passe` n'entre pas en conflit |
| Sitemap = projection de `buildUrlRegistry()` ; paires FR↔EN dérivées de `listTools()` | `src/domain/seo/indexability.ts`, `counterparts.ts` | 2 entrées de registre à ajouter, la paire se fait seule |
| `relatedAttackCodes` d'un outil fait apparaître l'outil **sur les fiches** (`toolsForAttack`) | `src/content/tools/index.ts` | **gel EXP-020** (fiches/simulations jusqu'au 2026-11-24) : `relatedAttackCodes: []`, liens vers les fiches posés depuis la page de l'outil seulement |
| `relatedGuideSlugs` fait apparaître l'outil sur les guides (non gelés) | idem | rattachement aux 3 guides mots de passe |
| Analytics : pas de fournisseur chargé ; `trackEvent` n'accepte que des codes | `src/lib/analytics.ts`, `use-tool-tracking.ts` | réutiliser `tool_start` / `tool_complete` (slug + langue), rien d'autre |
| Aucun suivi d'erreurs tiers ; l'error boundary ne journalise que le `digest` | `src/app/(marketing)/error.tsx` | les erreurs du générateur ne doivent jamais contenir de mot de passe |
| Vitest en environnement `node`, fichiers `*.test.ts` uniquement | `vitest.config.ts` | logique pure testée en unitaire ; l'interface testée dans un vrai navigateur (Playwright, §7) |
| Ligne éditoriale du site : « l'unicité protège, pas la complexité » | guide `comment-un-mot-de-passe-est-vole` | le contenu de la page doit rester cohérent : un générateur sert d'abord à avoir **un mot de passe différent par compte** |

## 2. Routes

- FR : `/outils/generateur-mot-de-passe` — EN : `/en/tools/password-generator`.
- `force-static` ; aucune lecture de `searchParams` ; aucune option ni résultat dans l'URL.
- Le HTML statique ne contient **aucun** mot de passe : la génération n'a lieu
  qu'après montage, dans le navigateur. Un mot de passe produit au build serait
  le même pour tous les visiteurs et resterait en cache CDN.

## 3. Modules

| Module | Rôle | Dépend de |
|---|---|---|
| `src/domain/password/random.ts` | entier uniforme dans `[0, n)` par rejet, à partir de `crypto.getRandomValues` ; source injectable pour les tests ; **aucun repli** si l'API manque | Web Crypto |
| `src/domain/password/alphabet.ts` | classes (minuscules, majuscules, chiffres, symboles), caractères ambigus, construction et validation de l'alphabet | — |
| `src/domain/password/generate-password.ts` | mot de passe de longueur L ; option « au moins un de chaque classe » par **rejet du mot entier** (uniforme sur l'ensemble des mots valides) | random, alphabet |
| `src/domain/password/passphrase.ts` | n mots tirés uniformément, avec remise, dans la liste EFF ; séparateur non vide | random, wordlist |
| `src/domain/password/eff-large-wordlist.ts` | liste EFF « large » (7 776 mots), source et licence en en-tête | — |
| `src/domain/password/entropy.ts` | entropie exacte : `L·log2(A)`, ou `log2(N)` par inclusion–exclusion quand chaque classe est exigée ; `n·log2(7776)` pour une phrase | — |
| `src/domain/password/options.ts` | bornes, valeurs par défaut, validation des options → état `invalid` explicite | alphabet |
| `src/lib/clipboard.ts` | copie sur action explicite ; renvoie `copied` / `unavailable` / `failed`, jamais un faux succès | Clipboard API |
| `src/components/tools/password-generator.tsx` | interface (client) : réglages, candidats, copie, états | les modules ci-dessus |
| `src/content/tools/password-generator.ts` | textes pédagogiques FR/EN, rendus côté serveur | — |
| pages FR/EN | métadonnées, contenu, liens internes | content, component |

## 4. Choix cryptographiques

- **Source** : `crypto.getRandomValues(Uint32Array)` uniquement. Si `globalThis.crypto.getRandomValues` est absent, l'outil passe en état d'erreur ; pas de `Math.random`, pas d'horodatage, pas de compteur.
- **Uniformité** : rejet des tirages `x ≥ 2³² − (2³² mod n)`, puis `x mod n`. Probabilité de rejet < n / 2³² (négligeable pour n ≤ 7 776).
- **« Au moins un caractère de chaque classe »** : on tire le mot entier uniformément sur l'alphabet et on le **rejette** s'il manque une classe. Le résultat est uniforme sur l'ensemble des mots valides ; l'insertion forcée d'un caractère par classe puis un mélange donnerait une distribution non uniforme. Plafond de 10 000 essais : au-delà, erreur (jamais un mot biaisé). Avec les bornes retenues (L ≥ nombre de classes, L ≥ 8), la probabilité d'acceptation la plus faible est calculée et testée (§7).
- **Entropie** : affichée seulement quand ses hypothèses tiennent (tirage uniforme, mot utilisé tel quel). Exacte par inclusion–exclusion en `BigInt` quand chaque classe est exigée, ce qui la rend inférieure à `L·log2(A)`, jamais supérieure. Pas de jauge « faible / fort », pas de « temps pour craquer ».
- **Phrase de passe** : séparateur non vide imposé (le découpage reste unique, donc `n·log2(7776)` reste exact) ; la majuscule initiale est une transformation déterministe qui n'ajoute pas d'entropie, et l'interface le dit.

## 5. Bornes et défauts

| Réglage | Min | Max | Défaut |
|---|---|---|---|
| Longueur (caractères) | 8 | 128 | 20 |
| Mots | 4 | 12 | 6 |
| Candidats | 1 | 5 | 1 |
| Classes | ≥ 1 cochée | 4 | toutes |

Caractères ambigus exclus en option : `0 O o 1 l I |` et, pour les symboles, les guillemets et l'accent grave.

## 6. Vie privée (résumé, détail dans le modèle de menace)

- Aucun `fetch`, aucun `XMLHttpRequest`, aucun `sendBeacon` dans les modules et le composant.
- Aucun stockage navigateur.
- Analytics : `tool_start`, puis `tool_complete`, avec le slug et la langue. Aucun réglage, aucune longueur, aucun mot.
- Annonces lecteur d'écran : « Nouveau mot de passe généré », sans le lire à voix haute.
- `translate="no"` sur les résultats : une extension de traduction n'envoie pas le mot de passe à un service tiers.
- Résultats affichés dans un simple `<span>` : pas d'`<input>`, que le navigateur ou un gestionnaire pourraient enregistrer ou soumettre, ni d'`<output>`, dont le rôle implicite « status » est une région live qui pourrait lire la valeur à voix haute (constat de la revue, passe 2).

## 7. Tests prévus

- **Unitaires (vitest)** :
  - rejet et uniformité, avec une source simulée et un test du χ² sur la vraie source ;
  - alphabet et caractères ambigus ;
  - contrainte des classes ;
  - entropie, comparée à un dénombrement exhaustif sur de petits cas ;
  - liste de mots : 7 776 mots, uniques, en minuscules, avec l'empreinte SHA-256 de la source ;
  - validation des options ;
  - presse-papiers : succès, refus, absence.
- **Sécurité (vitest, analyse statique du code source)** :
  - aucun `Math.random`, `fetch`, `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, `sendBeacon`, `console.*`, `useSearchParams` ni `router.push` dans les fichiers du générateur ;
  - les types d'analytics n'acceptent aucun champ libre.
- **SEO (vitest et scripts existants)** :
  - entrées du registre, paire FR↔EN, liens internes vers des routes existantes ;
  - `pnpm seo:metadata` et `pnpm seo:images` sur le build.
- **Intégration (Playwright sur `next start`, script hors dépôt)** :
  - génération au chargement ;
  - régénération, changement de mode, états invalides ;
  - copie : accordée, refusée, absente ;
  - aucune requête réseau contenant le mot de passe ;
  - stockage vide ;
  - URL inchangée ;
  - axe-core, mobile à 360 px.
- **Non-régression du gel** : empreinte du HTML des 354 pages de fiches et de simulations, avant et après.

## 8. Hors périmètre ou différé

- Rattachement **depuis** les fiches (`relatedAttackCodes`) : différé après le 2026-11-24 (gel EXP-020).
- Liste de mots française : aucune liste vérifiée et sous licence n'est disponible dans le dépôt. La liste EFF (anglaise, CC BY 3.0 US) est utilisée dans les deux langues, et la page le dit.
- Image Open Graph dédiée : non. Les images par langue existantes suffisent ; aucune n'apporterait d'information.
- Test de bout en bout en CI : le dépôt n'a pas Playwright en dépendance. Le script reste hors dépôt et ses résultats figurent dans le rapport de revue.

## 9. Suivi

| Étape | État |
|---|---|
| Découverte | fait |
| Implémentation | fait, 2 passes de revue, voir `PASSWORD_GENERATOR_REVIEW_REPORT.md` |
| Tests | vitest 696/696, navigateur 45/45, lint, typage, build, seo:metadata, seo:images, seo:audit |
| Commit / push | **non fait** : la mission l'interdit sans autorisation explicite |
