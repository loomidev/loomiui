# @loomidev/scroller

`<loomi-scroller>` turns ordinary HTML into a continuously moving row or column. It is
useful for news tickers, testimonials, partner logos, product images, announcements, and
other content that should move through a fixed area.

You provide the content as direct children. The scroller keeps the full sequence moving,
creates the copies needed for a seamless loop, and keeps those copies out of the accessibility
tree.

## Installation

Run the install command from your application's root folder—the folder containing its
`package.json`.

```bash
npm install @loomidev/scroller lit
```

Import the package once in your JavaScript or TypeScript entry file:

```js
import "@loomidev/scroller";
```

You can now use `<loomi-scroller>` anywhere in your HTML.

## Quick start

Place one or more elements inside the scroller. Every direct child becomes one item in the
moving sequence.

```html
<loomi-scroller>
  <span>Free delivery on orders over $50</span>
  <span>New products added every Friday</span>
  <span>Support is available 24/7</span>
</loomi-scroller>
```

This example uses the defaults:

- Items move to the left.
- The speed is `50` pixels per second.
- Scrolling continues forever.
- Scrolling pauses while the user hovers over it.
- Both edges fade so items enter and leave softly.

## How the seamless loop works

The component measures the complete sequence and creates enough visual copies to cover the
viewport. When one sequence leaves, an identical sequence is already following it. The
animation resets at the matching point, so users should not see an empty area or a jump.

The original elements remain the accessible content. Visual copies are marked as decorative,
removed from keyboard navigation, and mapped back to their original item when clicked.

You do not need to duplicate your HTML yourself.

## Choosing a direction

`direction` describes the physical direction in which the content moves.

```html
<loomi-scroller direction="left">...</loomi-scroller>
<loomi-scroller direction="right">...</loomi-scroller>
<loomi-scroller direction="up">...</loomi-scroller>
<loomi-scroller direction="down">...</loomi-scroller>
```

Left and right scrollers fill the width of their container. Up and down scrollers are `12rem`
tall by default. Set a CSS height when you need a taller or shorter vertical viewport.

```html
<loomi-scroller direction="up" style="height: 20rem">...</loomi-scroller>
```

## Choosing a speed

`speed` is measured in pixels per second:

- Use a lower number for slower, easier-to-read content.
- Use a higher number for faster decorative content.
- The default `50` works well for a short news ticker.

```html
<loomi-scroller speed="25">Slow and easy to read</loomi-scroller>
<loomi-scroller speed="80">Faster promotional content</loomi-scroller>
```

Values at or below zero fall back to `50`.

## News ticker

Use links when each headline should open a page. Native links continue to work normally.

```html
<loomi-scroller aria-label="Latest news" speed="45">
  <a href="/news/product-launch">New product launch — read the announcement</a>
  <a href="/news/accra-office">Our Accra office opens this Friday</a>
  <a href="/news/v2">Version 2.0 is now available</a>
</loomi-scroller>
```

The `aria-label` tells assistive technology what the collection represents when that meaning
is not already provided by a nearby heading.

## Testimonials

Testimonials are usually easier to read in a slow vertical scroller. Give the component an
explicit height so it behaves like a window through which the cards move.

```html
<style>
  .testimonial-scroller {
    height: 18rem;
    --loomi-scroller-gap: 1rem;
  }

  .testimonial {
    margin: 0;
    padding: 1rem;
    border: 1px solid var(--loomi-surface-border, #d0d5dd);
    border-radius: 0.75rem;
    background: var(--loomi-surface, white);
    color: var(--loomi-text, #101828);
  }
</style>

<loomi-scroller
  class="testimonial-scroller"
  direction="up"
  speed="28"
  aria-label="Customer testimonials"
>
  <blockquote class="testimonial">
    “Setup took minutes, and the result feels polished.” — Emma
  </blockquote>
  <blockquote class="testimonial">
    “Our support team ships replies much faster now.” — Diego
  </blockquote>
  <blockquote class="testimonial">
    “It works beautifully in both English and Arabic.” — Mariam
  </blockquote>
</loomi-scroller>
```

Page-level styles applied to an item are preserved by its seamless visual copies, so cards of
different heights continue through the vertical loop without a visible restart jump.

## Partner logos

A slower speed and wider faded edges create a calm logo strip. Each logo can be an ordinary
link to the partner's website.

