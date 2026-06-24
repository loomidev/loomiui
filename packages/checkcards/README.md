# @loomi/checkcards

`<loomi-checkcards>` — selectable cards, a prettier alternative to checkboxes or radio
groups. Define content in a `<loomi-checkcard>` and give it a `value` — that's what gets
submitted when the form is submitted. **Form-associated**: submits the selected values
(comma-joined) under `name`.

```bash
npm install @loomi/checkcards lit
```

```js
import "@loomi/checkcards/loomi-checkcards.js";
```

## Basic Usage

Cards take up the width of their parent — use a grid or flex container to lay several
out side by side.

```html
<loomi-checkcards name="hosting">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="Amazon Web Services">
      A subsidiary of Amazon that provides on-demand cloud computing.
    </loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean">
      A cloud infrastructure provider focused on simplicity.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```

### Compact Mode

```html
<loomi-checkcards name="hosting-compact" compact>
  <loomi-checkcard value="dOcean" title="DigitalOcean"></loomi-checkcard>
</loomi-checkcards>
```

## Max Selection

By default only one card can be selected at a time. Raise the limit with `max`.

```html
<loomi-checkcards name="hosting-3" max="3">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="AWS"></loomi-checkcard>
    <loomi-checkcard value="azure" title="Azure"></loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean"></loomi-checkcard>
    <loomi-checkcard value="gcp" title="Google Cloud"></loomi-checkcard>
  </div>
</loomi-checkcards>
```

### Automatically Select New Cards

When `max` is reached, by default selecting a new card drops the oldest selection to
make room (`auto-select-new`, on by default) — this keeps exactly `max` cards selected
without ever blocking the user. Set `auto-select-new="false"` to block new selections
instead, requiring the user to unselect a card first.

```html
<loomi-checkcards name="hosting-block" max="3" auto-select-new="false">
  ...
</loomi-checkcards>
```

## Icons and Avatars

The card's content is entirely up to you, but for convenience a leading `icon` (from
[`@loomi/icons`](../icons)) or `avatar` (an image URL, or ≤3 characters for an initials
label) can be set directly on `<loomi-checkcard>`. The `color` attribute on the parent
`<loomi-checkcards>` controls the icon/avatar color.

```html
<loomi-checkcards name="hosting-icons" color="primary">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="AWS" icon="cloud-arrow-up">
      A copy of your messages will be backed up to AWS.
    </loomi-checkcard>
    <loomi-checkcard value="gdrive" title="Google Drive" icon="circle-stack">
      A copy of your messages will be backed up to Google Drive.
    </loomi-checkcard>
  </div>
</loomi-checkcards>

<loomi-checkcards name="hosting-avatars" max="2">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="mike" title="Michael Ocansey" avatar="/avatars/mike.jpg">
      Follow Michael to know when they post a new update.
    </loomi-checkcard>
    <loomi-checkcard value="francis" title="Francis Appiah" avatar="FA">
      Follow Francis to know when they post a new update.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```

## Colors

`color` controls icon/avatar color; `border-color` controls the card's border and
selected-state checkmark color. Both accept any LoomiUI color.

```html
<loomi-checkcards name="hosting-colors" color="orange" border-color="orange">
  <loomi-checkcard value="aws" title="AWS" icon="cloud-arrow-up"></loomi-checkcard>
</loomi-checkcards>
```

## Form Submission

```html
<loomi-checkcards name="hosting" selected-value="aws,gcp">
  <loomi-checkcard value="aws" title="AWS"></loomi-checkcard>
  <loomi-checkcard value="gcp" title="Google Cloud"></loomi-checkcard>
</loomi-checkcards>
```

```js
new FormData(form).get("hosting"); // "aws,gcp"
```

## Attributes

### `<loomi-checkcards>`

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `max` | `1` | Max selectable cards. |
| `auto-select-new` | `true` | Drop the oldest selection when exceeding `max` (vs blocking). _(boolean)_ |
| `color` / `border-color` | `primary` | Accent / border color (any loomi color). |
| `border-width` | `2` | Card border width (px). |
| `radius` | `medium` | `none` \| `small` \| `medium` \| `full` |
| `compact` | `false` | Reduced padding. _(boolean)_ |
| `selected-value` | _(blank)_ | Comma-separated values to pre-select. |

### `<loomi-checkcard>`

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | _(blank)_ | Submitted value. |
| `title` | _(blank)_ | Card title. |
| `icon` | _(blank)_ | Leading icon name. |
| `avatar` | _(blank)_ | Image URL, or ≤3 chars for an initials label. |

**Slot:** default (card body). **Event:** `change` (`detail: { values }`).

## Full Example

```html
<loomi-checkcards
  name="hosting"
  max="3"
  color="primary"
  border-color="gray"
  border-width="2"
  radius="medium"
  selected-value="aws,azure"
>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="Amazon Web Services" icon="cloud-arrow-up">
      A subsidiary of Amazon that provides on-demand cloud computing.
    </loomi-checkcard>
    <loomi-checkcard value="azure" title="Microsoft Azure" icon="circle-stack">
      Microsoft's cloud computing platform.
    </loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean" icon="server">
      A cloud infrastructure provider focused on simplicity.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```
