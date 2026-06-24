# @loomi/card

`<loomi-card>` — a content card with an optional title and header/footer slots. Content
is entirely up to you; the card just provides the frame.

```bash
npm install @loomi/card lit
```

```js
import "@loomi/card/loomi-card.js";
```

## Basic Usage

```html
<loomi-card>Card content goes here.</loomi-card>
<loomi-card title="Recent activity">Card content goes here.</loomi-card>
```

## Different Radii

```html
<loomi-card radius="none">No rounding.</loomi-card>
<loomi-card radius="small">Small (default).</loomi-card>
<loomi-card radius="medium">Medium.</loomi-card>
<loomi-card radius="large">Large.</loomi-card>
<loomi-card radius="xl">Extra large.</loomi-card>
```

## Clickable Cards

Set `url` to make the whole card act as a link — a path, a full URL, or a JS function
call (evaluated as `javascript:`). Pair it with `has-hover` for a hover-shadow cue.

```html
<loomi-card has-hover url="/dashboard">Click anywhere on me</loomi-card>
<loomi-card has-hover url="https://loomiui.com">Opens in a new context via window.open</loomi-card>
```

## Compact & No-Padding

`compact` tightens the padding; `no-padding` removes it entirely so content touches the
card's edges (useful for an `<img>` filling the card).

```html
<loomi-card compact>Tighter padding all around.</loomi-card>
<loomi-card no-padding><img src="/photo.jpg" alt="" /></loomi-card>
```

## Practical Example: Grid of Nav Cards

```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem">
  <loomi-card has-hover url="/projects">
    <loomi-icon name="folder"></loomi-icon>
    <span>Projects</span>
  </loomi-card>
  <loomi-card has-hover url="/tasks">
    <loomi-icon name="check-circle"></loomi-icon>
    <span>Tasks</span>
  </loomi-card>
  <loomi-card has-hover url="/ideas">
    <loomi-icon name="light-bulb"></loomi-icon>
    <span>Ideas</span>
  </loomi-card>
</div>
```

## Practical Example: Compact Contact List

```html
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem">
  <loomi-card compact>
    <div style="display:flex;align-items:center;gap:0.5rem">
      <loomi-avatar image="/mike.jpg"></loomi-avatar>
      <div>
        <b>Michael K. Ocansey</b>
        <div style="font-size:0.875rem">Senior Developer</div>
      </div>
    </div>
  </loomi-card>
  <loomi-card compact>
    <div style="display:flex;align-items:center;gap:0.5rem">
      <loomi-avatar label="SA"></loomi-avatar>
      <div>
        <b>Sara Appiah</b>
        <div style="font-size:0.875rem">Designer</div>
      </div>
    </div>
  </loomi-card>
</div>
```

## Header and Footer

Headers and footers are slots, so there's no restriction on what goes in them. They're
independent — set either one without the other. When `header` is set, the card body
loses its default padding, so style the body yourself.

```html
<loomi-card>
  <div slot="header" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem">
    <loomi-avatar size="small" image="/mike.jpg"></loomi-avatar>
    <span>mkocansey · Greater Accra</span>
  </div>

  <img src="/photo.jpg" alt="" />

  <div slot="footer" style="display:flex;justify-content:space-between;padding:1rem">
    <div style="display:flex;gap:1rem">
      <loomi-icon name="heart"></loomi-icon>
      <loomi-icon name="chat-bubble-oval-left-ellipsis"></loomi-icon>
    </div>
  </div>
</loomi-card>
```

## Using It in the Docs Site

This very documentation site dogfoods `<loomi-card>` for its own previous/next page
navigation at the bottom of every page — see the [architecture
guide](../../../docs/src/content/docs/architecture.mdx) for how that's wired up.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Card heading (ignored when a header slot is present). |
| `radius` | `small` | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `compact` | `false` | Reduce padding. _(boolean)_ |
| `no-padding` | `false` | Remove padding. _(boolean)_ |
| `has-shadow` | `true` | Drop shadow. _(boolean)_ |
| `has-hover` | `false` | Extra shadow on hover. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click (path, `fn()` call, or full URL). |

**Slots:** default (body), `header`, `footer`. When a `header` slot is set, the body
padding is removed.

> Not (yet) ported from BladewindUI: the dedicated Contact Card variant — compose
> [`<loomi-avatar>`](../avatar) inside a compact `<loomi-card>` instead, as shown above.

## Full Example

```html
<loomi-card
  title="Recent updates"
  has-shadow
  has-hover="false"
  no-padding
  radius="large"
  url="/user"
>
  <div slot="header">...</div>
  ...
  <div slot="footer">...</div>
</loomi-card>
```
