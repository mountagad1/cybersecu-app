# Générateur de mots de passe — modèle de menace

Périmètre :
- `/outils/generateur-mot-de-passe` et `/en/tools/password-generator` ;
- le code de `src/domain/password/`, `src/lib/clipboard.ts` et `src/components/tools/password-generator*.tsx`.

Date : 2026-10-24. État : implémenté localement, non déployé.

Ce document ne revendique ni certification ni garantie. Il dit ce que le code fait, ce qui le vérifie, et ce qui reste hors de portée de l'outil.

## 1. Actifs

| Actif | Sensibilité |
|---|---|
| Le mot de passe ou la phrase de passe générés | **critique** : ils donneront accès à un compte |
| Les réglages : longueur, classes, nombre de mots | faible, mais ils réduisent l'espace de recherche si on les associe à une fuite. Ils sont traités comme sensibles et ne sont jamais transmis |
| Le fait qu'un visiteur ait utilisé l'outil | faible : seul ce fait est mesuré, par un code |

## 2. Frontières de confiance

```
[ serveur / CDN ] --HTML statique sans mot de passe--> [ navigateur : page + JS du site ]
                                                         │  crypto.getRandomValues (OS)
                                                         ▼
                                              mot de passe en mémoire (état React)
                                                         │ clic « Copier » seulement
                                                         ▼
                                                  presse-papiers du système
```

Le mot de passe n'existe qu'à droite de la première flèche. Rien ne repart vers la gauche.

## 3. Menaces et parades

