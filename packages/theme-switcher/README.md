# @loomi/theme-switcher

`<loomi-theme-switcher>` — a light/dark/system theme toggle, so you don't have to build
your own theme-switching mechanism. Persists the choice to `localStorage` and toggles
the `dark` class on `<html>`. There should only be one on a page at a time — this very
docs site uses it in the top-right of the nav bar.

```bash
npm install @loomi/theme-switcher lit
```

```js
import "@loomi/theme-switcher/loomi-theme-switcher.js";
```

## Basic Usage

```html
<loomi-theme-switcher></loomi-theme-switcher>
```

## Variants

The default `horizontal` variant renders the compact segmented control. Use
`variant="dropmenu"` to render the same choices inside `<loomi-dropmenu>`.

```html
<loomi-theme-switcher></loomi-theme-switcher>
<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

Style your dark theme against the `dark` class loomi adds to `<html>`:

```html
<style>
  :root.dark body {
    background: #0b1220;
    color: #e2e8f0;
  }
</style>
```

## Avoiding a Flash of the Wrong Theme

Since the saved theme is only applied once the component upgrades, call
`applyLoomiTheme(getLoomiTheme())` as early as possible in your page — ideally in a
blocking `<script>` in `<head>`, before first paint.

```html
<head>
  <script type="module">
    import { applyLoomiTheme, getLoomiTheme } from "@loomi/theme-switcher/loomi-theme-switcher.js";
    applyLoomiTheme(getLoomiTheme());
  </script>
</head>
```

## Icon Position

Icons sit before the label by default; flip them with `icon-right`.

```html
<loomi-theme-switcher icon-right></loomi-theme-switcher>
```

## Custom Labels

Useful for translating the switcher into another language, or for different wording
(e.g. "Auto" instead of "System").

```html
<loomi-theme-switcher light-text="Light Mode" dark-text="Dark Mode" system-text="Auto"></loomi-theme-switcher>
```

## Custom Icons

```html
<loomi-theme-switcher light-icon="sun" dark-icon="moon" system-icon="computer-desktop"></loomi-theme-switcher>
```

## Reacting to a Theme Change

```js
document.querySelector("loomi-theme-switcher").addEventListener("theme-change", (e) => {
  console.log(e.detail.theme); // "light" | "dark" | "system"
});
```

## Reading or Setting the Theme Programmatically

```js
import { applyLoomiTheme, getLoomiTheme } from "@loomi/theme-switcher/loomi-theme-switcher.js";

getLoomiTheme(); // "light" | "dark" | "system"
applyLoomiTheme("dark"); // switch programmatically, e.g. from a settings page
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `light-text` / `dark-text` / `system-text` | `Light` / `Dark` / `System` | Option labels (translatable). |
| `light-icon` / `dark-icon` / `system-icon` | `sun` / `moon` / `computer-desktop` | Option icon names. |
| `icon-right` | `false` | Place icons after the text. _(boolean)_ |
| `variant` | `horizontal` | Render style: `horizontal` or `dropmenu`. |

**Helpers:** `applyLoomiTheme(mode)`, `getLoomiTheme()`. **Event:** `theme-change`
(`detail: { theme }`).

## Full Example

```html
<loomi-theme-switcher
  icon-right
  light-text="Light Mode"
  dark-text="Dark Mode"
  system-text="Auto"
></loomi-theme-switcher>
```
