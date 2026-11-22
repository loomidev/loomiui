/**
 * Semantic surface/text tokens (`--loomi-surface`, `--loomi-text-on-primary`, …).
 *
 * Like the palette colours, each has a PUBLIC slot that pages override and a PRIVATE
 * `--_loomi-<name>-default` slot that `themeStyles` declares on `:host` (and re-points
 * under `.dark`). Declaring the public slot on `:host` would beat a value inherited from
 * the page's `:root`, so components must reference
 * `var(--loomi-<name>, var(--_loomi-<name>-default))`. Authors keep writing the short
 * form; `expandSemanticRefs` rewrites it at build time.
 *
 * Shared by @loomidev/theme (which declares the defaults) and the component style build.
 */
export const SEMANTIC_TOKENS = [
  "surface",
  "surface-border",
  "surface-border-subtle",
  "surface-hover",
  "surface-hover-primary",
  "surface-muted",
  "focus-ring",
  "focus-ring-color",
  "text",
  "text-on-primary",
  "text-secondary",
  "text-muted",
  "text-faint",
];

/**
 * Rewrites `var(--loomi-surface)` to `var(--loomi-surface, var(--_loomi-surface-default))`
 * and `var(--loomi-text, #111)` to `var(--loomi-text, var(--_loomi-text-default, #111))`,
 * so a literal fallback still applies where theme tokens are absent. Idempotent.
 */
export function expandSemanticRefs(css, prefix = "loomi") {
  const names = [...SEMANTIC_TOKENS].sort((a, b) => b.length - a.length).join("|");
  const re = new RegExp(`var\\(\\s*--${prefix}-(${names})\\s*([,)])`, "g");
  const matches = [...css.matchAll(re)];
  // Right to left, so rewriting an inner reference never shifts an outer match's index.
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const name = m[1];
    const priv = `var(--_${prefix}-${name}-default`;
    const sepAt = m.index + m[0].length - 1;
    if (m[2] === ")") {
      css = `${css.slice(0, sepAt)}, ${priv}))${css.slice(sepAt + 1)}`;
      continue;
    }
    // Find the `)` that closes this var(), then wrap its fallback.
    let depth = 1;
    let j = sepAt + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === "(") depth++;
      else if (css[j] === ")") depth--;
    }
    const close = j - 1;
    const fallback = css.slice(sepAt + 1, close).trim();
    if (fallback.startsWith(priv)) continue; // already expanded
    css = `${css.slice(0, sepAt)}, ${priv}, ${fallback}))${css.slice(close + 1)}`;
  }
  return css;
}
