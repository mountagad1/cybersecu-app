-- ============================================================
-- 0006 — four dimensions added to the Cyber Reflex profile.
--
-- WHY
-- `cyber_reflex_dimensions` was defined when the catalogue held twenty
-- fiches, all describing an attack that arrives as a message. The
-- catalogue now holds a hundred across ten families, and four of those
-- families are not about judging a message at all. The consequence was
-- measurable in the content: `account_security_awareness` carried 33
-- fiches — malware, phones, connected objects and personal data all
-- collapsed into it — and `social_engineering_resistance` carried the
-- whole of family 10. Both attributions were true in the loosest sense
-- and useless in practice: a profile cannot report a weakness it has no
-- name for, and the adaptive selector cannot boost a dimension that does
-- not exist.
--
-- WHAT THIS CHANGES
-- Four rows. Nothing is renamed and nothing is removed, so no existing
-- row in `attempts`, `learning_objectives` or any historical profile
-- becomes invalid. The reassignment of the fiches themselves happens in
-- the repository (src/content/attacks), which is the source of truth for
-- editorial content since 0005.
--
-- Recorded as resolved in docs/CONTENT_TAXONOMY_PLAN.md §12 bis.
-- ============================================================

insert into cyber_reflex_dimensions (code, label_fr) values
  ('device_integrity_awareness',      'Vigilance sur l''intégrité de l''appareil'),
  ('network_trust_awareness',         'Vigilance sur la confiance accordée au réseau'),
  ('personal_data_exposure_awareness','Maîtrise de l''exposition des données personnelles'),
  ('pressure_and_coercion_resistance','Résistance à la pression et au chantage')
on conflict (code) do nothing;
