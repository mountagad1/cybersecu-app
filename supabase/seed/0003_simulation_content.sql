-- ============================================================
-- Seed 0003 — a published simulation for every published attack.
--
-- WHY THIS EXISTS
-- Seeds 0001 and 0002 publish nine attacks but exactly one scenario
-- (SCENARIO-000001, smishing). The consequences were product-wide, and none
-- of them looked like an error:
--   * /simulations listed a single card — the site's headline feature read as
--     unfinished rather than broken.
--   * Eight of the nine attack pages rendered no "Testez-vous" section at all,
--     because `listPublishedScenariosForAttack()` correctly found nothing to
--     link (docs/SEO_CURRENT_STATE_AUDIT.md H-3).
--   * The free quota is ten simulations (docs/SIMULATION_QUOTA.md), so with one
--     scenario a visitor could never reach the paywall by playing the
--     catalogue. The entitlement and Stripe paths were unreachable in practice.
--
-- This file authors and publishes one scenario per remaining attack.
--
-- CONTENT RULES (docs/decisions/0002-synthetic-content-only.md, brief §14)
--   * Every impersonated entity is explicitly fictional ("Banque Fictive",
--     "Transporteur Fictif", …) and every domain sits under
--     `example-not-real.test`, a name that cannot resolve.
--   * No real organisation, statistic, incident, victim or date.
--   * Each scenario teaches the verification reflex; none of them is
--     operational guidance for conducting an attack.
--
-- SCHEMA CONTRACT (supabase/migrations/0001_init.sql)
--   * `correct_choice_ids` must be non-empty.
--   * Exactly one choice per scenario carries `isUnsure: true` — "Je ne sais
--     pas" is mandatory (brief §13) and enforced by a trigger.
--   * `explanations` carries an entry for EVERY choice id, including the
--     unsure one: the player shows an explanation whatever the visitor picks.
--
-- Idempotent: safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- Learning objectives, one per dimension exercised below.
-- ------------------------------------------------------------
insert into learning_objectives (code, description_fr, dimension) values
  ('LO-PHISH-001', 'Repérer un email qui imite un service en ligne et rejoindre le service par un chemin maîtrisé.', 'phishing_recognition'),
  ('LO-SMS-002', 'Refuser une demande de frais présentée par SMS et vérifier une livraison par le canal officiel.', 'sms_scam_recognition'),
  ('LO-SOCIAL-001', 'Raccrocher face à un appel qui demande de valider une opération, et rappeler soi-même.', 'social_engineering_resistance'),
  ('LO-SOCIAL-002', 'Refuser une prise de contrôle à distance sollicitée par un appel ou un message d''alerte.', 'social_engineering_resistance'),
  ('LO-PAYMENT-001', 'Reconnaître une promesse de remboursement qui sert à collecter des coordonnées bancaires.', 'financial_fraud_recognition'),
  ('LO-URL-001', 'Lire une adresse web caractère par caractère avant de saisir des identifiants.', 'url_verification'),
  ('LO-URL-002', 'Se méfier d''une adresse dont les caractères imitent visuellement ceux d''un domaine connu.', 'url_verification'),
  ('LO-QR-001', 'Ne pas payer depuis un QR code affiché en libre accès sur un support physique.', 'qr_phishing_recognition')
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- Scenario rows. `attack_id` is resolved from the stable attack code, never
-- from a hardcoded uuid.
-- ------------------------------------------------------------
insert into scenarios (code, attack_id, slug)
select v.scenario_code, a.id, v.slug
from (values
  ('SCENARIO-000002', 'PHISH-000001',   'email-espace-client-suspendu'),
  ('SCENARIO-000003', 'SOCIAL-000002',  'sms-colis-en-attente'),
  ('SCENARIO-000004', 'SOCIAL-000001',  'appel-conseiller-bancaire'),
  ('SCENARIO-000005', 'SOCIAL-000003',  'appel-support-technique'),
  ('SCENARIO-000006', 'PAYMENT-000001', 'email-faux-remboursement'),
  ('SCENARIO-000007', 'IDN-000001',     'adresse-mal-orthographiee'),
  ('SCENARIO-000008', 'IDN-000002',     'caracteres-similaires-dans-une-adresse'),
  ('SCENARIO-000009', 'QR-000001',      'qr-code-de-stationnement')
) as v(scenario_code, attack_code, slug)
join attacks a on a.code = v.attack_code
on conflict (code) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000002 — Phishing par email (PHISH-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'email', 'general', 2, 'Boutique Fictive',
  '{"sender": "Boutique Fictive <securite@boutique-fictive-verif.example-not-real.test>", "body": "Objet : Votre espace client a été suspendu\n\nCher client,\n\nUne anomalie de facturation a été détectée sur votre compte. Votre espace client est suspendu et vos commandes en cours seront annulées sous 24 heures.\n\nPour le réactiver, confirmez vos identifiants ici :\nhttps://boutique-fictive-verif.example-not-real.test/reactivation\n\nLe service sécurité", "ui": "email"}'::jsonb,
  '[
    {"id": "click", "label": "Je clique sur le lien et je confirme mes identifiants", "mistakePatternCodes": ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "reply", "label": "Je réponds à l''email pour demander de quelle facture il s''agit", "mistakePatternCodes": ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "verify", "label": "J''ouvre le site de la boutique depuis mon favori ou son application, sans utiliser le lien", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "click": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Le domaine de l''expéditeur et du lien est \"boutique-fictive-verif.example-not-real.test\", pas celui de la boutique", "whyDangerous": "La page d''arrivée imite la page de connexion officielle : les identifiants saisis partent directement chez l''attaquant, qui s''en sert immédiatement sur le vrai site.", "reflex": "Ne rejoignez jamais un espace client par le lien d''un email : passez par un favori, l''application officielle, ou une adresse saisie à la main."},
    "reply": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Le nom affiché (\"Boutique Fictive\") est choisi par l''expéditeur ; seule l''adresse complète compte", "whyDangerous": "Répondre confirme que votre adresse est lue et relance l''échange sur le terrain de l''attaquant, qui contrôle la conversation.", "reflex": "Ne répondez pas au message : vérifiez l''information sur le service lui-même, par un chemin que vous maîtrisez."},
    "verify": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Une menace d''annulation sous 24 heures, destinée à faire agir avant de vérifier", "whyDangerous": "N/A — c''est la bonne réponse : en rejoignant le service par votre propre chemin, vous constatez que l''alerte n''y figure pas.", "reflex": "Une information vraie se retrouve toujours dans votre espace client officiel. Si elle n''y est pas, elle est fausse."},
    "unsure": {"technique": "Urgence artificielle et imitation d''expéditeur", "indicator": "Formulation impersonnelle (\"Cher client\") de la part d''un service qui connaît votre nom", "whyDangerous": "Ne pas savoir est une réaction saine face à un message conçu pour paraître légitime ; l''erreur serait d''agir malgré le doute.", "reflex": "Dans le doute, ne cliquez pas : ouvrez le service par vous-même et vérifiez si l''alerte existe."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000002'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000003 — Faux colis en attente (SOCIAL-000002)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'sms', 'general', 1, 'Transporteur Fictif',
  '{"sender": "Transporteur Fictif", "body": "TRANSPORTEUR FICTIF : votre colis est en attente de livraison. Des frais de dedouanement de 1,99 EUR restent a regler sous 48h, sans quoi le colis sera retourne a l''expediteur : https://suivi-colis-fictif.example-not-real.test/paiement", "ui": "sms"}'::jsonb,
  '[
    {"id": "pay", "label": "Je paie les 1,99 € : le montant est faible et j''attends un colis", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "CLICKED_UNKNOWN_LINK", "TRUSTED_BRAND_NAME"]},
    {"id": "open", "label": "J''ouvre le lien pour voir de quel colis il s''agit, sans rien payer", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "verify", "label": "Je vérifie mes livraisons en cours dans l''application du transporteur ou avec le numéro de suivi du commerçant", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "pay": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Une demande de paiement arrivée par SMS, pour un montant volontairement dérisoire", "whyDangerous": "Le but n''est pas le 1,99 € mais le formulaire de paiement : la carte saisie sert ensuite à des débits bien plus élevés, parfois par abonnement.", "reflex": "Un transporteur ne réclame pas de frais par SMS. Ne saisissez jamais une carte depuis un lien reçu."},
    "open": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Le domaine \"suivi-colis-fictif.example-not-real.test\" n''est pas celui du transporteur", "whyDangerous": "La page est conçue pour paraître authentique et vous faire changer d''avis ; ouvrir le lien confirme aussi que votre numéro est actif.", "reflex": "Le suivi d''un colis se consulte dans l''application du transporteur ou depuis la commande, jamais depuis un lien non sollicité."},
    "verify": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Le message ne cite ni commande, ni expéditeur, ni numéro de suivi réel", "whyDangerous": "N/A — c''est la bonne réponse : le suivi officiel montre qu''aucun colis n''attend de paiement.", "reflex": "Partez toujours de votre commande ou de l''application officielle, jamais du message reçu."},
    "unsure": {"technique": "Prétexte de livraison et micro-paiement", "indicator": "Un délai de 48 h et une menace de retour du colis, pour empêcher la vérification", "whyDangerous": "Ces SMS sont envoyés en masse : ils tombent juste parce que beaucoup de gens attendent effectivement un colis.", "reflex": "Dans le doute, ne payez rien et vérifiez la livraison par le canal officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000003'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000004 — Faux conseiller bancaire (SOCIAL-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'phone', 'senior', 4, 'Banque Fictive — service anti-fraude',
  '{"sender": "Appel entrant — numéro affiché : celui figurant au dos de votre carte", "body": "« Bonjour, service anti-fraude de la Banque Fictive. Nous bloquons en ce moment un paiement de 840 € depuis votre compte, passé à l''étranger. Ce n''est pas vous, je suppose ? Je vais l''annuler tout de suite, mais le système va vous envoyer un code par SMS pour confirmer l''annulation. Ne raccrochez surtout pas, la ligne est sécurisée — sinon l''opération partira. »", "ui": "call"}'::jsonb,
  '[
    {"id": "code", "label": "Je communique le code reçu par SMS pour faire annuler le paiement", "mistakePatternCodes": ["SHARED_MFA_CODE", "TRUSTED_AUTHORITY", "RESPONDED_TO_URGENCY"]},
    {"id": "transfer", "label": "J''accepte de virer mon solde vers le « compte sécurisé » qu''il me dicte", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "hangup", "label": "Je raccroche, puis je rappelle moi-même le numéro au dos de ma carte", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['hangup'],
  '{
    "code": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "Une demande de communiquer un code reçu par SMS — ce qu''aucune banque ne fait", "whyDangerous": "Le code n''annule rien : il autorise l''opération de l''attaquant. C''est vous qui la validez, ce qui rend la contestation ensuite beaucoup plus difficile.", "reflex": "Un code reçu par SMS ne se dicte à personne, quel que soit le numéro affiché."},
    "transfer": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "L''expression « compte sécurisé » : cela n''existe pas dans une banque", "whyDangerous": "Le virement part vers un compte contrôlé par l''attaquant, et il a été ordonné par vous depuis votre propre accès.", "reflex": "Aucune banque ne demande de déplacer de l''argent pour le protéger. Cette phrase seule suffit à identifier la fraude."},
    "hangup": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "L''insistance à ne pas raccrocher — le seul geste qui casse l''attaque", "whyDangerous": "N/A — c''est la bonne réponse : en rappelant vous-même, vous choisissez l''interlocuteur au lieu de le subir.", "reflex": "Raccrochez systématiquement, puis rappelez le numéro officiel. Un vrai conseiller ne vous le reprochera jamais."},
    "unsure": {"technique": "Usurpation de numéro et validation par la victime", "indicator": "Le numéro affiché est celui de la banque : il peut être usurpé et ne prouve rien", "whyDangerous": "L''appel est construit pour ne laisser aucun temps de réflexion ; hésiter est déjà une bonne défense.", "reflex": "Dans le doute, raccrochez. Vous pouvez toujours rappeler ; vous ne pouvez pas annuler un code communiqué."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000004'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000005 — Faux support technique (SOCIAL-000003)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'phone', 'senior', 3, 'Support Technique Fictif',
  '{"sender": "Fenêtre d''alerte sur l''écran, puis appel au numéro affiché", "body": "Une page s''ouvre en plein écran avec une alarme sonore : « ALERTE SÉCURITÉ — votre ordinateur est infecté. Ne l''éteignez pas. Appelez immédiatement le support au numéro ci-dessous. » Vous appelez. Un technicien répond, se dit mandaté par l''éditeur de votre système, et vous demande d''installer un petit logiciel pour qu''il puisse « prendre la main et nettoyer la machine ».", "ui": "web"}'::jsonb,
  '[
    {"id": "install", "label": "J''installe le logiciel pour qu''il puisse réparer l''ordinateur à distance", "mistakePatternCodes": ["TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "card", "label": "Je donne ma carte pour régler la « licence de dépannage » qu''il facture", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_AUTHORITY"]},
    {"id": "close", "label": "Je raccroche, je ferme la fenêtre (ou je redémarre), et je passe par le support officiel du fabricant", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['close'],
  '{
    "install": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "C''est vous qui appelez un numéro affiché par la page suspecte elle-même", "whyDangerous": "L''outil de prise en main donne un accès complet à l''appareil : fichiers, messagerie, sessions bancaires déjà ouvertes. Vous l''avez autorisé, donc rien ne le bloque.", "reflex": "N''installez jamais un outil de prise en main à la demande de quelqu''un qui vous a contacté ou dont vous tenez le numéro d''un message d''alerte."},
    "card": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Un dépannage facturé dans l''urgence, par téléphone, sans devis ni contrat", "whyDangerous": "Le paiement n''achète aucun service et livre en plus vos coordonnées bancaires, souvent réutilisées ensuite.", "reflex": "Un éditeur ne détecte pas d''infection sur votre machine et ne vend pas de dépannage par un message d''alerte."},
    "close": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Une page web ne peut pas analyser votre ordinateur : l''alerte est une simple image animée", "whyDangerous": "N/A — c''est la bonne réponse : la fenêtre n''a aucun pouvoir sur la machine, la fermer suffit.", "reflex": "Fermez la page (au besoin en redémarrant), puis contactez le support par l''adresse officielle du fabricant."},
    "unsure": {"technique": "Fausse alerte et prise de contrôle à distance", "indicator": "Alarme sonore et interdiction d''éteindre : deux signaux d''une mise sous pression", "whyDangerous": "La panique est le mécanisme de l''attaque ; ne rien faire immédiatement est déjà la bonne direction.", "reflex": "Dans le doute, n''installez rien et ne payez rien : demandez de l''aide à un proche ou au support officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000005'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000006 — Faux remboursement (PAYMENT-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'email', 'general', 2, 'Service Fictif des Remboursements',
  '{"sender": "Service Fictif des Remboursements <remboursement@service-fictif-remb.example-not-real.test>", "body": "Objet : Remboursement de 128,40 € en attente\n\nBonjour,\n\nÀ la suite d''un trop-perçu, un remboursement de 128,40 € vous est dû. Le versement ne peut être effectué qu''après vérification de vos coordonnées bancaires.\n\nRenseignez-les avant le 30 du mois, faute de quoi la demande sera clôturée :\nhttps://service-fictif-remb.example-not-real.test/formulaire", "ui": "email"}'::jsonb,
  '[
    {"id": "form", "label": "Je remplis le formulaire avec mon IBAN et ma carte pour recevoir le remboursement", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "CLICKED_UNKNOWN_LINK", "TRUSTED_AUTHORITY"]},
    {"id": "peek", "label": "J''ouvre le lien pour voir le montant, quitte à ne rien remplir", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "account", "label": "Je me connecte à mon espace officiel par mes propres moyens et je regarde si un remboursement y figure", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['account'],
  '{
    "form": {"technique": "Appât du gain et fausse échéance", "indicator": "Des coordonnées bancaires complètes demandées pour *recevoir* de l''argent", "whyDangerous": "Un IBAN suffit à mettre en place des prélèvements, et la carte saisie est débitée ailleurs. Le remboursement annoncé n''existe pas.", "reflex": "Un versement en votre faveur n''exige jamais votre numéro de carte : un IBAN déjà connu de l''organisme suffit."},
    "peek": {"technique": "Appât du gain et fausse échéance", "indicator": "Le domaine \"service-fictif-remb.example-not-real.test\" est celui de l''expéditeur, pas d''une administration", "whyDangerous": "La page est conçue pour convaincre : une fois dessus, le montant affiché et la mise en page font le reste du travail.", "reflex": "Ne jugez pas un message à ce qu''il montre : vérifiez l''information à sa source, sans passer par son lien."},
    "account": {"technique": "Appât du gain et fausse échéance", "indicator": "Une somme précise et inattendue, assortie d''une date limite", "whyDangerous": "N/A — c''est la bonne réponse : un remboursement réel apparaît dans votre espace officiel, sans qu''un email soit nécessaire.", "reflex": "Une bonne nouvelle inattendue mérite la même vérification qu''une mauvaise."},
    "unsure": {"technique": "Appât du gain et fausse échéance", "indicator": "La clôture annoncée de la demande : une pression temporelle sur une décision financière", "whyDangerous": "L''appât du gain désarme la méfiance plus efficacement que la menace ; hésiter est déjà un bon réflexe.", "reflex": "Dans le doute, ne saisissez aucune coordonnée bancaire et vérifiez depuis votre espace officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000006'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000007 — Typosquatting (IDN-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'web', 'general', 3, 'Banque Fictive',
  '{"sender": "Barre d''adresse : https://banque-ficitve.example-not-real.test/connexion", "body": "Vous cherchez le site de votre banque et vous cliquez sur le premier résultat proposé. La page qui s''ouvre est exactement celle que vous connaissez : mêmes couleurs, même logo, même formulaire « Identifiant / Code secret ». Le navigateur affiche bien un cadenas. Dans la barre d''adresse : banque-ficitve.example-not-real.test", "ui": "web"}'::jsonb,
  '[
    {"id": "login", "label": "Je saisis mes identifiants : la page est identique à celle que j''utilise d''habitude", "mistakePatternCodes": ["TRUSTED_LOGO", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "padlock", "label": "Je continue : le cadenas indique que la connexion est sécurisée", "mistakePatternCodes": ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "leave", "label": "Je ferme l''onglet et je rejoins ma banque par mon favori ou son application", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['leave'],
  '{
    "login": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Deux lettres sont inversées : \"ficitve\" au lieu de \"fictive\"", "whyDangerous": "Le site est une copie qui transmet vos identifiants à l''attaquant, parfois en les rejouant en direct sur le vrai site pendant que vous croyez vous connecter.", "reflex": "Lisez le domaine caractère par caractère avant de saisir un identifiant. L''apparence de la page ne prouve rien : elle se copie en une commande."},
    "padlock": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Le cadenas ne dit rien du propriétaire : il n''atteste que du chiffrement", "whyDangerous": "N''importe qui obtient un certificat pour son propre domaine frauduleux ; le cadenas est donc présent sur la quasi-totalité des sites de phishing.", "reflex": "Le cadenas certifie que la connexion est chiffrée, pas que le site est le bon. Seul le domaine le dit."},
    "leave": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Vous êtes arrivé par un résultat de recherche, pas par un chemin que vous maîtrisez", "whyDangerous": "N/A — c''est la bonne réponse : le favori et l''application officielle ne peuvent pas se tromper de domaine.", "reflex": "Enregistrez vos sites sensibles en favori une bonne fois, et n''y accédez plus jamais par un moteur de recherche."},
    "unsure": {"technique": "Typosquatting (nom de domaine à une lettre près)", "indicator": "Une page parfaitement conforme sur une adresse presque conforme", "whyDangerous": "L''œil lit les mots globalement, pas lettre à lettre : ne pas voir la différence est la norme, pas une faute d''attention.", "reflex": "Dans le doute, ne saisissez rien et repartez de votre favori."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000007'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000008 — Homoglyphes (IDN-000002)
-- Deliberately the hardest of the set: the substituted character is a real
-- homoglyph (U+0131, « ı » sans point), so the address is indistinguishable
-- at a glance and only the punycode form gives it away.
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'web', 'business', 5, 'Fournisseur Fictif',
  '{"sender": "Email de relance — lien : https://fournisseur-fıctif.example-not-real.test/facture", "body": "Vous êtes en charge des règlements. Un fournisseur habituel relance une facture impayée et joint un lien vers son portail. Le message reprend vos références internes et le nom de votre interlocuteur habituel. L''adresse du lien semble être exactement celle du portail que vous utilisez chaque mois. Sur le portail, un encart annonce que les coordonnées bancaires du fournisseur ont changé et invite à régler sur un nouvel IBAN.", "ui": "web"}'::jsonb,
  '[
    {"id": "pay", "label": "Je règle la facture sur le nouvel IBAN indiqué sur le portail", "mistakePatternCodes": ["MISSED_UNUSUAL_PAYMENT_REQUEST", "MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "reply", "label": "Je réponds à l''email pour faire confirmer le changement d''IBAN", "mistakePatternCodes": ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "callback", "label": "Je bloque le règlement et j''appelle le fournisseur au numéro de nos contrats, pas à celui du message", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['callback'],
  '{
    "pay": {"technique": "Homoglyphe et détournement de virement", "indicator": "Le « i » de « fictif » est un « ı » sans point (U+0131) : copié dans un éditeur de texte, le domaine apparaît sous sa forme \"xn--\"", "whyDangerous": "Le virement part vers un compte contrôlé par l''attaquant, avec un ordre parfaitement régulier de votre côté — c''est le type de fraude le plus difficile à récupérer.", "reflex": "Un changement de coordonnées bancaires ne se valide jamais depuis le canal qui l''annonce."},
    "reply": {"technique": "Homoglyphe et détournement de virement", "indicator": "L''adresse de réponse appartient au domaine frauduleux : la confirmation viendra de l''attaquant lui-même", "whyDangerous": "Vous obtenez une confirmation rassurante et falsifiée, qui lève vos derniers doutes avant le virement.", "reflex": "Ne vérifiez jamais un message suspect en répondant à ce message : changez de canal."},
    "callback": {"technique": "Homoglyphe et détournement de virement", "indicator": "Un changement d''IBAN annoncé par un canal entrant, sur une facture en attente", "whyDangerous": "N/A — c''est la bonne réponse : le contre-appel sur un numéro déjà connu est le seul contrôle que l''attaquant ne peut pas fabriquer.", "reflex": "Tout changement de coordonnées bancaires se confirme par un contre-appel sur un numéro issu de vos propres archives."},
    "unsure": {"technique": "Homoglyphe et détournement de virement", "indicator": "Le message reprend vos références internes : signe d''une préparation, pas d''une légitimité", "whyDangerous": "Cette attaque est conçue pour être indétectable à l''œil ; le doute est ici la seule information exploitable.", "reflex": "Dans le doute sur un paiement, suspendez-le : un fournisseur légitime accepte toujours un contrôle de 24 heures."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000008'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- SCENARIO-000009 — Quishing (QR-000001)
-- ------------------------------------------------------------
insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select s.id, 1, 'qr_code', 'general', 3, 'Stationnement Fictif',
  '{"sender": "Autocollant collé sur un horodateur", "body": "Sur l''horodateur, un autocollant propre et bien imprimé : « Paiement sans contact — scannez ce QR code pour payer votre stationnement. Plus besoin de monnaie. » Le logo ressemble à celui de la ville. En scannant, votre téléphone propose d''ouvrir : https://stationnement-fictif-paiement.example-not-real.test", "ui": "qr"}'::jsonb,
  '[
    {"id": "pay", "label": "J''ouvre la page et je paie mon stationnement par carte", "mistakePatternCodes": ["CLICKED_UNKNOWN_LINK", "MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_LOGO"]},
    {"id": "trust", "label": "J''ouvre la page : l''adresse contient « stationnement », donc elle a l''air officielle", "mistakePatternCodes": ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"]},
    {"id": "machine", "label": "Je paie directement à l''horodateur, ou via l''application de stationnement que j''ai installée moi-même", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['machine'],
  '{
    "pay": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un autocollant : n''importe qui peut en coller un sur un équipement public", "whyDangerous": "La page de paiement capture la carte saisie. Le stationnement n''est pas réglé, et la carte est réutilisée ailleurs.", "reflex": "Ne payez jamais depuis un QR code affiché en libre accès : un support physique n''authentifie rien."},
    "trust": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Le mot « stationnement » est dans le nom de domaine, ce que n''importe qui peut enregistrer", "whyDangerous": "Un mot rassurant dans l''adresse ne dit rien du propriétaire du domaine ; c''est précisément ce sur quoi mise l''attaque.", "reflex": "Ce qui compte dans une adresse, c''est le domaine réel, pas les mots qu''on y a glissés."},
    "machine": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un QR code ne laisse pas lire sa destination avant le scan : rien n''est vérifiable en amont", "whyDangerous": "N/A — c''est la bonne réponse : l''horodateur et l''application installée par vos soins sont deux canaux dont vous connaissez l''origine.", "reflex": "Installez l''application de stationnement depuis la boutique officielle, et payez par elle plutôt que par un code affiché sur place."},
    "unsure": {"technique": "Quishing (QR code frauduleux sur support physique)", "indicator": "Un autocollant de bonne qualité, parfois collé par-dessus un vrai code", "whyDangerous": "L''impression soignée fait la crédibilité ; ne pas savoir trancher est normal face à un support qu''on ne peut pas authentifier.", "reflex": "Dans le doute, payez par un canal que vous avez choisi vous-même."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000009'
on conflict (scenario_id, version) do nothing;

-- ------------------------------------------------------------
-- Learning-objective links, resolved from the stable codes.
-- ------------------------------------------------------------
insert into scenario_objectives (scenario_version_id, learning_objective_id)
select sv.id, lo.id
from (values
  ('SCENARIO-000002', 'LO-PHISH-001'),
  ('SCENARIO-000003', 'LO-SMS-002'),
  ('SCENARIO-000004', 'LO-SOCIAL-001'),
  ('SCENARIO-000005', 'LO-SOCIAL-002'),
  ('SCENARIO-000006', 'LO-PAYMENT-001'),
  ('SCENARIO-000007', 'LO-URL-001'),
  ('SCENARIO-000008', 'LO-URL-002'),
  ('SCENARIO-000009', 'LO-QR-001')
) as m(scenario_code, objective_code)
join scenarios s on s.code = m.scenario_code
join scenario_versions sv on sv.scenario_id = s.id and sv.version = 1
join learning_objectives lo on lo.code = m.objective_code
on conflict do nothing;
