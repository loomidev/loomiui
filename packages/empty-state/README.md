# @loomi/empty-state

`<loomi-empty-state>` — a friendly placeholder for empty content, so users see a helpful
message instead of a boring blank page. Comes with a built-in illustration, but is
intentionally minimal so different apps can shape it to their needs.

```bash
npm install @loomi/empty-state lit
```

```js
import "@loomi/empty-state/loomi-empty-state.js";
```

## Basic Usage

```html
<loomi-empty-state
  message="Awesome! You have no documents to approve."
  button-label="Go to Dashboard"
></loomi-empty-state>
```

## Custom Image

```html
<loomi-empty-state
  message="You haven't saved any gists yet."
  image="/illustrations/no-code.svg"
  button-label="Create Gist"
></loomi-empty-state>
```

## With a Heading

```html
<loomi-empty-state
  heading="Create gists already"
  message="You haven't saved any gists yet."
  image="/illustrations/no-code.svg"
  button-label="Create Gist"
></loomi-empty-state>
```

## Reacting to the Action Button

```js
document.querySelector("loomi-empty-state").addEventListener("action", () => {
  router.push("/gists/new");
});
```

## Without a Call to Action

Omit `button-label` to show a message with no action button — appropriate when there's
nothing for the user to actively do yet.

```html
<loomi-card title="Recent Activity">
  <loomi-empty-state
    image="/illustrations/no-activity.svg"
    message="Your recent activity will show up here once your team gets moving."
  ></loomi-empty-state>
</loomi-card>
```

## Custom Content (No Illustration)

Set `show-image="false"` to take full control via the default slot instead of the
built-in image/heading/message/button layout.

```html
<loomi-empty-state show-image="false">
  <loomi-icon name="finger-print" style="width: 3rem; height: 3rem"></loomi-icon>
  <p>You have no biometric data available</p>
  <loomi-button color="red" size="small">Add biometric info</loomi-button>
</loomi-empty-state>
```

## Image Sizes

```html
<loomi-empty-state message="Small" image-size="small"></loomi-empty-state>
<loomi-empty-state message="Large" image-size="large"></loomi-empty-state>
<loomi-empty-state message="Extra large" image-size="xl"></loomi-empty-state>
```

## Using It Inside `<loomi-select>` and `<loomi-table>`

[`<loomi-select>`](../select) and [`<loomi-table>`](../table) currently render their own
plain-text empty states rather than a full `<loomi-empty-state>` — see those packages'
READMEs for their respective `empty-placeholder` / `no-data-message` attributes. Use
`<loomi-empty-state>` directly wherever you need the richer illustration + CTA version.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `heading` | _(blank)_ | Optional heading. |
| `message` | _(blank)_ | Main message text. |
| `button-label` | _(blank)_ | Action button text (omit to hide). |
| `image` | _(blank)_ | Custom image URL (defaults to a built-in illustration). |
| `image-size` | `medium` | `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `show-image` | `true` | Show the illustration. Set `false` to use the slot. _(boolean)_ |

**Slot:** default (custom content when `show-image="false"`). **Event:** `action`
(button click).

## Full Example

```html
<loomi-empty-state
  heading="Nothing to see here"
  message="Hey! You've cleaned up your inbox nicely."
  button-label="Compose a message"
  image="/illustrations/empty-inbox.png"
  image-size="xl"
></loomi-empty-state>
```
