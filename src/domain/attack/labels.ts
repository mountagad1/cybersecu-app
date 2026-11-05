import type { AttackVectorCode, PsychologicalTriggerCode } from "@/domain/scenario/types";

/**
 * Human-readable French labels for the taxonomy enums.
 *
 * These codes are internal identifiers. Rendering them raw put machine-facing
 * strings (`qr_code`, `sms`) into body copy on the attack index
 * (docs/SEO_CURRENT_STATE_AUDIT.md M-4). Centralised here because the detail
 * page had its own private trigger map while the index page had none.
 */
export const ATTACK_VECTOR_LABELS: Record<AttackVectorCode, string> = {
  sms: "SMS",
  email: "Email",
  phone: "Téléphone",
  web: "Site web",
  qr_code: "QR code",
  social_media: "Réseaux sociaux",
  messaging_app: "Messagerie instantanée",
  advertisement: "Publicité",
  file_attachment: "Pièce jointe",
};

/** English counterpart of `ATTACK_VECTOR_LABELS`, for the English hubs. */
export const ATTACK_VECTOR_LABELS_EN: Record<AttackVectorCode, string> = {
  sms: "Text message",
  email: "Email",
  phone: "Phone",
  web: "Website",
  qr_code: "QR code",
  social_media: "Social media",
  messaging_app: "Messaging app",
  advertisement: "Advertising",
  file_attachment: "Attachment",
};

export const PSYCHOLOGICAL_TRIGGER_LABELS: Record<PsychologicalTriggerCode, string> = {
  urgency: "Urgence",
  fear: "Peur",
  authority: "Autorité",
  reward: "Récompense",
  curiosity: "Curiosité",
  scarcity: "Rareté",
  social_pressure: "Pression sociale",
  trust: "Confiance",
  financial_incentive: "Appât du gain",
};
