# @loomi/modal

`<loomi-modal>` — an overlay dialog with types, sizes and action buttons. Open/close by `name` with `showLoomiModal()` / `hideLoomiModal()`, or the `show()` / `hide()` methods.

```bash
npm install @loomi/modal lit
```

```js
import "@loomi/modal/loomi-modal.js";
```

## Usage

```html
<loomi-modal name="confirm" type="warning" title="Delete user?"
  ok-button-label="Yes, delete" cancel-button-label="Keep">
  This action cannot be undone.
</loomi-modal>

<script type="module">
  import { showLoomiModal } from "@loomi/modal/loomi-modal.js";
  showLoomiModal("confirm");
  document.querySelector("loomi-modal").addEventListener("ok", () => {/* delete */});
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Unique name for `showLoomiModal()` / `hideLoomiModal()`. |
| `title` | _(blank)_ | Modal heading. |
| `type` | _(blank)_ | `info` \| `error` \| `warning` \| `success` (sets icon + color). |
| `icon` | _(blank)_ | Custom icon name (overrides the type icon). |
| `size` | medium | `tiny` \| `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `open` | false | Open state (reflected). _(boolean)_ |
| `ok-button-label` | Okay | Primary button text (blank hides it). |
| `cancel-button-label` | Cancel | Secondary button text (blank hides it). |
| `show-action-buttons` | true | Show the footer buttons. _(boolean)_ |
| `show-close-icon` | false | Show the top-right close icon. _(boolean)_ |
| `backdrop-can-close` | true | Backdrop click / Escape closes. _(boolean)_ |
| `close-after-action` | true | Close after an action button is clicked. _(boolean)_ |
| `blur-size` | medium | Backdrop blur: `none` \| `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `align-buttons` | right | `left` \| `center` \| `right` |
| `stretch-action-buttons` | false | Full-width stacked buttons. _(boolean)_ |

**Methods:** `show()`, `hide()`. **Helpers:** `showLoomiModal(name)`, `hideLoomiModal(name)`. **Events:** `ok`, `cancel`, `close`, `open`. **Slot:** default (body).
