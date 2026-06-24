# @loomi/notification

`<loomi-notification>` — a container for stacked, auto-dismissing toasts. Unlike
[`@loomi/alert`](../alert), notifications aren't permanently visible — they're triggered
from JavaScript and disappear on their own.

```bash
npm install @loomi/notification lit
```

```js
import "@loomi/notification/loomi-notification.js";
```

## Basic Usage

Place one `<loomi-notification>` anywhere on the page — ideally once, in a shared
layout, so it's available globally — then trigger toasts from anywhere with
`showLoomiNotification()`.

```html
<loomi-button onclick="showLoomiNotification('Saved', 'Your changes were saved.')">Save</loomi-button>

<loomi-notification></loomi-notification>
```

You don't strictly need to render `<loomi-notification>` yourself first —
`showLoomiNotification()` creates one (positioned `top-right`) automatically if none
exists on the page yet.

## Notification Types

The signature is `showLoomiNotification(title, message, type?, dismissIn?, name?)`.
`type` defaults to `"success"`.

```html
<loomi-button onclick="showLoomiNotification('Delete Successful', 'Your file was deleted.')">Success</loomi-button>
<loomi-button onclick="showLoomiNotification('Delete Failed', 'Could not delete. Try again.', 'error')">Error</loomi-button>
<loomi-button onclick="showLoomiNotification('Low Disk Space', 'You\'ve used 20GB of 25GB.', 'warning')">Warning</loomi-button>
<loomi-button onclick="showLoomiNotification('Invitation Accepted', 'Samuel accepted your invite.', 'info')">Info</loomi-button>

<loomi-notification></loomi-notification>
```

## Multiple Notifications

Trigger as many as you like — they stack, newest on top, each dismissing independently.

```html
<loomi-button onclick="showLoomiNotification('Upload 1 of 3', 'photo-1.jpg uploaded.'); showLoomiNotification('Upload 2 of 3', 'photo-2.jpg uploaded.'); showLoomiNotification('Upload 3 of 3', 'photo-3.jpg uploaded.')">
  Upload 3 Photos
</loomi-button>

<loomi-notification></loomi-notification>
```

## Auto-Dismiss Timing

The fourth argument is seconds before auto-dismiss — default `15`. Pass `0` to make a
notification persist until the user closes it manually.

```html
<loomi-button onclick="showLoomiNotification('Quick tip', 'This disappears fast.', 'info', 3)">Fast (3s)</loomi-button>
<loomi-button onclick="showLoomiNotification('Read this carefully', 'This stays until dismissed.', 'warning', 0)">Until Dismissed</loomi-button>

<loomi-notification></loomi-notification>
```

## Targeting an Existing Notification

Give a notification a `name` (the fifth argument) to re-render it in place instead of
stacking a duplicate — handy for a repeating error you don't want to spam the user with.

```html
<loomi-button onclick="showLoomiNotification('Upload Failed', 'Network error. Retrying… (1/3)', 'error', 0, 'upload-status')">
  Retry 1
</loomi-button>
<!-- click again with the same `name` — updates the existing toast instead of adding a new one -->
<loomi-button onclick="showLoomiNotification('Upload Failed', 'Network error. Retrying… (2/3)', 'error', 0, 'upload-status')">
  Retry 2
</loomi-button>

<loomi-notification></loomi-notification>
```

## Position

```html
<loomi-button onclick="showLoomiNotification('Bottom Right', 'I render from the bottom-right corner.')">Notify</loomi-button>

<loomi-notification position="bottom-right"></loomi-notification>
```

## Using the Element Directly

If you already have a reference to the `<loomi-notification>` element, its `notify()`
method takes the same data as an object — useful if you're rendering it via a framework
and want to avoid the global-helper pattern:

```js
document.querySelector("loomi-notification").notify({
  title: "Saved",
  message: "Your changes were saved.",
  type: "success",
  dismissIn: 5,
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `position` | `top-right` | `top-right` \| `bottom-right` \| `top-left` \| `bottom-left` |

**Helper:** `showLoomiNotification(title, message, type?, dismissIn?, name?)`.
**Method:** `notify({ title, message, type, dismissIn, name })`.

## Full Example

```html
<loomi-button
  onclick="showLoomiNotification('Profile Updated', 'Your changes have been saved.', 'success', 8, 'profile-save')"
>
  Save Profile
</loomi-button>

<loomi-notification position="bottom-right"></loomi-notification>
```
