-- REJOUABLE : chaque insert se termine par `on conflict do nothing`, et la
-- publication ne repousse pas `published_at` si elle a déjà eu lieu. Ces
-- fichiers sont appliqués à la main, sans table de suivi des versions : sans
-- ces gardes, « rejouer le seed » échoue sur la première ligne déjà présente.
--
-- Seed data: taxonomy catalogs (docs/ATTACK_TAXONOMY.md) + the MVP attack
-- family stubs + one fully-authored vertical slice (smishing / bank
-- impersonation, matching docs/decisions/0001).

insert into attack_vectors (code, label_fr) values
  ('sms', 'SMS'),
  ('email', 'Email'),
  ('phone', 'Téléphone'),
  ('web', 'Site web'),
  ('qr_code', 'QR code'),
  ('social_media', 'Réseau social'),
  ('messaging_app', 'Application de messagerie'),
  ('advertisement', 'Publicité'),
  ('file_attachment', 'Pièce jointe')
on conflict do nothing;

insert into psychological_triggers (code, label_fr) values
  ('urgency', 'Urgence'),
  ('fear', 'Peur'),
  ('authority', 'Autorité'),
  ('reward', 'Récompense'),
  ('curiosity', 'Curiosité'),
  ('scarcity', 'Rareté'),
  ('social_pressure', 'Pression sociale'),
  ('trust', 'Confiance'),
  ('financial_incentive', 'Incitation financière')
on conflict do nothing;

insert into mistake_patterns (code, label_fr, description_fr) values
  ('MISSED_SUSPICIOUS_DOMAIN', 'Domaine suspect non repéré', 'L''utilisateur n''a pas remarqué un nom de domaine anormal.'),
  ('TRUSTED_DISPLAY_NAME', 'Nom affiché trop vite cru', 'L''utilisateur a fait confiance au nom affiché sans vérifier l''expéditeur réel.'),
  ('RESPONDED_TO_URGENCY', 'A réagi à l''urgence', 'L''utilisateur a agi rapidement à cause d''une contrainte de temps artificielle.'),
  ('TRUSTED_AUTHORITY', 'A fait confiance à l''autorité affichée', 'L''utilisateur a obéi car le message prétendait venir d''une autorité.'),
  ('CLICKED_UNKNOWN_LINK', 'A cliqué sur un lien inconnu', 'L''utilisateur a cliqué sur un lien sans le vérifier.'),
  ('SHARED_CREDENTIAL', 'A partagé un mot de passe', 'L''utilisateur a communiqué un identifiant ou mot de passe.'),
  ('SHARED_MFA_CODE', 'A partagé un code de vérification', 'L''utilisateur a communiqué un code MFA/OTP.'),
  ('FAILED_TO_VERIFY_INDEPENDENTLY', 'N''a pas vérifié de façon indépendante', 'L''utilisateur n''a pas contacté l''organisme par un canal officiel séparé.'),
  ('TRUSTED_LOGO', 'A fait confiance au logo', 'L''utilisateur a jugé le message légitime uniquement à cause d''un logo.'),
  ('TRUSTED_BRAND_NAME', 'A fait confiance au nom de marque', 'L''utilisateur a jugé le message légitime uniquement à cause du nom de marque cité.'),
  ('MISSED_UNUSUAL_PAYMENT_REQUEST', 'Demande de paiement inhabituelle non repérée', 'L''utilisateur n''a pas identifié une demande de paiement anormale.')
on conflict do nothing;

insert into cyber_reflex_dimensions (code, label_fr) values
  ('phishing_recognition', 'Reconnaissance du phishing'),
  ('sms_scam_recognition', 'Reconnaissance des arnaques SMS'),
  ('url_verification', 'Vérification des liens'),
  ('identity_verification', 'Vérification d''identité'),
  ('financial_fraud_recognition', 'Reconnaissance des fraudes financières'),
  ('social_engineering_resistance', 'Résistance à l''ingénierie sociale'),
  ('qr_phishing_recognition', 'Reconnaissance du quishing'),
  ('deepfake_ai_awareness', 'Vigilance face aux deepfakes / IA'),
  ('device_integrity_awareness', 'Vigilance sur l''intégrité de l''appareil'),
  ('network_trust_awareness', 'Vigilance sur la confiance accordée au réseau'),
  ('personal_data_exposure_awareness', 'Maîtrise de l''exposition des données personnelles'),
  ('pressure_and_coercion_resistance', 'Résistance à la pression et au chantage'),
  ('account_security_awareness', 'Vigilance sur la sécurité du compte')
