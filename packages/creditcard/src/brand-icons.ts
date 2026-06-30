// Simplified, instantly-recognizable network marks (not pixel-accurate brand assets) —
// the same approach every payment-input UI kit takes for an inline "which network is
// this" indicator. Each is a self-contained <svg> string, uniformly framed in a
// `0 0 40 24` viewBox so they drop into a fixed-size slot regardless of brand.

export type LoomiCardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "diners"
  | "jcb"
  | "unionpay"
  | "maestro"
  | "unknown";

const VISA = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa">
  <text x="20" y="17" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="700" font-size="13" letter-spacing="0.5" fill="#1A1F71">VISA</text>
</svg>`;

const MASTERCARD = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard">
  <circle cx="16" cy="12" r="8" fill="#EB001B"/>
  <circle cx="24" cy="12" r="8" fill="#F79E1B" fill-opacity="0.85" style="mix-blend-mode:multiply"/>
</svg>`;

const AMEX = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American Express">
  <rect x="1" y="2" width="38" height="20" rx="3" fill="#006FCF"/>
  <text x="20" y="15.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="800" font-size="8.5" letter-spacing="0.5" fill="#ffffff">AMEX</text>
</svg>`;

const DISCOVER = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Discover">
  <rect x="1" y="2" width="38" height="20" rx="3" fill="#f4f4f5"/>
  <circle cx="31" cy="12" r="7" fill="#FF6000"/>
  <text x="17" y="15" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-style="italic" font-weight="700" font-size="7.5" fill="#1b1b1b">Discover</text>
</svg>`;

const DINERS = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diners Club">
  <circle cx="20" cy="12" r="9" fill="#0079BE"/>
  <path d="M20 4.5a7.5 7.5 0 0 0 0 15 7.5 7.5 0 0 1 0-15Z" fill="#ffffff"/>
</svg>`;

const JCB = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JCB">
  <rect x="1" y="2" width="38" height="20" rx="3" fill="#0b0b0b"/>
  <rect x="3" y="4" width="11" height="16" rx="2" fill="#0E4C96"/>
  <rect x="14.5" y="4" width="11" height="16" fill="#0a8f3c"/>
  <rect x="26" y="4" width="11" height="16" rx="2" fill="#D6232A"/>
  <text x="8.5" y="15.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="7" fill="#ffffff">J</text>
  <text x="20" y="15.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="7" fill="#ffffff">C</text>
  <text x="31.5" y="15.5" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="7" fill="#ffffff">B</text>
</svg>`;

const UNIONPAY = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UnionPay">
  <rect x="3" y="3" width="11" height="18" rx="2" fill="#E21836"/>
  <rect x="14.5" y="3" width="11" height="18" fill="#00447C"/>
  <rect x="26" y="3" width="11" height="18" rx="2" fill="#039B4F"/>
  <text x="20" y="29" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="6" fill="currentColor">UnionPay</text>
</svg>`;

const MAESTRO = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maestro">
  <circle cx="16" cy="12" r="8" fill="#EB001B"/>
  <circle cx="24" cy="12" r="8" fill="#0099DF" fill-opacity="0.85" style="mix-blend-mode:multiply"/>
</svg>`;

const UNKNOWN = `<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Card">
  <rect x="1.5" y="3" width="37" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <line x1="1.5" y1="9" x2="38.5" y2="9" stroke="currentColor" stroke-width="1.5"/>
</svg>`;

export const LOOMI_CARD_BRAND_ICONS: Record<LoomiCardBrand, string> = {
  visa: VISA,
  mastercard: MASTERCARD,
  amex: AMEX,
  discover: DISCOVER,
  diners: DINERS,
  jcb: JCB,
  unionpay: UNIONPAY,
  maestro: MAESTRO,
  unknown: UNKNOWN,
};

/** Per-brand digit grouping for the formatted display (e.g. Amex's 4-6-5). */
export const LOOMI_CARD_BRAND_GROUPS: Record<LoomiCardBrand, number[]> = {
  visa: [4, 4, 4, 4],
  mastercard: [4, 4, 4, 4],
  discover: [4, 4, 4, 4],
  jcb: [4, 4, 4, 4],
  maestro: [4, 4, 4, 4],
  unionpay: [4, 4, 4, 4, 3],
  amex: [4, 6, 5],
  diners: [4, 6, 4],
  unknown: [4, 4, 4, 4],
};

/** Max raw digit length per brand (drives both the input's hard cap and the layout's digit-count placeholder). */
export const LOOMI_CARD_BRAND_LENGTH: Record<LoomiCardBrand, number> = {
  visa: 16,
  mastercard: 16,
  discover: 16,
  jcb: 16,
  maestro: 16,
  unionpay: 19,
  amex: 15,
  diners: 14,
  unknown: 19,
};

/** CVC digit length per brand — Amex prints a 4-digit code on the *front*, everyone else a 3-digit code on the back. */
export const LOOMI_CARD_BRAND_CVC_LENGTH: Record<LoomiCardBrand, number> = {
  visa: 3,
  mastercard: 3,
  discover: 3,
  jcb: 3,
  maestro: 3,
  unionpay: 3,
  diners: 3,
  amex: 4,
  unknown: 3,
};

/**
 * Detects the card network from a digit-only number prefix using each network's
 * publicly documented IIN/BIN ranges. Order matters: more specific ranges are checked
 * before broader ones (e.g. Amex's `34`/`37` before Visa's catch-all `4`).
 */
export function detectCardBrand(digits: string): LoomiCardBrand {
  if (/^3[47]/.test(digits)) return "amex";
  if (/^3(?:0[0-5]|[68])/.test(digits)) return "diners";
  if (/^35(?:2[89]|[3-8]\d)/.test(digits)) return "jcb";
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)) return "mastercard";
  if (/^6(?:011|5\d{2}|4[4-9]\d|22(?:1\d{2}|[2-8]\d{2}|9[01]\d|92[0-5]))/.test(digits)) return "discover";
  if (/^62/.test(digits)) return "unionpay";
  if (/^(5[0678]\d{2}|6304|6390|67\d{2})/.test(digits)) return "maestro";
  if (/^4/.test(digits)) return "visa";
  return "unknown";
}
