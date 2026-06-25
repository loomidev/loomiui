# @loomi/modal

`<loomi-modal>` — an overlay dialog with types, sizes, and action buttons.

```bash
npm install @loomi/modal lit
```

```js
import "@loomi/modal/loomi-modal.js";
```

## Default Modal

Modals are usually triggered by an action — a button click, say. Every LoomiUI modal is
opened and closed by its unique `name`, using the exported `showLoomiModal()` /
`hideLoomiModal()` helpers (or the instance methods `show()`/`hide()` if you already
have a reference to the element).

> **Important:** give every modal on a page a unique `name` — it's how `showLoomiModal()`
> finds the right one.

The default modal keeps its content left aligned and places action buttons in a gray
footer, right aligned. Clicking the backdrop, pressing <kbd>Esc</kbd>, or clicking a
footer button all dismiss the modal by default. See
[Non-Dismissible Modal](#non-dismissible-modal) to change that.

```html
<loomi-button onclick="showLoomiModal('tnc-agreement')">Basic modal</loomi-button>

<loomi-modal name="tnc-agreement" title="Agree or Disagree">
  Please agree to the terms and conditions before proceeding.
</loomi-modal>

<script type="module">
  import { showLoomiModal } from "@loomi/modal/loomi-modal.js";
</script>
```

## Different Types

Four prebuilt types add a left-side icon and matching action color. The default (no
`type` set) has no icon.

```html
<loomi-button onclick="showLoomiModal('info')">Info Modal</loomi-button>
<loomi-modal type="info" title="General Info" name="info">
  We really think you should consider it. What say you?
</loomi-modal>

<loomi-button onclick="showLoomiModal('error')">Error Modal</loomi-button>
<loomi-modal type="error" title="Delete Not Allowed" name="error">
  You do not have permission to delete this user.
</loomi-modal>

<loomi-button onclick="showLoomiModal('warning')">Warning Modal</loomi-button>
<loomi-modal type="warning" title="First Warning" name="warning">
  This is your first warning. Two more and you're off the platform.
</loomi-modal>

<loomi-button onclick="showLoomiModal('success')">Success Modal</loomi-button>
<loomi-modal type="success" title="User Deleted" name="success">
  User deleted successfully.
</loomi-modal>
```

## Using Different Icons

Set `icon` to use any icon from [`@loomi/icons`](../icons) instead of (or together with)
a prebuilt `type`'s default icon. Modal icons render through `<loomi-icon>`.

```html
<loomi-button onclick="showLoomiModal('big-file')">Custom Icon</loomi-button>
<loomi-modal icon="cloud-download" title="Large File Size" name="big-file">
  This file is quite large. Continue with the download?
</loomi-modal>

<!-- combine a custom icon with a predefined color -->
<loomi-button onclick="showLoomiModal('big-file-warn')">Custom Icon + Type</loomi-button>
<loomi-modal type="warning" icon="cloud-download" title="Large File Size" name="big-file-warn">
  This file is quite large. Continue with the download?
</loomi-modal>
```

## Different Sizes

```html
<loomi-button onclick="showLoomiModal('tiny-modal')">Tiny</loomi-button>
<loomi-modal size="tiny" title="Tiny Modal" name="tiny-modal">I'm the tiniest.</loomi-modal>

<loomi-button onclick="showLoomiModal('small-modal')">Small</loomi-button>
<loomi-modal size="small" title="Small Modal" name="small-modal">I'm small.</loomi-modal>

<loomi-button onclick="showLoomiModal('medium-modal')">Medium</loomi-button>
<loomi-modal size="medium" title="Medium Modal" name="medium-modal">The default size.</loomi-modal>

<loomi-button onclick="showLoomiModal('large-modal')">Large</loomi-button>
<loomi-modal size="large" title="Large Modal" name="large-modal">I'm large.</loomi-modal>

<loomi-button onclick="showLoomiModal('xl-modal')">XL</loomi-button>
<loomi-modal size="xl" title="XL Modal" name="xl-modal">I'm extra large.</loomi-modal>

<loomi-button onclick="showLoomiModal('omg-modal')">Full Width</loomi-button>
<loomi-modal size="omg" title="Full Width Modal" name="omg-modal">I'm full width.</loomi-modal>
```

## Backdrop Blur Intensity

```html
<loomi-button onclick="showLoomiModal('no-blur')">No Blur</loomi-button>
<loomi-modal blur-size="none" title="See Through Me" name="no-blur">
  The backdrop behind this modal isn't blurred at all.
</loomi-modal>
```

Available: `none` `small` `medium` `large` `xl` `omg`.

## Action Buttons

By default the footer shows `Cancel` and `Okay`. Customize the labels, or set a label to
an empty string to hide that button entirely. Footer actions render as
`<loomi-button size="small">`.

```html
<!-- custom labels -->
<loomi-button onclick="showLoomiModal('rename')">Custom Labels</loomi-button>
<loomi-modal name="rename" ok-button-label="Rename" cancel-button-label="Not now">
  Rename this file?
</loomi-modal>

<!-- no cancel button -->
<loomi-button onclick="showLoomiModal('no-cancel')">No Cancel Button</loomi-button>
<loomi-modal name="no-cancel" cancel-button-label="">I only have an Okay button.</loomi-modal>

<!-- no buttons at all (e.g. you have your own submit button inside the modal) -->
<loomi-button onclick="showLoomiModal('no-buttons')">No Buttons</loomi-button>
<loomi-modal name="no-buttons" show-action-buttons="false">
  Only the backdrop or Escape can close me now.
</loomi-modal>
```

### Reacting to Action Buttons

Unlike BladewindUI's inline `ok_button_action`/`cancel_button_action` strings, loomi
modals fire real DOM events — listen for `ok`/`cancel` on the modal element:

```html
<loomi-button onclick="showLoomiModal('confirm-delete')">Delete User</loomi-button>
<loomi-modal name="confirm-delete" type="warning" title="Delete user?"
  ok-button-label="Yes, delete" cancel-button-label="Keep it" close-after-action="false">
  This action cannot be undone.
</loomi-modal>

<script type="module">
  const modal = document.querySelector('loomi-modal[name="confirm-delete"]');
  modal.addEventListener("ok", () => {
    deleteUser().then(() => modal.hide());
  });
  modal.addEventListener("cancel", () => console.log("kept the user"));
</script>
```

`close-after-action="false"` keeps the modal open after a button click — useful when the
action is asynchronous and you want to close it yourself once it resolves (as above).

### Alignment & Stretching

```html
<loomi-button onclick="showLoomiModal('left-aligned')">Left Aligned</loomi-button>
<loomi-modal name="left-aligned" align-buttons="left" title="Left Aligned">…</loomi-modal>

<loomi-button onclick="showLoomiModal('stretched')">Stretched Buttons</loomi-button>
<loomi-modal name="stretched" stretch-action-buttons title="Stretched">
  Each button gets its own full-width row.
</loomi-modal>
```

## Non-Dismissible Modal

Set `backdrop-can-close="false"` to stop the backdrop and <kbd>Esc</kbd> from closing
it — useful for a "lock screen" or a form that must be explicitly submitted or
cancelled.

```html
<loomi-button onclick="showLoomiModal('lock-screen')">Lock Screen</loomi-button>
<loomi-modal name="lock-screen" backdrop-can-close="false" show-action-buttons="false">
  <p>Enter your password to continue.</p>
  <loomi-input type="password" label="Password"></loomi-input>
  <loomi-button block onclick="hideLoomiModal('lock-screen')">Unlock</loomi-button>
</loomi-modal>
```

## Focus Handling

Opening a modal moves focus into it (the close icon if shown, otherwise the first
focusable element, otherwise the dialog itself) and traps <kbd>Tab</kbd> inside it while
open. Closing it restores focus to whatever was focused before — all automatic, no setup
needed.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Unique name for `showLoomiModal()` / `hideLoomiModal()`. |
| `title` | _(blank)_ | Modal heading. |
| `type` | _(blank)_ | `info` \| `error` \| `warning` \| `success` (sets icon + color). |
| `icon` | _(blank)_ | Custom icon name (overrides the type icon). |
| `size` | `medium` | `tiny` \| `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `open` | `false` | Open state (reflected). _(boolean)_ |
| `ok-button-label` | `Okay` | Primary button text (blank hides it). |
| `cancel-button-label` | `Cancel` | Secondary button text (blank hides it). |
| `show-action-buttons` | `true` | Show the footer buttons. _(boolean)_ |
| `show-close-icon` | `false` | Show the top-right close icon. _(boolean)_ |
| `backdrop-can-close` | `true` | Backdrop click / Escape closes. _(boolean)_ |
| `close-after-action` | `true` | Close after an action button is clicked. _(boolean)_ |
| `prevent-scroll` | `true` | Prevent document scrolling while open. _(boolean)_ |
| `blur-size` | `medium` | `none` \| `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `align-buttons` | `right` | `left` \| `center` \| `right` |
| `stretch-action-buttons` | `false` | Full-width stacked buttons. _(boolean)_ |

Boolean attributes can be omitted, present, or set to `"false"` in HTML, for example
`backdrop-can-close="false"` or `show-close-icon`.

**Methods:** `show()`, `hide()`. **Helpers:** `showLoomiModal(name)`, `hideLoomiModal(name)`.
**Events:** `ok`, `cancel`, `close`, `open`. **Slot:** default (body).

## Full Example

```html
<loomi-button onclick="showLoomiModal('full-modal')">Open Full Example</loomi-button>
<loomi-modal
  type="warning"
  title="Confirm deletion"
  name="full-modal"
  ok-button-label="Yes, delete"
  cancel-button-label="Keep it"
  close-after-action="false"
  backdrop-can-close="false"
  show-close-icon="true"
  blur-size="large"
  size="medium"
>
  Are you sure you want to delete this user? This action cannot be undone.
</loomi-modal>
```
