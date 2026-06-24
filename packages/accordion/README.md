# @loomi/accordion

`<loomi-accordion>` groups `<loomi-accordion-item>` collapsible sections. By default
only one item is open at a time, organizing content compactly without giving up access
to it.

```bash
npm install @loomi/accordion lit
```

```js
import "@loomi/accordion/loomi-accordion.js";
```

## Basic Usage

Each item needs a `title` for its clickable header; the body is its default slot.

```html
<loomi-accordion>
  <loomi-accordion-item title="What is loomi?">
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <p>npm install the package for whichever component you need.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="Can I theme it?">
    <p>Yes — override the public CSS custom properties at :root.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Custom Title Content

If a plain string title isn't enough, use the `title` slot instead of the `title`
attribute.

```html
<loomi-accordion>
  <loomi-accordion-item>
    <div slot="title" style="display:flex;align-items:center;gap:0.5rem">
      <loomi-icon name="cube"></loomi-icon>
      <div>
        <div>What is LoomiUI?</div>
        <div style="font-size:0.75rem;opacity:0.7">v1.0.0</div>
      </div>
    </div>
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open by Default

```html
<loomi-accordion>
  <loomi-accordion-item title="Open on load" open>
    <p>This section starts expanded.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="Closed on load">
    <p>This one doesn't.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open Multiple Accordion Items

By default opening one item closes whatever else is open. Set `can-open-multiple` to
let items stay open independently.

```html
<loomi-accordion can-open-multiple>
  <loomi-accordion-item title="Section A" open>…</loomi-accordion-item>
  <loomi-accordion-item title="Section B" open>…</loomi-accordion-item>
</loomi-accordion>
```

## Ungrouped Accordions

By default items sit inside one shared card, separated by divider lines. Set
`grouped="false"` for each item to render as its own standalone card.

```html
<loomi-accordion grouped="false">
  <loomi-accordion-item title="Standalone item one">…</loomi-accordion-item>
  <loomi-accordion-item title="Standalone item two">…</loomi-accordion-item>
</loomi-accordion>
```

## Colorful Accordions

`color` only applies when `grouped="false"`, since grouped accordions share one
container background.

```html
<loomi-accordion grouped="false" color="yellow">
  <loomi-accordion-item title="A pop of color">…</loomi-accordion-item>
</loomi-accordion>
```

It can also be set per-item to mix colors within one ungrouped accordion:

```html
<loomi-accordion grouped="false">
  <loomi-accordion-item title="Blue item" color="blue">…</loomi-accordion-item>
  <loomi-accordion-item title="Pink item" color="pink">…</loomi-accordion-item>
</loomi-accordion>
```

## No Padding

```html
<loomi-accordion-item title="Tight content" no-padding>
  <img src="/banner.jpg" alt="" />
</loomi-accordion-item>
```

## Attributes

### `<loomi-accordion>`

| Attribute | Default | Description |
| --- | --- | --- |
| `grouped` | `true` | Group items in one card (vs standalone cards). _(boolean)_ |
| `can-open-multiple` | `false` | Allow multiple open items. _(boolean)_ |
| `color` | _(blank)_ | Background color when `grouped="false"`. |

### `<loomi-accordion-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Header text (or use the `title` slot). |
| `open` | `false` | Open by default. _(boolean)_ |
| `color` | _(blank)_ | Standalone background color. |
| `no-padding` | `false` | Remove body padding. _(boolean)_ |

**Slots:** default (body), `title`.

## Full Example

```html
<loomi-accordion grouped="false" can-open-multiple color="pink">
  <loomi-accordion-item title="What is loomi?" open>
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <p>npm install the package for whichever component you need.</p>
  </loomi-accordion-item>
</loomi-accordion>
```
