# Revue experte du lot 4 — chantage, harcèlement et atteintes à la personne

**Objet :** les dix fiches de `src/content/attacks/chantage-et-harcelement.ts`
**Date :** 2026-09-02
**Angles de relecture :** hacker éthique senior · analyste threat intelligence ·
spécialiste sensibilisation · accompagnement des victimes · vérification
factuelle et juridique

Cette revue a produit **six correctifs appliqués** et **une liste de huit
affirmations juridiques que je ne peux pas vérifier depuis cet environnement**.
Deux des défauts trouvés étaient des violations de nos propres règles.

---

## 1. Corrigé — sécurité de la personne

### C-1 · `stalkerware` — la recherche elle-même était visible *(critique)*

La fiche demandait d'examiner la liste des applications et les autorisations,
en précisant seulement de le faire « à un moment où vous n'êtes pas observé ».

**Ce qui manquait :** sur un appareil surveillé, *consulter cette page* est
visible. Chercher « stalkerware », ouvrir les paramètres de sécurité, lire un
article sur le sujet — tout cela remonte à la personne qui surveille, au même
titre que les messages. C'est l'avertissement le plus important de tout
accompagnement en matière de stalkerware, et il était absent.

**Correctif :** `howToVerify` s'ouvre désormais sur « ne faites pas ces
recherches depuis l'appareil que vous soupçonnez », avec l'indication d'un
appareil de substitution, *avant* toute instruction technique.

### C-2 · `sextorsion` — le cas des mineurs était une subordonnée *(critique)*

Le 3018 et la mention des mineurs arrivaient en fin de paragraphe, dans une
proposition subordonnée, comme une précision.

**Ce qui n'allait pas :** la sextorsion visant un mineur est une situation
distincte — infraction spécifique, urgence différente — et le message décisif
(« parles-en à un adulte tout de suite ») ne peut pas être une incise.

**Correctif :** paragraphe autonome, en deuxième position dans
`whatToDoIfVictim`, qui nomme la gravité, l'urgence, et le fait que ne pas oser
en parler est exactement ce sur quoi l'auteur compte.

### C-3 · `chantage-au-faux-piratage` — une garantie absolue et dangereuse *(haute)*

La fiche affirmait : « Aucune diffusion ne suivra un refus de payer, car il n'y
a rien à diffuser. »

**Ce qui n'allait pas :** cette phrase est vraie du chantage de masse, et fausse
pour une victime de sextorsion réelle qui atterrirait sur cette page en cherchant
« chantage webcam ». Pour elle, c'est une garantie rassurante et fausse.

**Correctif :** l'affirmation est conditionnée à l'absence d'élément réellement
personnel, et la fiche renvoie explicitement vers `sextorsion` lorsqu'un contenu
a été montré ou qu'un échange intime a eu lieu.

---

## 2. Corrigé — nos propres règles, enfreintes par nous

### C-4 · Une statistique de prévalence sans source *(haute)*

« Dans l'immense majorité des cas, rien n'existe. »

`ANTI_HALLUCINATION` interdit les affirmations de prévalence sans source, et je
n'en ai aucune pour « immense majorité ». C'est exactement le type de phrase que
la règle vise, écrite par la personne qui a posé la règle.

**Correctif :** remplacée par une affirmation vérifiable *sur le mécanisme* —
le message est envoyé à l'identique à des milliers de destinataires et ne
contient aucun élément propre au destinataire — qui produit la même conclusion
sans invoquer de fréquence.

### C-5 · Explication de l'usurpation d'expéditeur incomplète *(moyenne)*

« L'adresse d'expéditeur est un champ librement modifiable » est exact mais
laissait le lecteur sans moyen de le constater lui-même.

**Correctif :** ajout du test que le lecteur peut faire seul — le message ne
figure pas dans son dossier d'envois, parce qu'il n'en est jamais parti.

### C-6 · `swatting` — une nuance juridique non sourçable *(basse)*

« infraction pénale **distincte** » : l'adjectif affirme une qualification que
je ne peux pas vérifier. Supprimé ; l'affirmation générale demeure.

---

## 3. Non corrigé — décision assumée

### D-1 · `doxxing` décrit la méthode de recoupement

La section « comment ça fonctionne » énumère ce qui se recoupe : pseudonyme
réutilisé, arrière-plan d'une photo, avis laissé sur un commerce, registre
public, ancienne annonce. Lue autrement, c'est une liste de départ pour
quelqu'un qui cherche à localiser une personne.

