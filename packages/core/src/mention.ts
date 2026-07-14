export interface LoomiMentionMatch {
  /** The trigger character that opened this mention (e.g. `"@"`). */
  trigger: string;
  /** Index of the trigger character within `text`. */
  start: number;
  /** Text typed after the trigger, up to the caret. */
  query: string;
}

/**
 * Find an in-progress "@mention"-style trigger ending at `caret` in `text`. Scans
 * backward from the caret looking for the nearest `triggers` char that starts a word
 * (preceded by whitespace, a newline, or the start of the string) — so `"foo@bar"`
 * doesn't match but `"hi @bar"` does. Returns `null` once whitespace/newline is hit
 * first, since that means the current word has no trigger in it.
 */
export function findMentionTrigger(
  text: string,
  caret: number,
  triggers: string[],
): LoomiMentionMatch | null {
  if (!triggers.length) return null;
  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i];
    if (triggers.includes(ch)) {
      const before = i > 0 ? text[i - 1] : undefined;
      if (before !== undefined && !/\s/.test(before)) return null;
      return { trigger: ch, start: i, query: text.slice(i + 1, caret) };
    }
    if (/\s/.test(ch)) return null;
  }
  return null;
}
