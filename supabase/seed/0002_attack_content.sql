-- ============================================================
-- Seed 0002 — complete and publish the eight stub attacks.
--
-- WHY THIS EXISTS
-- Seed 0001 inserts nine attacks but publishes exactly one: the other
-- eight carry only a one-line `definition`, so they fail the publish gate
-- (definition + how_it_works + warning_signs + at least one trigger or
-- indicator). The result is that a correctly-migrated, correctly-seeded
-- production still renders a single card on /attaques — which reads as an
-- empty page. See docs/BLANK_PAGES_ROOT_CAUSE.md.
--
-- This file fills in real content for those eight and publishes them.
--
-- CONTENT RULES (docs/decisions/0002-synthetic-content-only.md, brief §14)
--   * No fabricated statistics, incidents, victims, dates or organisations.
--   * Every `references` entry points to a real public authority page.
--   * Mechanisms are described generically; nothing here is operational
--     guidance for conducting an attack.
--
-- Idempotent: safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- PHISH-000001 — Phishing (email)
-- ------------------------------------------------------------
update attacks set
  definition = 'L''hameçonnage par email est un message frauduleux qui imite un expéditeur légitime — banque, administration, service en ligne, employeur — pour obtenir des identifiants, des données bancaires, ou faire ouvrir une pièce jointe malveillante.',
  how_it_works = 'L''attaquant envoie un email reprenant l''identité visuelle d''un organisme connu : logo, mise en page, ton habituel. Le message annonce un problème à régler rapidement (compte suspendu, facture impayée, colis bloqué) et propose un lien. Ce lien mène à une page de connexion imitant le site officiel. Tout ce qui y est saisi part directement chez l''attaquant, qui s''en sert immédiatement pour se connecter au vrai service.',
  warning_signs = array[
    'Adresse d''expéditeur qui ne correspond pas au domaine officiel de l''organisme',
    'Demande de « confirmer » ou « vérifier » des identifiants via un lien',
    'Urgence ou menace de conséquence immédiate (suspension, pénalité)',
    'Formulation impersonnelle (« Cher client ») alors que l''organisme connaît votre nom',
    'Pièce jointe inattendue, en particulier un fichier à activer ou à autoriser'
  ],
  how_to_verify = 'N''utilisez pas le lien du message. Ouvrez votre navigateur et rejoignez le service par un chemin que vous maîtrisez : un favori enregistré, l''application officielle, ou l''adresse saisie à la main. Si le message était authentique, l''information s''y retrouvera.',
  what_to_do = 'Ne cliquez pas, ne répondez pas, ne téléchargez pas la pièce jointe. Signalez le message comme hameçonnage dans votre messagerie, puis supprimez-le.',
  what_to_do_if_victim = 'Changez immédiatement le mot de passe du compte concerné, puis celui de tout autre compte réutilisant le même mot de passe. Activez la double authentification. Si des données bancaires ont été saisies, contactez votre banque sans attendre. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Comment distinguer un vrai email de ma banque d''un faux ?", "answer": "Une banque ne demande jamais vos identifiants complets, votre code secret ou un code reçu par SMS, quel que soit le canal. En cas de doute, n''utilisez pas le lien : passez par l''application officielle ou le numéro figurant au dos de votre carte."},
    {"question": "Est-ce dangereux d''avoir simplement ouvert l''email ?", "answer": "Ouvrir un email est rarement suffisant pour compromettre un appareil. Le risque vient de ce que l''on fait ensuite : cliquer sur le lien, saisir des informations, ou ouvrir une pièce jointe."},
    {"question": "J''ai cliqué sur le lien mais rien saisi, que faire ?", "answer": "Le risque principal reste limité si aucune information n''a été saisie et aucun fichier téléchargé. Par précaution, vérifiez l''activité récente du compte concerné et changez son mot de passe."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'PHISH-000001';

-- ------------------------------------------------------------
-- SOCIAL-000001 — Faux conseiller bancaire
-- ------------------------------------------------------------
update attacks set
  definition = 'L''usurpation de conseiller bancaire est un appel téléphonique dans lequel l''attaquant se fait passer pour le service anti-fraude de votre banque afin de vous faire valider vous-même une opération frauduleuse.',
  how_it_works = 'L''attaquant appelle en affichant parfois le numéro réel de la banque, technique connue sous le nom d''usurpation de numéro. Il annonce détecter une opération suspecte et propose de la « bloquer ». Pour cela, il demande de confirmer un code reçu par SMS, de valider une notification dans l''application bancaire, ou d''effectuer un virement vers un « compte sécurisé ». Chacune de ces actions autorise en réalité l''opération frauduleuse : c''est la victime elle-même qui valide, ce qui rend la contestation ultérieure plus difficile.',
  warning_signs = array[
    'Appel non sollicité annonçant une fraude en cours sur votre compte',
    'Demande de communiquer ou de valider un code reçu par SMS',
    'Demande de virement vers un prétendu « compte sécurisé » ou « compte tampon »',
    'Insistance pour rester en ligne et ne raccrocher sous aucun prétexte',
    'Pression pour agir avant de vérifier auprès de quelqu''un d''autre'
  ],
  how_to_verify = 'Raccrochez, sans exception. Rappelez ensuite votre banque au numéro figurant au dos de votre carte ou dans l''application officielle. Un conseiller légitime ne vous reprochera jamais d''avoir raccroché pour vérifier.',
  what_to_do = 'Ne communiquez aucun code, ne validez aucune notification, n''effectuez aucun virement pendant l''appel. Une banque ne demande jamais de déplacer de l''argent pour le protéger.',
  what_to_do_if_victim = 'Contactez immédiatement votre banque pour faire opposition et signaler l''opération. Déposez plainte. Conservez les traces disponibles : heure de l''appel, numéro affiché, montants. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le numéro affiché était bien celui de ma banque, est-ce possible ?", "answer": "Oui. L''affichage du numéro appelant peut être falsifié. Un numéro correct ne prouve donc jamais l''identité de l''interlocuteur, et ne doit pas servir de critère de confiance."},
    {"question": "Pourquoi ma banque ne me rembourse-t-elle pas automatiquement ?", "answer": "Parce que les opérations ont été validées depuis vos propres dispositifs d''authentification. C''est précisément l''objectif de l''attaque. Cela ne vous prive pas de recours : contestez par écrit auprès de votre banque, et déposez plainte."},
    {"question": "Un vrai conseiller peut-il me demander un code SMS ?", "answer": "Non. Aucun code d''authentification ne doit être communiqué à qui que ce soit, y compris à une personne se présentant comme votre banque ou comme la police."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'SOCIAL-000001';

-- ------------------------------------------------------------
-- SOCIAL-000002 — Faux livreur / colis en attente
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au colis est un SMS ou un email prétendant qu''une livraison est bloquée et qu''un petit paiement — frais de douane, de réexpédition, d''ajustement — est nécessaire pour la débloquer.',
  how_it_works = 'Le message imite un transporteur connu et annonce un colis en attente. Le montant réclamé est volontairement faible, souvent quelques euros, car une petite somme déclenche moins de méfiance qu''un montant important. La page de paiement collecte les coordonnées bancaires complètes. Celles-ci servent ensuite à des débits nettement supérieurs, ou à souscrire un abonnement récurrent. L''attaque fonctionne parce qu''elle arrive à un moment plausible : beaucoup de gens attendent effectivement une livraison.',
  warning_signs = array[
    'Frais réclamés pour un colis que vous n''avez pas commandé, ou dont le transporteur ne correspond pas',
    'Montant faible mais paiement par carte demandé en ligne',
    'Lien menant à un domaine qui n''est pas le site officiel du transporteur',
    'Message reçu alors qu''aucune livraison n''est en cours',
    'Absence de numéro de suivi vérifiable sur le site officiel'
  ],
  how_to_verify = 'Retrouvez le numéro de suivi dans la confirmation de commande d''origine, puis saisissez-le vous-même sur le site officiel du transporteur. Ne suivez jamais le lien du message pour vérifier le message lui-même.',
  what_to_do = 'Ne payez pas, ne saisissez pas votre carte. Supprimez le message. En France, un SMS frauduleux peut être transféré au 33700.',
  what_to_do_if_victim = 'Faites opposition sur votre carte immédiatement et surveillez les prélèvements des semaines suivantes, notamment les abonnements récurrents. Contestez les débits auprès de votre banque et déposez plainte.',
  faq = '[
    {"question": "Le montant demandé était minuscule, où est le risque ?", "answer": "Le paiement n''est pas l''objectif : la collecte de vos coordonnées bancaires l''est. Le faible montant sert uniquement à obtenir la saisie complète de la carte."},
    {"question": "J''attends vraiment un colis, comment savoir ?", "answer": "Un transporteur légitime rattache toujours la démarche à un numéro de suivi que vous pouvez vérifier vous-même sur son site officiel. Vérifiez ce numéro par vos propres moyens, jamais via le lien reçu."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'SOCIAL-000002';

-- ------------------------------------------------------------
-- SOCIAL-000003 — Faux support technique
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au faux support technique fait croire que votre ordinateur est infecté ou bloqué, afin d''obtenir un accès à distance à la machine ou le paiement d''une assistance inutile.',
  how_it_works = 'Le point de départ est souvent une page web affichant une alerte alarmante, parfois accompagnée d''un son et d''un message empêchant de fermer la fenêtre, avec un numéro à appeler. Au téléphone, un interlocuteur se présentant comme technicien demande d''installer un logiciel de prise en main à distance — outil légitime, détourné de son usage. Une fois connecté, il montre des éléments anodins du système présentés comme des preuves d''infection, puis facture une intervention, souscrit un abonnement, ou installe un logiciel malveillant.',
  warning_signs = array[
    'Page web ou fenêtre affichant une alerte de sécurité avec un numéro de téléphone à appeler',
    'Impossibilité apparente de fermer la fenêtre d''alerte',
    'Demande d''installer un outil de prise de contrôle à distance',
    'Éditeur légitime invoqué (système d''exploitation, antivirus) alors qu''aucun éditeur n''appelle spontanément',
    'Paiement demandé par carte, virement ou cartes prépayées'
  ],
  how_to_verify = 'Aucun éditeur de logiciel ni fournisseur d''accès ne détecte une infection sur votre machine à distance pour vous appeler ensuite. Une alerte affichée dans un navigateur est une page web, pas un diagnostic de votre appareil : fermez l''onglet, au besoin en fermant le navigateur.',
  what_to_do = 'N''appelez pas le numéro affiché, n''installez aucun logiciel de prise en main. Fermez le navigateur et, si nécessaire, redémarrez l''appareil.',
  what_to_do_if_victim = 'Déconnectez l''appareil d''internet, désinstallez tout outil de prise à distance installé pendant l''appel et faites analyser la machine. Changez vos mots de passe depuis un autre appareil sain, en commençant par la messagerie et la banque. Faites opposition si un paiement a été effectué, et signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le technicien m''a montré des erreurs dans le système, ce n''était pas réel ?", "answer": "Les éléments affichés sont généralement des journaux d''événements normaux, présents sur toute machine en bon état, présentés comme des preuves d''infection. C''est un procédé de mise en scène, pas un diagnostic."},
    {"question": "J''ai laissé quelqu''un prendre la main sur mon ordinateur, que risque-t-il d''avoir vu ?", "answer": "Tout ce qui était accessible sur la session : fichiers, messagerie, mots de passe enregistrés dans le navigateur, sessions ouvertes. Changez vos mots de passe depuis un autre appareil et faites vérifier la machine."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Faux support technique", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/faux-support-technique-arnaque"}]'::jsonb
where code = 'SOCIAL-000003';

-- ------------------------------------------------------------
-- PAYMENT-000001 — Faux remboursement
-- ------------------------------------------------------------
update attacks set
  definition = 'L''arnaque au faux remboursement annonce qu''une somme vous est due — impôts, mutuelle, énergie, abonnement — et demande vos coordonnées bancaires pour « procéder au versement ».',
  how_it_works = 'Le message reprend l''identité d''un organisme public ou d''un fournisseur et annonce un trop-perçu à restituer. La perspective de recevoir de l''argent réduit la vigilance : contrairement à une menace, une bonne nouvelle n''éveille pas la méfiance. Le formulaire demande les coordonnées bancaires complètes, souvent le numéro de carte plutôt qu''un simple IBAN — détail révélateur, car un remboursement ne nécessite jamais un numéro de carte complet avec date d''expiration et cryptogramme.',
  warning_signs = array[
    'Remboursement annoncé sans démarche préalable de votre part',
    'Demande du numéro de carte bancaire complet, avec cryptogramme, pour recevoir de l''argent',
    'Délai imposé pour « réclamer » la somme sous peine de la perdre',
    'Montant précis destiné à rendre le message crédible',
    'Domaine du lien différent du site officiel de l''organisme'
  ],
  how_to_verify = 'Connectez-vous à votre espace personnel officiel par vos propres moyens. Un remboursement réel y figure. Un organisme public ne réclame jamais un numéro de carte pour verser de l''argent : un versement se fait sur un IBAN déjà connu.',
  what_to_do = 'Ne saisissez aucune coordonnée bancaire. Supprimez le message et signalez-le comme frauduleux.',
  what_to_do_if_victim = 'Faites opposition sur votre carte, surveillez les prélèvements suivants et contestez les débits non autorisés auprès de votre banque. Déposez plainte et signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Pourquoi demander une carte bancaire pour un remboursement ?", "answer": "C''est précisément le signal d''alerte. Un versement ne nécessite qu''un IBAN. La demande d''un numéro de carte complet, avec date d''expiration et cryptogramme, ne sert qu''à débiter, jamais à créditer."},
    {"question": "Le message reprenait exactement le logo de l''administration.", "answer": "Un logo se copie en quelques secondes. L''apparence d''un message ne constitue jamais une preuve d''authenticité : seul l''accès à votre espace officiel, par vos propres moyens, permet de vérifier."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'PAYMENT-000001';

-- ------------------------------------------------------------
-- IDN-000001 — Typosquatting
-- ------------------------------------------------------------
update attacks set
  definition = 'Le typosquatting consiste à enregistrer un nom de domaine très proche d''un site légitime — une lettre en moins, une inversion, une extension différente — pour capter les visiteurs qui se trompent en saisissant l''adresse ou qui lisent trop vite.',
  how_it_works = 'L''attaquant enregistre des variantes plausibles du domaine visé : faute de frappe courante, doublement ou omission d''une lettre, tiret ajouté, extension différente. Le site hébergé reproduit l''apparence de l''original. Le visiteur, persuadé d''être au bon endroit, s''y connecte normalement. La technique se combine souvent avec l''hameçonnage : le domaine trompeur sert de destination à un lien envoyé par email ou SMS, où il paraît crédible à la lecture.',
  warning_signs = array[
    'Adresse presque identique à celle attendue, à une lettre ou un caractère près',
    'Extension inhabituelle pour l''organisme concerné',
    'Tiret inséré dans un nom de domaine qui n''en comporte pas habituellement',
    'Page de connexion demandant des identifiants après un lien reçu par message',
    'Absence des éléments personnalisés habituels une fois « connecté »'
  ],
  how_to_verify = 'Lisez l''adresse en partant de la fin du nom de domaine, juste avant la première barre oblique : c''est cette partie qui détermine à qui appartient réellement le site. Le plus sûr reste de ne pas saisir l''adresse du tout et d''utiliser un favori enregistré une fois pour toutes.',
  what_to_do = 'Ne saisissez aucun identifiant. Quittez la page et rejoignez le site par un favori ou l''application officielle.',
  what_to_do_if_victim = 'Changez immédiatement le mot de passe du service concerné, ainsi que celui de tout compte réutilisant le même mot de passe. Activez la double authentification et vérifiez les connexions récentes du compte.',
  faq = '[
    {"question": "Quelle différence avec une attaque par homoglyphes ?", "answer": "Le typosquatting utilise des caractères ordinaires arrangés différemment — une faute de frappe crédible. L''attaque par homoglyphes utilise des caractères différents mais visuellement identiques, ce qui la rend indétectable à la simple lecture."},
    {"question": "Le cadenas était affiché, le site n''était-il pas sécurisé ?", "answer": "Le cadenas indique seulement que la connexion est chiffrée, pas que le site est légitime. N''importe quel site, y compris frauduleux, peut obtenir un certificat."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'IDN-000001';

-- ------------------------------------------------------------
-- IDN-000002 — Attaque par homoglyphes
-- ------------------------------------------------------------
update attacks set
  definition = 'Une attaque par homoglyphes utilise des caractères issus d''alphabets différents mais visuellement identiques aux caractères latins pour composer une adresse web qui paraît authentique à la lecture, tout en désignant un domaine entièrement distinct.',
  how_it_works = 'Plusieurs systèmes d''écriture partagent des formes de lettres identiques ou quasi identiques : certaines lettres cyrilliques ou grecques sont indiscernables de leurs équivalents latins à l''œil nu. En substituant une seule de ces lettres dans un nom de domaine, l''attaquant obtient une adresse qui s''affiche comme l''originale mais pointe vers son propre serveur. Contrairement au typosquatting, il n''y a ici aucune faute à repérer : la lecture attentive ne suffit pas, car les caractères sont réellement différents pour la machine tout en étant identiques pour l''œil. Les navigateurs se défendent en affichant ces domaines sous leur forme technique encodée lorsqu''ils mélangent des alphabets.',
  warning_signs = array[
    'Adresse affichée sous une forme technique commençant par « xn-- », signe d''un domaine internationalisé',
    'Avertissement du navigateur signalant un domaine mêlant plusieurs alphabets',
    'Lien reçu par message dont l''adresse paraît pourtant parfaitement correcte',
    'Page de connexion atteinte via un lien plutôt que par un favori',
    'Le gestionnaire de mots de passe ne propose pas de remplir le formulaire'
  ],
  how_to_verify = 'Le signal le plus fiable est le comportement de votre gestionnaire de mots de passe : il associe vos identifiants au domaine réel, pas à son apparence. S''il ne propose rien sur un site que vous utilisez habituellement, considérez que le domaine n''est pas celui attendu. Sinon, rejoignez le service par un favori enregistré.',
  what_to_do = 'Ne saisissez aucun identifiant. Fermez l''onglet et accédez au service par un chemin que vous maîtrisez.',
  what_to_do_if_victim = 'Changez le mot de passe du service concerné depuis une session ouverte par vos propres moyens, activez la double authentification et vérifiez l''historique de connexion du compte.',
  faq = '[
    {"question": "Comment vérifier une adresse qui semble identique à la vraie ?", "answer": "Ne vous fiez pas à la lecture : c''est précisément ce que l''attaque contourne. Fiez-vous au comportement de votre gestionnaire de mots de passe, ou n''utilisez pas le lien du tout et passez par un favori."},
    {"question": "Cette attaque fonctionne-t-elle aussi sur téléphone ?", "answer": "Oui, et le risque y est accru : les navigateurs mobiles affichent l''adresse de façon tronquée, ce qui laisse encore moins d''éléments visibles pour repérer une anomalie."},
    {"question": "Que signifie une adresse commençant par xn-- ?", "answer": "C''est la forme encodée d''un domaine contenant des caractères non latins. Ce n''est pas frauduleux en soi, mais voir cette forme là où vous attendiez un nom ordinaire justifie de ne pas s''y connecter."}
  ]'::jsonb,
  "references" = '[
    {"label": "Unicode Consortium — Unicode Security Considerations (UTS #36)", "url": "https://www.unicode.org/reports/tr36/"},
    {"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}
  ]'::jsonb
where code = 'IDN-000002';

-- ------------------------------------------------------------
-- QR-000001 — Quishing (QR code frauduleux)
-- ------------------------------------------------------------
update attacks set
  definition = 'Le quishing est l''utilisation d''un QR code pour diriger vers un site frauduleux : le code masque l''adresse de destination, qui n''est donc pas lisible avant d''être ouverte.',
  how_it_works = 'Un QR code n''est qu''une adresse encodée sous forme graphique. Rien dans son apparence n''indique où il mène : deux codes visuellement semblables peuvent pointer vers des destinations sans rapport. L''attaquant place un code frauduleux là où la démarche paraît normale — autocollant apposé sur un horodateur ou une borne, courrier imitant une administration, affiche dans un lieu public — et la destination reproduit un service de paiement ou une page de connexion. Le scan se fait le plus souvent au téléphone, où l''adresse s''affiche tronquée et où l''on est moins attentif qu''au bureau.',
  warning_signs = array[
    'Autocollant apposé par-dessus un QR code d''origine, ou code visiblement rapporté',
    'Adresse affichée après le scan sans rapport avec l''organisme attendu',
    'Demande de paiement immédiat ou de saisie d''identifiants après un simple scan',
    'QR code reçu par courrier ou par message pour une démarche non sollicitée',
    'Redirections successives entre le scan et la page finale'
  ],
  how_to_verify = 'Avant d''ouvrir, lisez l''adresse que votre téléphone affiche en aperçu et vérifiez le nom de domaine. Pour un paiement ou une démarche administrative, ignorez le code et rejoignez le service officiel par vos propres moyens : un QR code n''est jamais le seul chemin disponible.',
  what_to_do = 'N''ouvrez pas la page si le domaine ne correspond pas à l''organisme attendu. Sur un support physique, vérifiez qu''aucun autocollant ne recouvre le code d''origine.',
  what_to_do_if_victim = 'Si des coordonnées bancaires ont été saisies, faites opposition immédiatement. Si des identifiants ont été saisis, changez le mot de passe concerné et activez la double authentification. Signalez les faits sur cybermalveillance.gouv.fr.',
  faq = '[
    {"question": "Le simple fait de scanner un QR code est-il dangereux ?", "answer": "Scanner ne fait qu''afficher une adresse. Le risque commence à l''ouverture de la page et surtout à la saisie d''informations. Prenez l''habitude de lire l''aperçu de l''adresse avant d''ouvrir."},
    {"question": "Comment repérer un QR code frauduleux sur un support physique ?", "answer": "Passez le doigt dessus : un autocollant apposé par-dessus le code d''origine se sent au toucher et constitue le signal le plus fiable sur une borne ou un horodateur."}
  ]'::jsonb,
  "references" = '[{"label": "Cybermalveillance.gouv.fr — Hameçonnage (phishing)", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
where code = 'QR-000001';

-- ------------------------------------------------------------
-- Psychological triggers.
--
-- MUST run before publication: the publish gate is enforced by a database
-- trigger (see supabase/migrations/0001_init.sql), which rejects
-- `published_at` on an attack with no trigger or indicator. Setting
-- published_at in the UPDATEs above fails with:
--   "cannot be published: needs at least one trigger or indicator"
-- Idempotent.
-- ------------------------------------------------------------
insert into attack_triggers (attack_id, trigger_code)
select a.id, t.code
from attacks a
join (values
  ('PHISH-000001',   'urgency'),
  ('PHISH-000001',   'authority'),
  ('PHISH-000001',   'fear'),
  ('SOCIAL-000001',  'authority'),
  ('SOCIAL-000001',  'urgency'),
  ('SOCIAL-000001',  'fear'),
  ('SOCIAL-000002',  'urgency'),
  ('SOCIAL-000002',  'curiosity'),
  ('SOCIAL-000003',  'fear'),
  ('SOCIAL-000003',  'authority'),
  ('PAYMENT-000001', 'reward'),
  ('PAYMENT-000001', 'financial_incentive'),
  ('IDN-000001',     'trust'),
  ('IDN-000002',     'trust'),
  ('QR-000001',      'trust'),
  ('QR-000001',      'curiosity')
) as t(attack_code, code) on t.attack_code = a.code
on conflict do nothing;

-- ------------------------------------------------------------
-- Related-attack edges. Symmetric, so each page links both ways.
-- ------------------------------------------------------------
insert into attack_related (attack_id, related_attack_id)
select a.id, b.id
from (values
  ('PHISH-000001',  'SMS-000001'),
  ('SMS-000001',    'PHISH-000001'),
  ('IDN-000001',    'IDN-000002'),
  ('IDN-000002',    'IDN-000001'),
  ('IDN-000002',    'PHISH-000001'),
  ('QR-000001',     'PHISH-000001'),
  ('SOCIAL-000001', 'SOCIAL-000003'),
  ('SOCIAL-000003', 'SOCIAL-000001'),
  ('SOCIAL-000002', 'SMS-000001'),
  ('PAYMENT-000001','PHISH-000001')
) as e(from_code, to_code)
join attacks a on a.code = e.from_code
join attacks b on b.code = e.to_code
on conflict do nothing;

-- ------------------------------------------------------------
-- Publication. Last, so the gate's precondition is already satisfied.
-- ------------------------------------------------------------
update attacks set published_at = now()
where code in (
  'PHISH-000001', 'SOCIAL-000001', 'SOCIAL-000002', 'SOCIAL-000003',
  'PAYMENT-000001', 'IDN-000001', 'IDN-000002', 'QR-000001'
) and published_at is null;
