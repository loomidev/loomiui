# @loomi/notification

`<loomi-notification>` — a container for stacked, auto-dismissing toasts. Trigger via `showLoomiNotification()` (creates a container if none exists) or the `notify()` method.

```bash
npm install @loomi/notification lit
```

```js
import "@loomi/notification/loomi-notification.js";
```

## Usage

```html
<loomi-notification position="top-right"></loomi-notification>

<script type="module">
  import { showLoomiNotification } from "@loomi/notification/loomi-notification.js";
  showLoomiNotification("Saved", "Your changes were saved.", "success");
  showLoomiNotification("Failed", "Try again.", "error", 8, "same-one");
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `position` | top-right | `top-right` \| `bottom-right` \| `top-left` \| `bottom-left` |

**Helper:** `showLoomiNotification(title, message, type?, dismissIn?, name?)` — `type` is `success`\|`info`\|`warning`\|`error`; `dismissIn` seconds (default 15, 0 = persist); a matching `name` re-renders an existing toast. **Method:** `notify({ title, message, type, dismissIn, name })`.
