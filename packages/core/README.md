# @loomidev/core

Shared runtime assets for loomi components — the shared runtime for Loomi components package. Every component imports its theme styles and helpers from here, so the shared
plumbing lives in exactly one place.

```bash
npm install @loomidev/core lit
```


## Accessibility

loomi-checkbox color="error" is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-checkbox color="error" is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-checkbox color="error" uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Exports

| Export | Description |
| --- | --- |
| `themeStyles` | The shared `:host` design tokens (re-exported from `@loomidev/theme`). |
| `loomiStyles(...styles)` | Prepends `themeStyles` and `motionStyles` to a component's own styles. Use in `static styles`. |
| `motionStyles` | Shared entrance-animation `@keyframes` + motion tokens (see below). Already included by `loomiStyles()`. |
| `accentVars(color)` | Returns the per-instance accent custom properties for a color (see below). |
| `cssColor(color, shade)` | A single themed color value with private-default fallback, for inline use. |
| `onClickOutside(el, handler)` | Calls `handler` on a click outside `el` (crosses shadow boundaries). Returns a cleanup fn. |
| `randomSuffix()` | A short random id, e.g. for de-duplicating notification keys across component instances. |
| `setLoomiLocale(locale)` / `getLoomiLocale()` | Set or read the shared locale used by translated component defaults. |
| `defineLoomiTranslations(locale, messages)` | Add or override translations for built-in component text. |
| `loomiT(path, params, locale)` | Translate a shared message by key, with English fallback. |
| `LOOMI_COLORS`, `LOOMI_SHADES`, `isLoomiColor`, `LoomiColor`, `LoomiShade` | Palette (re-exported from `@loomidev/theme`). |

```ts
import { LitElement } from "lit";
import { loomiStyles, accentVars } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

class Foo extends LitElement {
  static styles = loomiStyles(componentStyles);
  render() {
    return html`<span style=${accentVars("red")} class="thing">…</span>`;
  }
}
```

## Motion

**Don't hand-roll a new fade/pop/slide `@keyframes` block in a component package.**
`loomiStyles()` already prepends a shared set from `motionStyles` (`src/motion.ts`), so
every component that uses `loomiStyles(componentStyles)` can reference these by name for
free, with `prefers-reduced-motion` handled centrally:

| keyframe | motion |
| --- | --- |
| `loomi-fade-in` | opacity only |
| `loomi-pop-in` | fade + scale up from 0.98 |
| `loomi-rise-in` | fade + rise 8px + scale up from 0.98 |
| `loomi-drop-in` | fade + drop down 4px (opens downward, e.g. a menu) |
| `loomi-slide-in` | fade + slide in 12px from the trailing edge |
| `loomi-spin` | continuous 360° rotation, for loading spinners |

```css
.loomi-dialog {
  animation: loomi-rise-in var(--loomi-motion-duration) var(--loomi-motion-ease);
}
.loomi-spinner {
  animation: loomi-spin var(--loomi-spin-duration) linear infinite;
}
```

`--loomi-motion-duration` (default `0.16s`) and `--loomi-motion-ease` (default `ease`) are
the shared entrance-animation timing tokens; `--loomi-spin-duration` (default `0.7s`, slows
to `1.6s` under `prefers-reduced-motion` rather than stopping, since a spinner going still
would hide that work is in progress) times the spin keyframe. Override any of these
per-component only if that component genuinely needs different timing (see
`@loomidev/floating-panel`'s `--loomi-floating-panel-duration`, which falls back to
`var(--loomi-motion-duration)` rather than a hardcoded value).

Only add a new keyframe to `motion.ts` if it's a genuinely new motion primitive reused
across components. A component that layers its own positioning transform — e.g. a
centered overlay combining `translate(-50%, -50%)` with a scale-in — should keep that
composite keyframe local instead of forcing the shared list to carry a variable transform
base; `@loomidev/floating-panel`'s `.is-centered` variant is the example to follow.

## Internationalization

Loomi keeps built-in component copy in `@loomidev/core`: placeholders, validation
messages, aria labels, pagination strings, datepicker month/week names, and similar
defaults. User-provided text still wins, so attributes like `label`,
`placeholder-line1`, `ok-button-label`, and `no-data-message` remain the right way to
customize one component.

Set the shared locale before rendering components:

```js
import { setLoomiLocale } from "@loomidev/core";
import "@loomidev/datepicker";
import "@loomidev/filepicker";

setLoomiLocale("fr");
```

Or override a single component:

```html
<loomi-datepicker locale="de"></loomi-datepicker>
<loomi-filepicker locale="pt_BR"></loomi-filepicker>
```

Built-in locales: `en`, `ar`, `de`, `es`, `fr`, `it`, `ml`, `pt_BR`, `tr`, and
`zh_CN`. Datepicker month and weekday names are formatted with the component/global
locale.

Each built-in locale lives in its own file under
[`src/locales/`](./src/locales/) (e.g. `src/locales/fr.ts`), so contributing a
translation doesn't mean editing one giant file. To add a built-in language,
copy `en.ts` to `<locale>.ts`, translate the strings, and register it in
`src/locales/index.ts`.

To customize copy or add another language without touching this package at all,
register only the keys you want to change at runtime — datepicker custom locales
may also provide `monthsShort`, `monthsLong`, and `weekdaysShort` arrays.

```js
import { defineLoomiTranslations, setLoomiLocale } from "@loomidev/core";

defineLoomiTranslations("ak", {
  datepicker: {
    placeholder: "Paw da a wobɛpaw",
    monthsShort: ["S-Ɔ", "K-Ɔ", "E-Ɔ", "E-O", "E-K", "O-A", "A-K", "D-Ɔ", "F-Ɛ", "Ɔ-A", "O-O", "M-Ɔ"],
    weekdaysShort: ["Kwe", "Dwo", "Ben", "Wuk", "Yaw", "Fia", "Mem"],
  },
  filepicker: {
    placeholderLine1: "Paw fael anaa twe bra ha",
    placeholderLine2: "%s kosi %s",
  },
});

setLoomiLocale("ak");
```

## `--loomi-*` (public theme) vs `--_loomi-accent` (private, per-instance)

These are two different layers — this is the answer to "why `--loomi-accent` when
`--loomi-primary` already themes everything?"

- **`--loomi-<color>-<shade>`** are the **public theme tokens**. Setting one (e.g.
  `:root { --loomi-primary-600: #16a34a }`) re-skins **every** component that uses that
  color. This is your global theming knob.
- **`--_loomi-accent*`** are **private, per-instance** variables (note the leading `_`).
  A `<loomi-checkbox color="error">` and a `<loomi-checkbox color="success">` on the same page
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

## Dependencies

- `@loomidev/theme`
