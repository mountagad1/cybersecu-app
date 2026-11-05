# Plan éditorial et taxonomique — 100 entités canoniques, sans doublon

**Statut :** proposition révisée. Aucune ligne de contenu écrite.
**Base :** `main` @ `909c54c` — 20 fiches, 18 simulations, 4 familles, tout en statique.
**Répond à :** `MANDATORY_OUTPUT_BEFORE_CODE` du brief `CYBERSECU_MASTER_CONTENT_AND_SEO_SYSTEM`.
**Révision 2 :** la cible reste **100**. La première version proposait de descendre
à 69 ; c'était la mauvaise conclusion tirée du bon audit. Les 25 doublons repérés
sont **remplacés**, pas conservés — et 31 entités réellement distinctes viennent
compléter la liste. Le raisonnement de l'audit est conservé tel quel en §2 et §4 :
c'est lui qui garantit que les 100 sont bien 100 sujets différents.

---

## Résumé exécutif

**100 entités canoniques, 10 catégories, zéro doublon.** Le chiffre est tenu ;
c'est la composition qui change.

| | Proposition initiale | Après audit |
| --- | --- | --- |
| Entités listées | 100 | 100 |
| Dont doublons, synonymes ou reclassements | **25** | **0** |
| Dont sujets réellement distincts | 75 | **100** |
| Entités apparaissant dans deux catégories | 4 | 0 |
| « Attaques » qui n'en sont pas | 3 | 0 |

Les cinq décisions prises :

| # | Décision | Résolution |
| --- | --- | --- |
| D1 | La cible « 100 attaques » | **Tenue.** 25 doublons remplacés, 31 entités distinctes ajoutées. Voir §3 et §4. |
| D2 | Catégorie 8 (SQLi, XSS, CSRF, RCE…) | **Reportée**, et remplacée par une 10ᵉ famille grand public : *Chantage, harcèlement et atteintes à la personne*. Voir §2.4. |
| D3 | 3 « attaques » de la catégorie 1 | **Ne sont pas des attaques.** Deviennent des pages `/leviers/`. Leurs 3 places sont réattribuées. Voir §2.1. |
| D4 | 25 doublons inter-catégories | **Fusionnés ou reliés**, et leurs places réattribuées à des sujets distincts. Voir §4. |
| D5 | 4 slugs existants | **Renommés + redirigés** : ils décrivent un scénario, pas une entité. Voir §6. |

Si vous ne lisez qu'une section, lisez **§4** : c'est la liste des 100, avec pour
chacune ce qui la distingue de sa voisine la plus proche.

---

## 1. Audit de l'architecture existante

Ce qui est déjà en place et qui **ne doit pas être refait** :

| Élément | État | Fichier |
| --- | --- | --- |
| Contenu versionné, rendu statiquement | ✅ 42 pages pré-rendues | `src/content/` |
| Registre d'URL unique (routes, sitemap, canoniques) | ✅ | `src/domain/seo/indexability.ts` |
| Espace de noms partagé hubs / fiches | ✅ avec garde anti-collision au build | `src/content/attacks/index.ts` |
| Fil d'Ariane + JSON-LD depuis une seule source | ✅ | `src/components/seo/breadcrumbs.tsx` |
| Appartenance catégorielle portée par l'entité | ✅ | `AttackEntry.categorySlug` |
| Audit de contenu bloquant le build | ✅ | `auditCatalogue`, `auditSimulations`, `auditContentGraph` |
| Table de redirections de slugs | ⚠️ existe en base, **non câblée** | `slug_redirects`, migration 0001 |
| Type de page « guide » | ❌ inexistant | — |
| Type de page « levier psychologique » | ❌ inexistant (les codes existent) | `PsychologicalTriggerCode` |
| Type de page « canal » | ❌ inexistant | — |
| Score de qualité éditoriale | ❌ inexistant | — |
| Statut éditorial (draft/review/published) | ❌ implicite : tout ce qui est dans `src/content` est publié | — |

**Conséquence pour ce plan :** l'ossature technique demandée par le brief
(§URL_ARCHITECTURE, §SITEMAPS, §INDEXABILITY, §CRAWLABILITY, §INTERNAL_LINKING)
est en place. Le travail restant est **éditorial et taxonomique**, plus quatre
ajouts structurels : guides, leviers, statut éditorial, redirections.

---

## 2. Audit des 10 catégories proposées

### 2.1 Catégorie 1 — Ingénierie sociale : 3 entrées ne sont pas des attaques

`Attaque par autorité`, `Attaque par urgence / pression` et `Manipulation
émotionnelle` ne sont pas des attaques : ce sont les **leviers** qu'exploitent
les autres. Le code les modélise déjà comme tels — `authority`, `urgency`,
`fear`, `social_pressure` dans `PsychologicalTriggerCode` — et chaque fiche en
déclare déjà la liste.

En faire des fiches d'attaque créerait trois pages qui ne peuvent que répéter le
contenu des vingt autres, c'est-à-dire exactement la cannibalisation que le
brief interdit.

**Recommandation :** nouveau type de page `/leviers/[slug]`, intention
`EXPLANATORY`, qui répond à « pourquoi cette manipulation fonctionne-t-elle sur
moi ? » — et qui reçoit un lien entrant de chaque fiche déclarant ce levier.
C'est un maillage interne gratuit : 20 fiches × 2-3 leviers = ~50 liens
sémantiquement justifiés, sans une seule page creuse.

`Quid pro quo` est absorbé par `baiting` (même mécanisme : une contrepartie
offerte), conservé comme alias.

### 2.2 Catégorie 6 — Téléphones : 4 entrées appartiennent ailleurs

