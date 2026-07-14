# @loomidev/theme

The shared design tokens for the [LoomiUI](../../README.md) component library. Every
component depends on this package; you rarely import it directly.

It provides:

- **`themeStyles`** — a Lit `CSSResult` containing the `:host` block that declares the
  default value for every palette slot (plus a small Shadow-DOM-scoped reset). Components
  put it first in `static styles` so `var(--loomi-*)` references resolve.
- **The palette** — `LOOMI_COLORS`, `LOOMI_SHADES`, the `LoomiColor` / `LoomiShade` types,
  and the `isLoomiColor()` guard.
- **`tailwind-colors.css`** — a Tailwind `@theme inline` mapping (no hex) for authoring
  components against the `--loomi-*` slots in your editor.

```ts
import { themeStyles, LOOMI_COLORS, type LoomiColor } from "@loomidev/theme";

class MyComponent extends LitElement {
  static styles = [themeStyles, myCompiledStyles];
}
```

## Accessibility

loomi-theme is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-theme is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-theme uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## The token model

The single source of truth is [`palette.json`](palette.json): the list of color names,
the tonal shades, and the Tailwind ramp each color borrows its **default** values from.
`scripts/build-tokens.mjs` reads it and generates:

| Generated                      | Contents                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `src/generated/tokens.css.ts`  | `themeStyles` — `:host { --_loomi-<color>-<shade>-default: … }`                          |
| `src/generated/palette.gen.ts` | The typed `LOOMI_COLORS` / `LOOMI_SHADES` consts                                         |
| `src/tailwind-colors.css`      | `@theme inline { --color-<c>-<s>: var(--loomi-<c>-<s>, var(--_loomi-<c>-<s>-default)) }` |

### Why two tiers of variable?

Defaults are stored in **private** `--_loomi-*-default` slots, not the public `--loomi-*`
slots. If the public slot were declared on `:host`, that element-local declaration would
beat a value inherited from the consumer's `:root`, breaking global overrides. By
declaring only the private default and referencing
`var(--loomi-X, var(--_loomi-X-default))` in utilities, the public slot stays free to be set
from `:root` and inherit through the shadow boundary.

**Override the public slot, never the private one:**

```css
:root {
  --loomi-primary-600: #16a34a;
}
```

Default values come straight from Tailwind's own default ramps (oklch), so there are no
hand-typed hex values to drift.

## Dependencies

- No LoomiUI package dependencies.
