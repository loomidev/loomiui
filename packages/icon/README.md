# @loomi/icon

`<loomi-icon>` — render an icon from the shared [`@loomi/icons`](../icons) registry by
name, or any custom SVG via the default slot.

```bash
npm install @loomi/icon lit
```

```js
import "@loomi/icon/loomi-icon.js";
```

## Basic Usage

```html
<loomi-icon name="bell-alert"></loomi-icon>
<loomi-icon name="check-circle"></loomi-icon>
<loomi-icon name="trash"></loomi-icon>
```

## Outline and Solid Icons

Icons come from Heroicons' 24px outline and solid sets. Outline is the default.

```html
<loomi-icon name="bell-alert" variant="outline"></loomi-icon>
<loomi-icon name="bell-alert" variant="solid"></loomi-icon>
```

## Icons From a Directory

Use `directory` when your project has custom icon files. The `name` becomes the file
name. If `name` has no extension, `.svg` is used.

`directory` is not resolved relative to the component package or the JavaScript module.
It is written directly into the rendered `<img src="...">`, so the browser resolves it
the same way it resolves any normal image URL in your page:

- `directory="assets/images"` is relative to the current page URL.
- `directory="/assets/images"` is root-relative to your site or app domain.
- `directory="https://cdn.example.com/icons"` is an absolute external URL.

```html
<loomi-icon name="airpods" directory="assets/images"></loomi-icon>
<!-- renders assets/images/airpods.svg -->

<loomi-icon name="airpods" directory="/assets/images"></loomi-icon>
<!-- renders /assets/images/airpods.svg -->

<loomi-icon name="airpods.png" directory="assets/images"></loomi-icon>
<!-- renders assets/images/airpods.png -->
```

## Sizing

Icons default to `1.5rem`. Set `size` to any CSS length — it's applied via the
`--loomi-icon-size` custom property, so you could also override that variable directly
from your own CSS if you'd rather size a whole group of icons at once.

```html
<loomi-icon name="star" size="1rem"></loomi-icon>
<loomi-icon name="star" size="2rem"></loomi-icon>
<loomi-icon name="star" size="3rem"></loomi-icon>
```

## Coloring

There's no `color` attribute — icons render with `currentColor`, so they
inherit the text color of whatever they're placed in. Set `color` (or `class`) on the
icon itself, or on a parent, like any other inline element.

```html
<loomi-icon name="bell-alert" style="color:#dc2626"></loomi-icon>
<span style="color:#16a34a">
  <loomi-icon name="check-circle"></loomi-icon> Saved
</span>
```

## Accessible Labels

By default an icon is purely decorative (`aria-hidden="true"`) — appropriate when it
sits next to visible text (as in a button or tab heading). If the icon is the *only*
content conveying meaning (e.g. an icon-only button), set `label` so screen readers
announce it.

```html
<loomi-icon name="trash" label="Delete"></loomi-icon>
```

## Custom SVG

Don't have a registered icon for what you need? Drop any raw `<svg>` into the default
slot instead of setting `name` — it's sized and colored the same way (set its `stroke`
to `currentColor` and it'll inherit color the same as a registry icon).

```html
<loomi-icon size="2rem">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L2 9h7z" />
  </svg>
</loomi-icon>
```

## Registering Custom Icons

For an icon you'll reuse across your app, register it once with the shared registry
instead of repeating raw SVG markup everywhere — it then becomes usable via `name` from
any component that renders icons (`<loomi-icon>`, `<loomi-button icon="...">`,
`<loomi-tab icon="...">`, `<loomi-alert icon="...">`, and more):

```js
import { registerLoomiIcon } from "@loomi/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
```

```html
<loomi-icon name="rocket"></loomi-icon>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Registered icon name (see [`@loomi/icons`](../icons)). |
| `variant` | `outline` | Heroicons style. `outline` \| `solid`. Ignored when `directory` is set. |
| `directory` | _(blank)_ | Directory URL for file-based icons. Written directly to `<img src>`, so relative paths resolve from the current page URL; `.svg` is added when `name` has no extension. |
| `size` | _(blank)_ | CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`. |
| `stroke-width` | `1.5` | Stroke width for outline registry icons. Ignored for solid icons. |
| `label` | _(blank)_ | Accessible label; when omitted the icon is `aria-hidden`. |

**Slot:** default (custom `<svg>`, used when no registered icon matches `name`).

## Full Example

```html
<loomi-icon
  name="bell-alert"
  variant="solid"
  size="2rem"
  label="Notifications"
  style="color:#7c3aed"
></loomi-icon>
```
