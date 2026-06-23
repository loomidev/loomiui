# @loomi/core

Shared runtime assets for loomi components — the loomi analogue of BladewindUI's `core`
package. Every component imports its theme styles and helpers from here, so the shared
plumbing lives in exactly one place.

```bash
npm install @loomi/core lit
```

## Exports

| Export | Description |
| --- | --- |
| `themeStyles` | The shared `:host` design tokens (re-exported from `@loomi/theme`). |
| `loomiStyles(...styles)` | Prepends `themeStyles` to a component's own styles. Use in `static styles`. |
| `accentVars(color)` | Returns the per-instance accent custom properties for a color (see below). |
| `cssColor(color, shade)` | A single themed color value with private-default fallback, for inline use. |
| `onClickOutside(el, handler)` | Calls `handler` on a click outside `el` (crosses shadow boundaries). Returns a cleanup fn. |
| `LOOMI_COLORS`, `LOOMI_SHADES`, `isLoomiColor`, `LoomiColor`, `LoomiShade` | Palette (re-exported from `@loomi/theme`). |

```ts
import { LitElement } from "lit";
import { loomiStyles, accentVars } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

class Foo extends LitElement {
  static styles = loomiStyles(componentStyles);
  render() {
    return html`<span style=${accentVars("red")} class="thing">…</span>`;
  }
}
```

## `--loomi-*` (public theme) vs `--_loomi-accent` (private, per-instance)

These are two different layers — this is the answer to "why `--loomi-accent` when
`--loomi-primary` already themes everything?"

- **`--loomi-<color>-<shade>`** are the **public theme tokens**. Setting one (e.g.
  `:root { --loomi-primary-600: #16a34a }`) re-skins **every** component that uses that
  color. This is your global theming knob.
- **`--_loomi-accent*`** are **private, per-instance** variables (note the leading `_`).
  A `<loomi-checkbox color="red">` and a `<loomi-checkbox color="green">` on the same page
  need *different* active colors, so each instance sets its own `--_loomi-accent` from its
  `color` attribute, and the component's CSS paints with `var(--_loomi-accent)`.

Crucially, `accentVars(color)` resolves each accent slot **through the public token with
the private default as fallback**:

```css
--_loomi-accent: var(--loomi-red-600, var(--_loomi-red-600-default));
```

So a per-instance accent still honors a global `--loomi-red-600` override. The default
`color` is `primary`, so an un-colored control follows `--loomi-primary-*` automatically.

`accentVars(color)` defines: `--_loomi-accent` (600), `--_loomi-accent-strong` (700),
`--_loomi-accent-soft` (100), `--_loomi-accent-softer` (50), `--_loomi-accent-ring` (200),
`--_loomi-accent-fg` (700), `--_loomi-accent-border` (200).