```html
<style>
  .partner-scroller img {
    display: block;
    width: auto;
    height: 3rem;
  }
</style>

<loomi-scroller
  class="partner-scroller"
  speed="35"
  edge-size="5rem"
  aria-label="Our partners"
>
  <a href="https://example.com/atlas"><img src="/logos/atlas.svg" alt="Atlas" /></a>
  <a href="https://example.com/northstar"><img src="/logos/northstar.svg" alt="Northstar" /></a>
  <a href="https://example.com/cedar"><img src="/logos/cedar.svg" alt="Cedar" /></a>
  <a href="https://example.com/orbit"><img src="/logos/orbit.svg" alt="Orbit" /></a>
</loomi-scroller>
```

Keep meaningful `alt` text on each original image. The repeated visual copies are hidden from
assistive technology automatically.

## Image gallery

Buttons are a good choice when clicking an image opens an in-page lightbox. Listen for
`loomi-scroller-item-click` on the scroller rather than adding a separate listener to every
item. The event works for both an original item and any visible seamless copy.

```html
<style>
  .gallery-scroller img {
    display: block;
    width: 14rem;
    height: 9rem;
    object-fit: cover;
    border-radius: 0.75rem;
  }
</style>

<loomi-scroller
  id="gallery"
  class="gallery-scroller"
  direction="right"
  speed="42"
  scroll-count="3"
  aria-label="Featured photographs"
>
  <button type="button"><img src="/photos/coast.jpg" alt="Rocky coast" /></button>
  <button type="button"><img src="/photos/city.jpg" alt="City at dusk" /></button>
  <button type="button"><img src="/photos/forest.jpg" alt="Forest path" /></button>
</loomi-scroller>

<script>
  const gallery = document.querySelector("#gallery");

  gallery.addEventListener("loomi-scroller-item-click", (event) => {
    openLightbox(event.detail.index);
  });

  gallery.addEventListener("loomi-scroll-complete", (event) => {
    console.log(`Completed ${event.detail.count} passes.`);
  });
</script>
```

## Handling item clicks

Each direct element child is one clickable item. When an item is clicked, the component emits
`loomi-scroller-item-click` with:

- `item`: the original element, even if the user clicked a visual copy.
- `index`: the item's zero-based position in the original sequence.
- `originalEvent`: the browser's original `MouseEvent`.

```js
const scroller = document.querySelector("loomi-scroller");

scroller.addEventListener("loomi-scroller-item-click", (event) => {
  const { item, index, originalEvent } = event.detail;
  console.log("Clicked item", index, item, originalEvent);
});
```

Normal links and buttons keep their native behavior. The custom event is also cancelable. Call
`event.preventDefault()` on `loomi-scroller-item-click` when your handler should prevent the
original click's default action, such as following a link.

```js
scroller.addEventListener("loomi-scroller-item-click", (event) => {
  if (!userCanOpenItem(event.detail.index)) {
    event.preventDefault();
  }
});
```

## Limiting the number of passes

Scrolling is infinite by default. Set `scroll-count` to a positive whole number when the
sequence should stop.

```html
<loomi-scroller scroll-count="2">
  <span>This sequence moves through the scroller twice.</span>
  <span>It then stops at the equivalent end position.</span>
</loomi-scroller>
```

One pass means one complete movement of the original sequence. When the final pass finishes,
the component emits `loomi-scroll-complete`.

```js
scroller.addEventListener("loomi-scroll-complete", (event) => {
  console.log(event.detail.count); // 2
  console.log(event.detail.direction); // "left"
});
```

Use `scroll-count="infinite"`, or remove the attribute, to restore continuous scrolling.

## Pausing on hover

`pause-on-hover` is enabled by default so users can stop moving content long enough to read or
click it.

```html
<loomi-scroller pause-on-hover="false">...</loomi-scroller>
```

Keyboard focus always pauses the scroller, even when hover pausing is disabled. This keeps
interactive content usable for keyboard users.

## Faded edges

The default edge treatment is a transparency fade. It gives the impression that content fades
into and out of the scroller instead of being cut off abruptly.

Use `edge-size` to control the length of each fade:

```html
<loomi-scroller edge-size="5rem">...</loomi-scroller>
```

Disable the effect when the design needs hard edges:

```html
<loomi-scroller blurred-edges="false">...</loomi-scroller>
```

Although the public attribute is named `blurred-edges`, the visual treatment is a fade mask;
it does not blur the text or images themselves.

## Changing the space between items

Set `--loomi-scroller-gap` on the component. The same gap is used between the last item and the
next repeated sequence, which keeps the loop evenly spaced.

```html
<loomi-scroller style="--loomi-scroller-gap: 4rem">...</loomi-scroller>
```

