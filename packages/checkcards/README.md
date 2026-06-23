# @loomi/checkcards

`<loomi-checkcards>` — selectable cards (a prettier checkbox/radio group). Form-associated: submits selected values (comma-joined) under `name`.

```bash
npm install @loomi/checkcards lit
```

```js
import "@loomi/checkcards/loomi-checkcards.js";
```

## Usage

```html
<loomi-checkcards name="hosting" max="2" color="primary" selected-value="aws">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="AWS" icon="cloud-arrow-up">Amazon Web Services.</loomi-checkcard>
    <loomi-checkcard value="gcp" title="Google Cloud" icon="circle-stack">Google Cloud.</loomi-checkcard>
    <loomi-checkcard value="azure" title="Azure" avatar="MS">Microsoft Azure.</loomi-checkcard>
  </div>
</loomi-checkcards>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `max` | 1 | Max selectable cards. |
| `auto-select-new` | true | Drop the oldest selection when exceeding `max` (vs blocking). _(boolean)_ |
| `color / border-color` | primary | Accent / border color (any loomi color). |
| `border-width` | 2 | Card border width (px). |
| `radius` | medium | `none` \| `small` \| `medium` \| `full` |
| `compact` | false | Reduced padding. _(boolean)_ |
| `selected-value` | _(blank)_ | Comma-separated values to pre-select. |

### `<loomi-checkcard>`

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | _(blank)_ | Submitted value. |
| `title` | _(blank)_ | Card title. |
| `icon` | _(blank)_ | Leading icon name. |
| `avatar` | _(blank)_ | Image URL, or ≤3 chars for an initials label. |

**Slot:** default (card body). **Event:** `change` (`detail: { values }`).