**Décision : conservé.** C'est le cas d'usage double classique, et il penche ici
du bon côté. La fiche demande au lecteur de faire exactement cet exercice sur
lui-même (`howToVerify` : « recherchez votre nom comme le ferait un tiers »), ce
qui est inutilisable sans savoir quoi chercher. Aucun outil, aucune source de
données, aucune technique d'agrégation n'est nommée : le niveau de détail reste
celui de n'importe quel guide de sensibilisation, et en dessous de ce qu'un
attaquant sait déjà.

### D-2 · Sept fiches sur dix partagent la même dimension de réflexe

`CyberReflexDimensionCode` n'a pas été conçu pour cette famille (voir
`docs/CONTENT_TAXONOMY_PLAN.md` §12 bis). Exact mais peu informatif. Non
corrigé ici : la dimension est contrainte par une clé étrangère en base et
demande une migration, ce qui n'a pas sa place dans un lot de contenu.

---

## 4. À faire vérifier — huit affirmations juridiques

Je ne peux atteindre aucune source juridique depuis cet environnement (le proxy
refuse `CONNECT`, HTTP 403). Ces affirmations sont, à ma connaissance, conformes
au droit français, et elles sont utiles à une victime — savoir qu'un dépôt de
plainte a un fondement change ce qu'elle fait. Mais **elles sont énoncées sans
source vérifiée**, et doivent être confirmées par un juriste avant publication.

| Fiche | Affirmation | À confirmer |
| --- | --- | --- |
| `sextorsion` | « la sextorsion est une infraction pénale » | Qualification et article applicable |
| `sextorsion` | « les images d'un mineur relèvent d'une infraction spécifique » | Régime distinct pour les mineurs |
| `diffusion-non-consentie-d-images` | « pénalement réprimée en France, y compris entre anciens partenaires » | Article, et le fait que le lien conjugal ne soit pas exonératoire |
| `doxxing` | « le droit français vise cette mise à disposition malveillante » | Existence d'une incrimination visant la publication de données pour nuire |
| `stalkerware` | « surveiller les communications d'une personne majeure sans son consentement est pénalement réprimé, y compris au sein d'un couple » | Article, et l'absence d'exception conjugale |
| `cyberharcelement` | « la plainte peut viser des auteurs multiples » | Disposition sur la répétition résultant de plusieurs auteurs agissant séparément |
| `raid-de-harcelement` | « le droit français prévoit le cas d'une répétition résultant d'auteurs multiples agissant de façon concertée » | Même disposition, formulation « concertée » |
| `usurpation-de-profil-sur-les-reseaux-sociaux` | « l'usurpation d'identité numérique est une infraction pénale » | Article applicable |

**Recommandation :** aucune ne cite de numéro d'article, ce qui est le bon niveau
de prudence — une référence fausse serait pire qu'une affirmation générale. Elles
peuvent rester telles quelles si un juriste les confirme, ou être reformulées en
« peut relever de » si le doute subsiste.

Les numéros d'appel cités — 17, 112, 114 par SMS, 3018, 3919 — relèvent de la
même exigence : ils sont à confirmer par quelqu'un disposant d'un accès sortant.

---

## 5. Ce que la revue n'a pas trouvé

- **Aucune statistique, date, victime, organisation ou acteur malveillant
  fabriqués** en dehors de C-4, corrigé.
- **Aucun contenu opérationnel.** Aucune fiche ne donne de charge utile, de
  procédure d'installation, de script, ni de moyen de se procurer un outil. Les
  mécanismes restent au niveau descriptif nécessaire à la détection.
- **Aucune formulation culpabilisante.** Vérifié fiche par fiche : envoyer une
  image à un partenaire, accepter un appel vidéo, publier sous son nom, faire
  confiance — chacune est nommée comme n'étant pas une faute là où le sujet se
  pose.
- **Aucune référence non vérifiée** : les dix fiches ne citent que les quatre URL
  du registre `VERIFIED_REFERENCES`.

---

## 6. Avis

Les dix fiches sont **publiables sous réserve de la section 4**. Les trois
défauts critiques ou hauts touchaient tous à la même chose : une formulation
juste en général qui devenait fausse ou dangereuse pour la personne précise en
train de la lire. C'est le mode de défaillance propre à cette famille, et il
justifie que ces dix fiches restent en relecture externe alors que les
quatre-vingt-dix autres n'en ont pas besoin.

---

# Deuxième passe — lots 4 et 5

**Date :** 2026-09-02, après publication du lot 5.
**Méthode :** contrôles automatisés plutôt que relecture d'impression — une
mesure de convergence des textes sur tout le catalogue, et un balayage des
formulations de fréquence. Quatre défauts trouvés, dont un dans un contrôle
censé attraper les trois autres.

