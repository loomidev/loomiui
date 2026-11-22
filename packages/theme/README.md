# @loomidev/theme

The shared design tokens for the [LoomiUI](../../README.md) component library. Every
component depends on this package; you rarely import it directly.

It provides:

- **`themeStyles`** - a Lit `CSSResult` containing the `:host` block that declares the
  default value for every palette slot (plus a small Shadow-DOM-scoped reset). Components
  put it first in `static styles` so `var(--loomi-*)` references resolve.
- **The palette** - `LOOMI_COLORS`, `LOOMI_SHADES`, the `LoomiColor` / `LoomiShade` types,
  and the `isLoomiColor()` guard.
- **`tailwind-colors.css`** - a Tailwind `@theme inline` mapping onto the `--loomi-*`
  slots, so `bg-primary-600` or `border-gray-200` on your page follow the theme. It also
  declares the defaults on `:root`, so it works on its own.
- **`defaults.css`** - the default value behind every slot, on `:root` (and the dark-mode
  values under `.dark`), for page CSS that writes
  `var(--loomi-gray-600, var(--_loomi-gray-600-default))` itself.

```ts
import { themeStyles, LOOMI_COLORS, type LoomiColor } from "@loomidev/theme";

class MyComponent extends LitElement {
  static styles = [themeStyles, myCompiledStyles];
}
```

The built-in palette colors are `primary`, `secondary`, `info`, `success`, `error`,
`warning`, and `gray`. `info` uses Tailwind's blue ramp by default and can be
customized through `--loomi-info-50` to `--loomi-info-950`.

## Before components are defined

Until a component's script loads, its tag is an unknown inline element: button labels
show as bare text and fields have no size, so the page shifts when they upgrade. The
optional `undefined.css` hides not-yet-defined `loomi-*` elements and reserves roughly
their default size, switching itself off per element as each one is defined:

```html
<link rel="stylesheet" href="/node_modules/@loomidev/theme/src/undefined.css" />
```

or `import "@loomidev/theme/undefined.css";` with a bundler that handles CSS. Every rule
is wrapped in `:where()`, so your own styles win; `--loomi-undefined-control-height` and
`--loomi-undefined-field-spacing` tune the reserved field size.

## Accessibility

For the library-wide baseline, see [Foundations - Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations - Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations - Dark mode](https://loomiui.com/foundations/#dark-mode).

## The token model

The single source of truth is [`palette.json`](palette.json): the list of color names,
the tonal shades, and the Tailwind ramp each color borrows its **default** values from.
`scripts/build-tokens.mjs` reads it and generates:

| Generated                      | Contents                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `src/generated/tokens.css.ts`  | `themeStyles` - `:host { --_loomi-<color>-<shade>-default: … }`                          |
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

The semantic tokens follow the same rule, so you can set them from `:root` too:
`--loomi-surface`, `--loomi-surface-border`, `--loomi-surface-border-subtle`,
`--loomi-surface-hover`, `--loomi-surface-hover-primary`, `--loomi-surface-muted`,
`--loomi-text`, `--loomi-text-secondary`, `--loomi-text-muted`, `--loomi-text-faint`,
`--loomi-text-on-primary`, `--loomi-focus-ring` and `--loomi-focus-ring-color`. A value
you set is used in light and dark mode alike; leave it unset to keep the built-in
dark-mode switch.

```css
:root {
  --loomi-text-on-primary: #1c1917; /* dark text on a light primary colour */
}
```

<!-- bundle-size:start -->

## Bundle size

About **2.2 KB** minified and gzipped if you import every export, excluding `lit`. It is tree-shakeable (`"sideEffects": false`), so a component bundles only the parts it uses. Measured by `pnpm check:bundle-size`.

<!-- bundle-size:end -->

## Dependencies

- No LoomiUI package dependencies.
