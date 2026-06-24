# @loomi/alert

`<loomi-alert>` — an inline alert message. Four prebuilt types with default icons,
`faint`/`dark` shades, palette overrides, an optional avatar, and a dismiss button.
For floating/overlay alerts instead, see [`@loomi/notification`](../notification).

```bash
npm install @loomi/alert lit
```

```js
import "@loomi/alert/loomi-alert.js";
```

## Basic Usage

Four prebuilt types, each with its own default icon and color:

```html
<loomi-alert>Your subscription is expiring in 19 days. <a href="#">Renew now</a></loomi-alert>
<loomi-alert type="error">You do not have permission to upload files.</loomi-alert>
<loomi-alert type="warning">Well, this is your first warning.</loomi-alert>
<loomi-alert type="success">Files were successfully uploaded.</loomi-alert>
```

## Shades

Set `shade="dark"` for a solid-fill variant instead of the default tinted `faint`
background.

```html
<loomi-alert shade="dark">Your subscription is expiring in 19 days.</loomi-alert>
<loomi-alert type="error" shade="dark">You do not have permission to upload files.</loomi-alert>
```

## Hiding Icons

The type icon and the dismiss (×) icon can each be hidden independently.

```html
<!-- hide the dismiss icon only -->
<loomi-alert show-close-icon="false">Message here.</loomi-alert>

<!-- hide the type icon only -->
<loomi-alert show-icon="false">Message here.</loomi-alert>

<!-- hide both -->
<loomi-alert show-icon="false" show-close-icon="false">Message here.</loomi-alert>
```

## Custom Colors

`color` overrides the type's default palette — any loomi color, on either shade, plus a
`transparent` background for a borderless, no-fill look.

```html
<loomi-alert color="pink">I am a pink alert.</loomi-alert>
<loomi-alert color="pink" shade="dark">I am a pink alert. Dark version.</loomi-alert>
<loomi-alert color="cyan">I am a cyan alert.</loomi-alert>
<loomi-alert color="violet">I am a violet alert.</loomi-alert>
<loomi-alert color="transparent">I am a transparent alert.</loomi-alert>
```

## Custom Icons

The four prebuilt types already have default icons (`information-circle`, `x-circle`,
`exclamation-triangle`, `check-circle`). Set `icon` to use a different one from the
shared [`@loomi/icons`](../icons) registry — most useful together with a custom `color`.

```html
<loomi-alert color="indigo" icon="bell-alert">No more snoozing. Wake up!</loomi-alert>
<loomi-alert color="indigo" shade="dark" icon="key">Your subscription is expiring soon.</loomi-alert>
```

## Avatars

Use an image as the prefix instead of an icon by setting `avatar` to an image URL.

```html
<loomi-alert color="violet" shade="dark" avatar="/images/jane.jpg">
  Jane has been added to your friends list.
</loomi-alert>

<!-- with a ring -->
<loomi-alert color="cyan" shade="dark" avatar="/images/jane.jpg" show-ring>
  <strong>New friend request</strong><br />
  Jane C. Doe wants to connect.
</loomi-alert>
```

## Dismissing

Clicking the close icon removes the alert from the DOM. Listen for `close` (and call
`event.preventDefault()`) if you need to intercept the dismiss — e.g. to persist that
the user has seen it before letting the element disappear.

```js
document.querySelector("loomi-alert").addEventListener("close", (e) => {
  // e.preventDefault() to stop it from removing itself
  console.log("dismissed");
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `info` | `info` \| `error` \| `warning` \| `success` |
| `shade` | `faint` | `faint` \| `dark` |
| `color` | _(blank)_ | Override color — any loomi color, or `transparent`. |
| `icon` | _(blank)_ | Icon name override (see [`@loomi/icons`](../icons)). |
| `avatar` | _(blank)_ | Image URL shown instead of the icon. |
| `show-icon` | `true` | Show the type icon. _(boolean)_ |
| `show-close-icon` | `true` | Show the dismiss button. _(boolean)_ |
| `show-ring` | `false` | Ring around the avatar. _(boolean)_ |

**Slot:** default (message, may contain HTML). **Event:** `close` (cancelable).

## Full Example

```html
<loomi-alert
  type="warning"
  shade="dark"
  color="pink"
  icon="key"
  show-close-icon="true"
>
  Stay safe. Wash your hands for 20 seconds.
</loomi-alert>
```
