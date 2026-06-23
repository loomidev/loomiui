# @loomi/card

`<loomi-card>` — a content card with an optional title and header/footer slots.

```bash
npm install @loomi/card lit
```

```js
import "@loomi/card/loomi-card.js";
```

## Usage

```html
<loomi-card title="recent activity">…body…</loomi-card>

<loomi-card has-hover url="/dashboard">Clickable</loomi-card>

<loomi-card>
  <div slot="header">Header</div>
  …body…
  <div slot="footer">Footer</div>
</loomi-card>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Card heading (ignored when a header slot is present). |
| `radius` | small | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `compact` | false | Reduce padding. _(boolean)_ |
| `no-padding` | false | Remove padding. _(boolean)_ |
| `has-shadow` | true | Drop shadow. _(boolean)_ |
| `has-hover` | false | Extra shadow on hover. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click (path, `fn()` call, or full URL). |

**Slots:** default (body), `header`, `footer`. When a `header` slot is set, the body padding is removed.
