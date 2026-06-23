# @loomi/theme-switcher

`<loomi-theme-switcher>` — a light/dark/system theme toggle. Persists the choice to `localStorage` and toggles the `dark` class on `<html>`.

```bash
npm install @loomi/theme-switcher lit
```

```js
import "@loomi/theme-switcher/loomi-theme-switcher.js";
```

## Usage

```html
<loomi-theme-switcher></loomi-theme-switcher>

<!-- style your dark theme against the html.dark class -->
<style>:root.dark body { background:#0b1220; color:#e2e8f0 }</style>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `light-text / dark-text / system-text` | Light / Dark / System | Option labels (translatable). |
| `light-icon / dark-icon / system-icon` | sun / moon / computer-desktop | Option icon names. |
| `icon-right` | false | Place icons after the text. _(boolean)_ |

**Helpers:** `applyLoomiTheme(mode)`, `getLoomiTheme()`. **Event:** `theme-change` (`detail: { theme }`). Call `applyLoomiTheme(getLoomiTheme())` early in your app to avoid a flash before the component upgrades.