## D-1 · Le contrôle anti-doublon ne regardait pas les champs d'action *(haute)*

`findNearDuplicates` comparait `definition`, `howItWorks` et
`plainLanguageDefinition`. Pas `howToVerify`, pas `whatToDo`, pas
`whatToDoIfVictim`.

Résultat mesuré : `fausse-amende` et `faux-remboursement` partageaient un
`whatToDo` **identique à 88 %** — au-dessus du seuil d'échec — sans que le build
s'en aperçoive, parce que le champ n'était pas regardé. Ce sont pourtant les
champs sur lesquels un lecteur agit.

**Correctifs :** les trois champs d'action entrent dans le périmètre ; un
plancher de 25 mots significatifs est ajouté, parce que les impératifs courts
convergent légitimement — « ne saisissez aucune coordonnée bancaire » est le bon
conseil dans une douzaine de fiches et le reformuler par souci de nouveauté
dégraderait le site. Le `whatToDo` de `fausse-amende` est réécrit autour de ce
qui lui est propre : la vérification en trente secondes sur le service officiel,
et le fait qu'un avis réel arrive par courrier.

Deux tests ajoutés : l'un échoue si un champ d'action dupliqué n'est pas
détecté, l'autre échoue si un impératif court l'est à tort.

## D-2 · Le lot 5 a répété la faute corrigée au lot 4 *(haute)*

Le balayage des formulations de fréquence a trouvé quatre affirmations non
sourcées dans le guide `comment-un-mot-de-passe-est-vole` :

- « Dans la plupart des cas ils l'ont déjà »
- « presque toujours fausse aujourd'hui »
- « C'est le chemin le plus fréquent »
- « Il arrive presque toujours par une action volontaire »

Ce sont des classements de vecteurs d'attaque par fréquence, c'est-à-dire de la
donnée de threat intelligence, et je n'ai aucune source. C'est exactement le
défaut C-4 corrigé au lot 4 — reproduit un lot plus tard, dans un guide qui
prétend expliquer comment les choses se passent réellement.

**Correctif :** chaque affirmation est remplacée par un raisonnement mécanique
qui produit la même conclusion sans invoquer de fréquence. « Deviner est rare »
devient « les services limitent les tentatives et verrouillent le compte, ce qui
rend cette voie impraticable quelle que soit la puissance de calcul » — plus
utile, et vérifiable par le lecteur.

Le levier `rareté` affirmait de même que la rareté est « presque toujours
fabriquée ». Reformulé : une rareté annoncée n'a pas besoin d'être réelle pour
fonctionner.

**Conservées :** les formulations qui décrivent un comportement humain plutôt
qu'une statistique d'attaque (« nous n'authentifions presque jamais : nous
reconnaissons »), et les couvertures prudentes du type « il vient souvent d'une
fuite de données ». La règle vise les statistiques inventées, pas toute
quantification.

## D-3 · Le guide sur les liens enseignait une règle fausse *(haute)*

`verifier-un-lien-avant-de-cliquer` demandait de « reculer de deux mots » depuis
la première barre oblique pour trouver le propriétaire d'un domaine.

C'est faux pour toute extension composée. Sur `impots.gouv.fr`, reculer de deux
mots donne « gouv.fr » et désigne l'État plutôt que l'organisme ; sur un `.co.uk`
la règle se trompe pareillement. Un guide qui enseigne une méthode doit être
juste sur les cas que le lecteur rencontre — les administrations françaises en
sont un.

**Correctif :** la règle devient « lisez de droite à gauche jusqu'à rencontrer le
nom de l'organisme ; s'il n'arrive pas tout de suite, vous n'êtes pas chez lui »,
avec le cas des extensions composées traité explicitement.

## D-4 · Convergence sous le seuil, à surveiller *(basse)*

`faux-conseiller-bancaire` et `smishing` partagent 73 % de leur `howToVerify`.
Sous le seuil d'échec, et légitime — les deux se vérifient en rappelant le
numéro au dos de la carte. Noté ici pour que la paire soit revue si l'une des
deux fiches est retouchée.

## Ce que cette passe dit du dispositif

Les quatre défauts ont été trouvés par des mesures, pas par une relecture. Les
deux premiers étaient invisibles à l'œil : un contrôle qui ne regarde pas un
champ ne signale rien, et une formulation de fréquence se lit comme une phrase
ordinaire. La leçon opérationnelle est que les garde-fous doivent eux-mêmes être
audités — D-1 est un contrôle qui laissait passer précisément ce qu'il existait
pour attraper.
