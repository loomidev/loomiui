# @loomi/spinner

`<loomi-spinner>` — a themeable loading spinner in the full loomi palette.

```bash
npm install @loomi/spinner lit
```

```js
import "@loomi/spinner/loomi-spinner.js";
```

## Basic Usage

```html
<loomi-spinner></loomi-spinner>
```

## Different Colors

The default color is `gray`. Any loomi color works.

```html
<loomi-spinner color="primary"></loomi-spinner>
<loomi-spinner color="red"></loomi-spinner>
<loomi-spinner color="green"></loomi-spinner>
<loomi-spinner color="blue"></loomi-spinner>
<loomi-spinner color="purple"></loomi-spinner>
<loomi-spinner color="pink"></loomi-spinner>
<loomi-spinner color="orange"></loomi-spinner>
<loomi-spinner color="cyan"></loomi-spinner>
```

## Different Sizes

There are five sizes available. The default is `small`.

```html
<loomi-spinner size="small"></loomi-spinner>
<loomi-spinner size="medium"></loomi-spinner>
<loomi-spinner size="big"></loomi-spinner>
<loomi-spinner size="xl"></loomi-spinner>
<loomi-spinner size="omg"></loomi-spinner>
```

## Inside a Button

Most of the time you won't reach for `<loomi-spinner>` directly inside a button —
[`<loomi-button>`](../button) has built-in `has-spinner`/`show-spinner` attributes that
manage one for you. Use a standalone spinner for everything else: a loading section, a
table mid-fetch, a full-page overlay.

```html
<div style="text-align:center; padding: 2rem">
  <loomi-spinner size="big" color="primary"></loomi-spinner>
</div>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `size` | `small` | `small` \| `medium` \| `big` \| `xl` \| `omg` |
| `color` | `gray` | Any loomi color. |

## Full Example

```html
<loomi-spinner size="medium" color="blue"></loomi-spinner>
```