Any CSS length is valid, including `px`, `rem`, and `clamp()` values.

## RTL support

The scroller inherits the page's text direction. Items keep their RTL reading order, while the
four `direction` values remain physical:

- `left` always moves content toward the left edge.
- `right` always moves content toward the right edge.
- `up` and `down` keep their usual meanings.

```html
<loomi-scroller dir="rtl" direction="right" aria-label="آخر الأخبار">
  <a href="/ar/1">افتتاح فرع جديد هذا الأسبوع</a>
  <a href="/ar/2">الإصدار الجديد متاح الآن</a>
</loomi-scroller>
```

You can place the component inside an RTL page instead of adding `dir="rtl"` directly:

```html
<html dir="rtl">
  <body>
    <loomi-scroller direction="left">...</loomi-scroller>
  </body>
</html>
```

## Accessibility

Moving content can be difficult to read or operate, so the component provides several built-in
safeguards:

- Hovering pauses by default.
- Keyboard focus always pauses.
- Seamless visual copies are hidden from assistive technology and removed from tab order.
- `prefers-reduced-motion: reduce` stops automatic movement and turns the viewport into a
  manually scrollable area.
- Native links, buttons, image alternative text, and other semantics remain available on the
  original content.

Add an `aria-label` when a nearby heading or surrounding section does not already describe the
items. Do not put important information only in moving content; provide it elsewhere on the
page too.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

Horizontal scrollers fill the width of their container. The component creates enough copies to
cover wide screens even when the original sequence is short.

Vertical scrollers need a height because that height defines the visible window. They use
`12rem` by default, and you can override it with normal CSS:

```css
.my-vertical-scroller {
  height: clamp(14rem, 40vh, 24rem);
}
```

Images and cards keep the sizes provided by your application. Use responsive CSS such as
`clamp()`, `max-width`, and media queries on the items when their size should change with the
viewport.

For shared viewport guidance, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

The component does not impose foreground, background, border, or image colors on your items.
Slotted content continues to use your application's theme styles. The faded edges are based on
transparency, so they work on both light and dark backgrounds.

When styling testimonial cards or gallery buttons, use your application's semantic color
tokens instead of fixed light colors if the example must support dark mode.

For theme activation and token guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attribute reference

| Attribute        | Default    | What it controls                                                                      |
| ---------------- | ---------- | ------------------------------------------------------------------------------------- |
| `speed`          | `50`       | Movement speed in pixels per second. Values at or below zero fall back to `50`.       |
| `direction`      | `left`     | Physical movement direction: `left`, `right`, `up`, or `down`.                        |
| `pause-on-hover` | `true`     | Whether pointer hover pauses movement. Use the string value `"false"` to turn it off. |
| `scroll-count`   | `infinite` | Number of complete passes, or `infinite` for continuous movement.                     |
| `blurred-edges`  | `true`     | Whether content fades at the leading and trailing edges.                              |
| `edge-size`      | `3rem`     | Width or height of each faded edge.                                                   |

Boolean attributes in plain HTML need an explicit `"false"` value when you want to disable a
default-on feature:

```html
<loomi-scroller pause-on-hover="false" blurred-edges="false">...</loomi-scroller>
```

## CSS custom properties

| Property               | Default | What it controls                 |
| ---------------------- | ------- | -------------------------------- |
| `--loomi-scroller-gap` | `2rem`  | Space between consecutive items. |

## Events

| Event                       | Detail                                          | When it fires                                      |
| --------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `loomi-scroller-item-click` | `{ item, index, originalEvent }`                | The user clicks an original item or a visual copy. |
| `loomi-scroll-complete`     | `{ count, direction }` for finite scroll counts | The final requested pass finishes.                 |

## Slot

| Slot        | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| _(default)_ | One or more content items. Each direct element child is treated as one item. |

## Troubleshooting

### The vertical scroller is too short or too tall

Set a normal CSS `height` on `<loomi-scroller>`. The default vertical height is `12rem`.

### The items move too quickly

Lower `speed`. Try values between `20` and `40` for text-heavy content.

### There is too much or too little space between items

Change `--loomi-scroller-gap` on the component.

### Clicking a repeated copy does not run the listener attached to the original item

A visual copy is a different DOM node. Listen for `loomi-scroller-item-click` on the scroller;
the event always gives you the original element and index.

### Automatic movement stops on some computers

The user may have enabled reduced-motion preferences. In that mode, the scroller intentionally
becomes manually scrollable instead of animating.

## Dependencies

- `@loomidev/core`
