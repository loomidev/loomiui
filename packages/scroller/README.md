# @loomidev/scroller

`<loomi-scroller>` continuously scrolls any content placed inside it. Add one item
or many; the component repeats the full sequence for a seamless ticker.

```bash
npm install @loomidev/scroller lit
```

```js
import "@loomidev/scroller";
```

## News ticker

The default `50` pixels-per-second speed is comfortable for a news ticker. Hovering
or focusing interactive content pauses it.

```html
<loomi-scroller aria-label="Latest news">
  <a href="/news/product-launch">New product launch — read the announcement</a>
  <a href="/news/accra-office">Our Accra office opens this Friday</a>
  <a href="/news/v2">Version 2.0 is now available</a>
</loomi-scroller>
```

## Testimonials

Use `direction="up"` or `direction="down"` for a vertical scroller. Vertical
scrollers are `12rem` tall by default; set a different CSS height when needed.

```html
<loomi-scroller direction="up" speed="28" style="height: 18rem; --loomi-scroller-gap: 1rem">
  <blockquote>“Setup took minutes, and the result feels polished.” — Ama</blockquote>
  <blockquote>“Our support team ships replies much faster now.” — Kojo</blockquote>
  <blockquote>“It works beautifully in both English and Arabic.” — Mariam</blockquote>
</loomi-scroller>
```

## Partner logos

Decorative duplicate content is hidden from assistive technology. Give every image
useful alternative text because the original items remain the accessible content.

```html
<loomi-scroller speed="35" edge-size="5rem" aria-label="Our partners">
  <a href="https://example.com/atlas"><img src="/logos/atlas.svg" alt="Atlas" /></a>
  <a href="https://example.com/northstar"><img src="/logos/northstar.svg" alt="Northstar" /></a>
  <a href="https://example.com/cedar"><img src="/logos/cedar.svg" alt="Cedar" /></a>
  <a href="https://example.com/orbit"><img src="/logos/orbit.svg" alt="Orbit" /></a>
</loomi-scroller>
```

## Image gallery

Set a finite `scroll-count` when the gallery should stop after a known number of
passes. Listen for `loomi-scroll-complete` to react when it finishes.

```html
<loomi-scroller id="gallery" direction="right" speed="42" scroll-count="3">
  <button type="button"><img src="/photos/coast.jpg" alt="Rocky coast" /></button>
  <button type="button"><img src="/photos/city.jpg" alt="City at dusk" /></button>
  <button type="button"><img src="/photos/forest.jpg" alt="Forest path" /></button>
</loomi-scroller>

<script>
  const gallery = document.querySelector("#gallery");

  gallery.addEventListener("loomi-scroller-item-click", (event) => {
    openLightbox(event.detail.index);
  });

  gallery.addEventListener("loomi-scroll-complete", () => {
    console.log("The gallery completed three passes.");
  });
</script>
```

## Item click actions

Each direct child element is one item. `loomi-scroller-item-click` fires whether the
user clicks the original item or a seamless visual clone. Its detail contains the
original `item`, its zero-based `index`, and the `originalEvent`. The custom event is
cancelable: call `event.preventDefault()` to also prevent the original click's default
action. Plain links keep their normal navigation behavior.

```js
scroller.addEventListener("loomi-scroller-item-click", (event) => {
  const { item, index } = event.detail;
  console.log("Clicked", index, item);
});
```

## RTL

The component inherits text direction. In an RTL context, items retain RTL reading
order while `left`, `right`, `up`, and `down` continue to mean those physical movement
directions.

```html
<loomi-scroller dir="rtl" direction="right" aria-label="آخر الأخبار">
  <a href="/ar/1">افتتاح فرع جديد هذا الأسبوع</a>
  <a href="/ar/2">الإصدار الجديد متاح الآن</a>
</loomi-scroller>
```

## Accessibility

Focused content always pauses so keyboard users can interact without chasing a moving
target. `prefers-reduced-motion: reduce` turns the animation into a manually scrollable
region and removes the duplicated sequence. Add an `aria-label` when the surrounding
page does not already describe the content.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The scroller fills its container. Short sequences are repeated enough to cover wide
viewports without leaving a blank stretch.

For shared viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

The component does not impose colors, so slotted content continues to use your theme.
The edge fade is a transparency mask and works on light and dark backgrounds.

For theme activation, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute        | Default    | Description                                                                    |
| ---------------- | ---------- | ------------------------------------------------------------------------------ |
| `speed`          | `50`       | Travel speed in pixels per second. Values at or below zero fall back to `50`.  |
| `direction`      | `left`     | Physical movement direction: `left`, `right`, `up`, or `down`.                 |
| `pause-on-hover` | `true`     | Pause while hovered. Use `pause-on-hover="false"` to disable.                  |
| `scroll-count`   | `infinite` | Positive number of complete passes, or `infinite`.                             |
| `blurred-edges`  | `true`     | Fade content into both viewport edges. Use `blurred-edges="false"` to disable. |
| `edge-size`      | `3rem`     | CSS length used for each faded edge.                                           |

## CSS custom properties

| Property               | Default | Description                      |
| ---------------------- | ------- | -------------------------------- |
| `--loomi-scroller-gap` | `2rem`  | Space between consecutive items. |

## Events

| Event                       | Detail                                          |
| --------------------------- | ----------------------------------------------- |
| `loomi-scroller-item-click` | `{ item, index, originalEvent }`                |
| `loomi-scroll-complete`     | `{ count, direction }` for finite scroll counts |

## Slots

| Slot        | Description                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| _(default)_ | One or more content items. Each direct element child is clickable as one item. |

## Dependencies

- `@loomidev/core`
