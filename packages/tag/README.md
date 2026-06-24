# @loomi/tag

`<loomi-tag>` — a themeable label/badge for grouping items or showing status. Faint or
dark shade, optional outline, rounded, tiny, and a close button. Group several in
`<loomi-tags>` to make them selectable, like a fancier checkbox group.

```bash
npm install @loomi/tag lit
```

```js
import "@loomi/tag/loomi-tag.js";
```

## Basic Usage

```html
<loomi-tag label="pending"></loomi-tag>
```

## Faint vs Dark Shade

Tags default to a faint tint. Set `shade="dark"` for a deeper, solid-fill version (not
related to dark mode).

```html
<loomi-tag label="pending" color="blue"></loomi-tag>
<loomi-tag label="pending" color="blue" shade="dark"></loomi-tag>
```

Any loomi color works: `primary` `red` `yellow` `green` `blue` `pink` `cyan` `orange`
`gray` `purple` `violet` `indigo` `fuchsia`.

## With Close Icons

Useful for removable selections, like a list of chosen filters. The tag removes itself
from the DOM on click by default.

```html
<loomi-tag label="pending" can-close></loomi-tag>
<loomi-tag label="pending" can-close color="pink"></loomi-tag>
```

Intercept the removal by listening for the cancelable `close` event:

```js
document.querySelector("loomi-tag").addEventListener("close", (e) => {
  e.preventDefault(); // stop it from removing itself
  console.log("user wants to remove this tag — confirm first?");
});
```

## Tiny Tags

Handy as a small hint next to a menu item — e.g. flagging what's new.

```html
<loomi-tag label="just added" tiny color="pink"></loomi-tag>
<loomi-tag label="new" tiny color="purple" shade="dark"></loomi-tag>
```

## Rounded Tags

```html
<loomi-tag label="pending" rounded></loomi-tag>
<loomi-tag label="pending" can-close rounded color="pink"></loomi-tag>
```

## Outline Tags

No background fill — just a border in `color`. The shade still affects how light or
dark the outline is.

```html
<loomi-tag label="pending" outline color="pink"></loomi-tag>
<loomi-tag label="pending" can-close outline color="pink" shade="dark"></loomi-tag>
```

## Selectable Tags

Wrap tags in `<loomi-tags name="...">` to use them as a form control, similar to a
checkbox group — give each `<loomi-tag>` a `value`, and the parent submits the selected
values (comma-joined) under `name`.

```html
<loomi-tags name="stack" color="orange" max="3">
  <loomi-tag label="laravel" value="laravel"></loomi-tag>
  <loomi-tag label="javascript" value="js"></loomi-tag>
  <loomi-tag label="node js" value="node"></loomi-tag>
  <loomi-tag label="tailwindcss" value="tailwind"></loomi-tag>
</loomi-tags>
```

### Pre-Selected Values

```html
<loomi-tags name="fridays" color="red" selected-value="hangout,sleep">
  <loomi-tag label="hangout with friends" value="hangout"></loomi-tag>
  <loomi-tag label="watch movies" value="movies"></loomi-tag>
  <loomi-tag label="sleeeeep" value="sleep"></loomi-tag>
</loomi-tags>
```

### Reacting to Selection

```js
document.querySelector("loomi-tags").addEventListener("change", (e) => {
  console.log(e.detail.values); // ["hangout", "sleep"]
});
```

## Attributes

### `<loomi-tag>`

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Tag text (or use the default slot). |
| `color` | `primary` | Any loomi color. |
| `shade` | `faint` | `faint` \| `dark` |
| `outline` | `false` | Outline only, no fill. _(boolean)_ |
| `rounded` | `false` | Fully rounded. _(boolean)_ |
| `tiny` | `false` | Tiny size. _(boolean)_ |
| `uppercasing` | `false` | Uppercase the text. _(boolean)_ |
| `can-close` | `false` | Show a close button. _(boolean)_ |
| `value` | _(blank)_ | Submitted value when inside `<loomi-tags>`. |

**Slot:** default (content). **Event:** `close` (cancelable; the tag removes itself
unless prevented).

### `<loomi-tags>` (selectable group)

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `max` | _(blank)_ | Max selectable tags (no limit by default). |
| `selected-value` | _(blank)_ | Comma-separated values to pre-select. |
| `required` | `false` | Marks the field required. _(boolean)_ |

**Event:** `change` (`detail: { values }`).

## Full Example

```html
<loomi-tags name="stack" color="orange" max="3" required>
  <loomi-tag label="accounting" value="accounting" can-close rounded outline shade="dark"></loomi-tag>
  <loomi-tag label="marketing" value="marketing"></loomi-tag>
  <loomi-tag label="tech" value="tech"></loomi-tag>
</loomi-tags>
```