| # | Menace | Parade dans le code | Vérification |
|---|---|---|---|
| T1 | Hasard prévisible (`Math.random`, horloge, compteur, saisie du visiteur) | `random.ts` : seule source `crypto.getRandomValues`, sans repli. Absente → état d'erreur, aucun mot de passe | `security.test.ts` (analyse du code source) ; test navigateur « no crypto.getRandomValues → error state » |
| T2 | Biais du modulo | rejet des mots de 32 bits au-delà du plus grand multiple de n | `random.test.ts` (source scriptée qui observe le rejet), χ² sur la vraie source |
| T3 | Biais de la contrainte « une classe de chaque » | rejet du tirage entier, jamais d'insertion forcée | `generate-password.test.ts` : test de rejet scripté, et test statistique sur la position 1 comparé à la probabilité exacte |
| T4 | Source défaillante (le tampon reste vide) | tampon remis à zéro avant chaque appel ; un tampon entièrement nul ou 64 tours sans valeur acceptée provoquent une erreur | `random.test.ts` |
| T5 | Entropie surestimée, donc fausse assurance | dénombrement exact par inclusion–exclusion en `BigInt`. Les séparateurs n'apparaissent jamais dans un mot (« - » est exclu, la liste EFF contient « t-shirt »). La majuscule est déclarée sans effet. Avec n propositions, on retire log2(n) bits. Aucune jauge, aucun « temps pour craquer » | tests de dénombrement exhaustif ; liste vérifiée par SHA-256 ; test « no allowed separator in a word » |
| T6 | Mot de passe rendu côté serveur, donc en cache CDN et identique pour tous | état initial « chargement » ; premier tirage dans un `useEffect` côté client | `security.test.ts` ; `server-render.test.ts` : `renderToString` n'appelle jamais `crypto.getRandomValues`, et une mutation qui génère au rendu fait échouer le test |
| T7 | Envoi réseau (API, analytics, suivi d'erreurs, IA) | aucun `fetch`, XHR, `sendBeacon` ni WebSocket. Les événements `tool_start` et `tool_complete` ne portent que `{tool, locale, action}`. Aucun fournisseur d'analytics n'est chargé (`src/lib/analytics.ts`) | `security.test.ts` ; test navigateur : aucune requête vers une autre origine, aucune des 11 valeurs générées dans une URL ou un corps de requête, événements sans valeur |
| T8 | Persistance (localStorage, sessionStorage, IndexedDB, cookies) | aucune API de stockage n'est appelée | `security.test.ts` ; test navigateur : stockages vides, aucune base IndexedDB |
| T9 | Fuite par l'URL ou l'historique (partage, Referer, journaux serveur) | `force-static`, aucune lecture de `searchParams`, aucun `router.push` ; options et résultats hors de l'URL | `security.test.ts` ; test navigateur : URL et `history.length` inchangés après toutes les interactions |
| T10 | Journalisation (console, error boundary) | aucun `console.*` ; l'erreur interceptée est réduite à son type (`random`, `wordlist` ou `other`) ; les messages d'erreur du domaine ne contiennent jamais de valeur | `security.test.ts` |
| T11 | Copie automatique ou faux succès | `copyText` n'est appelé que dans le gestionnaire du clic. « Copié » n'apparaît qu'après la résolution de `writeText`. Refus ou absence de l'API → message invitant à copier à la main | `clipboard.test.ts` ; tests navigateur : pas de copie au tirage, copie exacte au clic, refus, API absente |
| T12 | Lecture à voix haute par le lecteur d'écran (écoute indiscrète) | la zone `aria-live` annonce « Nouveau mot de passe généré », jamais la valeur. La valeur est dans un `<span>`, pas dans un `<output>`, dont le rôle implicite « status » est une région live | `security.test.ts` (interdit `<output>`) ; test navigateur : aucune région live ne contient la valeur |
| T13 | Traduction automatique : le texte de la page est envoyé à un service tiers | `translate="no"` et la classe `notranslate` sur les résultats et l'alphabet | `security.test.ts`. **Limite** : une extension qui ignore ces attributs reste possible (§6) |
| T14 | Enregistrement par le navigateur ou le gestionnaire de mots de passe d'un mauvais champ, ou envoi de formulaire | résultat dans un `<span>`, pas dans un `<input>` ; aucun `<form>` | revue du code |
| T15 | Intégration de la page dans un cadre (clickjacking) pour lire ou piéger la copie | `X-Frame-Options: DENY` et `frame-ancestors 'none'`, en place sur tout le site (`next.config.ts`) | en-têtes existants, non modifiés |
| T16 | Liste de mots altérée | empreinte SHA-256 du fichier EFF reconstruit, vérifiée en test | `passphrase.test.ts` |
| T17 | Course entre deux tirages : un chargement lent de la liste, ou une copie lente, aboutit après un nouveau tirage | numéro de tirage (`latest`) : un résultat ou un message de copie périmé est ignoré | revue (passes 1 et 2) ; test navigateur « copie lente puis nouveau tirage » |

## 4. Hypothèses

- Le navigateur et le système d'exploitation sont sains, et `crypto.getRandomValues` est un CSPRNG conforme à la spécification Web Crypto.
- Le JavaScript servi est celui du dépôt : HTTPS et HSTS sont en place, sans script tiers chargé sur ces pages.
- Le visiteur utilise le résultat tel quel. L'entropie affichée ne vaut que sous cette hypothèse, et l'interface le dit.

## 5. Invariants vérifiés automatiquement

Fichier `src/domain/password/security.test.ts`. Sur tous les fichiers du générateur, il vérifie l'absence de :
- `Math.random`, `Date`, `performance.now` ;
- `fetch`, XHR, `sendBeacon`, WebSocket, `navigator.share` ;
- `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie` ;
- `useSearchParams`, `useRouter` et toute écriture dans l'historique ou `location` ;
- `console.*`.

Il vérifie aussi :
- un seul appel à `copyText`, placé dans le gestionnaire du clic ;
- aucun tirage dans les pages rendues côté serveur ;
- `translate="no"` sur la valeur, et aucune balise `<output>` ;
- une annonce lecteur d'écran sans valeur.

## 6. Risques résiduels, hors de portée de l'outil

- **Appareil compromis** : un logiciel espion ou une extension malveillante lit le DOM, l'écran ou le presse-papiers. Rien dans une page web ne l'empêche, et la page le dit.
- **Presse-papiers** : après une copie, la valeur reste dans le presse-papiers. Elle peut aussi entrer dans un historique (Windows, gestionnaires de presse-papiers) ou être synchronisée vers d'autres appareils. La page le signale. L'outil ne vide pas le presse-papiers, car l'effacer sans action du visiteur serait surprenant et peu fiable.
- **Mémoire** : JavaScript ne permet pas d'effacer une chaîne. La valeur reste en mémoire jusqu'à la collecte par le ramasse-miettes ou la fermeture de l'onglet.
- **Extensions de traduction ou d'accessibilité** qui ignorent `translate="no"`.
- **Regard par-dessus l'épaule** : la valeur est affichée en clair. Aucune option de masquage n'est proposée (différé, voir le rapport de revue).
- **Chaîne d'approvisionnement** : une dépendance compromise du site affecterait toutes les pages. Ce risque est hors du périmètre de ce changement, qui n'ajoute aucune dépendance.

## 7. Ce que l'outil ne prétend pas

- Il n'est pas « incassable ». Il ne garantit pas la sécurité d'un compte et n'a fait l'objet d'aucune certification ni d'aucun audit externe.
- Le nombre de bits mesure le tirage, pas la protection : il ne protège ni d'une fuite chez un service, ni d'une fausse page, ni d'un logiciel espion.
- Le test `password-generator-seo.test.ts` interdit dans le contenu les mots « incassable », « garanti », « certifié », « 100 % » et leurs équivalents anglais.
