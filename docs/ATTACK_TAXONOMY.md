# Attack Taxonomy — cybersecu.app

## 0. Target category set (encyclopedia scale, not yet populated)

The no-login/encyclopedia repositioning (`docs/decisions/0005`) specifies
a much larger target category list than the MVP seed below:

`SOCIAL_ENGINEERING`, `PHISHING`, `SMISHING`, `VISHING`, `EMAIL_ATTACKS`,
`WEBSITE_ATTACKS`, `URL_DECEPTION`, `HOMOGLYPH_ATTACKS`,
`TYPOSQUATTING`, `QUISHING`, `ACCOUNT_ATTACKS`, `IDENTITY_THEFT`,
`FINANCIAL_FRAUD`, `PAYMENT_FRAUD`, `E_COMMERCE_FRAUD`,
`DELIVERY_SCAMS`, `GOVERNMENT_IMPERSONATION`, `BANK_IMPERSONATION`,
`TECH_SUPPORT_SCAMS`, `MALWARE`, `MALICIOUS_FILES`,
`SOCIAL_MEDIA_ATTACKS`, `JOB_SCAMS`, `ROMANCE_SCAMS`, `SEXTORTION`,
`EXTORTION`, `AI_ENABLED_ATTACKS`, `DEEPFAKE_SCAMS`, `VOICE_CLONING`,
`MOBILE_ATTACKS`, `WIFI_ATTACKS`, `IOT_ATTACKS`, `PRIVACY_ATTACKS`,
`DATA_THEFT`, `MFA_ATTACKS`, `OAUTH_ATTACKS`, `QR_ATTACKS`,
`SUBSCRIPTION_SCAMS`, `INVESTMENT_SCAMS`, `CRYPTO_SCAMS`,
`MARKETPLACE_SCAMS`.

This is **not yet reflected in the database** as a populated
`attack_categories` table with the richer relationship graph the brief
describes (`attack_aliases`, `attack_relationships` as first-class
entities, separate `sources`/`mitigations` tables) — that is deferred
content-and-schema work per `docs/decisions/0005`. The existing
`attack_related`/`attack_triggers`/`attack_indicators` join tables
(section 5 of `DOMAIN_MODEL.md`) already provide a working, smaller-scale
version of the same graph shape and do not need to be thrown away when
the category table is added — a category becomes an additional
classification dimension alongside `primary_vector`, not a replacement
for the existing relations.

## 1. Seeded attack vectors (`attack_vectors`)

`sms`, `email`, `phone`, `web`, `qr_code`, `social_media`, `messaging_app`,
`advertisement`, `file_attachment`.

## 2. Seeded psychological triggers (`psychological_triggers`)

`urgency`, `fear`, `authority`, `reward`, `curiosity`, `scarcity`,
`social_pressure`, `trust`, `financial_incentive`.

## 3. Seeded mistake patterns (`mistake_patterns`)

`MISSED_SUSPICIOUS_DOMAIN`, `TRUSTED_DISPLAY_NAME`, `RESPONDED_TO_URGENCY`,
`TRUSTED_AUTHORITY`, `CLICKED_UNKNOWN_LINK`, `SHARED_CREDENTIAL`,
`SHARED_MFA_CODE`, `FAILED_TO_VERIFY_INDEPENDENTLY`, `TRUSTED_LOGO`,
`TRUSTED_BRAND_NAME`, `MISSED_UNUSUAL_PAYMENT_REQUEST`.

## 4. Seeded Cyber Reflex dimensions (`cyber_reflex_dimensions`)

`phishing_recognition`, `sms_scam_recognition`, `url_verification`,
`identity_verification`, `financial_fraud_recognition`,
`social_engineering_resistance`, `qr_phishing_recognition`,
`deepfake_ai_awareness`, `account_security_awareness`.

## 5. MVP attack family priority (from brief §35), seeded as `attacks` rows

1. Smishing (`SMS-000001`) — **fully authored this pass** (definition,
   indicators, triggers, one scenario version, one SEO page).
2. Phishing (email) (`PHISH-000001`) — seeded row, content stub only.
3. Bank impersonation (`SOCIAL-000001`)
4. Delivery scam (`SOCIAL-000002`)
5. Fake refund (`PAYMENT-000001`)
6. Fake tech support (`SOCIAL-000003`)
7. Suspicious URLs / typosquatting (`IDN-000001`)
8. Homoglyph attack (`IDN-000002`)
9. QR phishing / quishing (`QR-000001`)

Rows 2–9 are seeded with `code`, `slug`, `name`, `primary_vector`,
`primary_dimension` and a minimal `definition` so the taxonomy/relations
are real and queryable, but are **not** published (`published_at IS
NULL`) — they will not appear on public pages until fully authored per
the SEO content contract (`SEO_ARCHITECTURE.md` §3). This keeps the
"never mass-generate thin SEO pages" rule intact: unpublished ≠ live.

## 6. ID prefix rule

Prefix is chosen once at creation from the attack's dominant vector/
family and is immutable regardless of later renames:
`SMS-*` (SMS-native attacks), `PHISH-*` (email phishing family),
`SOCIAL-*` (impersonation / pretexting not vector-specific),
`PAYMENT-*` (fraud whose core mechanic is a payment request),
`IDN-*` (domain/identity spoofing — typosquatting, homoglyphs),
`QR-*` (QR-code-delivered attacks). New prefixes are added by amending
this table + a migration comment, never invented ad hoc in application
code.