on conflict do nothing;

insert into indicators (code, label_fr) values
  ('shortened_url', 'Lien raccourci'),
  ('urgent_deadline', 'Délai artificiellement court'),
  ('unexpected_sender', 'Expéditeur inattendu'),
  ('payment_request', 'Demande de paiement'),
  ('credential_request', 'Demande d''identifiants'),
  ('suspicious_domain', 'Nom de domaine suspect')
on conflict do nothing;

-- ------------------------------------------------------------
-- MVP attack family (docs/ATTACK_TAXONOMY.md §5). Only the first is
-- fully authored + published this pass; the rest are seeded stubs
-- (published_at stays NULL — never shown publicly per the "no thin SEO
-- pages" rule).
-- ------------------------------------------------------------

-- Inserted unpublished first: the publish-gate trigger on `attacks`
-- requires at least one attack_triggers/attack_indicators row to already
-- exist, so those relations must be inserted before `published_at` is set.
insert into attacks (code, slug, name, primary_vector, primary_dimension, definition, how_it_works, warning_signs, how_to_verify, what_to_do, what_to_do_if_victim, "references")
values (
  'SMS-000001',
  'smishing-faux-sms-bancaire',
  'Smishing (faux SMS bancaire)',
  'sms',
  'sms_scam_recognition',
  'Le smishing est une arnaque par SMS qui imite un organisme de confiance (souvent une banque) pour pousser la victime à cliquer sur un lien frauduleux ou à communiquer des informations sensibles.',
  'L''attaquant envoie un SMS qui semble provenir de votre banque, annonçant un problème urgent (carte bloquée, virement suspect). Le message contient un lien vers un faux site qui imite l''interface bancaire, où la victime saisit ses identifiants ou son code de carte, immédiatement récupérés par l''attaquant.',
  array[
    'Message non sollicité annonçant un problème urgent',
    'Lien raccourci ou domaine qui ne correspond pas au site officiel de la banque',
    'Demande de saisir un mot de passe ou un code depuis un lien SMS',
    'Délai très court imposé ("sous 30 minutes")'
  ],
  'Ne cliquez jamais sur le lien reçu. Ouvrez l''application officielle de votre banque ou appelez le numéro figurant au dos de votre carte pour vérifier.',
  'Supprimez le SMS. Si vous avez un doute sur votre compte, contactez votre banque via un canal officiel, jamais via le lien reçu.',
  'Contactez immédiatement votre banque pour bloquer votre carte/compte, changez vos mots de passe, et signalez l''arnaque sur signal-arnaques.com ou cybermalveillance.gouv.fr.',
  '[{"label": "cybermalveillance.gouv.fr — Hameçonnage / phishing", "url": "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing"}]'::jsonb
)
on conflict do nothing;

insert into attack_triggers (attack_id, trigger_code)
select id, t.code from attacks, unnest(array['urgency', 'authority', 'fear']) as t(code) where attacks.code = 'SMS-000001'
on conflict do nothing;

insert into attack_indicators (attack_id, indicator_id)
select a.id, i.id from attacks a, indicators i
where a.code = 'SMS-000001' and i.code in ('shortened_url', 'urgent_deadline', 'unexpected_sender', 'credential_request', 'suspicious_domain')
on conflict do nothing;

update attacks set published_at = now() where code = 'SMS-000001' and published_at is null;

-- Unpublished stubs for the remaining MVP-priority attack family.
insert into attacks (code, slug, name, primary_vector, primary_dimension, definition)
values
  ('PHISH-000001', 'phishing-email', 'Phishing (email)', 'email', 'phishing_recognition', 'Email frauduleux imitant un expéditeur légitime pour voler des informations.'),
  ('SOCIAL-000001', 'usurpation-conseiller-bancaire', 'Faux conseiller bancaire', 'phone', 'social_engineering_resistance', 'Appel se faisant passer pour un conseiller bancaire afin d''obtenir des informations sensibles.'),
  ('SOCIAL-000002', 'faux-livreur-colis', 'Faux livreur / colis en attente', 'sms', 'sms_scam_recognition', 'SMS prétendant qu''un colis est en attente pour pousser au paiement de frais fictifs.'),
  ('PAYMENT-000001', 'faux-remboursement', 'Faux remboursement', 'email', 'financial_fraud_recognition', 'Message annonçant un remboursement pour obtenir des données bancaires.'),
  ('SOCIAL-000003', 'faux-support-technique', 'Faux support technique', 'phone', 'social_engineering_resistance', 'Appel ou pop-up se faisant passer pour un support technique afin d''obtenir un accès à distance.'),
  ('IDN-000001', 'typosquatting', 'Typosquatting', 'web', 'url_verification', 'Nom de domaine proche d''un site légitime, avec une faute volontaire, pour tromper l''utilisateur.'),
  ('IDN-000002', 'homoglyphes', 'Attaque par homoglyphes', 'web', 'url_verification', 'Utilisation de caractères visuellement similaires pour imiter un domaine légitime.'),
  ('QR-000001', 'quishing', 'Quishing (QR code frauduleux)', 'qr_code', 'qr_phishing_recognition', 'QR code frauduleux redirigeant vers un site de phishing.')
on conflict do nothing;

-- ------------------------------------------------------------
-- Learning objective + scenario for the vertical slice.
-- ------------------------------------------------------------

insert into learning_objectives (code, description_fr, dimension) values
  ('LO-SMS-001', 'Reconnaître un SMS de banque frauduleux et vérifier par un canal officiel avant d''agir.', 'sms_scam_recognition')
on conflict do nothing;

insert into scenarios (code, attack_id, slug)
select 'SCENARIO-000001', id, 'sms-banque' from attacks where code = 'SMS-000001'
on conflict do nothing;

insert into scenario_versions (
  scenario_id, version, channel, target_profile, difficulty, impersonated_entity,
  content, choices, correct_choice_ids, explanations, published_at
)
select
  s.id, 1, 'sms', 'general', 2, 'Banque Fictive',
  '{"sender": "Banque Fictive", "body": "Votre carte a ete temporairement bloquee suite a une activite inhabituelle. Confirmez vos informations sous 30 minutes : https://banque-fictive-secure.example-not-real.test/confirmer", "ui": "sms"}'::jsonb,
  '[
    {"id": "click", "label": "Je clique sur le lien pour confirmer mes informations", "mistakePatternCodes": ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"]},
    {"id": "reply", "label": "Je reponds au SMS pour demander des precisions", "mistakePatternCodes": ["FAILED_TO_VERIFY_INDEPENDENTLY"]},
    {"id": "verify", "label": "Je verifie directement aupres de ma banque (application officielle ou numero au dos de ma carte)", "isRecommended": true},
    {"id": "unsure", "label": "Je ne sais pas", "isUnsure": true}
  ]'::jsonb,
  array['verify'],
  '{
    "click": {"technique": "Urgence artificielle", "indicator": "Lien vers un domaine qui n''est pas celui de votre banque (\"banque-fictive-secure.example-not-real.test\")", "whyDangerous": "Le lien mene a un faux site qui capture vos identifiants bancaires des que vous les saisissez.", "reflex": "Ne cliquez jamais sur un lien recu par SMS non sollicite, meme s''il semble urgent."},
    "reply": {"technique": "Urgence artificielle", "indicator": "Le SMS incite a repondre directement plutot qu''a verifier par un canal officiel", "whyDangerous": "Repondre confirme a l''attaquant que votre numero est actif et peut mener a d''autres questions pieges.", "reflex": "Ne repondez jamais a un SMS suspect : contactez l''organisme par un canal que vous connaissez deja."},
    "verify": {"technique": "Urgence artificielle", "indicator": "Demande d''action immediate sous 30 minutes", "whyDangerous": "N/A - c''est la bonne reponse : verifier independamment neutralise l''urgence fabriquee par l''attaquant.", "reflex": "Continuez a verifier aupres de l''organisme via un canal officiel avant toute action."},
    "unsure": {"technique": "Urgence artificielle", "indicator": "Demande d''action immediate sous 30 minutes", "whyDangerous": "Ne pas savoir est normal - le plus important est de ne rien faire depuis le lien du SMS.", "reflex": "Dans le doute, ne cliquez pas et verifiez toujours aupres de l''organisme via un canal officiel."}
  }'::jsonb,
  now()
from scenarios s where s.code = 'SCENARIO-000001'
on conflict do nothing;

insert into scenario_objectives (scenario_version_id, learning_objective_id)
select sv.id, lo.id
from scenario_versions sv
join scenarios s on s.id = sv.scenario_id
join learning_objectives lo on lo.code = 'LO-SMS-001'
where s.code = 'SCENARIO-000001' and sv.version = 1
on conflict do nothing;
