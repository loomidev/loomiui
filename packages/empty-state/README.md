# @loomi/empty-state

`<loomi-empty-state>` — a friendly placeholder for empty content with an optional heading, message and action button.

```bash
npm install @loomi/empty-state lit
```

```js
import "@loomi/empty-state/loomi-empty-state.js";
```

## Usage

```html
<loomi-empty-state
  heading="Nothing here yet"
  message="Your activity will show up here."
  button-label="Create something"></loomi-empty-state>

<!-- full custom content -->
<loomi-empty-state show-image="false">…your markup…</loomi-empty-state>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `heading` | _(blank)_ | Optional heading. |
| `message` | _(blank)_ | Main message text. |
| `button-label` | _(blank)_ | Action button text (omit to hide). |
| `image` | _(blank)_ | Custom image URL (defaults to a built-in illustration). |
| `image-size` | medium | `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `show-image` | true | Show the illustration. Set `false` to use the slot. _(boolean)_ |

**Slot:** default (custom content when `show-image="false"`). **Event:** `action` (button click).