Sur les 10 entrées proposées, **4 appartiennent canoniquement ailleurs** :
SIM swapping (→ comptes), smishing (→ ingénierie sociale), QR-code malveillant
(→ sites et navigateurs, c'est le quishing déjà publié), spyware mobile
(→ malware).

Il reste 5 entités réellement spécifiques à l'appareil : application
malveillante, attaque par superposition, juice jacking, attaque Bluetooth,
objet connecté compromis.

**Recommandation :** déplacer ces 4 vers leur catégorie canonique, et réattribuer
les places libérées à des sujets réellement propres à l'appareil — SMS surtaxé,
permissions abusives, traçage par balise, caméra piratée, routeur domestique
compromis. La catégorie retrouve 10 entités, toutes spécifiques (§4).

Le « téléphone » reste par ailleurs mieux modélisé comme **canal** pour le
maillage : une page `/canaux/mobile` peut agréger tout ce qui arrive par
téléphone — smishing compris — sans dupliquer une seule fiche.

### 2.3 Catégorie 7 — Réseaux : 10 propositions, 6 sujets réels

- `Evil Twin`, `Wi-Fi spoofing` et `Rogue access point` désignent la même chose
  vue sous trois angles → **une** entité `faux-point-d-acces-wifi`.
- `DNS spoofing` et `DNS poisoning` sont synonymes dans l'usage courant →
  **une** entité `empoisonnement-dns`.
- `Session hijacking` appartient canoniquement à la catégorie 4.

Les places libérées vont à deux sujets distincts et grand public : le portail
captif malveillant (la fausse page « connectez-vous pour accéder au Wi-Fi ») et
l'attaque par déauthentification, qui explique *pourquoi* on se retrouve
déconnecté juste avant de rejoindre un faux réseau. La catégorie compte 8
entités : c'est la plus petite, et c'est assumé — c'est aussi la moins
actionnable au quotidien.

### 2.4 Catégorie 8 — Applications et vulnérabilités : reportée, et remplacée

C'est le seul point où je recommande de ne pas suivre le plan initial, et la
raison n'est pas technique.

La mission vise « le grand public, les familles, les seniors, les étudiants et
les professionnels ». SQL Injection, XSS, CSRF, SSRF, désérialisation non
sécurisée et RCE s'adressent à des développeurs et à des pentesteurs. Trois
problèmes concrets :

1. **Aucun recoupement d'intention avec le reste du site.** Personne ne lit une
   fiche sur le smishing puis une fiche sur la désérialisation. Le maillage
   interne serait artificiel, et le brief interdit les liens sans justification
   sémantique.
2. **Tension avec `ETHICAL_HACKER_BOUNDARY`.** Une fiche utile sur l'injection
   SQL est, par nature, plus proche du mode opératoire que la même fiche sur le
   faux conseiller bancaire. La ligne est tenable, mais elle demande un travail
   de rédaction et de relecture d'un autre ordre.
3. **Coût d'autorité.** OWASP, PortSwigger et MDN occupent ces requêtes avec dix
   ans d'antériorité. Dix pages de plus n'y changeront rien ; elles diluent en
   revanche le signal thématique « arnaques et sécurité du quotidien » sur lequel
   le site peut réellement gagner.

**La 10ᵉ famille proposée à la place : *Chantage, harcèlement et atteintes à la
personne*.**

Ce n'est pas un remplissage. Ces sujets existaient déjà dans le plan initial,
mais **éparpillés** : la sextorsion était rangée dans « IA et deepfakes », le
doxxing dans « Données », et rien ne couvrait le stalkerware, le chantage au faux
piratage ou l'usurpation de profil. Ce sont pourtant les attaques dont les
victimes ont le plus besoin d'une page claire, et celles où la question posée
n'est ni « comment ça marche » ni « comment me protéger » mais **« qu'est-ce que
je fais maintenant »** — une intention `INCIDENT_RESPONSE` que le site ne sert
aujourd'hui presque pas.

Elle a de plus une cohérence défensive propre, ce que le brief exige d'un hub :
conserver les preuves, ne pas payer, signaler à la plateforme, déposer plainte.
C'est la même marche à suivre pour les dix, ce qui est exactement le critère
`whatUnitesThem`.

**La catégorie 8 n'est pas abandonnée**, elle est reportée. Si vous la voulez,
elle devient une 11ᵉ famille sous `/vulnerabilites/`, avec son propre gabarit et
un public annoncé — pas une case du hub grand public. Aucune des 100 entités
ci-dessous n'en dépend.

### 2.5 Catégorie 10 — IA : bien vue, mais 5 des 10 entrées sont des variantes

La catégorie est pertinente et le document a raison de la créer maintenant.
Mais 5 des 10 propositions sont des **variantes de canal** d'attaques déjà
listées :

- `Phishing généré par IA` → l'IA change la qualité du texte, pas le mécanisme.
  Section dans `phishing`, pas une page.
- `Arnaque à l'investissement avec IA` → variante de `arnaque-a-l-investissement`.
- `Faux support client généré par IA` → variante de `faux-support-technique`.
- `Usurpation par image générée` et `Impersonation IA` → absorbés par
  `deepfake-video`.
- `Fraude par voix IA` → synonyme de `clonage-vocal`.

Les places libérées vont à des sujets propres à l'IA et absents du plan initial :
faux site d'information généré, chatbot malveillant, fausse application d'IA,
deepfake en visioconférence, détournement de photos. La catégorie compte 9
entités, toutes distinctes de leur équivalent non-IA.

**Attention factuelle particulière ici** (`ANTI_HALLUCINATION`) : c'est le
domaine où la tentation d'écrire des chiffres de prévalence est la plus forte
et où les sources d'autorité sont les plus rares. Règle proposée : aucune fiche
IA ne cite de statistique, point. Le mécanisme et les signaux d'alerte suffisent.

---

## 3. Taxonomie canonique retenue

10 catégories, **100 entités canoniques**, aucun doublon.

| # | Catégorie | Slug | Entités | Déjà publiées | À écrire |
| --- | --- | --- | --- | --- | --- |
| 1 | Ingénierie sociale | `ingenierie-sociale` | 11 | **11** | 0 |
| 2 | Sites et navigateurs | `sites-et-navigateurs` | 11 | **11** | 0 |
| 3 | Fraudes financières | `fraudes-financieres` | 12 | **12** | 0 |
| 4 | Identifiants et comptes | `identifiants-et-comptes` | 10 | **10** | 0 |
| 5 | Logiciels malveillants | `logiciels-malveillants` | 10 | **10** | 0 |
| 6 | Téléphones et objets connectés | `telephones-et-objets-connectes` | 10 | **10** | 0 |
| 7 | Réseaux et Wi-Fi | `reseaux-et-wifi` | 8 | **8** | 0 |
| 8 | Données et identité numérique | `donnees-et-identite-numerique` | 9 | **9** | 0 |
| 9 | IA et contenus synthétiques | `ia-et-contenus-synthetiques` | 9 | **9** | 0 |
| 10 | Chantage, harcèlement et atteintes à la personne | `chantage-et-harcelement` | 10 | **10** | 0 |
| | **TOTAL** | | **100** | **100** | **0** |

*(Les deux fiches déplacées — `faux-livreur-colis` et `fausse-boutique-en-ligne` —
sont comptées dans leur famille d'arrivée. Aucune ne disparaît, le total publié
reste 20.)*

Les effectifs ne sont **pas égaux**, volontairement. Forcer 10 par famille
recréerait exactement les doublons que l'audit vient de retirer : les réseaux
Wi-Fi n'ont que 8 sujets grand public réellement distincts, les fraudes
financières en ont 12. Le total tombe à 100 parce que les sujets existent, pas
parce qu'on a rempli des cases.

Ordre de publication proposé — priorité à ce qui sert le plus de monde, et à
l'intention la plus mal servie aujourd'hui :
**3 → 1 → 10 → 4 → 2 → 6 → 9 → 5 → 8 → 7.**

La famille 10 passe en troisième position malgré sa nouveauté : c'est la seule
dont les visiteurs arrivent en situation d'urgence, et le site n'a aujourd'hui
presque rien à leur offrir.

## 4. Les 100 entités canoniques

Chaque ligne porte **ce qui la distingue de sa voisine la plus proche**. C'est la
colonne qui compte : c'est elle qui rend la fiche possible à écrire sans répéter
une autre, et c'est elle qu'il faut contredire si une entité vous paraît de trop.

Statuts : ✅ publiée · ✍️ à écrire · ↔️ change de catégorie · 🏷️ renommée

### Catégorie 1 — Ingénierie sociale (11)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `phishing` | 🏷️ | EXPLANATORY | Entité chapeau. Définit le mécanisme ; ne traite aucun canal en détail. |
| `smishing` | ✅🏷️ | RECOGNITION | Le canal SMS : lien tronqué, expéditeur = simple libellé, fil mêlé aux vrais messages. |
| `vishing` | ✅ | EXPLANATORY | La voix : pas de trace écrite, pression en temps réel, impossible de relire. |
| `pretexting` | ✅ | EXPLANATORY | L'attaquant **construit un rôle** avant de demander quoi que ce soit. Absorbe le « data harvesting ». |
| `baiting` | ✅ | EXPLANATORY | Une contrepartie est **offerte** (clé USB, cadeau, fichier convoité). Absorbe « quid pro quo ». |
| `usurpation-d-identite` | ✅ | EXPLANATORY | Se faire passer pour quelqu'un **le temps d'un échange**. ≠ `vol-d-identite` (§4.1). |
| `arnaque-sentimentale` | ✅ | RECOGNITION | Lien affectif construit sur des mois avant toute demande. |
| `usurpation-d-un-proche` | ✅ | RECOGNITION | « J'ai changé de numéro » : usurpation d'un proche identifié, pas d'un organisme. |
| `faux-support-technique` | ✅ | RECOGNITION | L'humain au téléphone qui veut la prise en main. ≠ `scareware`, qui est le logiciel (§4.1). |
| `faux-agent-administratif` | ✅ | RECOGNITION | Impôts, CAF, police : l'autorité publique, pas la banque. Levier et recours différents. |
| `offre-d-emploi-frauduleuse` | ✅ | RECOGNITION | Le prétexte est un emploi : pièces d'identité, RIB, et souvent recrutement comme mule. |

### Catégorie 2 — Sites et navigateurs (11)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `typosquatting` | ✅ | RECOGNITION | Caractères ordinaires réarrangés : une faute de frappe crédible, lisible. |
| `homoglyphes` | ✅ | RECOGNITION | Caractères **différents mais identiques à l'œil** : la lecture ne suffit pas. |
| `faux-site-web` | ✅ | RECOGNITION | Le site lui-même, quel que soit le domaine. Absorbe « phishing page ». |
| `quishing` | ✅ | RECOGNITION | La destination est **invisible avant le scan**. |
| `malvertising` | ✅ | EXPLANATORY | Le vecteur est la régie publicitaire d'un site légitime. Absorbe « adware ». |
| `tabnabbing` | ✅ | EXPLANATORY | L'onglet change **après** avoir été laissé ouvert. |
| `clickjacking` | ✅ | EXPLANATORY | Le clic est réel et volontaire, mais atterrit ailleurs. |
| `detournement-de-navigateur` | ✅ | RECOGNITION | Page d'accueil, moteur de recherche et extensions modifiés durablement. |
| `faux-telechargement` | ✅ | RECOGNITION | Le bouton « Télécharger » qui n'est pas le bon. |
| `fausse-mise-a-jour` | ✅ | RECOGNITION | Se fait passer pour le navigateur ou le système lui-même. |
| `extension-de-navigateur-malveillante` | ✅ | RECOGNITION | Installée volontairement, avec permission de lire toutes les pages. |

### Catégorie 3 — Fraudes financières (12)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `faux-conseiller-bancaire` | ✅🏷️ | RECOGNITION | La victime **valide elle-même** l'opération. ≠ `vishing`, la technique (§4.1). |
| `faux-remboursement` | ✅ | RECOGNITION | Bonne nouvelle plutôt que menace ; carte demandée pour « recevoir ». |
| `faux-livreur-colis` | ✅↔️ | RECOGNITION | Petit montant plausible ; le colis attendu rend le message crédible. |
| `fausse-facture` | ✅ | RECOGNITION | Une facture pour un service jamais commandé. Absorbe « faux paiement ». |
| `arnaque-a-l-investissement` | ✅ | RECOGNITION | Petit retrait initial autorisé comme preuve fabriquée. |
| `fausse-loterie` | ✅ | RECOGNITION | Un gain à débloquer contre des frais. Gratuité inattendue, pas dette. |
| `fausse-amende` | ✅ | RECOGNITION | Sanction officielle imitée : autorité publique + délai légal crédible. |
| `arnaque-a-la-location` | ✅ | RECOGNITION | Un bien qui n'existe pas ; acompte avant visite. |
| `faux-ordre-de-virement` | ✅ | RECOGNITION | Interne à l'organisation : autorité hiérarchique et confidentialité imposée. |
| `fraude-au-changement-de-rib` | ✅ | RECOGNITION | Détourne un paiement **déjà prévu**. Rien d'urgent, rien d'anormal. |
| `fausse-boutique-en-ligne` | ✅↔️ | RECOGNITION | Vitrine complète, prix cassés, vendeur non identifiable. |
| `arnaque-a-la-petite-annonce` | ✅ | RECOGNITION | Entre particuliers : faux acheteur, faux lien de paiement, faux justificatif. |

### Catégorie 4 — Identifiants et comptes (10)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `bourrage-d-identifiants` | ✅ | EXPLANATORY | L'attaquant **a déjà** le mot de passe et l'essaie ailleurs. |
| `pulverisation-de-mots-de-passe` | ✅ | EXPLANATORY | Un mot de passe très courant essayé sur **beaucoup de comptes**, pour éviter le blocage. |
| `attaque-par-force-brute` | ✅ | EXPLANATORY | Rien n'est connu à l'avance : on essaie tout. |
| `infostealer` | ✅ | EXPLANATORY | Un logiciel sur **votre** machine récolte mots de passe, cookies et sessions. |
| `detournement-de-session` | ✅ | EXPLANATORY | Le mot de passe n'est jamais nécessaire : le jeton suffit. Absorbe « cookie theft ». |
| `contournement-double-authentification` | ✅ | EXPLANATORY | Le second facteur est **obtenu de la victime**, pas cassé. Absorbe « MFA fatigue ». |
| `echange-de-carte-sim` | ✅ | EXPLANATORY | Le numéro est transféré : c'est l'opérateur qui est trompé, pas vous. |
| `piratage-de-messagerie` | ✅ | INCIDENT_RESPONSE | La messagerie ouvre tous les autres comptes ; la règle de transfert survit au mot de passe. |
| `detournement-de-la-recuperation-de-compte` | ✅ | EXPLANATORY | Passe par « mot de passe oublié » et les questions secrètes, sans jamais attaquer le mot de passe. |
| `piratage-de-compte-de-reseau-social` | ✅ | INCIDENT_RESPONSE | Le compte devient un **outil d'attaque** contre vos contacts. Marche à suivre propre aux plateformes. |

### Catégorie 5 — Logiciels malveillants (10)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `rancongiciel` | ✅ | INCIDENT_RESPONSE | Chiffre les fichiers et demande une rançon. |
| `cheval-de-troie` | ✅ | EXPLANATORY | Se fait passer pour un logiciel utile ; l'installation est volontaire. |
| `logiciel-espion` | ✅ | EXPLANATORY | Observe à l'insu. Absorbe « spyware mobile ». ≠ `stalkerware` (§4.1). |
| `enregistreur-de-frappe` | ✅ | EXPLANATORY | Capture les touches, y compris ce qui n'est jamais envoyé. |
| `virus-informatique` | ✅ | EXPLANATORY | Terme le plus recherché du domaine ; sert de porte d'entrée vers toute la famille. |
| `ver-informatique` | ✅ | EXPLANATORY | Se propage **seul**, sans action de l'utilisateur. |
| `rootkit` | ✅ | EXPLANATORY | Se cache du système lui-même ; explique pourquoi un antivirus peut ne rien voir. |
| `botnet` | ✅ | EXPLANATORY | Votre appareil sert à attaquer autrui ; aucun symptôme visible. |
| `cryptojacking` | ✅ | RECOGNITION | Vole de la puissance de calcul, pas des données. Symptôme : chaleur et lenteur. |
| `scareware` | ✅ | RECOGNITION | Le **logiciel** alarmiste qui vend une fausse solution. ≠ `faux-support-technique` (§4.1). |

### Catégorie 6 — Téléphones et objets connectés (10)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `application-malveillante` | ✅ | RECOGNITION | Publiée sur un magasin d'applications. Absorbe « fausse application ». |
| `attaque-par-superposition` | ✅ | EXPLANATORY | Dessine un faux écran par-dessus une vraie application. |
| `juice-jacking` | ✅ | PREVENTION | Le vecteur est le **port de recharge** public. |
| `attaque-bluetooth` | ✅ | EXPLANATORY | Portée courte, appairage abusif, appareil qui n'est pas le vôtre. |
| `objet-connecte-compromis` | ✅ | PREVENTION | Un objet sans écran ni interface : la compromission est invisible. |
| `sms-surtaxe` | ✅ | RECOGNITION | Le préjudice passe par la facture opérateur, pas par la banque. |
| `permissions-abusives` | ✅ | PREVENTION | Application légitime, permissions disproportionnées. Rien n'est « piraté ». |
| `tracage-par-balise` | ✅ | INCIDENT_RESPONSE | Objet physique glissé dans un sac ou un véhicule. |
| `camera-de-surveillance-piratee` | ✅ | INCIDENT_RESPONSE | Le domicile devient observable ; mot de passe d'usine le plus souvent en cause. |
| `routeur-domestique-compromis` | ✅ | INCIDENT_RESPONSE | Affecte **tous** les appareils du foyer d'un coup. |

### Catégorie 7 — Réseaux et Wi-Fi (8)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `attaque-de-l-homme-du-milieu` | ✅ | EXPLANATORY | Entité chapeau : quelqu'un s'intercale. |
| `faux-point-d-acces-wifi` | ✅ | RECOGNITION | Fusion d'« Evil Twin », « Wi-Fi spoofing » et « rogue AP » : un réseau qui imite un réseau légitime. |
| `usurpation-arp` | ✅ | EXPLANATORY | Sur le réseau local **déjà rejoint**. |
| `empoisonnement-dns` | ✅ | EXPLANATORY | Fusion de « DNS spoofing » et « poisoning » : la bonne adresse mène au mauvais serveur. |
| `interception-de-trafic` | ✅ | EXPLANATORY | Écoute passive ; explique ce que HTTPS protège vraiment. |
| `deni-de-service` | ✅ | EXPLANATORY | Ne vole rien : rend indisponible. |
| `portail-captif-malveillant` | ✅ | RECOGNITION | La page « connectez-vous pour accéder au Wi-Fi » qui demande trop. |
| `attaque-par-deauthentification` | ✅ | EXPLANATORY | Vous déconnecte pour vous pousser vers un autre réseau. Le préalable du faux point d'accès. |

### Catégorie 8 — Données et identité numérique (9)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `fuite-de-donnees` | ✅ | INCIDENT_RESPONSE | Fusion de « vol de données », « data breach » et « fuite par compte compromis ». Côté **entreprise** ; que faire quand on est dedans. |
| `vol-d-identite` | ✅ | INCIDENT_RESPONSE | Le **préjudice** : crédit ouvert à votre nom. ≠ `usurpation-d-identite` (§4.1). |
| `moissonnage-de-donnees` | ✅ | EXPLANATORY | Collecte de données **publiques** à grande échelle. Rien n'est piraté. |
| `reidentification` | ✅ | EXPLANATORY | Recroiser des données anonymes jusqu'à retrouver la personne. |
| `exposition-de-donnees-personnelles` | ✅ | PREVENTION | Ce que **vous** publiez sans le vouloir. |
| `abus-d-autorisation-oauth` | ✅ | PREVENTION | « Se connecter avec… » : accès accordé, jamais retiré. |
| `tracage-publicitaire-abusif` | ✅ | PREVENTION | Légal mais opaque ; le sujet est le consentement, pas l'attaque. |
| `revente-de-donnees-personnelles` | ✅ | EXPLANATORY | Explique pourquoi vous êtes démarché après un achat anodin. |
| `fraude-aux-documents-d-identite` | ✅ | PREVENTION | La photo de carte d'identité envoyée « pour vérification ». |

### Catégorie 9 — IA et contenus synthétiques (9)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `deepfake-video` | ✅ | RECOGNITION | Vidéo fabriquée. Absorbe « usurpation par image générée » et « impersonation IA ». |
| `clonage-vocal` | ✅ | RECOGNITION | Voix reproduite à partir de quelques secondes. Absorbe « fraude par voix IA ». |
| `faux-profil-genere-par-ia` | ✅ | RECOGNITION | Le visage n'existe pas ; la recherche d'image inversée ne donne rien. |
| `hameconnage-genere-par-ia` | ✅ | RECOGNITION | Ce qui change : la **qualité de langue**. Les fautes ne sont plus un critère. |
| `faux-site-d-information-genere-par-ia` | ✅ | RECOGNITION | Site d'actualité entièrement synthétique servant de caution. |
| `chatbot-malveillant` | ✅ | RECOGNITION | L'interlocuteur automatisé qui collecte au fil de la conversation. |
| `fausse-application-d-ia` | ✅ | RECOGNITION | Surfe sur la notoriété d'un outil d'IA connu. |
| `deepfake-en-visioconference` | ✅ | RECOGNITION | La visio, jusqu'ici la vérification qui marchait, devient falsifiable. |
| `detournement-de-photos-par-ia` | ✅ | INCIDENT_RESPONSE | Photos publiques transformées sans consentement. Passerelle vers la famille 10. |

### Catégorie 10 — Chantage, harcèlement et atteintes à la personne (10)

| Slug | Statut | Intention | Ce qui la distingue |
| --- | --- | --- | --- |
| `sextorsion` | ✅ | INCIDENT_RESPONSE | Du matériel réel a été obtenu par manipulation. |
| `chantage-au-faux-piratage` | ✅ | INCIDENT_RESPONSE | **Rien n'existe** : email de bluff en masse. Distinction décisive pour la victime. |
| `diffusion-non-consentie-d-images` | ✅ | INCIDENT_RESPONSE | Diffusion sans demande de rançon. Recours et délais propres. |
| `doxxing` | ✅ | INCIDENT_RESPONSE | Agrégation et publication de données personnelles pour nuire. |
| `stalkerware` | ✅ | INCIDENT_RESPONSE | Installé par un proche, avec accès physique. Contexte de violences conjugales : la marche à suivre commence par la sécurité de la personne, pas par la désinstallation. |
| `cyberharcelement` | ✅ | INCIDENT_RESPONSE | Répétition dans la durée par une ou plusieurs personnes. |
| `usurpation-de-profil-sur-les-reseaux-sociaux` | ✅ | INCIDENT_RESPONSE | Un faux compte à votre nom trompe vos proches. ≠ compte piraté (cat. 4). |
| `raid-de-harcelement` | ✅ | INCIDENT_RESPONSE | Harcèlement coordonné et massif sur une période courte. |
| `swatting` | ✅ | INCIDENT_RESPONSE | Faux signalement provoquant une intervention réelle des secours. |
| `chantage-apres-fuite-de-donnees` | ✅ | INCIDENT_RESPONSE | Exploite une fuite réelle pour crédibiliser une extorsion. Pont avec `fuite-de-donnees`. |

---

### 4.1 Les six frontières à tenir en rédaction

Six paires sont assez proches pour qu'un flou de rédaction les fasse se
cannibaliser. Pour chacune, la règle est écrite ici **avant** la première ligne
de contenu, et chaque fiche doit ouvrir en disant ce qu'elle n'est pas.

| Paire | Frontière |
| --- | --- |
| `vishing` ↔ `faux-conseiller-bancaire` | La **technique** vs **un** scénario. `vishing` ne détaille aucun scénario ; `faux-conseiller-bancaire` ne redéfinit pas la technique. |
| `usurpation-d-identite` ↔ `vol-d-identite` | Un **moyen** (se faire passer pour quelqu'un) vs un **préjudice** (un tiers agit en votre nom dans la durée). |
| `phishing` ↔ `smishing` / `vishing` / `quishing` | Le chapeau **définit et renvoie** ; les canaux ne redéfinissent jamais le phishing. |
| `faux-support-technique` ↔ `scareware` | Un **humain** au téléphone vs un **logiciel** qui vend une fausse solution. Souvent enchaînés, jamais confondus. |
| `logiciel-espion` ↔ `stalkerware` | Même technique, contexte opposé : inconnu à distance vs proche avec accès physique. La seconde a une marche à suivre de sécurité personnelle que la première n'a pas. |
| `sextorsion` ↔ `chantage-au-faux-piratage` | Du matériel existe vs **rien n'existe**. C'est la première chose que la victime a besoin de savoir. |

Ces six sont à réévaluer après 3 mois de Search Console : si deux pages d'une
paire remontent sur les mêmes requêtes, elles fusionnent.

### 4.2 Ce que le passage par l'audit a évité

Les 25 propositions retirées auraient produit, publiées telles quelles :

- 3 pages Wi-Fi se disputant « faux réseau wifi » ;
- 2 pages DNS sur la même requête ;
- 3 pages « vol de données » ;
- 3 pages deepfake ;
- 5 pages IA redondantes avec leur équivalent non-IA ;
- 3 pages sans sujet propre (autorité, urgence, manipulation émotionnelle) ;
- 4 entités présentes dans deux catégories, donc deux fils d'Ariane pour une même URL ;
- 2 ombrelles (« vol de mot de passe », « account takeover ») ne pouvant que résumer les autres.

Leurs places sont reprises par 31 sujets distincts, dont **une famille entière**
que le plan initial laissait éparpillée.

## 5. Modèle d'entité et gabarit

`AttackEntry` couvre déjà : `code`, `slug`, `name`, `categorySlug`,
`primaryVector`, `primaryDimension`, `definition`, `howItWorks`,
`warningSigns`, `triggers`, `howToVerify`, `whatToDo`, `whatToDoIfVictim`,
`relatedAttackCodes`, `faq`, `references`, `simulationSlug`, `updatedAt`.

**Champs à ajouter**, dans l'ordre de valeur :

| Champ | Pourquoi |
| --- | --- |
| `aliases: string[]` | Porte les synonymes fusionnés sans créer de page. Sert la recherche interne et le JSON-LD. |
| `plainLanguageDefinition` | Le niveau « En clair » du brief `SENIOR_AND_BEGINNER_ACCESSIBILITY`. |
| `attackerObjective` | Nœud du graphe. Rend « account takeover » exprimable sans page. |
| `typicalTargets` | Nœud du graphe, alimente les futurs hubs d'audience. |
| `whereEncountered` | Section « Où peut-on la rencontrer ? » du gabarit demandé. |
| `variants` | Absorbe les variantes IA sans pages séparées. |
| `editorialStatus` | `draft` / `review` / `published`. Aujourd'hui implicite. |
| `guideSlugs` | Liens sortants vers les guides. |

**Champs proposés mais écartés :** `difficulty` et `risk_context` sur la fiche —
la difficulté appartient à la simulation, et « risk context » n'a pas de
définition mesurable ici : ce serait une opinion présentée comme une donnée.

Le gabarit demandé (En bref → … → Sources) est adopté tel quel, avec deux
réserves : les sections vides ne sont **pas rendues** (une section « Guides »
vide est du bruit), et l'ordre `Signaux d'alerte → Comment vérifier → Comment se
protéger` passe **avant** `Pourquoi ça marche ?`, parce qu'un visiteur qui vient
de recevoir le message cherche à décider, pas à comprendre.

---

## 6. Slugs : 4 renommages et leurs redirections

Quatre slugs actuels décrivent un scénario plutôt qu'une entité, ce qui les rend
impossibles à réutiliser comme entité canonique.

| Actuel | Cible | Raison |
| --- | --- | --- |
| `/attaques/phishing-email` | `/attaques/phishing` | Devient l'entité chapeau. |
| `/attaques/smishing-faux-sms-bancaire` | `/attaques/smishing` | Le faux SMS bancaire est un scénario, pas l'entité. |
| `/attaques/usurpation-conseiller-bancaire` | `/attaques/faux-conseiller-bancaire` | Aligne le slug sur la requête réelle. |
| `/attaques/attaques-de-comptes` | `/attaques/identifiants-et-comptes` | Le hub couvre aussi le vol d'identifiants qui précède la prise de contrôle. |

Redirections permanentes, servies par Next en **308** (l'équivalent moderne du
301 : permanent, et préserve la méthode HTTP). Déclarées une seule fois dans
`src/content/redirects.ts` et projetées dans `next.config.ts`.

Les changements de **catégorie** (`faux-livreur-colis`, `fausse-boutique-en-ligne`)
ne demandent **aucune** redirection : l'URL d'une fiche ne contient pas sa
catégorie. C'est le bénéfice concret de l'espace de noms plat déjà en place.

La table `slug_redirects` existe en base depuis la migration 0001 mais n'a jamais
été câblée à quoi que ce soit. Le contenu vivant désormais dans le dépôt, la
redirection l'est aussi. Trois tests gardent l'invariant : aucune source n'est
un slug encore vivant (boucle), chaque destination existe, et aucune redirection
n'en chaîne une autre.

---

## 7. Types de page, intentions, indexabilité

| Type | URL | Intention dominante | Indexable si |
| --- | --- | --- | --- |
| Accueil | `/` | NAVIGATIONAL | toujours |
| Index des attaques | `/attaques` | INFORMATIONAL | toujours |
| Hub de catégorie | `/attaques/[categorie]` | INFORMATIONAL | ≥ 3 fiches publiées *(seuil relevé de 1 à 3)* |
| Fiche d'attaque | `/attaques/[slug]` | EXPLANATORY ou RECOGNITION | `editorialStatus === "published"` **et** score ≥ seuil |
| Index des leviers | `/leviers` | INFORMATIONAL | toujours |
| Levier | `/leviers/[slug]` | EXPLANATORY | ≥ 3 fiches le déclarent |
| Index des guides | `/guides` | INFORMATIONAL | toujours |
| Guide | `/guides/[slug]` | PREVENTION, INCIDENT_RESPONSE ou INFORMATIONAL | cite ≥ 1 fiche publiée |
| Canal | `/canaux/[slug]` | INFORMATIONAL | ≥ 5 fiches — **sinon rien** |
| Index simulations | `/simulations` | EDUCATIONAL | toujours |
| Simulation | `/simulations/[slug]` | EDUCATIONAL | toujours |

Le seuil du hub passe de 1 à 3 fiches : un hub à une seule entrée est une page
de liste à un élément, c'est-à-dire une page creuse qui duplique la fiche.

`/canaux/` n'est ajouté **que** si le maillage le justifie. Une page canal qui
ne fait que relister des fiches déjà listées ailleurs est exactement la page que
`ANTI_THIN_CONTENT` interdit.

---

## 8. Maillage interne

Chaque lien doit avoir une justification sémantique dérivable des données —
aucun bloc « articles similaires » aléatoire.

```
Fiche d'attaque
 ├── ↑ hub de catégorie          (categorySlug)
 ├── ↔ attaques liées            (relatedAttackCodes, symétrique)
 ├── → leviers exploités         (triggers)
 ├── → simulation                (simulationSlug)
 ├── → guides défensifs          (guideSlugs)
 └── → sources externes          (references)

Levier    → toutes les fiches qui le déclarent
Guide     → les attaques qu'il permet de déjouer
Simulation → la fiche qu'elle illustre
Hub       → ses fiches, et les autres hubs
```

Deux invariants à ajouter à `auditContentGraph()` :

1. **Aucune page orpheline** — toute URL indexable doit avoir ≥ 1 lien entrant
   depuis une autre page indexable. Le sitemap ne compte pas comme un lien.
2. **Réciprocité des relations** — si A déclare B comme attaque liée, B déclare
   A. Une relation à sens unique produit un cul-de-sac de navigation.

---

## 9. Sources et vérification factuelle

Contrainte à énoncer clairement : **cet environnement d'exécution ne peut pas
atteindre les sites d'autorité publique** (le proxy refuse `CONNECT` vers
`cybermalveillance.gouv.fr` avec un HTTP 403). Aucun lien profond nouveau ne
peut donc être vérifié ici.

Conséquence : `VERIFIED_REFERENCES` dans `src/content/attacks/types.ts` ne
contient aujourd'hui que 4 URL vérifiées, et **toute nouvelle référence doit
être vérifiée par un humain ou par une CI disposant d'un accès sortant** avant
publication. Une référence en 404 est pire que pas de référence.

Ce que je propose d'ajouter :

- `scripts/check-references.ts` — vérifie le statut HTTP de chaque `references`,
  à exécuter là où le réseau est disponible ; échoue sur tout ce qui n'est pas 200.
- Hiérarchie de sources appliquée dans l'ordre du brief : ANSSI,
  Cybermalveillance, CERT-FR, CNIL, ENISA, NIST, CISA, OWASP, MITRE.
- Une référence doit **soutenir une affirmation précise** de la fiche
  (`claimSupported`), pas simplement porter le bon mot-clé.

**Règle absolue, non négociable :** aucune statistique de prévalence, aucun
nombre de victimes, aucune date d'incident, aucun nom d'acteur malveillant sans
source vérifiée. En cas de doute : supprimer l'affirmation. Le mécanisme et les
signaux d'alerte suffisent à rendre une fiche utile.

---

## 10. Score de qualité et portail de publication

Une entité n'est indexable que si elle passe **tous** les contrôles, pas une
moyenne pondérée — une moyenne laisse passer une fiche sans sources si elle est
longue.

| Contrôle | Seuil |
| --- | --- |
| Champs obligatoires | tous remplis (`isPublishable` étendu) |
| Définition en clair | présente, ≤ 2 phrases |
| Signaux d'alerte | ≥ 4 |
| Vérification + protection + après-coup | non vides |
| Sources | ≥ 1 vérifiée |
| FAQ | ≥ 2 questions, réellement posées |
| Liens internes | ≥ 2 attaques liées, réciproques |
| Différenciation | aucune section identique à ≥ 85 % avec une autre fiche |
| Relecture | `editorialStatus === "published"` |

**Le nombre de mots n'est pas un critère.** Une fiche de 700 mots qui répond
peut valoir mieux qu'une de 2 500 qui tourne autour.

La détection de quasi-doublon (85 %) est le contrôle qui manque le plus
aujourd'hui : c'est celui qui empêche la génération en série de produire vingt
fiches à l'introduction interchangeable.

---

## 11. Plan de migration base de données

Le contenu ne retourne **pas** en base — la décision `0007` tient, et c'est elle
qui garantit qu'un déploiement publie le contenu. Ce qui bouge :

| Migration | Objet |
| --- | --- |
| `0006` | Renommer la catégorie `attaques-de-comptes` → `identifiants-et-comptes` **côté contenu uniquement** — aucune migration SQL nécessaire, la catégorie n'existe pas en base. |
| `0007_slug_redirects_retire` | La table `slug_redirects` n'est câblée à rien et le contenu vit dans le dépôt : marquer la table comme historique (commentaire), la redirection passe par `src/content/redirects.ts` + `next.config.ts`. |

C'est tout. **Aucune migration n'est requise pour passer de 20 à 100 fiches** —
ce qui est précisément le résultat recherché par la décision `0007`.

---

## 12. Séquencement

80 fiches à écrire au départ, dont 11 livrées au lot 3. Elles ne s'écrivent pas
d'un bloc — voir la note en fin de section.

| Lot | Contenu | Fiches | Cumul |
| --- | --- | --- | --- |
| **0** | Ce document, validé ou corrigé. | — | 20 |
| **1** ✅ | Structure : `aliases`, `plainLanguageDefinition`, `attackerObjective`, `editorialStatus`, redirections, seuil de hub à 3, audits anti-orphelin, de réciprocité et de quasi-doublon. | 0 | 20 |
| **2** ✅ | Renommage des 4 slugs + redirections, déplacement de 2 fiches, déclaration des 10 catégories *(6 encore sous le seuil, donc non routées)*. | 0 | 20 |
| **3** ✅ | Compléter les familles **3** (fraudes) et **1** (ingénierie sociale). | +11 | 31 |
| **4** ✅ | Famille **10** (chantage et harcèlement) — la plus attendue en urgence. | +10 | 41 |
| **5** ✅ | Leviers `/leviers/` + premiers guides `/guides/` + maillage complet. | 0 | 41 |
| **6** ✅ | Familles **4** (comptes) et **2** (sites et navigateurs). | +13 | 54 |
| **7** ✅ | Familles **6** (téléphones) et **9** (IA). | +19 | 73 |
| **8** ✅ | Familles **5** (malware) et **8** (données). | +19 | 92 |
| **9** ✅ | Famille **7** (réseaux). | +8 | **100** |
| **10** | Simulations pour toute fiche qui en justifie une. | — | ~60 simulations |

Un lot ne démarre pas tant que le précédent ne passe pas `pnpm seo:audit`,
`pnpm test` et le portail de qualité du §10.

**Ce que je ne recommande pas :** générer les fiches restantes en une fois. Chacune
contient des affirmations de sécurité qu'une personne suivra peut-être après
s'être fait piéger — la famille 10 tout particulièrement, où une mauvaise
marche à suivre peut aggraver une situation de violence. Le débit n'est pas la
contrainte ; la relecture l'est. Les lots sont dimensionnés pour rester
relisibles d'un seul tenant.

## 12 bis. Une limite constatée au lot 4, corrigée avant le lot 10

`CyberReflexDimensionCode` — les dimensions du profil de réflexes — avait été
défini quand le catalogue comptait vingt fiches, toutes consacrées à une
attaque reçue par message. À cent fiches et dix familles, quatre d'entre elles
ne parlent plus de juger un message, et le défaut se mesurait dans le contenu :
`account_security_awareness` portait **33 fiches** — logiciels malveillants,
téléphones, objets connectés et données personnelles s'y étaient tous
effondrés — et `social_engineering_resistance` portait la famille 10 entière.
Ces rattachements étaient vrais au sens le plus lâche et inutiles en pratique :
un profil ne peut pas signaler une faiblesse qu'il n'a pas de mot pour nommer.

Quatre dimensions ont été ajoutées (migration `0006`), et 37 fiches
réassignées :

| Dimension | Ce qu'elle mesure | Fiches |
| --- | --- | --- |
| `device_integrity_awareness` | Ce qui tourne sur l'appareil, ce qui y a été installé, et ce qu'on ne peut pas y voir | 17 |
| `network_trust_awareness` | Sur quel réseau je suis, et ce que cela change | 7 |
| `personal_data_exposure_awareness` | Ce qui est exposé, et qui le détient | 6 |
| `pressure_and_coercion_resistance` | Ne pas céder sous la menace, conserver les preuves, ne pas rester seul | 7 |

Aucune dimension n'est renommée ni supprimée : les lignes existantes de
`attempts` et de `learning_objectives` restent valides. Après réassignation,
la dimension la plus chargée en porte 17 sur 100 au lieu de 33, et chaque
famille est décrite par une dimension qui la concerne réellement.

Ces libellés ne sont affichés nulle part pour l'instant — il n'existe pas
encore de surface de score — mais ils conditionnent la sélection adaptative,
qui pousse les scénarios des dimensions les plus faibles. C'est le lot 10 qui
en dépend, d'où la correction maintenant.

## 12 ter. Une correction rétroactive imposée par le lot 7

La famille 9 rend fausse une consigne qui figurait déjà sur le site. Trois
fiches antérieures présentaient l'appel vidéo comme *la* vérification d'identité
(`arnaque-sentimentale`, sa FAQ, et `fausse-offre-d-emploi`). `deepfake-en-visioconference`
établit qu'un visage et une voix peuvent être synthétisés en direct : l'appel
accepté ne prouve plus rien.

Les trois passages ont été repris dans le même lot, avec la nuance exacte —
l'indice reste **asymétrique** : un refus persistant est révélateur, une
acceptation ne conclut pas. Publier la famille 9 sans les corriger aurait laissé
le site se contredire d'une page à l'autre.

Le point général : ajouter une famille peut périmer du contenu déjà publié.
Aucun audit automatique ne détecte ce genre de contradiction — elle se cherche à
la lecture, famille par famille, avant chaque publication.

## 12 quater. Trois fiches du lot 8 ne décrivent pas des attaques

`moissonnage-de-donnees`, `tracage-publicitaire-abusif` et
`revente-de-donnees-personnelles` relèvent de pratiques en grande partie
licites. Elles figurent dans la taxonomie parce qu'elles produisent la matière
que le reste du site décrit — un message frauduleux est crédible parce qu'il
connaît un achat réel — et parce que ce sont des requêtes que les visiteurs
formulent.

Chacune le dit explicitement plutôt que de suggérer une infraction. Présenter
du légal comme du criminel aurait deux coûts : la crédibilité du reste du
catalogue, et surtout la compréhension du lecteur, qui a besoin de savoir
*pourquoi* la situation ne s'arrête pas d'elle-même et où se situe réellement
son recours — la CNIL et l'exercice de ses droits, pas une plainte pénale.

Les affirmations juridiques y sont tenues au minimum vérifiable : l'existence
de droits (accès, effacement, opposition) et l'existence d'un recours. Aucun
délai, aucun montant, aucune qualification pénale — ils demanderaient une
vérification que cet environnement ne permet pas.

## 12 quinquies. La règle qui a cadré le lot 9

La famille 7 est celle où la frontière avec le manuel opératoire est la plus
proche : déauthentification, usurpation sur le réseau local, détournement de
résolution de noms et saturation de service sont tous des procédés qu'une
fiche trop précise apprendrait à reproduire. La règle retenue, inscrite en
tête du fichier, est de décrire chaque mécanisme au niveau qui permet de
reconnaître et de se protéger, jamais à celui qui permet de faire — aucun nom
d'outil, aucune commande, aucun détail de trame. `attaque-par-deauthentification`
le dit explicitement dans son corps de texte plutôt que de laisser un blanc.

Deuxième règle : ne pas surestimer la détectabilité. Pour la plupart de ces
procédés, la personne visée ne peut rien observer, et l'écrire est plus utile
qu'une liste de signes qui donnerait l'illusion d'un contrôle. La protection
y est structurelle — chiffrement de bout en bout, réseau de confiance, mises
à jour — et non comportementale. `interception-de-trafic` porte donc, en
premier signe d'alerte, « aucun signe ».

Troisième règle : corriger une idée reçue au lieu de la reprendre. « Sur un
Wi-Fi public on lit vos mots de passe » ne décrit plus la situation courante,
et le raisonnement tenu est mécanique, non statistique : une connexion
chiffrée de bout en bout ne livre pas son contenu à l'intermédiaire, qui voit
les destinations. Les risques résiduels réels sont nommés à la place — portail
captif, certificat installé, application ancienne non chiffrée. Une peur
imprécise finit par être ignorée en bloc ; trois points fermes sont tenables.

## 13. Points ouverts

Décidés dans cette révision, à contredire si besoin :

- **100 entités** — tenu, par remplacement des doublons (§3, §4).
- **Catégorie 8** — reportée, remplacée par *Chantage, harcèlement et atteintes à
  la personne* (§2.4). Réversible : elle reviendrait comme 11ᵉ famille sous
  `/vulnerabilites/`, sans toucher aux 100.
- **`vishing` / `faux-conseiller-bancaire`** — deux pages, frontière écrite en
  §4.1, réévaluées après 3 mois de Search Console.
- **`phishing-email` → `phishing`** — la fiche actuelle est écrite comme la
  variante email ; elle est réécrite en entité chapeau et l'ancien slug redirige
  (§6).

Restent ouverts, et un seul bloque quelque chose :

1. **Vérification des sources — bloquant à terme.** Cet environnement ne peut
   atteindre aucun site d'autorité (`CONNECT` refusé, HTTP 403). Les 4 URL
   vérifiées suffisent aux 20 fiches actuelles ; **elles ne suffiront pas à 100**.
   Il faut soit une CI avec accès sortant exécutant `check-references`, soit une
   relecture humaine de chaque nouvelle URL. Sans cela, les fiches des lots 3+
   citeront un jeu de sources plus étroit que ce qu'elles mériteraient.
2. **Famille 10 et rédaction sensible.** Sextorsion, stalkerware et diffusion non
   consentie touchent à des situations de violence. Je recommande de faire relire
   ces 10 fiches par quelqu'un connaissant le sujet avant publication, et de
   faire pointer chacune vers les dispositifs d'aide officiels plutôt que vers
   des conseils génériques.
3. **Nom de la 10ᵉ famille.** *Chantage, harcèlement et atteintes à la personne*
   est descriptif mais long. Alternative plus courte à trancher au lot 2.

Rien n'empêche de démarrer les lots 1 et 2 : ils ne touchent qu'à la structure.
