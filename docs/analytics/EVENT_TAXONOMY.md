# Taxonomie des événements

Ce document est la liste à jour des événements que le code émet (`src/lib/analytics.ts`), au 2026-10-26.
Leur sens, les questions auxquelles ils répondent et les règles de confidentialité sont dans `docs/growth/ANALYTICS_EVENT_MODEL.md`, qui fait foi.

**Règle commune** : des codes et des comptes uniquement, jamais de champ texte libre. Ni texte saisi, ni URL collée, ni mot de passe, ni réglage d'outil.

| Événement | Propriétés |
|---|---|
| `message_analyzer_analyzed` | `locale`, `channel`, `signal_count`, `signals`, `link_count`, `source` |
| `message_analyzer_example_loaded` | `example` |
| `message_analyzer_result_shared` | `method`, `signal_count` |
| `message_analyzer_cta_clicked` | `target`, `attack_code` |
| `incident_assistant_planned` | `locale`, `situations`, `situation_count`, `channel` |
| `incident_assistant_shared` | `method`, `situation_count` |
| `incident_assistant_printed` | `situation_count` |
| `incident_assistant_cta_clicked` | `target` |
| `seo_landing` | `page_type`, `locale`, `engine` |
| `ai_landing` | `page_type`, `locale`, `assistant` |
| `attack_view` | `attack_code`, `locale`, `from_search` |
| `simulation_start` | `simulation`, `attack_code`, `locale` |
| `simulation_complete` | `simulation`, `attack_code`, `locale`, `correct` |
| `tool_start` | `tool`, `locale` |
| `tool_complete` | `tool`, `locale`, `action` |
| `tool_error` | `tool`, `locale`, `error` |
| `related_attack_click` | `from`, `from_code`, `to_attack`, `section` |
| `guide_click` | `from`, `from_code`, `guide` |
| `premium_intent` | `locale`, `trigger` |
| `checkout_start` | `locale` |
| `purchase` | `locale` |
| `funnel_cta_click` | `from`, `cta`, `attack_code` |
| `simulation_shared` | `simulation`, `method` |

23 événements. Aucun n'est collecté tant qu'aucun fournisseur n'est chargé (`ANALYTICS_AUDIT.md`, AN1).
