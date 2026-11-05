# Vérifications restantes

Audit du 2026-10-08 (`official-resources-audit.md`). Cette liste ne contient
que ce qui n'a pas pu être établi.

## Blocage commun

Toutes les sources primaires sont **inaccessibles** depuis l'environnement de
travail. Le proxy refuse les connexions (`CONNECT tunnel failed, response
403`) et l'outil de lecture de pages ne résout pas les domaines.

Deux façons de lever le blocage :
- **ouvrir l'accès réseau** de l'environnement à ces domaines : Network access
  dans les réglages de l'environnement cloud, avec les domaines ajoutés aux
  domaines autorisés ;
- **faire vérifier par une personne** qui ouvre les pages et reporte, pour
  chaque point, « confirmé », « corrigé » (libellé exact) ou « retiré ».

Dans les deux cas, commencer par `pnpm sources:check --write` : le script
teste chaque lien officiel cité par le site et chaque page ci-dessous, puis
écrit `docs/audits/source-check-AAAA-MM-JJ.md`. Une page qui répond est
« joignable », pas « confirmée » : son contenu reste à lire.

Domaines nécessaires : `legifrance.gouv.fr`, `service-public.gouv.fr`,
`service-public.fr`, `cybermalveillance.gouv.fr`, `17cyber.gouv.fr`,
`cnil.fr`, `33700.fr`, `signal-spam.fr`, `internet-signalement.gouv.fr`,
`interieur.gouv.fr`, `police-nationale.interieur.gouv.fr`, `3018.fr`,
`e-enfance.org`, `arretonslesviolences.gouv.fr`, `solidaritefemmes.org`,
`info.urgence114.fr`, `justice.fr`, `france-victimes.fr`, `economie.gouv.fr`,
`unicode.org`.

## Par ordre de priorité

| Priorité | Élément | Question à trancher | Page à ouvrir | Si la réponse change le contenu |
| ---: | --- | --- | --- | --- |
| 1 | 3018 (A14) | Le service accueille-t-il les **adultes** victimes de harcèlement en ligne ? | 3018.fr, e-enfance.org | Si mineurs seulement : réécrire cyberharcelement, raid-de-harcelement, diffusion-non-consentie-d-images et detournement-de-photos-par-ia (FR et EN) avec un parcours adulte vérifié (plainte, PHAROS pour les contenus publics, 116 006). La fiche sextorsion (mineurs) reste juste. |
| 2 | URL du faux support technique (A24) | L'URL citée répond-elle, ou faut-il citer la fiche réflexe ? | cybermalveillance.gouv.fr | Mettre à jour `VERIFIED_REFERENCES.fakeSupport` dans `src/content/attacks/types.ts` : 5 fiches suivront automatiquement. |
| 3 | Démarchage téléphonique (A12) | Texte exact de l'article L223-1 du code de la consommation depuis le 11/08/2026 ; sort de Bloctel ; recours du consommateur | legifrance.gouv.fr, economie.gouv.fr | Le site ne décrit plus l'ancien régime. On pourra décrire le nouveau (consentement préalable) une fois le texte lu. |
| 4 | Doxxing (A15) | Texte de l'article 223-1-1 du code pénal | legifrance.gouv.fr | Citer l'article et ses conditions dans la fiche (FR et EN), sans afficher de peine maximale comme automatique. |
| 5 | 17Cyber (B1) | Adresse officielle, public, parcours | 17cyber.gouv.fr, cybermalveillance.gouv.fr | L'ajouter à `/sources` et aux fiches qui orientent vers cybermalveillance.gouv.fr. |
| 6 | Plainte en ligne, THESEE, Perceval (B3, B6) | Périmètres et conditions actuels | service-public.gouv.fr | Distinguer, dans les fiches de fraude, le signalement et la plainte en ligne. |
| 7 | 116 006, Info Escroqueries (B4, B5) | Horaires, gratuité, périmètre | justice.fr, france-victimes.fr, interieur.gouv.fr | Ajout éventuel à `/sources`, sans horaire non vérifié. |
| 8 | Signal Spam (B2) | Périmètre | signal-spam.fr | Ajout éventuel aux fiches phishing et hameconnage-genere-par-ia. |
| 9 | Articles 226-2-1, 226-8, 226-8-1, 222-33-2-2 ; loi n° 2024-449 (A4–A6, A16–A18) | Textes en vigueur | legifrance.gouv.fr | Le site ne cite ni article ni peine. Citation éventuelle après lecture. |
| 10 | Liens restants (A22, A23, A25–A27) et numéros 33700, 3919, 17, 114 (A1, A3, A7, A10) | Existence et libellé exacts | sites respectifs | Passage en CONFIRMÉ ; date `updatedAt` avancée sur les fiches relues. |
| 11 | Hébergeur (CGU §1, ajouté le 2026-10-12) | Adresse postale exacte de Vercel Inc. (la loi française demande le nom, l'adresse et le téléphone de l'hébergeur) | Mentions légales et conditions de vercel.com | Compléter `PUBLISHER.host` dans `src/lib/publisher.ts`. La ville seule est affichée tant que l'adresse n'est pas lue à la source. |

## Ce qui n'a pas été exécuté

- **Vérification des liens externes :** impossible, réseau bloqué.
- **Revue juridique professionnelle :** non réalisée ; cet audit est
  documentaire.
