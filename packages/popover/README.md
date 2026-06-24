# @loomi/popover

`<loomi-popover>` — a floating rich-content panel opened on click or hover. Unlike a
tooltip, it can contain links, lists, images, or any custom markup — not just a line of
text.

```bash
npm install @loomi/popover lit
```

```js
import "@loomi/popover/loomi-popover.js";
```

## Basic Usage

The default trigger is an information-circle icon.

```html
<loomi-popover>
  <p>This is the popover content. You can put <strong>any markup</strong> here.</p>
</loomi-popover>
```

## Trigger Icon

Swap the default trigger for any icon from [`@loomi/icons`](../icons).

```html
<loomi-popover trigger="question-mark-circle">
  <p>Triggered by a question-mark icon.</p>
</loomi-popover>

<loomi-popover trigger="bell">
  <p>Triggered by a bell icon.</p>
</loomi-popover>

<loomi-popover trigger="ellipsis-vertical">
  <p>Triggered by a vertical ellipsis icon.</p>
</loomi-popover>
```

## Custom Trigger Markup

When an icon isn't enough, use the `trigger` slot to make a button, badge, or avatar
the trigger instead.

```html
<loomi-popover>
  <loomi-button slot="trigger" size="small" type="secondary">Options</loomi-button>
  <ul>
    <li><a href="#">Edit record</a></li>
    <li><a href="#">Duplicate</a></li>
    <li><a href="#">Delete</a></li>
  </ul>
</loomi-popover>
```

## Title

An optional heading, separated from the content by a subtle border.

```html
<loomi-popover title="Account Actions">
  <ul>
    <li><a href="#">Edit profile</a></li>
    <li><a href="#">Change password</a></li>
    <li><a href="#">Sign out</a></li>
  </ul>
</loomi-popover>
```

## Position

```html
<loomi-popover position="top">…</loomi-popover>
<loomi-popover position="bottom">…</loomi-popover>
<loomi-popover position="left">…</loomi-popover>
<loomi-popover position="right">…</loomi-popover>
```

## Trigger Event

Opens on `click` by default; set `trigger-on="mouseover"` to open on hover instead.

```html
<loomi-popover trigger-on="mouseover">
  <p>This popover opens on mouseover.</p>
</loomi-popover>
```

## Width

```html
<loomi-popover width="360" title="Wider popover">
  <p>More room for longer content.</p>
</loomi-popover>
```

## JavaScript API

```js
const popover = document.querySelector("loomi-popover");
popover.show();
popover.hide();
popover.toggle();
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | `information-circle` | Trigger icon name (from `@loomi/icons`). Ignored when the `trigger` slot is used. |
| `trigger-on` | `click` | `click` \| `mouseover` |
| `position` | `bottom` | `top` \| `bottom` \| `left` \| `right` |
| `title` | _(blank)_ | Optional heading above the content. |
| `width` | `280` | Panel width in pixels. |

**Methods:** `show()`, `hide()`, `toggle()`. **Slots:** default (content), `trigger`
(custom trigger).

## Full Example

```html
<loomi-popover trigger="ellipsis-vertical" trigger-on="click" position="bottom" title="User Actions" width="300">
  <ul>
    <li><a href="#">Edit</a></li>
    <li><a href="#">Delete</a></li>
  </ul>
</loomi-popover>
```
