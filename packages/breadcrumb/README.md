# @loomidev/breadcrumb

`<loomi-breadcrumb>` and `<loomi-breadcrumb-item>` show a navigation trail from a
site's home page down to the current page. The last item is always treated as the
current page: it renders as plain text with `aria-current="page"`, never a link, even
if it has an `href`.

```bash
npm install @loomidev/breadcrumb lit
```

```js
import "@loomidev/breadcrumb";
```

## Basic Usage

```html
<loomi-breadcrumb>
  <loomi-breadcrumb-item href="/" label="Home"></loomi-breadcrumb-item>
  <loomi-breadcrumb-item href="/settings" label="Settings"></loomi-breadcrumb-item>
  <loomi-breadcrumb-item label="Billing"></loomi-breadcrumb-item>
</loomi-breadcrumb>
```

## Slotted Content

`label` covers plain text. Use the default slot for anything richer, like an icon
next to the text.

```html
<loomi-breadcrumb>
  <loomi-breadcrumb-item href="/"><loomi-icon name="home-modern"></loomi-icon> Home</loomi-breadcrumb-item>
  <loomi-breadcrumb-item>Reports</loomi-breadcrumb-item>
</loomi-breadcrumb>
```

## Separators

`separator` is set once on `<loomi-breadcrumb>` and applies to every item.

```html
<loomi-breadcrumb separator="slash">
  <loomi-breadcrumb-item href="/" label="Home"></loomi-breadcrumb-item>
  <loomi-breadcrumb-item label="Docs"></loomi-breadcrumb-item>
</loomi-breadcrumb>
```

### Full-sized chevrons

Use `separator="full-chevron"` for thin, full-height chevron dividers and padded
labels. The 42px-tall dividers mirror in right-to-left layouts. The current page
uses the same muted, regular-weight text as the other labels and has no trailing
divider. Icon-only links need an accessible name on their slotted content.

```html
<loomi-breadcrumb separator="full-chevron">
  <loomi-breadcrumb-item href="/">
    <span role="img" aria-label="Home"><loomi-icon name="home" aria-hidden="true"></loomi-icon></span>
  </loomi-breadcrumb-item>
  <loomi-breadcrumb-item href="/projects" label="Projects"></loomi-breadcrumb-item>
  <loomi-breadcrumb-item label="Project Nero"></loomi-breadcrumb-item>
</loomi-breadcrumb>
```

Import `@loomidev/icon` separately when using the icon example.

## Handling Navigation Yourself

Listen for `loomi-breadcrumb-item-click` and call `event.preventDefault()` to route
with something like React Router or a custom history stack instead of letting the
`href` navigate normally.

```js
document.querySelector("loomi-breadcrumb").addEventListener("loomi-breadcrumb-item-click", (event) => {
  event.preventDefault();
  router.push(event.detail.href);
});
```

## Accessibility

`<loomi-breadcrumb>` renders a `<nav>` landmark labeled "Breadcrumb" by default; pass
`label` to override it, or `locale` to pick a different built-in translation. Every
item is exposed as a list item, and the current page carries `aria-current="page"`.
For the library-wide baseline, see [Foundations - Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

Items wrap onto a new line when the trail is wider than its container; long labels
truncate with an ellipsis rather than pushing the layout wider. For the shared
container and viewport rules, see [Foundations - Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations - Dark mode](https://loomiui.com/foundations/#dark-mode).

## `<loomi-breadcrumb>` Attributes

| Attribute   | Default    | Description                                            |
| ----------- | ---------- | -------------------------------------------------------|
| `separator` | `chevron`  | Separator glyph for every item: `chevron` \| `slash` \| `full-chevron`.   |
| `label`     | _(blank)_  | Accessible name for the `<nav>` landmark.               |
| `locale`    | _(blank)_  | Locale for the default accessible name.                 |
| `color`     | `primary`  | Any loomi color, used for link hover/underline color.   |

## `<loomi-breadcrumb-item>` Attributes

| Attribute | Default   | Description                                                                       |
| --------- | --------- | ---------------------------------------------------------------------------------|
| `href`    | _(blank)_ | Renders the item as a link. Ignored on the last item, which is always plain text.|
| `label`   | _(blank)_ | Item text. The default slot takes precedence when present.                       |

## Slots

| Slot        | Element               | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| _(default)_ | `loomi-breadcrumb`      | `<loomi-breadcrumb-item>` children. |
| _(default)_ | `loomi-breadcrumb-item` | Overrides the `label` attribute.    |

## Events

| Event                         | Description                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------|
| `loomi-breadcrumb-item-click` | Fired when a linked item is clicked. `detail: { href, label }`. Cancelable.        |

## Dependencies

- `@loomidev/core`
